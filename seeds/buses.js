const Bus = require('../models/Bus');

// Helper: generate ISO date string N days from today
const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const createBuses = () => {
  const buses = [];

  // Full Route Schedule Templates covering Morning, Afternoon, Evening, and Night travel
  const routeTemplates = [
    // ==========================================
    // 1. NAIROBI ↔ MOMBASA & COASTAL REGION
    // ==========================================
    // Nairobi -> Mombasa
    {
      name: 'ENA Coach', busNumber: 'KDD 101A', type: 'AC', fare: 1800, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD', 'Westlands', 'Mlolongo'], droppingPoints: ['Voi', 'Mombasa CBD'],
      features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Morning Express Nairobi to Mombasa',
      departure_time: '06:30 AM', slugPrefix: 'ena-coach'
    },
    {
      name: 'Modern Coast Express', busNumber: 'KCB 123A', type: 'AC', fare: 1700, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD', 'Westlands'], droppingPoints: ['Voi', 'Mombasa CBD'],
      features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Mid-Morning Luxury Coach Nairobi to Mombasa',
      departure_time: '08:30 AM', slugPrefix: 'modern-coast'
    },
    {
      name: 'Tahmeed Express', busNumber: 'KDE 301T', type: 'Suspense AC', fare: 2000, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Mombasa CBD', 'Kilifi', 'Malindi'],
      features: ['WiFi', 'AC', 'VIP Reclining Seats', 'Charging Ports'], description: 'Afternoon VIP Express to Malindi via Mombasa',
      departure_time: '02:00 PM', slugPrefix: 'tahmeed'
    },
    {
      name: 'Mash East Africa', busNumber: 'KCA 881M', type: 'AC', fare: 2100, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD', 'Mlolongo'], droppingPoints: ['Voi', 'Mombasa CBD'],
      features: ['WiFi', 'AC', 'Refreshments', 'Extra Legroom'], description: 'Night Rider Express Nairobi to Mombasa',
      departure_time: '08:30 PM', slugPrefix: 'mash-east'
    },
    {
      name: 'ENA Coach', busNumber: 'KDD 102A', type: 'AC', fare: 1900, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD', 'Mlolongo'], droppingPoints: ['Voi', 'Mombasa CBD'],
      features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Late Night Express Nairobi to Mombasa',
      departure_time: '10:00 PM', slugPrefix: 'ena-coach'
    },

    // Mombasa -> Nairobi
    {
      name: 'ENA Coach', busNumber: 'KDD 103A', type: 'AC', fare: 1800, numberOfSeats: 44,
      boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Mlolongo', 'Nairobi CBD'],
      features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Morning Coastal Express to Nairobi',
      departure_time: '07:00 AM', slugPrefix: 'ena-coach'
    },
    {
      name: 'Tahmeed Express', busNumber: 'KDE 302T', type: 'Suspense AC', fare: 1900, numberOfSeats: 44,
      boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Mlolongo', 'Nairobi CBD'],
      features: ['WiFi', 'AC', 'VIP Reclining Seats'], description: 'Afternoon Express Mombasa to Nairobi',
      departure_time: '02:30 PM', slugPrefix: 'tahmeed'
    },
    {
      name: 'Modern Coast Express', busNumber: 'KCB 124A', type: 'AC', fare: 1700, numberOfSeats: 44,
      boardingPoints: ['Mombasa CBD'], droppingPoints: ['Voi', 'Nairobi CBD'],
      features: ['WiFi', 'AC', 'USB Charging'], description: 'Evening Luxury Coach Mombasa to Nairobi',
      departure_time: '08:00 PM', slugPrefix: 'modern-coast'
    },
    {
      name: 'Mash East Africa', busNumber: 'KCA 882M', type: 'AC', fare: 2100, numberOfSeats: 44,
      boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Nairobi CBD'],
      features: ['WiFi', 'AC', 'Refreshments', 'Reclining Seats'], description: 'Night Executive Mombasa to Nairobi',
      departure_time: '09:30 PM', slugPrefix: 'mash-east'
    },

    // ==========================================
    // 2. NAIROBI ↔ KISUMU & LAKE REGION
    // ==========================================
    // Nairobi -> Kisumu
    {
      name: 'Easy Coach', busNumber: 'KDB 456B', type: 'Delux', fare: 1750, numberOfSeats: 52,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
      features: ['AC', 'Water Provided', 'Reclining Seats'], description: 'Early Morning Service Nairobi to Kisumu',
      departure_time: '07:00 AM', slugPrefix: 'easy-coach'
    },
    {
      name: 'Transline Classic', busNumber: 'KDA 789C', type: 'Normal', fare: 1500, numberOfSeats: 52,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
      features: ['AC', 'Legroom'], description: 'Mid-Day Express Nairobi to Kisumu',
      departure_time: '11:00 AM', slugPrefix: 'transline-classic'
    },
    {
      name: 'ENA Coach', busNumber: 'KDD 201K', type: 'Normal', fare: 1600, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kisumu'],
      features: ['AC', 'USB Charging', 'Reclining Seats'], description: 'Afternoon Runner Nairobi to Kisumu',
      departure_time: '03:00 PM', slugPrefix: 'ena-coach'
    },
    {
      name: 'Easy Coach', busNumber: 'KDB 457B', type: 'Delux', fare: 1750, numberOfSeats: 52,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
      features: ['AC', 'Water Provided', 'Comfortable Seats'], description: 'Evening Night Service Nairobi to Kisumu',
      departure_time: '08:30 PM', slugPrefix: 'easy-coach'
    },
    {
      name: 'Guardian Angel Bus', busNumber: 'KCN 331G', type: 'Delux', fare: 1600, numberOfSeats: 48,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
      features: ['AC', 'USB Charging', 'Storage Space'], description: 'Late Night Service Nairobi to Kisumu',
      departure_time: '10:30 PM', slugPrefix: 'guardian-angel'
    },

    // Kisumu -> Nairobi
    {
      name: 'Easy Coach', busNumber: 'KDB 458B', type: 'Delux', fare: 1750, numberOfSeats: 52,
      boardingPoints: ['Kisumu'], droppingPoints: ['Kericho', 'Nakuru', 'Nairobi CBD'],
      features: ['AC', 'Water Provided'], description: 'Morning Service Kisumu to Nairobi',
      departure_time: '08:00 AM', slugPrefix: 'easy-coach'
    },
    {
      name: 'ENA Coach', busNumber: 'KDD 202K', type: 'Normal', fare: 1600, numberOfSeats: 44,
      boardingPoints: ['Kisumu'], droppingPoints: ['Nakuru', 'Nairobi CBD'],
      features: ['AC', 'USB Charging', 'Reclining Seats'], description: 'Mid-Day Express Kisumu to Nairobi',
      departure_time: '10:30 AM', slugPrefix: 'ena-coach'
    },
    {
      name: 'Transline Classic', busNumber: 'KDA 790C', type: 'Normal', fare: 1500, numberOfSeats: 52,
      boardingPoints: ['Kisumu'], droppingPoints: ['Kericho', 'Nakuru', 'Nairobi CBD'],
      features: ['AC', 'Legroom'], description: 'Afternoon Service Kisumu to Nairobi',
      departure_time: '03:00 PM', slugPrefix: 'transline-classic'
    },
    {
      name: 'Easy Coach', busNumber: 'KDB 459B', type: 'Delux', fare: 1750, numberOfSeats: 52,
      boardingPoints: ['Kisumu'], droppingPoints: ['Kericho', 'Nakuru', 'Nairobi CBD'],
      features: ['AC', 'Water Provided'], description: 'Night Express Kisumu to Nairobi',
      departure_time: '09:00 PM', slugPrefix: 'easy-coach'
    },

    // ==========================================
    // 3. NAIROBI ↔ ELDORET, KAKAMEGA, BUNGOMA & KITALE
    // ==========================================
    {
      name: 'Easy Coach', busNumber: 'KDC 301E', type: 'Delux', fare: 1550, numberOfSeats: 52,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Eldoret'],
      features: ['AC', 'Water Provided'], description: 'Morning Express Nairobi to Eldoret',
      departure_time: '07:30 AM', slugPrefix: 'easy-coach'
    },
    {
      name: 'Mash East Africa', busNumber: 'KCA 321D', type: 'Suspense AC', fare: 1650, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD', 'Westlands'], droppingPoints: ['Nakuru', 'Eldoret', 'Bungoma'],
      features: ['Suspense AC', 'WiFi', 'Charging Ports'], description: 'Afternoon Service Nairobi to Eldoret & Bungoma',
      departure_time: '01:30 PM', slugPrefix: 'mash-east'
    },
    {
      name: 'Easy Coach', busNumber: 'KDC 303E', type: 'Delux', fare: 1650, numberOfSeats: 52,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Eldoret', 'Kakamega'],
      features: ['AC', 'Water Provided', 'Comfortable Seats'], description: 'Evening Bus Nairobi to Kakamega',
      departure_time: '07:30 PM', slugPrefix: 'easy-coach'
    },
    {
      name: 'Easy Coach', busNumber: 'KDC 304E', type: 'Delux', fare: 1700, numberOfSeats: 52,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Eldoret', 'Kitale'],
      features: ['AC', 'Water Provided'], description: 'Night Express Nairobi to Kitale',
      departure_time: '09:30 PM', slugPrefix: 'easy-coach'
    },

    // Returns to Nairobi
    {
      name: 'Easy Coach', busNumber: 'KDC 302E', type: 'Delux', fare: 1550, numberOfSeats: 52,
      boardingPoints: ['Eldoret'], droppingPoints: ['Nakuru', 'Nairobi CBD'],
      features: ['AC', 'Water Provided'], description: 'Morning Eldoret to Nairobi',
      departure_time: '08:00 AM', slugPrefix: 'easy-coach'
    },
    {
      name: 'Mash East Africa', busNumber: 'KCA 322D', type: 'Suspense AC', fare: 1650, numberOfSeats: 44,
      boardingPoints: ['Bungoma', 'Eldoret'], droppingPoints: ['Nakuru', 'Nairobi CBD'],
      features: ['Suspense AC', 'WiFi', 'Charging Ports'], description: 'Night Service Bungoma/Eldoret to Nairobi',
      departure_time: '08:30 PM', slugPrefix: 'mash-east'
    },

    // ==========================================
    // 4. NAIROBI ↔ NYANZA REGION (KISII / MIGORI)
    // ==========================================
    {
      name: 'ENA Coach', busNumber: 'KDD 401M', type: 'Delux', fare: 1600, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Narok', 'Kisii', 'Migori'],
      features: ['AC', 'Reclining Seats', 'USB Charging'], description: 'Morning Direct Nairobi to Kisii & Migori',
      departure_time: '07:30 AM', slugPrefix: 'ena-coach'
    },
    {
      name: 'Transline Classic', busNumber: 'KDA 801M', type: 'Normal', fare: 1500, numberOfSeats: 52,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Narok', 'Kisii'],
      features: ['AC', 'Comfortable Seats'], description: 'Mid-Day Express Nairobi to Kisii',
      departure_time: '01:00 PM', slugPrefix: 'transline-classic'
    },
    {
      name: 'ENA Coach', busNumber: 'KDD 402M', type: 'Delux', fare: 1600, numberOfSeats: 44,
      boardingPoints: ['Nairobi CBD'], droppingPoints: ['Narok', 'Kisii', 'Migori'],
      features: ['AC', 'Reclining Seats', 'USB Charging'], description: 'Night Express Nairobi to Migori',
      departure_time: '09:00 PM', slugPrefix: 'ena-coach'
    },
    {
      name: 'Transline Classic', busNumber: 'KDA 802M', type: 'Normal', fare: 1500, numberOfSeats: 52,
      boardingPoints: ['Kisii', 'Narok'], droppingPoints: ['Nairobi CBD'],
      features: ['AC'], description: 'Night Express Kisii to Nairobi',
      departure_time: '08:30 PM', slugPrefix: 'transline-classic'
    },

    // ==========================================
    // 5. MOMBASA ↔ KILIFI / MALINDI
    // ==========================================
    {
      name: 'Guardian Angel Bus', busNumber: 'KBZ 555E', type: 'Normal', fare: 600, numberOfSeats: 44,
      boardingPoints: ['Mombasa CBD', 'Nyali'], droppingPoints: ['Kilifi', 'Malindi'],
      features: ['Comfortable Seats', 'Storage Space'], description: 'Morning Coastal Express Mombasa to Malindi',
      departure_time: '09:00 AM', slugPrefix: 'guardian-angel'
    },
    {
      name: 'Tahmeed Express', busNumber: 'KDE 305T', type: 'AC', fare: 700, numberOfSeats: 44,
      boardingPoints: ['Mombasa CBD', 'Nyali'], droppingPoints: ['Kilifi', 'Malindi'],
      features: ['AC', 'WiFi'], description: 'Afternoon Shuttle Mombasa to Malindi',
      departure_time: '03:30 PM', slugPrefix: 'tahmeed'
    },
    {
      name: 'Guardian Angel Bus', busNumber: 'KBZ 556E', type: 'Normal', fare: 600, numberOfSeats: 44,
      boardingPoints: ['Malindi', 'Kilifi'], droppingPoints: ['Nyali', 'Mombasa CBD'],
      features: ['Comfortable Seats', 'Storage Space'], description: 'Afternoon Route Malindi to Mombasa',
      departure_time: '02:00 PM', slugPrefix: 'guardian-angel'
    },

    // ==========================================
    // 6. NAIROBI ↔ CENTRAL KENYA (NYERI / NANYUKI)
    // ==========================================
    {
      name: '2NK Shuttle', busNumber: 'KCE 777F', type: 'Delux', fare: 700, numberOfSeats: 29,
      boardingPoints: ['Nairobi CBD', 'Thika'], droppingPoints: ['Nyeri', 'Nanyuki'],
      features: ['AC', 'Fast Service'], description: 'Morning Express Shuttle Nairobi to Nyeri & Nanyuki',
      departure_time: '07:30 AM', slugPrefix: '2nk'
    },
    {
      name: '2NK Shuttle', busNumber: 'KCE 779F', type: 'Delux', fare: 700, numberOfSeats: 29,
      boardingPoints: ['Nairobi CBD', 'Thika'], droppingPoints: ['Nyeri', 'Nanyuki'],
      features: ['AC', 'Fast Service'], description: 'Afternoon Shuttle Nairobi to Nyeri',
      departure_time: '01:30 PM', slugPrefix: '2nk'
    },
    {
      name: '2NK Shuttle', busNumber: 'KCE 778F', type: 'Delux', fare: 700, numberOfSeats: 29,
      boardingPoints: ['Nyeri', 'Nanyuki'], droppingPoints: ['Thika', 'Nairobi CBD'],
      features: ['AC', 'Fast Service'], description: 'Afternoon Shuttle Nyeri to Nairobi',
      departure_time: '02:00 PM', slugPrefix: '2nk'
    },

    // ==========================================
    // 7. INTER-CITY LINK: KISUMU ↔ MOMBASA
    // ==========================================
    {
      name: 'ENA Coach', busNumber: 'KDD 501X', type: 'AC', fare: 3200, numberOfSeats: 44,
      boardingPoints: ['Kisumu', 'Kericho', 'Nakuru'], droppingPoints: ['Voi', 'Mombasa CBD'],
      features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Cross-Country Afternoon Express Kisumu to Mombasa',
      departure_time: '02:30 PM', slugPrefix: 'ena-coach'
    },
    {
      name: 'ENA Coach', busNumber: 'KDD 502X', type: 'AC', fare: 3200, numberOfSeats: 44,
      boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
      features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Cross-Country Afternoon Express Mombasa to Kisumu',
      departure_time: '02:30 PM', slugPrefix: 'ena-coach'
    }
  ];

  // Generate records across 5 upcoming days
  routeTemplates.forEach((template) => {
    // Single brand slug for all buses of this brand
    const brandSlug = template.slugPrefix || 'bus';

    for (let day = 1; day <= 5; day++) {
      buses.push({
        name: template.name,
        busNumber: template.busNumber,
        type: template.type,
        fare: template.fare,
        numberOfSeats: template.numberOfSeats,
        seatsAvailable: template.numberOfSeats,
        seatsConfiguration: { left: 2, right: 2 },
        boardingPoints: template.boardingPoints,
        droppingPoints: template.droppingPoints,
        features: template.features,
        description: template.description,
        departure_time: template.departure_time,
        journeyDate: daysFromNow(day),
        isAvailable: true,
        bookedSeat: [],
        soldSeat: [],
        slug: brandSlug, // All Easy Coach get 'easy-coach', ENA Coach get 'ena-coach', etc.
      });
    }
  });

  return buses;
};

