// ============================================================
// src/coachBot/coachBot.js
// BOT 1 — Coach Bot (for coaches only)
// ============================================================

const TelegramBot = require('node-telegram-bot-api');
const { Coach, Client } = require('../shared/models');
const { coachMessages } = require('../shared/messages');

const registrationSessions = {};
const addClientSessions = {};

function generateCoachId(count) {
  return 'COACH-' + String(count).padStart(4, '0');
}

async function initCoachBot(token, clientBotInstance) {
  const bot = new TelegramBot(token, { polling: true });
  console.log('✅ Coach Bot started');

  // ─── /start ────────────────────────────────────────────────
  bot.onText(/\/start/, async (msg) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;

    const existingCoach = await Coach.findOne({ telegramId });
    if (existingCoach) {
      await bot.sendMessage(chatId,
        `🙏 *Wapas aaye, ${existingCoach.fullName} ji!*\n\n` +
        `Aapka Coach ID: *${existingCoach.coachId}*\n\n` +
        coachMessages.helpMessage(),
        { parse_mode: 'Markdown' }
      );
      return;
    }

    registrationSessions[telegramId] = { step: 'NAME', data: {} };
    await bot.sendMessage(chatId, coachMessages.welcome(), { parse_mode: 'Markdown' });
  });

  // ─── /addclient ────────────────────────────────────────────
  bot.onText(/\/addclient/, async (msg) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;

    const coach = await Coach.findOne({ telegramId });
    if (!coach) {
      await bot.sendMessage(chatId, '⚠️ Pehle /start se register karo!');
      return;
    }

    addClientSessions[telegramId] = { step: 'CLIENT_NAME', data: { coachId: coach.coachId, coachTelegramId: telegramId } };
    await bot.sendMessage(chatId, coachMessages.askClientName(), { parse_mode: 'Markdown' });
  });

  // ─── /myclients ────────────────────────────────────────────
  bot.onText(/\/myclients/, async (msg) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;

    const coach = await Coach.findOne({ telegramId });
    if (!coach) {
      await bot.sendMessage(chatId, '⚠️ Pehle /start se register karo!');
      return;
    }

    const clients = await Client.find({ coachId: coach.coachId });
    if (clients.length === 0) {
      await bot.sendMessage(chatId, coachMessages.noClients(), { parse_mode: 'Markdown' });
      return;
    }

    let report = `📊 *${coach.fullName} ji ke Clients (${clients.length} total)*\n━━━━━━━━━━━━━━━━━━━━━\n\n`;
    for (const client of clients) {
      report += coachMessages.clientSummaryItem(client);
    }

    await bot.sendMessage(chatId, report, { parse_mode: 'Markdown' });
  });

  // ─── /client [phone] ───────────────────────────────────────
  bot.onText(/\/client (.+)/, async (msg, match) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;
    const phone = match[1].trim();

    const coach = await Coach.findOne({ telegramId });
    if (!coach) {
      await bot.sendMessage(chatId, '⚠️ Pehle /start se register karo!');
      return;
    }

    const client = await Client.findOne({ coachId: coach.coachId, phone });
    if (!client) {
      await bot.sendMessage(chatId, coachMessages.clientNotFound(phone), { parse_mode: 'Markdown' });
      return;
    }

    const detail =
      `🔍 *Client Details*\n━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 Naam: *${client.clientName}*\n` +
      `📱 Phone: *${client.phone}*\n` +
      `📅 Current Day: *${client.currentDay}/30*\n` +
      `📝 Last Task: *${client.lastTaskSubmitted || 'Not submitted yet'}*\n` +
      `📆 Joined: *${client.joinedAt ? client.joinedAt.toDateString() : 'N/A'}*\n` +
      `❌ Days Missed: *${client.daysMissed.length > 0 ? client.daysMissed.join(', ') : 'None'}*\n` +
      `🔁 Consecutive Misses: *${client.consecutiveMisses}*\n` +
      `🏁 Day 30 Status: *${client.day30Status}*\n` +
      `📌 Program Status: *${client.programStatus}*\n`;

    await bot.sendMessage(chatId, detail, { parse_mode: 'Markdown' });
  });

  // ─── /deactivateclient [phone] ─────────────────────────────
  bot.onText(/\/deactivateclient (.+)/, async (msg, match) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;
    const phone = match[1].trim();

    const coach = await Coach.findOne({ telegramId });
    if (!coach) {
      await bot.sendMessage(chatId, '⚠️ Pehle /start se register karo!');
      return;
    }

    const client = await Client.findOne({ coachId: coach.coachId, phone });
    if (!client) {
      await bot.sendMessage(chatId,
        `❌ *Client nahi mila*\n\nPhone: *${phone}* aapke clients mein nahi hai.`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    if (client.programStatus === 'INACTIVE') {
      await bot.sendMessage(chatId,
        `⚠️ *${client.clientName}* pehle se hi inactive hai.`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    const prevStatus = client.programStatus;
    client.programStatus = 'INACTIVE';
    await client.save();

    await bot.sendMessage(chatId,
      `✅ *Client Deactivated*\n\n` +
      `👤 Naam: *${client.clientName}*\n` +
      `📱 Phone: *${client.phone}*\n` +
      `📅 Day: *${client.currentDay}/30*\n\n` +
      `Status: *${prevStatus}* → *INACTIVE*\n\n` +
      `_Client ko ab koi message nahi jayega. Reactivate karne ke liye /reactivateclient ${phone}_`,
      { parse_mode: 'Markdown' }
    );
  });

  // ─── /reactivateclient [phone] ─────────────────────────────
  bot.onText(/\/reactivateclient (.+)/, async (msg, match) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;
    const phone = match[1].trim();

    const coach = await Coach.findOne({ telegramId });
    if (!coach) {
      await bot.sendMessage(chatId, '⚠️ Pehle /start se register karo!');
      return;
    }

    const client = await Client.findOne({ coachId: coach.coachId, phone });
    if (!client) {
      await bot.sendMessage(chatId,
        `❌ *Client nahi mila*\n\nPhone: *${phone}* aapke clients mein nahi hai.`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    client.programStatus = 'ACTIVE';
    await client.save();

    await bot.sendMessage(chatId,
      `✅ *Client Reactivated!*\n\n` +
      `👤 Naam: *${client.clientName}*\n` +
      `📱 Phone: *${client.phone}*\n` +
      `📅 Day: *${client.currentDay}/30*\n\n` +
      `_Kal subah se regular messages phir shuru ho jayenge._`,
      { parse_mode: 'Markdown' }
    );
  });

  // ─── /deleteclient [phone] ─────────────────────────────────
  bot.onText(/\/deleteclient (.+)/, async (msg, match) => {
    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;
    const phone = match[1].trim();

    const coach = await Coach.findOne({ telegramId });
    if (!coach) {
      await bot.sendMessage(chatId, '⚠️ Pehle /start se register karo!');
      return;
    }

    const client = await Client.findOne({ coachId: coach.coachId, phone });
    if (!client) {
      await bot.sendMessage(chatId,
        `❌ *Client nahi mila*\n\nPhone: *${phone}* aapke clients mein nahi hai.`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    const clientName = client.clientName;
    await Client.deleteOne({ _id: client._id });

    await bot.sendMessage(chatId,
      `🗑️ *Client Permanently Deleted*\n\n` +
      `👤 Naam: *${clientName}*\n` +
      `📱 Phone: *${phone}*\n\n` +
      `⚠️ _Ye action undo nahi ho sakta. Client ka saara data delete ho gaya._`,
      { parse_mode: 'Markdown' }
    );
  });

  // ─── /help ─────────────────────────────────────────────────
  bot.onText(/\/help/, async (msg) => {
    await bot.sendMessage(msg.chat.id,
      `📋 *Available Commands*\n━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `➕ /addclient — Naya client register karo\n` +
      `📊 /myclients — Apne sabhi clients dekho\n` +
      `🔍 /client [phone] — Kisi client ki details\n` +
      `⏸️ /deactivateclient [phone] — Client ko pause karo\n` +
      `▶️ /reactivateclient [phone] — Client ko resume karo\n` +
      `🗑️ /deleteclient [phone] — Client permanently delete karo\n` +
      `❓ /help — Ye list`,
      { parse_mode: 'Markdown' }
    );
  });

  // ─── GENERAL MESSAGE HANDLER ───────────────────────────────
  bot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/')) return;

    const telegramId = String(msg.from.id);
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    // ── COACH REGISTRATION FLOW ───────────────────────────
    if (registrationSessions[telegramId]) {
      const session = registrationSessions[telegramId];

      if (session.step === 'NAME') {
        session.data.fullName = text;
        session.step = 'PHONE';
        await bot.sendMessage(chatId, coachMessages.askPhone(text), { parse_mode: 'Markdown' });
        return;
      }

      if (session.step === 'PHONE') {
        session.data.phone = text;

        const coachCount = await Coach.countDocuments();
        const coachId = generateCoachId(coachCount + 1);

        const newCoach = new Coach({
          telegramId,
          coachId,
          fullName: session.data.fullName,
          phone: session.data.phone,
          whatsapp: session.data.phone
        });
        await newCoach.save();

        delete registrationSessions[telegramId];

        await bot.sendMessage(chatId,
          coachMessages.registrationComplete(newCoach.fullName, coachId),
          { parse_mode: 'Markdown' }
        );
        return;
      }
    }

    // ── ADD CLIENT FLOW ───────────────────────────────────
    if (addClientSessions[telegramId]) {
      const session = addClientSessions[telegramId];

      if (session.step === 'CLIENT_NAME') {
        session.data.clientName = text;
        session.step = 'CLIENT_PHONE';
        await bot.sendMessage(chatId, coachMessages.askClientPhone(text), { parse_mode: 'Markdown' });
        return;
      }

      if (session.step === 'CLIENT_PHONE') {
        session.data.phone = text;

        const existing = await Client.findOne({ phone: session.data.phone });
        if (existing) {
          delete addClientSessions[telegramId];
          await bot.sendMessage(chatId, coachMessages.clientAlreadyExists(session.data.phone), { parse_mode: 'Markdown' });
          return;
        }

        const newClient = new Client({
          clientName: session.data.clientName,
          phone:      session.data.phone,
          coachId:    session.data.coachId,
          coachTelegramId: session.data.coachTelegramId,
          programStatus: 'REGISTERED'
        });
        await newClient.save();

        delete addClientSessions[telegramId];

        await bot.sendMessage(chatId,
          coachMessages.clientRegistered(session.data.clientName, session.data.phone),
          { parse_mode: 'Markdown' }
        );

        console.log(`📌 Client registered: ${session.data.clientName} under coach ${session.data.coachId}`);
        return;
      }
    }
  });

  // ─── SEND MORNING REPORTS ───────────────────────────────────
  bot.sendMorningReports = async () => {
    const coaches = await Coach.find({ isActive: true });

    for (const coach of coaches) {
      const clients = await Client.find({ coachId: coach.coachId, programStatus: 'ACTIVE' });
      if (clients.length === 0) continue;

      let summaries = '';
      for (const client of clients) {
        summaries += coachMessages.clientSummaryItem(client);
      }

      try {
        await bot.sendMessage(
          coach.telegramId,
          coachMessages.morningReport(coach.fullName, summaries),
          { parse_mode: 'Markdown' }
        );
      } catch (err) {
        console.error(`Error sending morning report to coach ${coach.coachId}:`, err.message);
      }
    }
  };

  // ─── NOTIFY COACH of missed client ─────────────────────────
  bot.notifyCoachMissed = async (coachTelegramId, clientName, clientPhone, consecutiveDays) => {
    try {
      await bot.sendMessage(
        coachTelegramId,
        coachMessages.clientMissedAlert(clientName, clientPhone, consecutiveDays),
        { parse_mode: 'Markdown' }
      );
    } catch (err) {
      console.error('Error notifying coach of missed client:', err.message);
    }
  };

  // ─── NOTIFY COACH of Day 30 READY ──────────────────────────
  bot.notifyCoachReady = async (coachTelegramId, clientName, clientPhone) => {
    try {
      await bot.sendMessage(
        coachTelegramId,
        coachMessages.clientReadyAlert(clientName, clientPhone),
        { parse_mode: 'Markdown' }
      );
    } catch (err) {
      console.error('Error notifying coach of ready client:', err.message);
    }
  };

  return bot;
}

module.exports = { initCoachBot };
