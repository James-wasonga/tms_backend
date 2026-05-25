const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get M-Pesa access token
const getToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const res = await axios.get(url, {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
};

// POST /api/payments/mpesa-stk
router.post('/mpesa-stk', async (req, res) => {
  try {
    const { phone, amount, from, to } = req.body;
    const token = await getToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.ceil(amount),
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `MOVELINK-${Date.now()}`,
        TransactionDesc: `Bus ticket ${from} to ${to}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (err) {
    console.error('STK Push error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to send M-Pesa prompt',
      details: err.response?.data
    });
  }
});

// POST /api/payments/mpesa-callback
// Safaricom calls this after the user approves or rejects the payment
router.post('/mpesa-callback', (req, res) => {
  const result = req.body?.Body?.stkCallback;
  console.log('M-Pesa Callback received:', JSON.stringify(result, null, 2));

  if (result?.ResultCode === 0) {
    const items = result.CallbackMetadata?.Item || [];
    const amount = items.find(i => i.Name === 'Amount')?.Value;
    const mpesaCode = items.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
    const phone = items.find(i => i.Name === 'PhoneNumber')?.Value;
    console.log(`✅ Payment successful! Amount: ${amount}, Code: ${mpesaCode}, Phone: ${phone}`);
  } else {
    console.log(`❌ Payment failed: ${result?.ResultDesc}`);
  }

  // Always respond to Safaricom with success
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

module.exports = router;