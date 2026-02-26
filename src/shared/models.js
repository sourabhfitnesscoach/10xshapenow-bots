// ============================================================
// src/shared/models.js
// MongoDB Schemas for Coaches and Clients
// ============================================================

const mongoose = require('mongoose');

// ─── COACH SCHEMA ────────────────────────────────────────────
const coachSchema = new mongoose.Schema({
  telegramId:   { type: String, required: true, unique: true },
  coachId:      { type: String, required: true, unique: true }, // e.g. COACH-0001
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  whatsapp:     { type: String },               // WhatsApp number for client Day 30 referral
  registeredAt: { type: Date, default: Date.now },
  isActive:     { type: Boolean, default: true }
});

// ─── CLIENT SCHEMA ───────────────────────────────────────────
const clientSchema = new mongoose.Schema({
  telegramId:        { type: String, default: null },    // Set after client starts bot
  clientName:        { type: String, required: true },
  phone:             { type: String, required: true },
  coachId:           { type: String, required: true },   // Which coach registered them
  coachTelegramId:   { type: String, required: true },
  joinedAt:          { type: Date, default: Date.now },
  currentDay:        { type: Number, default: 0 },       // 0 = not started
  lastTaskSubmitted: { type: String, default: null },    // 'YES' or 'NO'
  lastActivityDate:  { type: Date, default: null },
  daysMissed:        { type: [Number], default: [] },    // Array of missed day numbers
  consecutiveMisses: { type: Number, default: 0 },
  weekSummaries: {
    week1: { type: String, default: null },
    week2: { type: String, default: null },
    week3: { type: String, default: null },
    week4: { type: String, default: null }
  },
  day30Status:       { type: String, default: 'PENDING' }, // PENDING / READY
  day30StatusDate:   { type: Date, default: null },
  isOnboarded:       { type: Boolean, default: false },   // Has started the Client Bot
  programStartDate:  { type: Date, default: null },
  programStatus:     { type: String, default: 'REGISTERED' } // REGISTERED / ACTIVE / COMPLETED
});

const Coach  = mongoose.model('Coach', coachSchema);
const Client = mongoose.model('Client', clientSchema);

module.exports = { Coach, Client };
