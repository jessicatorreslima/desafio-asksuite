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
        res.status(200).json(rooms);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.all("**", (req, res) => {
    res.status(403);
    res.send("Not alowed!");
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
