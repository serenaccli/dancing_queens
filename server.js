const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const dataDir = path.join(root, "data");
const storePath = path.join(dataDir, "store.json");
const port = Number(process.env.PORT || 5174);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png"
};

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({ profile: null, sessions: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(storePath, "utf8"));
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function mobilityDefaults(profile = {}) {
  const supports = profile.supports || [];
  const condition = profile.condition || "unspecified";
  const mobility = profile.mobility || "seated";
  const settings = {
    mode: "handPath",
    access: "dwell",
    sensitivity: 6,
    intensity: 6,
    targetSize: 7,
    dwellTime: 1000,
    tempo: 96,
    reducedMotion: false,
    suggestedEffect: "ribbons"
  };

  if (mobility === "wheelchair") {
    settings.mode = "handPath";
    settings.suggestedEffect = "stars";
  }
  if (mobility === "bed" || mobility === "assisted") {
    settings.mode = "headTracking";
    settings.access = mobility === "assisted" ? "assisted" : "dwell";
    settings.sensitivity = 8;
    settings.intensity = 5;
    settings.targetSize = 9;
    settings.dwellTime = 1250;
  }
  if (supports.includes("head")) settings.mode = "headTracking";
  if (supports.includes("switch")) {
    settings.mode = "keyboard";
    settings.access = "switch";
    settings.targetSize = 10;
  }
  if (supports.includes("sensory-soft") || condition === "autism") {
    settings.tempo = 78;
    settings.intensity = 3;
    settings.reducedMotion = true;
    settings.suggestedEffect = "bubbles";
    settings.dwellTime = 1500;
  }
  if (supports.includes("one-arm")) settings.mode = "handPath";
  if (profile.calibration) {
    settings.targetSize = profile.calibration.targetSize || settings.targetSize;
    settings.dwellTime = profile.calibration.dwellTime || settings.dwellTime;
  }

  return settings;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function oneHot(value, options) {
  return options.map((option) => value === option ? 1 : 0);
}

function movementVector(features = {}, profile = {}) {
  const mode = features.mode || mobilityDefaults(profile).mode;
  const access = features.access || mobilityDefaults(profile).access;
  const zone = String(features.zone || "middle-center");
  const supports = profile.supports || [];
  return [
    clamp01(features.level),
    clamp01(features.x ?? 0.5),
    clamp01(features.y ?? 0.5),
    clamp01((Number(features.velocity) || 0) * 18),
    clamp01((Number(features.calibratedNoise) || 0.06) / 0.28),
    zone.startsWith("high") ? 1 : 0,
    zone.startsWith("middle") ? 1 : 0,
    zone.startsWith("low") ? 1 : 0,
    zone.endsWith("left") ? 1 : 0,
    zone.endsWith("center") ? 1 : 0,
    zone.endsWith("right") ? 1 : 0,
    ...oneHot(mode, ["keyboard", "headTracking", "handPath", "upperBody", "oneArm"]),
    ...oneHot(access, ["switch", "dwell", "camera", "assisted"]),
    supports.includes("head") ? 1 : 0,
    supports.includes("one-arm") ? 1 : 0,
    supports.includes("switch") ? 1 : 0,
    supports.includes("sensory-soft") ? 1 : 0,
    features.targetHit ? 1 : 0
  ];
}

const actionMeta = {
  "calm bloom collected": { effect: "flowers", praise: "Your breath made the bloom open." },
  "movement bloom collected": { effect: "flowers", praise: "Your movement opened the bloom." },
  "keyboard path step": { effect: "stars", praise: "Beautiful tap." },
  "tiny head shimmer": { effect: "bubbles", praise: "Tiny head movement counts." },
  "tiny shimmer": { effect: "bubbles", praise: "Tiny moves count." },
  "head tilt halo": { effect: "stars", praise: "That head move made magic." },
  "chair glide wave": { effect: "ribbons", praise: "Your glide filled the room." },
  "hand path sweep": { effect: "ribbons", praise: "That hand move is dancing." },
  "big queen burst": { effect: "flowers", praise: "Yes, queen. Keep glowing." },
  "gentle glow": { effect: "bubbles", praise: "I see your movement." }
};

function seededMlModel() {
  const seeds = [
    ["gentle glow", { level: 0.02, x: 0.5, y: 0.5, velocity: 0.001, zone: "middle-center" }],
    ["tiny shimmer", { level: 0.035, x: 0.52, y: 0.5, velocity: 0.002, zone: "middle-center" }],
    ["tiny head shimmer", { level: 0.035, x: 0.5, y: 0.24, velocity: 0.002, zone: "high-center", mode: "headTracking" }],
    ["head tilt halo", { level: 0.16, x: 0.5, y: 0.22, velocity: 0.012, zone: "high-center", mode: "headTracking" }],
    ["chair glide wave", { level: 0.2, x: 0.5, y: 0.76, velocity: 0.012, zone: "low-center" }],
    ["hand path sweep", { level: 0.22, x: 0.78, y: 0.45, velocity: 0.018, zone: "middle-right", mode: "handPath" }],
    ["keyboard path step", { level: 0.4, x: 0.5, y: 0.62, velocity: 0.01, zone: "keyboard", mode: "keyboard", access: "switch" }],
    ["big queen burst", { level: 0.72, x: 0.5, y: 0.46, velocity: 0.04, zone: "middle-center" }],
    ["movement bloom collected", { level: 0.45, x: 0.5, y: 0.46, velocity: 0.02, zone: "middle-center", targetHit: true }],
    ["calm bloom collected", { level: 0.18, x: 0.5, y: 0.5, velocity: 0.004, zone: "middle-center", targetHit: true, wellness: "calm" }]
  ];
  const labels = {};
  seeds.forEach(([label, sample]) => {
    labels[label] = { count: 1, centroid: movementVector(sample, {}) };
  });
  return { version: 1, labels, observations: seeds.length, updatedAt: new Date().toISOString() };
}

function getMlModel(store) {
  if (!store.mlModel || store.mlModel.version !== 1 || !store.mlModel.labels) {
    store.mlModel = seededMlModel();
  }
  return store.mlModel;
}

function distance(a, b) {
  let total = 0;
  for (let index = 0; index < a.length; index += 1) {
    const diff = (a[index] || 0) - (b[index] || 0);
    total += diff * diff;
  }
  return Math.sqrt(total / a.length);
}

function predictMovement(model, vector) {
  let best = null;
  let second = null;
  Object.entries(model.labels).forEach(([label, entry]) => {
    const score = distance(vector, entry.centroid);
    if (!best || score < best.score) {
      second = best;
      best = { label, score, count: entry.count || 1 };
    } else if (!second || score < second.score) {
      second = { label, score, count: entry.count || 1 };
    }
  });
  const margin = second ? Math.max(0, second.score - best.score) : 0.2;
  const confidence = Math.max(0.12, Math.min(0.96, 1 - best.score * 1.45 + margin * 0.65));
  return { ...best, confidence };
}

function learnMovement(model, label, vector, strength = 1) {
  if (!model.labels[label]) {
    model.labels[label] = { count: 0, centroid: vector.slice() };
  }
  const entry = model.labels[label];
  const count = Number(entry.count || 0);
  const rate = Math.min(0.35, strength / (count + strength + 6));
  entry.centroid = entry.centroid.map((value, index) => value * (1 - rate) + vector[index] * rate);
  entry.count = count + strength;
  model.observations = Number(model.observations || 0) + strength;
  model.updatedAt = new Date().toISOString();
}

function ruleMapMovement(features = {}, profile = {}) {
  const level = Number(features.level || 0);
  const x = Number(features.x || 0.5);
  const y = Number(features.y || 0.5);
  const velocity = Number(features.velocity || 0);
  const mode = features.mode || mobilityDefaults(profile).mode;
  const access = features.access || mobilityDefaults(profile).access;
  const zone = String(features.zone || "middle-center");
  const targetHit = Boolean(features.targetHit);
  const wellness = String(features.wellness || "mobility");
  const supports = profile.supports || [];

  let action = "gentle glow";
  let effect = features.effect || mobilityDefaults(profile).suggestedEffect;
  let confidence = Math.min(0.98, Math.max(0.08, level * 1.2 + velocity * 0.9));
  let praise = "I see your movement.";

  if (targetHit) {
    action = wellness === "calm" ? "calm bloom collected" : "movement bloom collected";
    effect = "flowers";
    confidence = Math.max(confidence, 0.88);
    praise = wellness === "calm" ? "Your breath made the bloom open." : "Your movement opened the bloom.";
  } else if (access === "switch" || mode === "keyboard") {
    action = "keyboard path step";
    effect = "stars";
    confidence = 0.9;
    praise = "Beautiful tap.";
  } else if (level < 0.06) {
    action = supports.includes("head") ? "tiny head shimmer" : "tiny shimmer";
    effect = "bubbles";
    praise = "Tiny moves count.";
  } else if (mode === "headTracking" || zone.startsWith("high") || y < 0.34) {
    action = "head tilt halo";
    effect = "stars";
    praise = "That head move made magic.";
  } else if (zone.startsWith("low") || y > 0.64) {
    action = "chair glide wave";
    effect = "ribbons";
    praise = "Your glide filled the room.";
  } else if (mode === "handPath" || zone.endsWith("left") || zone.endsWith("right") || x < 0.28 || x > 0.72) {
    action = "hand path sweep";
    effect = "ribbons";
    praise = "That hand move is dancing.";
  } else if (level > 0.38) {
    action = "big queen burst";
    effect = "flowers";
    praise = "Yes, queen. Keep glowing.";
  }

  return {
    action,
    effect,
    confidence: Number(confidence.toFixed(2)),
    praise,
    settings: mobilityDefaults(profile)
  };
}

function mapMovement(features = {}, profile = {}, store = null) {
  const rule = ruleMapMovement(features, profile);
  if (!store) return rule;

  const model = getMlModel(store);
  const vector = movementVector(features, profile);
  const prediction = predictMovement(model, vector);
  const usePrediction = !features.targetHit && prediction.confidence > 0.56;
  const action = usePrediction ? prediction.label : rule.action;
  const meta = actionMeta[action] || actionMeta[rule.action] || actionMeta["gentle glow"];
  const confidence = usePrediction
    ? Math.max(rule.confidence * 0.45, prediction.confidence)
    : rule.confidence;

  const teachingLabel = features.targetHit ? rule.action : action;
  learnMovement(model, teachingLabel, vector, features.targetHit ? 2.5 : 0.7);

  return {
    action,
    effect: meta.effect || rule.effect,
    confidence: Number(Math.min(0.98, confidence).toFixed(2)),
    praise: meta.praise || rule.praise,
    settings: mobilityDefaults(profile),
    model: {
      type: "online-nearest-centroid",
      prediction: prediction.label,
      confidence: Number(prediction.confidence.toFixed(2)),
      observations: Math.round(model.observations || 0)
    }
  };
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const store = readStore();

  if (req.method === "GET" && url.pathname === "/api/profile") {
    return sendJson(res, 200, { profile: store.profile, defaults: mobilityDefaults(store.profile || {}) });
  }

  if (req.method === "POST" && url.pathname === "/api/profile") {
    const body = await readBody(req);
    store.profile = {
      childName: String(body.childName || "").slice(0, 60),
      condition: String(body.condition || "unspecified"),
      conditionNotes: String(body.conditionNotes || "").slice(0, 500),
      mobility: String(body.mobility || "seated"),
      supports: Array.isArray(body.supports) ? body.supports.slice(0, 8) : [],
      updatedAt: new Date().toISOString()
    };
    writeStore(store);
    return sendJson(res, 200, { profile: store.profile, defaults: mobilityDefaults(store.profile) });
  }

  if (req.method === "POST" && url.pathname === "/api/calibration") {
    const body = await readBody(req);
    store.profile = store.profile || {
      childName: "",
      condition: "unspecified",
      conditionNotes: "",
      mobility: "seated",
      supports: [],
      updatedAt: new Date().toISOString()
    };
    store.profile.calibration = {
      noise: Number(body.noise || 0.06),
      mode: String(body.mode || "handPath"),
      access: String(body.access || "camera"),
      targetSize: Number(body.targetSize || 7),
      dwellTime: Number(body.dwellTime || 1000),
      updatedAt: new Date().toISOString()
    };
    writeStore(store);
    return sendJson(res, 200, { profile: store.profile, defaults: mobilityDefaults(store.profile) });
  }

  if (req.method === "POST" && url.pathname === "/api/ai/map-movement") {
    const body = await readBody(req);
    const mapped = mapMovement(body.features, store.profile || {}, store);
    writeStore(store);
    return sendJson(res, 200, mapped);
  }

  if (req.method === "POST" && url.pathname === "/api/sessions/start") {
    const body = await readBody(req);
    const session = {
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      events: [],
      game: String(body.game || "bloom"),
      routine: String(body.routine || "confidence"),
      timeLimit: Number(body.timeLimit || 90),
      summary: { moves: 0, blooms: 0, breaths: 0, activeSeconds: 0, wellnessPoints: 0, score: 0, peak: 0, favoriteAction: "gentle glow" }
    };
    store.sessions.unshift(session);
    writeStore(store);
    return sendJson(res, 200, { session });
  }

  const eventMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/events$/);
  if (req.method === "POST" && eventMatch) {
    const body = await readBody(req);
    const session = store.sessions.find((item) => item.id === eventMatch[1]);
    if (!session) return sendJson(res, 404, { error: "Session not found" });
    const event = {
      at: new Date().toISOString(),
      level: Number(body.level || 0),
      action: String(body.action || "movement"),
      confidence: Number(body.confidence || 0),
      targetHit: Boolean(body.targetHit),
      game: String(body.game || session.game || "bloom"),
      routine: String(body.routine || session.routine || "confidence"),
      wellness: String(body.wellness || "mobility"),
      activeSeconds: Number(body.activeSeconds || 0),
      breaths: Number(body.breaths || 0),
      score: Number(body.score || 0)
    };
    session.events.push(event);
    session.summary.moves += 1;
    if (event.targetHit) session.summary.blooms += 1;
    session.summary.breaths = Math.max(session.summary.breaths, event.breaths);
    session.summary.activeSeconds = Math.max(session.summary.activeSeconds, event.activeSeconds);
    session.summary.score = Math.max(session.summary.score || 0, event.score);
    session.summary.wellnessPoints += event.targetHit ? (event.wellness === "calm" ? 2 : 3) : 1;
    session.summary.peak = Math.max(session.summary.peak, event.level);
    session.summary.favoriteAction = event.action;
    writeStore(store);
    return sendJson(res, 200, { session });
  }

  const endMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/end$/);
  if (req.method === "POST" && endMatch) {
    const session = store.sessions.find((item) => item.id === endMatch[1]);
    if (!session) return sendJson(res, 404, { error: "Session not found" });
    session.endedAt = new Date().toISOString();
    writeStore(store);
    return sendJson(res, 200, { session });
  }

  if (req.method === "GET" && url.pathname === "/api/sessions") {
    return sendJson(res, 200, { sessions: store.sessions.slice(0, 8) });
  }

  return sendJson(res, 404, { error: "Not found" });
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(root, requested));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) await handleApi(req, res);
    else serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Dancing Queens running at http://localhost:${port}`);
});
