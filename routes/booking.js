const router = require("express").Router();

const {
  bookingById,
  getOwnerBookings,
  getUserBookings,
  changeVerificationStatus,
  postBooking,
  postUserBooking,
  postSold,
  deleteBooking,
  getAllBookings
} = require("../controllers/booking");

const { checkUserSignin, requireUserSignin } = require("../controllers/auth-user");
const {
  requireOwnerSignin,
  isBookingOwner,
  requireSuperadminSignin
} = require("../controllers/auth-owner");
const { busBySlug } = require("../controllers/bus");

// ── USER ROUTES (frontend expects these) ──────────────────────
router.get("/my", requireUserSignin, getUserBookings);   // GET user's own bookings
router.post("/", requireUserSignin, postUserBooking);    // POST create booking (flat, no busSlug in URL)

// ── OWNER ROUTES ──────────────────────────────────────────────
router.get("/owner", requireOwnerSignin, getOwnerBookings);
router.get("/all", requireSuperadminSignin, getAllBookings);
router.post("/sold/:busSlug", requireOwnerSignin, postSold);
router.post("/book/:busSlug", checkUserSignin, postBooking);  // keep old route
router.patch("/:bookingId", requireOwnerSignin, changeVerificationStatus);
router.delete("/:bookingId", requireUserSignin, deleteBooking);

router.param("busSlug", busBySlug);
router.param("bookingId", bookingById);

module.exports = router;
