// ============================================================
// src/clientBot/clientBot.js
// BOT 2 — Client Assistant Bot (for clients only)
// ============================================================

const TelegramBot = require('node-telegram-bot-api');
const { Coach, Client } = require('../shared/models');
const { clientMessages } = require('../shared/messages');

async function initClientBot(token, coachBotInstance) {
  const bot = new TelegramBot(token, { polling: true });
  console.log('✅ Client Bot started');

  const channelLink = process.env.CHANNEL_INVITE_LINK;

  // ─── /start ────────────────────────────────────────────────
  bot.onText(/\/start/, async (msg) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;

    // Find unboarded client by checking if this Telegram user has registered phone
    // Client must be registered by coach first, then they start the bot
    // We match by checking existing unboarded clients

    // Check if already onboarded
    const existingClient = await Client.findOne({ telegramId });
    if (existingClient) {
      await bot.sendMessage(chatId,
        `🙏 *${existingClient.clientName} ji, wapas aaye!*\n\n` +
        `Aap *Day ${existingClient.currentDay}/30* pe ho.\n\n` +
        `Apna aaj ka video dekhna mat bhuliyo! 💪`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // No telegram ID match — ask for phone number to link their account
    await bot.sendMessage(chatId,
      `🙏 *Namaste! 10X Shape Transformation Bot mein Aapka Swagat!*\n\n` +
      `Apna *registered phone number* type karein (jaise 919876543210):\n\n` +
      `_Ye wo number hona chahiye jo aapke coach ne register kiya._`,
      { parse_mode: 'Markdown' }
    );

    // Mark this user as waiting for phone verification
    // We use a simple in-memory map
    bot._pendingVerification = bot._pendingVerification || {};
    bot._pendingVerification[telegramId] = true;
  });

  // ─── GENERAL MESSAGE HANDLER ───────────────────────────────
  bot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/')) return;

    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;
    const text = msg.text.trim().toUpperCase();

    // ── PHONE VERIFICATION ────────────────────────────────
    bot._pendingVerification = bot._pendingVerification || {};

    if (bot._pendingVerification[telegramId]) {
      const phoneInput = msg.text.trim();

      // Try to find unboarded client with this phone
      const client = await Client.findOne({ phone: phoneInput, telegramId: null });

      if (!client) {
        await bot.sendMessage(chatId,
          `❌ Ye phone number system mein nahi mila.\n\n` +
          `Apne coach se confirm karo ki unhone *${phoneInput}* se aapko register kiya hai ya nahi.`,
          { parse_mode: 'Markdown' }
        );
        return;
      }

      // Link Telegram ID to client
      client.telegramId = telegramId;
      client.isOnboarded = true;
      client.programStatus = 'ACTIVE';
      client.programStartDate = new Date();
      client.currentDay = 0;
      await client.save();

      delete bot._pendingVerification[telegramId];

      // Get coach info for welcome message
      const coach = await Coach.findOne({ coachId: client.coachId });
      const coachName = coach ? coach.fullName : 'Aapke Coach';

      await bot.sendMessage(chatId,
        clientMessages.welcome(client.clientName, coachName, channelLink),
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // ── JOINED CHANNEL CONFIRMATION ───────────────────────
    if (text === 'JOINED') {
      const client = await Client.findOne({ telegramId });
      if (!client) return;

      await bot.sendMessage(chatId,
        clientMessages.channelJoined(client.clientName),
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // ── EVENING CHECK-IN RESPONSE ─────────────────────────
    if (text === 'YES' || text === 'NO') {
      const client = await Client.findOne({ telegramId });
      if (!client || client.currentDay === 0) return;

      const today = new Date();
      const dayOfProgram = client.currentDay;

      if (text === 'YES') {
        // Mark day as complete
        client.lastTaskSubmitted = 'YES';
        client.lastActivityDate = today;
        client.consecutiveMisses = 0;

        // Week summaries
        if (dayOfProgram === 7)  client.weekSummaries.week1 = `Week 1 complete!`;
        if (dayOfProgram === 14) client.weekSummaries.week2 = `Week 2 complete!`;
        if (dayOfProgram === 21) client.weekSummaries.week3 = `Week 3 complete!`;

        await client.save();

        if (dayOfProgram < 30) {
          await bot.sendMessage(chatId,
            clientMessages.dayCompleted(client.clientName, dayOfProgram),
            { parse_mode: 'Markdown' }
          );
        }

      } else {
        // Mark day as missed
        client.lastTaskSubmitted = 'NO';
        client.consecutiveMisses += 1;
        if (!client.daysMissed.includes(dayOfProgram)) {
          client.daysMissed.push(dayOfProgram);
        }
        await client.save();

        await bot.sendMessage(chatId,
          clientMessages.dayMissed(client.clientName, dayOfProgram),
          { parse_mode: 'Markdown' }
        );

        // 2+ consecutive misses — notify coach
        if (client.consecutiveMisses >= 2) {
          await bot.sendMessage(chatId,
            clientMessages.reEngagement(client.clientName),
            { parse_mode: 'Markdown' }
          );

          if (coachBotInstance && client.coachTelegramId) {
            await coachBotInstance.notifyCoachMissed(
              client.coachTelegramId,
              client.clientName,
              client.phone,
              client.consecutiveMisses
            );
          }
        }
      }
      return;
    }

    // ── BACK (re-engagement response) ────────────────────
    if (text === 'BACK') {
      const client = await Client.findOne({ telegramId });
      if (!client) return;

      client.consecutiveMisses = 0;
      await client.save();

      await bot.sendMessage(chatId,
        `🔥 *WAPAS AA GAYE!*\n\n${client.clientName} ji, ye decision sahi hai!\n\n` +
        `Kal subah fresh start — Day ${client.currentDay + 1} aapka wait kar raha hai! 💪`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // ── MAIN READY HOON ───────────────────────────────────
    if (text === 'MAIN READY HOON') {
      const client = await Client.findOne({ telegramId });
      if (!client) return;

      // Record the conversion
      client.day30Status = 'READY';
      client.day30StatusDate = new Date();
      client.programStatus = 'COMPLETED';
      await client.save();

      await bot.sendMessage(chatId,
        clientMessages.mainReadyConfirmation(client.clientName),
        { parse_mode: 'Markdown' }
      );

      // Notify coach
      if (coachBotInstance && client.coachTelegramId) {
        await coachBotInstance.notifyCoachReady(
          client.coachTelegramId,
          client.clientName,
          client.phone
        );
      }
      return;
    }
  });

  // ─── SEND MORNING MESSAGES (called by cron in index.js) ────
  bot.sendMorningMessages = async () => {
    const activeClients = await Client.find({ programStatus: 'ACTIVE' });

    for (const client of activeClients) {
      if (!client.telegramId) continue;

      // Advance to next day
      client.currentDay += 1;

      if (client.currentDay > 30) {
        client.programStatus = 'COMPLETED';
        await client.save();
        continue;
      }

      await client.save();

      const task = clientMessages.getDayTask(client.currentDay);

      try {
        await bot.sendMessage(
          client.telegramId,
          clientMessages.morningMessage(client.clientName, client.currentDay, task),
          { parse_mode: 'Markdown' }
        );

        // Send week review messages
        if ([7, 14, 21].includes(client.currentDay)) {
          const weekNum = client.currentDay / 7;
          const daysCompleted = client.currentDay - client.daysMissed.filter(d => d <= client.currentDay).length;
          const daysMissedInWeek = client.daysMissed.filter(d => d > client.currentDay - 7 && d <= client.currentDay).length;

          setTimeout(async () => {
            await bot.sendMessage(
              client.telegramId,
              clientMessages.weekReview(client.clientName, weekNum, daysCompleted, daysMissedInWeek),
              { parse_mode: 'Markdown' }
            );
          }, 5000);
        }

        // Day 30 final message
        if (client.currentDay === 30) {
          const coach = await Coach.findOne({ coachId: client.coachId });
          const coachWhatsapp = coach ? coach.whatsapp : 'Apne Coach se contact karo';
          const coachName = coach ? coach.fullName : 'Aapke Coach';

          setTimeout(async () => {
            await bot.sendMessage(
              client.telegramId,
              clientMessages.day30Final(client.clientName, coachName, coachWhatsapp),
              { parse_mode: 'Markdown' }
            );
          }, 10000);
        }

      } catch (err) {
        console.error(`Error sending morning message to client ${client.clientName}:`, err.message);
      }
    }
  };

  // ─── SEND EVENING CHECK-INS (called by cron in index.js) ───
  bot.sendEveningCheckIns = async () => {
    const activeClients = await Client.find({ programStatus: 'ACTIVE' });

    for (const client of activeClients) {
      if (!client.telegramId || client.currentDay === 0) continue;

      try {
        await bot.sendMessage(
          client.telegramId,
          clientMessages.eveningCheckIn(client.clientName, client.currentDay),
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        console.error(`Error sending evening check-in to ${client.clientName}:`, err.message);
      }
    }
  };

  return bot;
}

module.exports = { initClientBot };
