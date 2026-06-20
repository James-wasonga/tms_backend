const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get M-Pesa access token
const getToken = async () => {
  const key = process.env.MPESA_CONSUMER_KEY?.trim();
  const secret = process.env.MPESA_CONSUMER_SECRET?.trim();

  if (!key || !secret) {
    throw new Error('MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET is missing in .env');
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  console.log('[MPESA] Requesting token...');
  const res = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` }
  });
  console.log('[MPESA] Token received ✅');
  return res.data.access_token;
};

// POST /api/payments/mpesa-stk
router.post('/mpesa-stk', async (req, res) => {
  try {
    const { phone, amount, from, to } = req.body;
    console.log('[MPESA] STK request received:', { phone, amount, from, to });

    // Validate env vars exist before doing anything
    const required = ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORTCODE', 'MPESA_PASSKEY', 'MPESA_CALLBACK_URL'];
    const missing = required.filter(k => !process.env[k]);
    if (missing.length > 0) {
      console.error('[MPESA] Missing env vars:', missing);
      return res.status(500).json({ error: `Missing env vars: ${missing.join(', ')}` });
    }

    const token = await getToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);

    const shortcode = process.env.MPESA_SHORTCODE.trim();
    const passkey = process.env.MPESA_PASSKEY.trim();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    console.log('[MPESA] Sending STK push...', { shortcode, timestamp, phone });

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount) || 1,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL.trim(),
        AccountReference: `MOVELINK-${Date.now()}`,
        TransactionDesc: `Bus ticket ${from || ''} to ${to || ''}`.slice(0, 100),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('[MPESA] STK push response:', response.data);
    res.json(response.data);

  } catch (err) {
    // ── THIS IS THE KEY PART — log the REAL error from Safaricom ──
    const safaricomError = err.response?.data;
    console.error('[MPESA] STK Push FAILED');
    console.error('[MPESA] Status:', err.response?.status);
    console.error('[MPESA] Safaricom response:', JSON.stringify(safaricomError, null, 2));
    console.error('[MPESA] Error message:', err.message);

    res.status(500).json({
      error: safaricomError?.errorMessage || safaricomError?.error_description || err.message || 'Failed to send M-Pesa prompt',
      safaricomDetails: safaricomError,
    });
  }
});

// POST /api/payments/mpesa-callback
router.post('/mpesa-callback', (req, res) => {
  const result = req.body?.Body?.stkCallback;
  console.log('[MPESA] Callback received:', JSON.stringify(result, null, 2));

  if (result?.ResultCode === 0) {
    const items = result.CallbackMetadata?.Item || [];
    const amount = items.find(i => i.Name === 'Amount')?.Value;
    const mpesaCode = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
    const phone = items.find(i => i.Name === 'PhoneNumber')?.Value;
    console.log(`✅ [MPESA] Payment successful! Amount: ${amount}, Code: ${mpesaCode}, Phone: ${phone}`);
  } else {
    console.log(`❌ [MPESA] Payment failed/cancelled: ${result?.ResultDesc}`);
  }

  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// GET /api/payments/mpesa-status/:checkoutRequestId — manually check sandbox status
router.get('/mpesa-status/:checkoutRequestId', async (req, res) => {
  try {
    const token = await getToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const shortcode = process.env.MPESA_SHORTCODE.trim();
    const passkey = process.env.MPESA_PASSKEY.trim();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: req.params.checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data);
  } catch (err) {
    console.error('[MPESA] Query error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Query failed', details: err.response?.data });
  }
});

module.exports = router;