exports.seedBuses = async () => {
  try {
    // 1. Drop the unique index on 'slug' from MongoDB so duplicate slugs are permitted
    await Bus.collection.dropIndex('slug_1').catch(() => {
      // Index might not exist yet, ignore error
    });

    // 2. Clear old data and insert new standardized buses
    await Bus.deleteMany({});
    const buses = createBuses();
    await Bus.insertMany(buses, { validateBeforeSave: false });

    console.log(`✅ Seeded ${buses.length} bus records successfully across all locations and schedule times.`);
  } catch (err) {
    console.error('Bus seed error:', err.message);
  }
};


// const Bus = require('../models/Bus');

// // Helper: generate ISO date string N days from today
// const daysFromNow = (n) => {
//   const d = new Date();
//   d.setDate(d.getDate() + n);
//   return d.toISOString().split('T')[0];
// };

// const createBuses = () => {
//   const buses = [];

//   // Full Route Schedule Templates covering Morning, Afternoon, Evening, and Night travel
//   const routeTemplates = [
//     // ==========================================
//     // 1. NAIROBI ↔ MOMBASA & COASTAL REGION
//     // ==========================================
//     // Nairobi -> Mombasa
//     {
//       name: 'ENA Coach', busNumber: 'KDD 101A', type: 'AC', fare: 1800, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD', 'Westlands', 'Mlolongo'], droppingPoints: ['Voi', 'Mombasa CBD'],
//       features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Morning Express Nairobi to Mombasa',
//       departure_time: '06:30 AM', slugPrefix: 'ena-coach'
//     },
//     {
//       name: 'Modern Coast Express', busNumber: 'KCB 123A', type: 'AC', fare: 1700, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD', 'Westlands'], droppingPoints: ['Voi', 'Mombasa CBD'],
//       features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Mid-Morning Luxury Coach Nairobi to Mombasa',
//       departure_time: '08:30 AM', slugPrefix: 'modern-coast'
//     },
//     {
//       name: 'Tahmeed Express', busNumber: 'KDE 301T', type: 'Suspense AC', fare: 2000, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Mombasa CBD', 'Kilifi', 'Malindi'],
//       features: ['WiFi', 'AC', 'VIP Reclining Seats', 'Charging Ports'], description: 'Afternoon VIP Express to Malindi via Mombasa',
//       departure_time: '02:00 PM', slugPrefix: 'tahmeed'
//     },
//     {
//       name: 'Mash East Africa', busNumber: 'KCA 881M', type: 'AC', fare: 2100, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD', 'Mlolongo'], droppingPoints: ['Voi', 'Mombasa CBD'],
//       features: ['WiFi', 'AC', 'Refreshments', 'Extra Legroom'], description: 'Night Rider Express Nairobi to Mombasa',
//       departure_time: '08:30 PM', slugPrefix: 'mash-east'
//     },
//     {
//       name: 'ENA Coach', busNumber: 'KDD 102A', type: 'AC', fare: 1900, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD', 'Mlolongo'], droppingPoints: ['Voi', 'Mombasa CBD'],
//       features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Late Night Express Nairobi to Mombasa',
//       departure_time: '10:00 PM', slugPrefix: 'ena-coach'
//     },

