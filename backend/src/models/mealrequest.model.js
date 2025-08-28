import mongoose from "mongoose";
// mongo: 68kR9JZtrjb4fN5t

const mealRequestSchema = new mongoose.Schema({
    initiatorGoogleId: String,
    initiatorName: String,
    initiatorEmail: String,
    dateRange: String, // e.g., "next_3_days"
    minTime: Number, 
    specificDate: {type: String, default: null},
    preferredDiningHalls: [String],
    inviteeGoogleId: { type: String, default: null },
    inviteeName: { type: String, default: null },
    inviteeEmail: { type: String, default: null },
    status: { type: String, enum: ['pending', 'matching', 'matched', 'confirmed'], default: 'pending' },
    matchedSlots: { type: Array, default: [] },
    selectedSlot: { type: Object, default: null },
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  });
  
  export default mongoose.model('MealRequest', mealRequestSchema);