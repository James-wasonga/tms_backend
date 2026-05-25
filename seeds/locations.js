const Location = require('../models/Location');

const kenyanLocations = [
  { name: 'Nairobi CBD', district: 'Nairobi' },
  { name: 'Westlands', district: 'Nairobi' },
  { name: 'Thika', district: 'Kiambu' },
  { name: 'Mombasa CBD', district: 'Mombasa' },
  { name: 'Nyali', district: 'Mombasa' },
  { name: 'Kisumu', district: 'Kisumu' },
  { name: 'Nakuru', district: 'Nakuru' },
  { name: 'Eldoret', district: 'Uasin Gishu' },
  { name: 'Malindi', district: 'Kilifi' },
  { name: 'Garissa', district: 'Garissa' },
  { name: 'Kakamega', district: 'Kakamega' },
  { name: 'Machakos', district: 'Machakos' },
  { name: 'Nyeri', district: 'Nyeri' },
  { name: 'Meru', district: 'Meru' },
  { name: 'Kitale', district: 'Trans-Nzoia' },
  { name: 'Embu', district: 'Embu' },
  { name: 'Nanyuki', district: 'Laikipia' },
  { name: 'Naivasha', district: 'Nakuru' },
  { name: 'Kericho', district: 'Kericho' },
  { name: 'Bungoma', district: 'Bungoma' },
  { name: 'Voi', district: 'Taita-Taveta' },
  { name: 'Kilifi', district: 'Kilifi' },
];

exports.seedLocations = async () => {
  try {
    const count = await Location.countDocuments();
    if (count > 0) return; // already seeded
    await Location.insertMany(kenyanLocations);
    console.log('✅ Locations seeded:', kenyanLocations.length);
  } catch(err) {
    console.error('Location seed error:', err.message);
  }
};
