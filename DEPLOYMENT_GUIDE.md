# 10X Shape Bot System — Complete Deployment Guide
## By Cohtrix Technologies

---

## 📁 FOLDER STRUCTURE

```
10xshape-bots/
├── src/
│   ├── index.js                ← Main entry point (starts both bots)
│   ├── coachBot/
│   │   └── coachBot.js         ← Coach Bot logic
│   ├── clientBot/
│   │   └── clientBot.js        ← Client Assistant Bot logic
│   └── shared/
│       ├── models.js           ← MongoDB data schemas
│       ├── database.js         ← DB connection
│       └── messages.js         ← All Hinglish messages
├── package.json
├── Procfile                    ← Railway deployment config
├── .env.example                ← Environment variable template
└── .gitignore
```

---

## STEP 1 — CREATE TWO TELEGRAM BOTS

1. Open Telegram and search for **@BotFather**
2. Type `/newbot`
3. Enter name: `10X Shape Coach Portal`
4. Enter username: `10xshape_coach_bot` (must be unique — add numbers if taken)
5. **COPY the TOKEN** — save it as `COACH_BOT_TOKEN`

6. Type `/newbot` again
7. Enter name: `10X Shape Assistant`
8. Enter username: `10xshape_client_bot`
9. **COPY the TOKEN** — save it as `CLIENT_BOT_TOKEN`

---

## STEP 2 — CREATE MONGODB ATLAS DATABASE

1. Go to **https://www.mongodb.com/atlas**
2. Click "Try Free" → Sign up with Google or email
3. Choose **FREE tier (M0)**
4. Select region: **AWS / Mumbai (ap-south-1)**
5. Cluster name: `10xshape`
6. Click "Create Cluster" (takes 2-3 minutes)

**Create Database User:**
7. Left sidebar → "Database Access" → "Add New Database User"
8. Username: `admin10x`
9. Password: Create a strong password (SAVE IT)
10. Role: "Atlas Admin" → "Add User"

**Allow All IPs (for Railway):**
11. Left sidebar → "Network Access" → "Add IP Address"
12. Click "Allow Access from Anywhere" (0.0.0.0/0)
13. Click "Confirm"

**Get Connection String:**
14. Go to "Database" → "Connect" → "Drivers"
15. Select Node.js → Copy the connection string
16. It looks like: `mongodb+srv://admin10x:<password>@cluster.mongodb.net/`
17. Replace `<password>` with your actual password
18. Add `10xshape` before the `?` → `...mongodb.net/10xshape?retryWrites...`
19. This is your `MONGODB_URI`

---

## STEP 3 — SET UP PRIVATE TELEGRAM CHANNEL

1. In Telegram, create a **Private Channel**
2. Name it: `10X Shape 30-Day Transformation`
3. Upload all 30 video lessons to this channel (Day 1, Day 2... Day 30)
4. **Create Invite Link:**
   - Channel settings → Invite Links → Create Invite Link
   - Set it to "No expiry, unlimited members"
   - Copy the link → This is `CHANNEL_INVITE_LINK`

5. **Get Channel ID:**
   - Forward any message from your channel to **@userinfobot**
   - It will reply with the Channel ID (negative number like -1001234567890)
   - This is `PRIVATE_CHANNEL_ID`

---

## STEP 4 — DEPLOY TO RAILWAY.APP

**Install required tools:**
1. Install **Node.js** from https://nodejs.org (LTS version)
2. Install **Git** from https://git-scm.com

**Prepare the project:**
Open Terminal / Command Prompt and run these commands one by one:

```bash
cd 10xshape-bots
npm install
```

**Create .env file:**
1. Copy `.env.example` to a new file called `.env`
2. Fill in all 5 values:
   - `COACH_BOT_TOKEN` = from BotFather Step 1
   - `CLIENT_BOT_TOKEN` = from BotFather Step 1
   - `MONGODB_URI` = from MongoDB Step 2
   - `PRIVATE_CHANNEL_ID` = from Step 3
   - `CHANNEL_INVITE_LINK` = from Step 3

