const Owner = require("../models/Owner");

exports.seedSuperAdmin = async () => {
    const email = "jameswasonga22@gmail.com"
    const password = "password123"
    const role = "superadmin"
    const ownerExists = await Owner.findOne({ email });
    if (ownerExists) return;

    const newowner = new Owner({
        email,
        password,
        role,
        name: 'James Wasonga',
        citizenshipNumber: '12345678',
        phone: 793758686,
        isVerified: true
    });

    await newowner.save();
    console.warn("Superadmin seeded successfully...")
  };