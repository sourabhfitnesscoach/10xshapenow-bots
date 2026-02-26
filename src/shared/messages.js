// ============================================================
// src/shared/messages.js
// All Hinglish Messages for Coach Bot + Client Bot
// ============================================================

// ─── CLIENT BOT MESSAGES ────────────────────────────────────

const clientMessages = {

  welcome: (clientName, coachName, channelLink) =>
    `🙏 *Namaste ${clientName} ji!*\n\n` +
    `Aapka 10X Shape 30-Day Transformation Program mein swagat hai! 🎉\n\n` +
    `Main aapki AI Wellness Assistant hoon — main aapko har din guide karungi — subah bhi, shaam bhi.\n\n` +
    `👨‍💼 Aapke Coach hain: *${coachName}*\n\n` +
    `Sabse pehle — neeche diye gaye link pe click karke hamare *Private Transformation Channel* join karein. Isme aapke sabhi 30-din ke videos hain:\n\n` +
    `🔗 ${channelLink}\n\n` +
    `Channel join karne ke baad mujhe reply karein: *JOINED* ✅\n\n` +
    `_Yaad rahe — consistency hi transformation hai. Chalo shuru karte hain! 🔥_`,

  channelJoined: (clientName) =>
    `✅ *Bilkul sahi, ${clientName} ji!*\n\n` +
    `Channel join ho gaya! 🎊\n\n` +
    `Kal subah 7 baje main aapko Day 1 ka message bhejungi. Kal se aapka 30-din ka safar shuru hota hai!\n\n` +
    `Aaj ke liye bas ek kaam — channel mein jao aur videos dekho. Kal ek nayi zindagi ka pehla din hai! 💪`,

  morningMessage: (clientName, dayNumber, taskDescription) =>
    `☀️ *Good Morning ${clientName} ji!*\n\n` +
    `Aaj ka din special hai — *Day ${dayNumber}* 🎯\n\n` +
    `📺 *Aaj ka Video:* Channel mein jaake Day ${dayNumber} ka video dekho\n\n` +
    `✅ *Aaj ka Task:*\n${taskDescription}\n\n` +
    `💡 _"Har din ek chhota kadam — 30 din mein bada badlaav. Aap kar sakte ho!"_\n\n` +
    `Shaam ko main check-in message bhejungi 🌙`,

  eveningCheckIn: (clientName, dayNumber) =>
    `🌙 *Shaam ka Check-in, ${clientName} ji!*\n\n` +
    `Day ${dayNumber} ka review time! 📊\n\n` +
    `Kya aapne aaj ka video dekha aur task complete kiya?\n\n` +
    `Reply karein:\n` +
    `✅ *YES* — Agar aapne video dekha aur task kiya\n` +
    `❌ *NO* — Agar kuch miss ho gaya`,

  dayCompleted: (clientName, dayNumber) =>
    `🔥 *Waah ${clientName} ji!* Day ${dayNumber} complete! 🏆\n\n` +
    `Aap ek din aur aage badh gaye. Ye consistency hi transformation ka raaz hai!\n\n` +
    `Kal subah phir milenge Day ${dayNumber + 1} ke saath. Raat ko achi neend lena! 🌟`,

  dayMissed: (clientName, dayNumber) =>
    `💙 *Koi baat nahi ${clientName} ji!*\n\n` +
    `Aaj kuch ho gaya hoga — life mein aisa hota hai. 😊\n\n` +
    `Lekin yaad rahe — *ek miss chhota hota hai, baar baar miss bada nuksaan*.\n\n` +
    `Kal subah fresh start karo — Day ${dayNumber + 1} aapka wait kar raha hai! 💪`,

  reEngagement: (clientName) =>
    `🚨 *${clientName} ji — 2 din se koi activity nahi!*\n\n` +
    `Main jaanti hoon life busy hoti hai — lekin aapne ye program ek reason se join kiya tha. 🎯\n\n` +
    `Wo reason aaj bhi valid hai.\n\n` +
    `*Abhi sirf ek kaam karo:* Channel kholo aur koi bhi ek video dekho. 5 minute bhi kaafi hain.\n\n` +
    `Aapka transformation rok ke nahi rakhunga — bas ek step lo! 🔥\n\n` +
    `Reply karo: *BACK* agar aap wapas ready ho! 💪`,

  weekReview: (clientName, weekNumber, daysCompleted, daysMissed) =>
    `🎊 *${clientName} ji — Week ${weekNumber} Complete!* 🏆\n\n` +
    `Aapne is hafte *${daysCompleted}/7 din* complete kiye!\n` +
    (daysMissed > 0 ? `(${daysMissed} din miss hue — no worries, aage badhte hain)\n\n` : '\n') +
    `✨ *Aap ek transformation journey pe ho — jo zyada log shuru bhi nahi karte.*\n\n` +
    `Agla week aur powerful hoga. Chalo Week ${weekNumber + 1} mein boom karte hain! 💥`,

  day30Final: (clientName, coachName, coachWhatsapp) =>
    `🎉🎉🎉 *CONGRATULATIONS ${clientName.toUpperCase()} JI!* 🎉🎉🎉\n\n` +
    `*30 DIN PURE HO GAYE!* 🏆\n\n` +
    `Aapne wo kar dikhaya jo bahut kam log kar paate hain — *30 din ki consistency!*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `📺 *Abhi ek kaam karo:*\n` +
    `Channel mein jao aur *Day 30 ka Special Video* dekho — ye video aapki zindagi badal sakta hai.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `🔥 *Ek Bada Sawaal:*\n\n` +
    `Agar aap ye transformation dusron ko bhi dena chahte ho — apne coaching career shuru karke — toh aapke coach *${coachName}* taiyaar hain aapko guide karne ke liye.\n\n` +
    `Agar aap ready ho toh unhe WhatsApp karo:\n` +
    `📱 *${coachWhatsapp}*\n\n` +
    `Message bhejo: *MAIN READY HOON*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Chahe aap coach bano ya na bano — aap hamesha 10X Shape family ka hissa rahoge. 💙_`,

  mainReadyConfirmation: (clientName) =>
    `🔥 *${clientName} ji — AMAZING!*\n\n` +
    `Aapne *MAIN READY HOON* bheja — ye ek badi baat hai! 🎯\n\n` +
    `Aapke coach ko notify kar diya gaya hai. Wo jald hi aapse contact karenge.\n\n` +
    `*Aapka coach career shuru hone wala hai. Welcome to the Empire! 👑*`,

  getDayTask: (dayNumber) => {
    // Default task template — you can expand this with your actual 30-day curriculum
    const tasks = {
      1:  "Subah uthke 10 min walk karo. Aaj ka goal: apna ek health goal likho.",
      2:  "Aaj 2 liter pani piyo. Har glass track karo.",
      3:  "Apna breakfast photo lo aur track karo.",
      4:  "10 min stretching karo. Body ko warm up karo.",
      5:  "Aaj koi processed food mat khao.",
      6:  "20 min walk + 5 min deep breathing.",
      7:  "Week 1 summary likho — kya badla? Kya feel hua?",
      8:  "Aaj apne coach ka video dobara dekho.",
      9:  "Dinner 8 baje se pehle karo.",
      10: "15 min morning yoga ya light exercise.",
      11: "Apna weight aur measurements note karo.",
      12: "Aaj ki meal mein protein zaroor shamil karo.",
      13: "30 min walk — bina phone ke.",
      14: "Week 2 complete! Apni progress photo lo.",
      15: "Ek naya healthy recipe try karo.",
      16: "Aaj sugar completely avoid karo.",
      17: "20 min exercise + 8 glass pani.",
      18: "Apne goals review karo — kya aage badh rahe ho?",
      19: "Family ke saath healthy meal banao.",
      20: "Aaj apna best performance do — full focus.",
      21: "Week 3 milestone! Kisi dost ko inspire karo.",
      22: "Morning routine 30 min complete karo.",
      23: "Aaj ki achievement ek line mein likho.",
      24: "Apni energy level 1-10 rate karo. Kya improve hua?",
      25: "5 din baad Day 30 aayega — taiyaar ho?",
      26: "Apni transformation journey ke 3 biggest changes likho.",
      27: "Aaj extra effort do — last mile strongest hota hai.",
      28: "Apne coach ko thank you message bhejo.",
      29: "Kal Day 30 hai — mental taiyaari karo!",
      30: "FINAL DAY! Channel mein Day 30 Special Video dekho. Aaj sab kuch clear ho jayega."
    };
    return tasks[dayNumber] || `Aaj ka task: Day ${dayNumber} video dekho aur notes banao.`;
  }
};