**Push to GitHub:**
```bash
git init
git add .
git commit -m "10X Shape Bot System"
git branch -M main
```

- Go to **github.com** → Create New Repository → name it `10xshape-bots`
- Copy the commands GitHub gives you and run them in terminal

**Deploy on Railway:**
1. Go to **https://railway.app**
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `10xshape-bots`
5. Click "Deploy Now"

**Add Environment Variables on Railway:**
6. Click your project → "Variables" tab
7. Click "Raw Editor" and paste all 5 variables:
```
COACH_BOT_TOKEN=your_value
CLIENT_BOT_TOKEN=your_value
MONGODB_URI=your_value
PRIVATE_CHANNEL_ID=your_value
CHANNEL_INVITE_LINK=your_value
TZ=Asia/Kolkata
```
8. Click "Update Variables" — Railway will restart automatically

---

## STEP 5 — TEST THE SYSTEM

**Test Coach Bot:**
1. Open Telegram → Search your `10xshape_coach_bot`
2. Click Start → Type your full name when asked
3. Type your phone number
4. You should receive a Coach ID like `COACH-0001`
5. Type `/addclient` → Enter a test client name and phone

**Test Client Bot:**
1. Open Telegram → Search `10xshape_client_bot`
2. Click Start
3. Enter the same phone number you just registered as a test client
4. You should receive the welcome message with channel invite link
5. Reply: `JOINED`
6. You'll receive confirmation

**Test Morning/Evening Messages:**
The cron jobs run at:
- 7:00 AM IST = Morning messages to clients + reports to coaches
- 8:00 PM IST = Evening check-in messages to clients

---

## SYSTEM FLOW DIAGRAM

```
COACH registers client via Coach Bot
         ↓
Client starts Client Bot → enters phone → LINKED to their record
         ↓
Client receives WELCOME MESSAGE + Channel Link
         ↓
Client replies JOINED → confirmed
         ↓
Every 7:00 AM → Morning message with Day number + task
         ↓
Every 8:00 PM → Evening check-in (YES/NO)
         ↓
Day 7, 14, 21 → Week review celebration message
         ↓
Day 30 → Final message + MAIN READY HOON invitation
         ↓
Client sends MAIN READY HOON → Coach gets instant alert
```

---

## COMMANDS REFERENCE

**Coach Bot Commands:**
| Command | What it does |
|---------|-------------|
| /start | Register or login |
| /addclient | Register a new client |
| /myclients | See all your clients + progress |
| /client 919876543210 | See one specific client's details |
| /help | See all commands |

**Client Bot Responses:**
| Client types | What happens |
|-------------|-------------|
| JOINED | Confirms channel join |
| YES | Marks today complete |
| NO | Records miss, sends nudge |
| BACK | Resets consecutive miss counter |
| MAIN READY HOON | Records conversion, alerts coach |

---

## TROUBLESHOOTING

**Bot not responding:**
- Check Railway logs (Deployments → View Logs)
- Ensure all 6 environment variables are set
- Check MongoDB IP whitelist (0.0.0.0/0 allowed)

**Client can't verify phone:**
- Coach must register client BEFORE client starts the bot
- Phone number format must match exactly (e.g. 919876543210)

**Cron not firing:**
- Railway free tier may sleep — upgrade to Starter plan ($5/month) for always-on
- Or use Railway's "Always On" toggle in settings

---

## CUSTOMIZING THE 30-DAY CURRICULUM

In `src/shared/messages.js`, find the `getDayTask()` function.
Replace each day's task text with your actual curriculum tasks.
This is where you write the specific daily tasks for all 30 days.

---

*Built for 10X Shape by Cohtrix Technologies*
*Automation First, Manual Only If Required*
