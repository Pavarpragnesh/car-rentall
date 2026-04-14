import Booking from "../models/Booking.js"
import Car from "../models/Car.js";
import Offer from "../models/offer.js";

// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location
        const cars = await Car.find({location, isAvaliable: true})

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car)=>{
           const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
           return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
// ✅ CREATE BOOKING (FINAL)
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate, offer } = req.body;

    const carData = await Car.findById(car);

    if (!carData) {
      return res.json({ success: false, message: "Car not found" });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    // ✅ FIXED DAYS LOGIC
    let noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)) + 1;

    if (noOfDays <= 0) noOfDays = 1;

    let basePrice = Number(carData.pricePerDay) || 0;

    let totalPrice = basePrice * noOfDays;

    let discountAmount = 0;
    let offerData = null;

    // ✅ APPLY OFFER
    if (offer) {
      offerData = await Offer.findById(offer);

      if (offerData && offerData.isActive) {
        const today = new Date();

        if (today >= offerData.startDate && today <= offerData.endDate) {

          if (offerData.discountType === "flat") {
            discountAmount = offerData.discountValue;
          } else {
            discountAmount = (totalPrice * offerData.discountValue) / 100;
          }

          if (discountAmount > totalPrice) {
            discountAmount = totalPrice;
          }

          totalPrice = totalPrice - discountAmount;
        }
      }
    }

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price: totalPrice,
      offerCode: offerData?.code || null,
      discountType: offerData?.discountType || null,
      discountValue: offerData?.discountValue || null,
      discountAmount
    });

    res.json({ success: true, message: "Booking Created" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const addRating = async (req, res) => {
    try {
        const { bookingId, rating, review } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // ✅ Check if already rated
        if (booking.rating) {
            return res.json({ success: false, message: "Already rated" });
        }

        // ✅ Check conditions
        if (booking.status !== "confirmed") {
            return res.json({ success: false, message: "Booking not completed" });
        }

        if (new Date(booking.returnDate) > new Date()) {
            return res.json({ success: false, message: "Rental period not finished" });
        }

        booking.rating = rating;
        booking.review = review;

        await booking.save();

        res.json({ success: true, message: "Rating submitted" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};