// ============================================================
// src/index.js
// MAIN ENTRY POINT — 10X Shape Bot System
// Starts both bots + cron scheduler
// ============================================================

require('dotenv').config();
const cron = require('node-cron');

const { connectDB } = require('./shared/database');
const { initCoachBot } = require('./coachBot/coachBot');
const { initClientBot } = require('./clientBot/clientBot');

async function main() {
  console.log('🚀 Starting 10X Shape Bot System...');

  // ─── 1. Connect to MongoDB ──────────────────────────────
  await connectDB();

  // ─── 2. Start Client Bot first (so coach bot can reference it) ──
  const clientBot = await initClientBot(process.env.CLIENT_BOT_TOKEN, null);

  // ─── 3. Start Coach Bot (pass clientBot reference) ─────
  const coachBot = await initCoachBot(process.env.COACH_BOT_TOKEN, clientBot);

  // ─── 4. Link coach bot back into client bot ─────────────
  // This enables cross-bot notifications
  clientBot._coachBot = coachBot;

  // ─── 5. CRON JOBS ───────────────────────────────────────
  // India Standard Time (UTC+5:30)
  // node-cron uses server time — Railway is UTC, so we subtract 5:30

  // MORNING MESSAGES — 7:00 AM IST = 1:30 AM UTC
  cron.schedule('30 1 * * *', async () => {
    console.log('⏰ Running morning messages — 7:00 AM IST');
    try {
      await clientBot.sendMorningMessages();
      await coachBot.sendMorningReports();
    } catch (err) {
      console.error('Cron morning error:', err.message);
    }
  });

  // EVENING CHECK-INS — 8:00 PM IST = 2:30 PM UTC
  cron.schedule('30 14 * * *', async () => {
    console.log('⏰ Running evening check-ins — 8:00 PM IST');
    try {
      await clientBot.sendEveningCheckIns();
    } catch (err) {
      console.error('Cron evening error:', err.message);
    }
  });

  console.log('✅ All systems running!');
  console.log('📅 Morning cron: 7:00 AM IST');
  console.log('📅 Evening cron: 8:00 PM IST');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch((err) => {
  console.error('❌ Fatal startup error:', err);
  process.exit(1);
});
