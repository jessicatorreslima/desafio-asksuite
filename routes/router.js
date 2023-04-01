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
    const errors = [];
    if (!checkin) {
        errors.push("Check-in date is required");
    }
    if (!checkout) {
        errors.push("Checkout date is required");
    }
    return errors;
}

module.exports = router;