//     // Mombasa -> Nairobi
//     {
//       name: 'ENA Coach', busNumber: 'KDD 103A', type: 'AC', fare: 1800, numberOfSeats: 44,
//       boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Mlolongo', 'Nairobi CBD'],
//       features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Morning Coastal Express to Nairobi',
//       departure_time: '07:00 AM', slugPrefix: 'ena-coach'
//     },
//     {
//       name: 'Tahmeed Express', busNumber: 'KDE 302T', type: 'Suspense AC', fare: 1900, numberOfSeats: 44,
//       boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Mlolongo', 'Nairobi CBD'],
//       features: ['WiFi', 'AC', 'VIP Reclining Seats'], description: 'Afternoon Express Mombasa to Nairobi',
//       departure_time: '02:30 PM', slugPrefix: 'tahmeed'
//     },
//     {
//       name: 'Modern Coast Express', busNumber: 'KCB 124A', type: 'AC', fare: 1700, numberOfSeats: 44,
//       boardingPoints: ['Mombasa CBD'], droppingPoints: ['Voi', 'Nairobi CBD'],
//       features: ['WiFi', 'AC', 'USB Charging'], description: 'Evening Luxury Coach Mombasa to Nairobi',
//       departure_time: '08:00 PM', slugPrefix: 'modern-coast'
//     },
//     {
//       name: 'Mash East Africa', busNumber: 'KCA 882M', type: 'AC', fare: 2100, numberOfSeats: 44,
//       boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Nairobi CBD'],
//       features: ['WiFi', 'AC', 'Refreshments', 'Reclining Seats'], description: 'Night Executive Mombasa to Nairobi',
//       departure_time: '09:30 PM', slugPrefix: 'mash-east'
//     },

