import express from "express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
const router = express.Router();

router.get(":type", getEvents);
router.post(":type", createEvent);
router.put(":type/:id", updateEvent);
router.delete(":type/:id", deleteEvent);

export default router;