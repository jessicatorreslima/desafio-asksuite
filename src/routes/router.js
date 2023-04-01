const express = require("express");
const RoomService = require("../services/RoomService");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello Asksuite World!");
});

router.post("/search", async (req, res) => {
    const { checkin, checkout } = req.body;

    const errors = validateParams(checkin, checkout);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const rooms = await RoomService.getRooms(checkin, checkout);
        return res.json(rooms);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Failed to fetch rooms. Please try again later.");
    }
});

function validateParams(checkin, checkout) {
    const errors = {};

    function validateDate(date, fieldName) {
        if (!date) {
            errors[fieldName] = `${fieldName} date is required`;
        } else if (!isValidDate(date)) {
            errors[fieldName] = `${fieldName} date must be in 'yyyy-mm-dd' format`;
        }
    }

    validateDate(checkin, 'Check-in');
    validateDate(checkout, 'Checkout');

    return Object.values(errors);
}

function isValidDate(dateString) {
    let pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(dateString);
}

module.exports = router;