//     // ==========================================
//     // 2. NAIROBI ↔ KISUMU & LAKE REGION
//     // ==========================================
//     // Nairobi -> Kisumu
//     {
//       name: 'Easy Coach', busNumber: 'KDB 456B', type: 'Delux', fare: 1750, numberOfSeats: 52,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
//       features: ['AC', 'Water Provided', 'Reclining Seats'], description: 'Early Morning Service Nairobi to Kisumu',
//       departure_time: '07:00 AM', slugPrefix: 'easy-coach'
//     },
//     {
//       name: 'Transline Classic', busNumber: 'KDA 789C', type: 'Normal', fare: 1500, numberOfSeats: 52,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
//       features: ['AC', 'Legroom'], description: 'Mid-Day Express Nairobi to Kisumu',
//       departure_time: '11:00 AM', slugPrefix: 'transline-classic'
//     },
//     {
//       name: 'ENA Coach', busNumber: 'KDD 201K', type: 'Normal', fare: 1600, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kisumu'],
//       features: ['AC', 'USB Charging', 'Reclining Seats'], description: 'Afternoon Runner Nairobi to Kisumu',
//       departure_time: '03:00 PM', slugPrefix: 'ena-coach'
//     },
//     {
//       name: 'Easy Coach', busNumber: 'KDB 457B', type: 'Delux', fare: 1750, numberOfSeats: 52,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
//       features: ['AC', 'Water Provided', 'Comfortable Seats'], description: 'Evening Night Service Nairobi to Kisumu',
//       departure_time: '08:30 PM', slugPrefix: 'easy-coach'
//     },
//     {
//       name: 'Guardian Angel Bus', busNumber: 'KCN 331G', type: 'Delux', fare: 1600, numberOfSeats: 48,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
//       features: ['AC', 'USB Charging', 'Storage Space'], description: 'Late Night Service Nairobi to Kisumu',
//       departure_time: '10:30 PM', slugPrefix: 'guardian-angel'
//     },