// ─── COACH BOT MESSAGES ─────────────────────────────────────

const coachMessages = {

  welcome: () =>
    `🙏 *10X Shape Coach Portal mein Aapka Swagat Hai!*\n\n` +
    `Main aapka Coach Assistant Bot hoon — aapke saare clients ka data yahaan manage hoga.\n\n` +
    `Pehle apna registration complete karo.\n\n` +
    `Apna *Poora Naam* type karo:`,

  askPhone: (name) =>
    `✅ Naam save hua: *${name}*\n\n` +
    `Ab apna *WhatsApp Number* type karo (with country code, e.g. 919876543210):`,

  registrationComplete: (name, coachId) =>
    `🎉 *Registration Complete, ${name} ji!*\n\n` +
    `🪪 Aapka Coach ID: *${coachId}*\n\n` +
    `Ye ID save kar lo — yahi aapki identity hai is system mein.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Available Commands:*\n` +
    `➕ /addclient — Naya client register karo\n` +
    `📊 /myclients — Apne sabhi clients dekho\n` +
    `🔍 /client [phone] — Kisi specific client ki progress\n` +
    `ℹ️ /help — Saari commands`,

  askClientName: () =>
    `👤 *Naya Client Register Karo*\n\nClient ka *Poora Naam* type karo:`,

  askClientPhone: (name) =>
    `✅ Client naam: *${name}*\n\nClient ka *Phone Number* type karo (with country code, e.g. 919876543210):`,

  clientRegistered: (clientName, phone) =>
    `✅ *Client Successfully Registered!*\n\n` +
    `👤 Naam: *${clientName}*\n` +
    `📱 Phone: *${phone}*\n\n` +
    `Client Assistant Bot unhe jald hi welcome message bhejega.\n` +
    `_Client ko bolo ke wo apna Telegram kholen — bot ka message aayega._`,

  clientAlreadyExists: (phone) =>
    `⚠️ Is phone number se ek client already registered hai: *${phone}*\n\nDobara try karo ya /myclients se check karo.`,

  morningReport: (coachName, clientSummaries) =>
    `☀️ *Good Morning ${coachName} ji!*\n\n` +
    `📊 *Aaj ka Client Progress Report*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    clientSummaries +
    `\n━━━━━━━━━━━━━━━━━━━━━\n` +
    `_/myclients se full list dekho_`,

  clientSummaryItem: (client) => {
    const status = client.day30Status === 'READY' ? '🔥 READY' : '⏳ In Progress';
    const missed = client.daysMissed.length > 0 ? `❌ Missed Days: ${client.daysMissed.join(', ')}` : '✅ No misses';
    return `👤 *${client.clientName}*\n` +
           `📱 ${client.phone}\n` +
           `📅 Day: ${client.currentDay}/30\n` +
           `📝 Last Task: ${client.lastTaskSubmitted || 'Not started'}\n` +
           `${missed}\n` +
           `🏁 Day 30 Status: ${status}\n\n`;
  },

  clientMissedAlert: (clientName, clientPhone, consecutiveDays) =>
    `🚨 *Alert: Client Inactive!*\n\n` +
    `👤 *${clientName}* (${clientPhone})\n` +
    `Ne ${consecutiveDays} consecutive din se koi activity nahi ki.\n\n` +
    `Bot ne re-engagement message bhej diya hai. Aap bhi personally follow up kar sakte ho.`,

  clientReadyAlert: (clientName, clientPhone) =>
    `🔥 *CONVERSION ALERT!*\n\n` +
    `👤 *${clientName}* (${clientPhone})\n` +
    `Ne *MAIN READY HOON* bheja hai! 🎯\n\n` +
    `Ye client coaching mein join hone ke liye taiyaar hai.\n` +
    `*Abhi WhatsApp pe contact karo!*`,

  noClients: () =>
    `📭 Aapke paas abhi koi registered client nahi hai.\n\n/addclient se pehla client add karo!`,

  clientNotFound: (phone) =>
    `❌ *${phone}* se koi client nahi mila. Phone number check karo.`,

  helpMessage: () =>
    `🤖 *10X Shape Coach Bot — Help Menu*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `➕ /addclient — Naya client register karo\n` +
    `📊 /myclients — Apne sabhi clients ki list\n` +
    `🔍 /client [phone] — Specific client ki full progress\n` +
    `ℹ️ /help — Ye help menu\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Subah 7 baje daily report milegi aapko._`
};

module.exports = { clientMessages, coachMessages };