//     // Kisumu -> Nairobi
//     {
//       name: 'Easy Coach', busNumber: 'KDB 458B', type: 'Delux', fare: 1750, numberOfSeats: 52,
//       boardingPoints: ['Kisumu'], droppingPoints: ['Kericho', 'Nakuru', 'Nairobi CBD'],
//       features: ['AC', 'Water Provided'], description: 'Morning Service Kisumu to Nairobi',
//       departure_time: '08:00 AM', slugPrefix: 'easy-coach'
//     },
//     {
//       name: 'ENA Coach', busNumber: 'KDD 202K', type: 'Normal', fare: 1600, numberOfSeats: 44,
//       boardingPoints: ['Kisumu'], droppingPoints: ['Nakuru', 'Nairobi CBD'],
//       features: ['AC', 'USB Charging', 'Reclining Seats'], description: 'Mid-Day Express Kisumu to Nairobi',
//       departure_time: '10:30 AM', slugPrefix: 'ena-coach'
//     },
//     {
//       name: 'Transline Classic', busNumber: 'KDA 790C', type: 'Normal', fare: 1500, numberOfSeats: 52,
//       boardingPoints: ['Kisumu'], droppingPoints: ['Kericho', 'Nakuru', 'Nairobi CBD'],
//       features: ['AC', 'Legroom'], description: 'Afternoon Service Kisumu to Nairobi',
//       departure_time: '03:00 PM', slugPrefix: 'transline-classic'
//     },
//     {
//       name: 'Easy Coach', busNumber: 'KDB 459B', type: 'Delux', fare: 1750, numberOfSeats: 52,
//       boardingPoints: ['Kisumu'], droppingPoints: ['Kericho', 'Nakuru', 'Nairobi CBD'],
//       features: ['AC', 'Water Provided'], description: 'Night Express Kisumu to Nairobi',
//       departure_time: '09:00 PM', slugPrefix: 'easy-coach'
//     },

//     // ==========================================
//     // 3. NAIROBI ↔ ELDORET, KAKAMEGA, BUNGOMA & KITALE
//     // ==========================================
//     {
//       name: 'Easy Coach', busNumber: 'KDC 301E', type: 'Delux', fare: 1550, numberOfSeats: 52,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Nakuru', 'Eldoret'],
//       features: ['AC', 'Water Provided'], description: 'Morning Express Nairobi to Eldoret',
//       departure_time: '07:30 AM', slugPrefix: 'easy-coach'
//     },
//     {
//       name: 'Mash East Africa', busNumber: 'KCA 321D', type: 'Suspense AC', fare: 1650, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD', 'Westlands'], droppingPoints: ['Nakuru', 'Eldoret', 'Bungoma'],
//       features: ['Suspense AC', 'WiFi', 'Charging Ports'], description: 'Afternoon Service Nairobi to Eldoret & Bungoma',
//       departure_time: '01:30 PM', slugPrefix: 'mash-east'
//     },
//     {
//       name: 'Easy Coach', busNumber: 'KDC 303E', type: 'Delux', fare: 1650, numberOfSeats: 52,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Eldoret', 'Kakamega'],
//       features: ['AC', 'Water Provided', 'Comfortable Seats'], description: 'Evening Bus Nairobi to Kakamega',
//       departure_time: '07:30 PM', slugPrefix: 'easy-coach'
//     },
//     {
//       name: 'Easy Coach', busNumber: 'KDC 304E', type: 'Delux', fare: 1700, numberOfSeats: 52,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Eldoret', 'Kitale'],
//       features: ['AC', 'Water Provided'], description: 'Night Express Nairobi to Kitale',
//       departure_time: '09:30 PM', slugPrefix: 'easy-coach'
//     },

//     // Returns to Nairobi
//     {
//       name: 'Easy Coach', busNumber: 'KDC 302E', type: 'Delux', fare: 1550, numberOfSeats: 52,
//       boardingPoints: ['Eldoret'], droppingPoints: ['Nakuru', 'Nairobi CBD'],
//       features: ['AC', 'Water Provided'], description: 'Morning Eldoret to Nairobi',
//       departure_time: '08:00 AM', slugPrefix: 'easy-coach'
//     },
//     {
//       name: 'Mash East Africa', busNumber: 'KCA 322D', type: 'Suspense AC', fare: 1650, numberOfSeats: 44,
//       boardingPoints: ['Bungoma', 'Eldoret'], droppingPoints: ['Nakuru', 'Nairobi CBD'],
//       features: ['Suspense AC', 'WiFi', 'Charging Ports'], description: 'Night Service Bungoma/Eldoret to Nairobi',
//       departure_time: '08:30 PM', slugPrefix: 'mash-east'
//     },

//     // ==========================================
//     // 4. NAIROBI ↔ NYANZA REGION (KISII / MIGORI)
//     // ==========================================
//     {
//       name: 'ENA Coach', busNumber: 'KDD 401M', type: 'Delux', fare: 1600, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Narok', 'Kisii', 'Migori'],
//       features: ['AC', 'Reclining Seats', 'USB Charging'], description: 'Morning Direct Nairobi to Kisii & Migori',
//       departure_time: '07:30 AM', slugPrefix: 'ena-coach'
//     },
//     {
//       name: 'Transline Classic', busNumber: 'KDA 801M', type: 'Normal', fare: 1500, numberOfSeats: 52,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Narok', 'Kisii'],
//       features: ['AC', 'Comfortable Seats'], description: 'Mid-Day Express Nairobi to Kisii',
//       departure_time: '01:00 PM', slugPrefix: 'transline-classic'
//     },
//     {
//       name: 'ENA Coach', busNumber: 'KDD 402M', type: 'Delux', fare: 1600, numberOfSeats: 44,
//       boardingPoints: ['Nairobi CBD'], droppingPoints: ['Narok', 'Kisii', 'Migori'],
//       features: ['AC', 'Reclining Seats', 'USB Charging'], description: 'Night Express Nairobi to Migori',
//       departure_time: '09:00 PM', slugPrefix: 'ena-coach'
//     },
//     {
//       name: 'Transline Classic', busNumber: 'KDA 802M', type: 'Normal', fare: 1500, numberOfSeats: 52,
//       boardingPoints: ['Kisii', 'Narok'], droppingPoints: ['Nairobi CBD'],
//       features: ['AC'], description: 'Night Express Kisii to Nairobi',
//       departure_time: '08:30 PM', slugPrefix: 'transline-classic'
//     },

//     // ==========================================
//     // 5. MOMBASA ↔ KILIFI / MALINDI
//     // ==========================================
//     {
//       name: 'Guardian Angel Bus', busNumber: 'KBZ 555E', type: 'Normal', fare: 600, numberOfSeats: 44,
//       boardingPoints: ['Mombasa CBD', 'Nyali'], droppingPoints: ['Kilifi', 'Malindi'],
//       features: ['Comfortable Seats', 'Storage Space'], description: 'Morning Coastal Express Mombasa to Malindi',
//       departure_time: '09:00 AM', slugPrefix: 'guardian-angel'
//     },
//     {
//       name: 'Tahmeed Express', busNumber: 'KDE 305T', type: 'AC', fare: 700, numberOfSeats: 44,
//       boardingPoints: ['Mombasa CBD', 'Nyali'], droppingPoints: ['Kilifi', 'Malindi'],
//       features: ['AC', 'WiFi'], description: 'Afternoon Shuttle Mombasa to Malindi',
//       departure_time: '03:30 PM', slugPrefix: 'tahmeed'
//     },
//     {
//       name: 'Guardian Angel Bus', busNumber: 'KBZ 556E', type: 'Normal', fare: 600, numberOfSeats: 44,
//       boardingPoints: ['Malindi', 'Kilifi'], droppingPoints: ['Nyali', 'Mombasa CBD'],
//       features: ['Comfortable Seats', 'Storage Space'], description: 'Afternoon Route Malindi to Mombasa',
//       departure_time: '02:00 PM', slugPrefix: 'guardian-angel'
//     },

//     // ==========================================
//     // 6. NAIROBI ↔ CENTRAL KENYA (NYERI / NANYUKI)
//     // ==========================================
//     {
//       name: '2NK Shuttle', busNumber: 'KCE 777F', type: 'Delux', fare: 700, numberOfSeats: 29,
//       boardingPoints: ['Nairobi CBD', 'Thika'], droppingPoints: ['Nyeri', 'Nanyuki'],
//       features: ['AC', 'Fast Service'], description: 'Morning Express Shuttle Nairobi to Nyeri & Nanyuki',
//       departure_time: '07:30 AM', slugPrefix: '2nk'
//     },
//     {
//       name: '2NK Shuttle', busNumber: 'KCE 779F', type: 'Delux', fare: 700, numberOfSeats: 29,
//       boardingPoints: ['Nairobi CBD', 'Thika'], droppingPoints: ['Nyeri', 'Nanyuki'],
//       features: ['AC', 'Fast Service'], description: 'Afternoon Shuttle Nairobi to Nyeri',
//       departure_time: '01:30 PM', slugPrefix: '2nk'
//     },
//     {
//       name: '2NK Shuttle', busNumber: 'KCE 778F', type: 'Delux', fare: 700, numberOfSeats: 29,
//       boardingPoints: ['Nyeri', 'Nanyuki'], droppingPoints: ['Thika', 'Nairobi CBD'],
//       features: ['AC', 'Fast Service'], description: 'Afternoon Shuttle Nyeri to Nairobi',
//       departure_time: '02:00 PM', slugPrefix: '2nk'
//     },

//     // ==========================================
//     // 7. INTER-CITY LINK: KISUMU ↔ MOMBASA
//     // ==========================================
//     {
//       name: 'ENA Coach', busNumber: 'KDD 501X', type: 'AC', fare: 3200, numberOfSeats: 44,
//       boardingPoints: ['Kisumu', 'Kericho', 'Nakuru'], droppingPoints: ['Voi', 'Mombasa CBD'],
//       features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Cross-Country Afternoon Express Kisumu to Mombasa',
//       departure_time: '02:30 PM', slugPrefix: 'ena-coach'
//     },
//     {
//       name: 'ENA Coach', busNumber: 'KDD 502X', type: 'AC', fare: 3200, numberOfSeats: 44,
//       boardingPoints: ['Mombasa CBD', 'Voi'], droppingPoints: ['Nakuru', 'Kericho', 'Kisumu'],
//       features: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'], description: 'Cross-Country Afternoon Express Mombasa to Kisumu',
//       departure_time: '02:30 PM', slugPrefix: 'ena-coach'
//     }
//   ];

//   // Track image counters per brand prefix (e.g., easy-coach1, easy-coach2...)
// // Generate records across 5 upcoming days
// routeTemplates.forEach((template) => {
//   const currentSlug = template.slugPrefix || 'bus';

//   for (let day = 1; day <= 5; day++) {
//     buses.push({
//       name: template.name,
//       busNumber: template.busNumber,
//       type: template.type,
//       fare: template.fare,
//       numberOfSeats: template.numberOfSeats,
//       seatsAvailable: template.numberOfSeats,
//       seatsConfiguration: { left: 2, right: 2 },
//       boardingPoints: template.boardingPoints,
//       droppingPoints: template.droppingPoints,
//       features: template.features,
//       description: template.description,
//       departure_time: template.departure_time,
//       journeyDate: daysFromNow(day),
//       isAvailable: true,
//       bookedSeat: [],
//       soldSeat: [],
//       slug: currentSlug,
//     });
//   }
// });

//   return buses;
// };

// exports.seedBuses = async () => {
//   try {
//     await Bus.deleteMany({});
//     const buses = createBuses();
//     await Bus.insertMany(buses, { validateBeforeSave: false });
//     console.log(`✅ Seeded ${buses.length} bus records successfully across all locations and schedule times.`);
//   } catch (err) {
//     console.error('Bus seed error:', err.message);
//   }
// };