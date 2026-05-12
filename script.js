const stage = document.querySelector("#stage");
const video = document.querySelector("#cameraVideo");
const canvas = document.querySelector("#danceCanvas");
const motionCanvas = document.querySelector("#motionCanvas");
const ctx = canvas.getContext("2d");
const motionCtx = motionCanvas.getContext("2d", { willReadFrequently: true });

const cameraButton = document.querySelector("#cameraButton");
const calibrateButton = document.querySelector("#calibrateButton");
const gameButton = document.querySelector("#gameButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const stageOptions = document.querySelector("#stageOptions");
const stageOptionsButton = document.querySelector("#stageOptionsButton");
const stageOptionsPanel = document.querySelector("#stageOptionsPanel");
const stageMotionLevel = document.querySelector("#stageMotionLevel");
const stageAccess = document.querySelector("#stageAccess");
const stageSensitivityRange = document.querySelector("#stageSensitivityRange");
const stageDwellRange = document.querySelector("#stageDwellRange");
const stagePauseButton = document.querySelector("#stagePauseButton");
const sparkleButton = document.querySelector("#sparkleButton");
const soundButton = document.querySelector("#soundButton");
const cameraStatus = document.querySelector("#cameraStatus");
const movementLabel = document.querySelector("#movementLabel");
const effectLabel = document.querySelector("#effectLabel");
const cameraGuide = document.querySelector("#cameraGuide");
const worldIntro = document.querySelector("#worldIntro");
const guideCopyTitle = cameraGuide.querySelector(".guide-copy strong");
const guideCopyText = cameraGuide.querySelector(".guide-copy > span");
const setupChecks = cameraGuide.querySelectorAll(".setup-checks span");
const motionRoute = document.querySelector("#motionRoute");
const routeLabel = document.querySelector("#routeLabel");
const detectionRing = document.querySelector("#detectionRing");
const trackingLabel = document.querySelector("#trackingLabel");
const debugStatus = document.querySelector("#debugStatus");
const debugDetails = document.querySelector("#debugDetails");
const targetZone = document.querySelector("#targetZone");
const targetInstruction = targetZone.querySelector("strong");
const movementMeter = document.querySelector("#movementMeter");
const movementScore = document.querySelector("#movementScore");
const calibrationMeter = document.querySelector("#calibrationMeter");
const calibrationScore = document.querySelector("#calibrationScore");
const gameName = document.querySelector("#gameName");
const levelLabel = document.querySelector("#levelLabel");
const gameProgress = document.querySelector("#gameProgress");
const scoreLabel = document.querySelector("#scoreLabel");
const comboLabel = document.querySelector("#comboLabel");
const rankLabel = document.querySelector("#rankLabel");
const timeLeftLabel = document.querySelector("#timeLeftLabel");
const wellnessScore = document.querySelector("#wellnessScore");

const sensitivityRange = document.querySelector("#sensitivityRange");
const targetRange = document.querySelector("#targetRange");
const dwellRange = document.querySelector("#dwellRange");
const intensityRange = document.querySelector("#intensityRange");
const tempoRange = document.querySelector("#tempoRange");
const gameSelect = document.querySelector("#gameSelect");
const routineSelect = document.querySelector("#routineSelect");
const timeLimitRange = document.querySelector("#timeLimitRange");
const motionLevelSelect = document.querySelector("#motionLevelSelect");
const accessSelect = document.querySelector("#accessSelect");
const handTrackerSelect = document.querySelector("#handTrackerSelect");
const reducedToggle = document.querySelector("#reducedToggle");
const mirrorToggle = document.querySelector("#mirrorToggle");
const celebrateToggle = document.querySelector("#celebrateToggle");
const profileForm = document.querySelector("#profileForm");
const childName = document.querySelector("#childName");
const conditionSelect = document.querySelector("#conditionSelect");
const conditionNotes = document.querySelector("#conditionNotes");
const mobilitySelect = document.querySelector("#mobilitySelect");
const aiAction = document.querySelector("#aiAction");
const aiConfidence = document.querySelector("#aiConfidence");
const sessionClock = document.querySelector("#sessionClock");
const sessionSummary = document.querySelector("#sessionSummary");
const startSessionButton = document.querySelector("#startSessionButton");
const historyList = document.querySelector("#historyList");
const freedomMoves = document.querySelector("#freedomMoves");
const breathCount = document.querySelector("#breathCount");
const flowTime = document.querySelector("#flowTime");
const moveName = document.querySelector("#moveName");
const movePurpose = document.querySelector("#movePurpose");
const coachPrompt = document.querySelector("#coachPrompt");

const profilePresets = {
  wheelchair: {
    condition: "spinal-injury",
    mobility: "wheelchair",
    supports: [],
    mode: "upperBody",
    access: "camera",
    motion: "small",
    intensity: 6,
    tracker: "pose",
    guide: "wheelchair",
    title: "Center chair and upper body",
    copy: "Keep face, shoulders, hands, and chair space visible. Chair movement and arm gestures can lead the dance.",
    checks: ["Face centered", "Hands visible", "Chair in frame"],
    coach: "Wheelchair profile on. I will prioritize upper-body movement, chair glide, and generous target zones."
  },
  oneArm: {
    condition: "other",
    mobility: "seated",
    supports: ["one-arm"],
    mode: "oneArm",
    access: "camera",
    motion: "small",
    intensity: 6,
    tracker: "pose",
    guide: "one-arm",
    title: "Place the available arm in view",
    copy: "Only one hand needs to be visible. Small reaches, taps, or pauses can create the full dance.",
    checks: ["One hand visible", "Shoulder relaxed", "Small range ok"],
    coach: "One-arm profile on. Paths will focus on the available hand and will not ask for two-handed movement."
  },
  gaze: {
    condition: "developmental-delay",
    mobility: "seated",
    supports: ["head"],
    mode: "headTracking",
    access: "dwell",
    motion: "small",
    intensity: 5,
    tracker: "motion",
    guide: "gaze",
    title: "Center face for gaze and head tilt",
    copy: "Keep the face softly centered. Eye gaze, blink, dwell, or a tiny head tilt can trigger the expression.",
    checks: ["Face centered", "Eyes visible", "Tiny tilts count"],
    coach: "Gaze and head profile on. The experience will use dwell timing, head movement, and larger targets."
  },
  assisted: {
    condition: "other",
    mobility: "assisted",
    supports: [],
    mode: "upperBody",
    access: "assisted",
    motion: "small",
    intensity: 6,
    tracker: "pose",
    guide: "assisted",
    title: "Make room for partner movement",
    copy: "Frame the dancer and helper side-by-side. Assisted hand or shoulder movement becomes shared choreography.",
    checks: ["Dancer visible", "Helper beside", "Gentle support"],
    coach: "Assisted profile on. The app will treat caregiver co-movement as part of the dance."
  },
  switch: {
    condition: "other",
    mobility: "seated",
    supports: ["switch"],
    mode: "keyboard",
    access: "switch",
    motion: "small",
    intensity: 7,
    tracker: "motion",
    guide: "switch",
    title: "Place switch where it is easy",
    copy: "The dancer only needs one tap, key, or switch press. Each press creates a full musical and visual phrase.",
    checks: ["Switch reachable", "One tap works", "No timing pressure"],
    coach: "Switch profile on. One press will generate full expression with no required sequence."
  },
  sensory: {
    condition: "autism",
    mobility: "seated",
    supports: ["sensory-soft"],
    mode: "upperBody",
    access: "dwell",
    motion: "small",
    intensity: 3,
    tracker: "pose",
    guide: "sensory",
    title: "Soft calm setup",
    copy: "Keep the dancer comfortably framed. Visuals and sound stay gentle, with slower prompts and fewer bursts.",
    checks: ["Low sparkle", "Soft sound", "Slow prompts"],
    coach: "Sensory calm profile on. I reduced intensity, slowed the feel, and softened the setup guide."
  }
};

let particles = [];
let ribbons = [];
let pathGlows = [];
let backgroundFrame = null;
let cameraOn = false;
let soundOn = true;
let audioContext;
let accent = "#ff6fae";
let activeMode = "standard";
let activeEffect = "ribbons";
let lastBeat = 0;
let motionLevel = 0;
let motionPoint = { x: 0.5, y: 0.45 };
let previousPoint = { x: 0.5, y: 0.45 };
let motionVelocity = 0;
let dominantZone = "center";
let trackerConfidence = 0;
let trackingTarget = "hand";
let calibratedNoise = 0.06;
let calibrationState = "idle";
let calibrationStartedAt = 0;
let calibrationSamples = [];
let calibrationTrackSamples = [];
let pendingStartAfterCalibration = false;
let danceFlowRunning = false;
let lockedTrack = null;
let lockLostFrames = 0;
let currentProfile = null;
let currentSession = null;
let sessionStartedAt = null;
let lastMapAt = 0;
let lastEventAt = 0;
let apiOnline = true;
let faceDetector = null;
let faceDetecting = false;
let facePoint = null;
let facePointAt = 0;
let lastFaceAttemptAt = 0;
let handLandmarker = null;
let handModelState = "idle";
let handDetecting = false;
let handPoint = null;
let handPointAt = 0;
let handLandmarks = [];
let lastHandAttemptAt = 0;
let markerColor = null;
let markerPoint = null;
let markerPointAt = 0;
let markerConfidence = 0;
let poseLandmarker = null;
let poseModelState = "idle";
let poseDetecting = false;
let poseLandmarks = [];
let posePoint = null;
let posePointAt = 0;
let lastPoseAttemptAt = 0;
let poseCalibration = null;

let gameRunning = false;
let pausedMidDance = false;
let quickPreviewMode = false;
let lastPreviewSparkAt = 0;
let blooms = 0;
let target = { x: 0.5, y: 0.45, radius: 0.16 };
let targetDwellStartedAt = null;
let targetDwellProgress = 0;
let targetLeftAt = 0;
let resizeFrame = null;
let currentMoveIndex = 0;
let activeSeconds = 0;
let wellnessPoints = 0;
let score = 0;
let timeLeft = 90;
let gameStartedAt = null;
let movesCompleted = 0;
let breathsCompleted = 0;
let lastActiveTick = 0;
let sweepPath = [];
let sweepStep = 0;
let nextMusicStepAt = 0;
let musicStepIndex = 0;
let pendingDropAt = 0;
let lastPathGlowAt = 0;
let gameLevel = 1;
let combo = 1;
let streak = 0;
let bestStreak = 0;
let pathStartedAt = 0;
let checkpointStartedAt = 0;
let lastCheckpointAt = 0;
let perfectHits = 0;
let goodHits = 0;
let lastMotionDetectAt = 0;

const motionWidth = 120;
const motionHeight = 90;
const grayFrame = new Float32Array(motionWidth * motionHeight);
const gridCols = 12;
const gridRows = 9;

const poseIndexes = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28
};

const modePrompts = {
  standard: "Every visible movement can become ribbons, music, and light.",
  oneArm: "One-arm dance: one available gesture can fill the whole room.",
  upperBody: "Seated dance: arms, shoulders, head, breath, or stillness can lead.",
  handPath: "Sweep, tap, or pause near the glowing path.",
  keyboard: "Press any key when you want the world to bloom.",
  headTracking: "A tiny head movement can guide the glow."
};

const effects = {
  ribbons: "Rainbow ribbons",
  stars: "Star shower",
  bubbles: "Bubble pop",
  flowers: "Flower burst"
};

const gameLabels = {
  bloom: "Gesture-to-Dance",
  freedom: "Adaptive Choreography",
  follow: "Mirror Mode",
  paint: "Music + Movement"
};

const domainLabels = {
  leftHand: "left hand",
  rightHand: "right hand",
  leftFoot: "left foot",
  rightFoot: "right foot",
  shoulders: "shoulders",
  bodyCenter: "whole body",
  head: "head",
  keyboard: "keyboard"
};

const movementPrograms = {
  confidence: [
    { id: "open", name: "Open your space", purpose: "Sweep across the glowing route. The goal is taking up space with confidence.", coach: "We are going to sweep across the glowing arrows. Can you guide your hand across the path?", x: 0.78, y: 0.42, mode: "handPath", effect: "ribbons", wellness: "mobility" },
    { id: "crown", name: "Crown lift", purpose: "Guide the bloom upward with head movement if that feels possible.", coach: "Now guide the crown glow upward. A tiny head turn or lift counts.", x: 0.5, y: 0.24, mode: "headTracking", effect: "stars", wellness: "posture" },
    { id: "sway", name: "Side-to-side sweep", purpose: "Sweep from one side to the other using hand, keyboard, or head tracking.", coach: "Let us move side to side. Follow the arrows your way.", x: 0.25, y: 0.56, mode: "handPath", effect: "ribbons", wellness: "cardio" },
    { id: "breathe", name: "Breath sparkle", purpose: "Rest on the center bloom when you are ready.", coach: "Now one slow sparkle breath. Hold on the center bloom when you are ready.", x: 0.5, y: 0.5, mode: "headTracking", effect: "bubbles", wellness: "calm" }
  ],
  strength: [
    { id: "left-reach", name: "Left power sweep", purpose: "Sweep or key toward the left side.", coach: "Sweep to the left arrow. Big or tiny, it counts.", x: 0.23, y: 0.42, mode: "handPath", effect: "ribbons", wellness: "strength" },
    { id: "right-reach", name: "Right power sweep", purpose: "Sweep or key toward the right side.", coach: "Now sweep to the right arrow. Let the bloom meet you there.", x: 0.77, y: 0.42, mode: "handPath", effect: "ribbons", wellness: "strength" },
    { id: "lift", name: "Lift and glow", purpose: "Guide upward with head tracking or keyboard.", coach: "Three lift-and-glow moves. Guide the glow upward, even just a little.", x: 0.5, y: 0.22, mode: "headTracking", effect: "stars", wellness: "posture" }
  ],
  mobility: [
    { id: "chair-glide", name: "Low glide path", purpose: "Move through a lower route with hand, head, or keyboard.", coach: "Let us glide through the lower path. Smooth and proud.", x: 0.5, y: 0.72, mode: "handPath", effect: "ribbons", wellness: "mobility" },
    { id: "range-left", name: "Range left", purpose: "Explore comfortable range toward the left.", coach: "Find your comfy left-side space. No stretching past what feels okay.", x: 0.22, y: 0.5, mode: "handPath", effect: "flowers", wellness: "mobility" },
    { id: "range-right", name: "Range right", purpose: "Explore comfortable range toward the right.", coach: "Now find your right-side space. Smooth, slow, and proud.", x: 0.78, y: 0.5, mode: "handPath", effect: "flowers", wellness: "mobility" }
  ],
  calm: [
    { id: "inhale", name: "Inhale glow", purpose: "Breathe in slowly and hold on the bloom.", coach: "Breathe in like you are filling the room with light.", x: 0.5, y: 0.42, mode: "headTracking", effect: "bubbles", wellness: "calm" },
    { id: "exhale", name: "Exhale shimmer", purpose: "Breathe out and hold on the bloom.", coach: "Breathe out slowly. Let the shimmer dance with you.", x: 0.5, y: 0.58, mode: "headTracking", effect: "bubbles", wellness: "calm" },
    { id: "settle", name: "Settle and shine", purpose: "Rest, blink, tilt, or press a key when ready.", coach: "One gentle ready move. A blink, key press, tilt, or pause can be your dance.", x: 0.5, y: 0.5, mode: "keyboard", effect: "stars", wellness: "calm" }
  ]
};

function resizeCanvas() {
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  motionCanvas.width = motionWidth;
  motionCanvas.height = motionHeight;
  placeTarget();
}

function scheduleResize() {
  if (resizeFrame) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = null;
    resizeCanvas();
    updateMotionFeedback();
    if (gameRunning) applyCurrentMove();
    backgroundFrame = null;
  });
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

function collectProfileFromForm() {
  return {
    childName: childName.value.trim(),
    condition: conditionSelect.value,
    conditionNotes: conditionNotes.value.trim(),
    mobility: mobilitySelect.value,
    supports: [...profileForm.querySelectorAll('input[name="supports"]:checked')].map((item) => item.value)
  };
}

function getCheckedSupports() {
  return [...profileForm.querySelectorAll('input[name="supports"]:checked')].map((item) => item.value);
}

function setCheckedSupports(values) {
  profileForm.querySelectorAll('input[name="supports"]').forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

function getAdaptiveProfileKey() {
  const supports = getCheckedSupports();
  const notes = conditionNotes.value.toLowerCase();
  if (supports.includes("switch") || accessSelect.value === "switch" || activeMode === "keyboard") return "switch";
  if (supports.includes("sensory-soft") || conditionSelect.value === "autism" || reducedToggle.checked) return "sensory";
  if (mobilitySelect.value === "assisted" || accessSelect.value === "assisted") return "assisted";
  if (supports.includes("head") || notes.includes("eye gaze") || notes.includes("blink") || notes.includes("head")) return "gaze";
  if (supports.includes("one-arm") || activeMode === "oneArm" || notes.includes("one arm") || notes.includes("one-arm")) return "oneArm";
  if (mobilitySelect.value === "wheelchair" || conditionSelect.value === "spinal-injury") return "wheelchair";
  if (mobilitySelect.value === "bed" || conditionSelect.value === "muscular-dystrophy") return "sensory";
  return "wheelchair";
}

function presetMatchesRequirements(key) {
  const supports = getCheckedSupports();
  const notes = conditionNotes.value.toLowerCase();
  if (key === "wheelchair") return mobilitySelect.value === "wheelchair" || conditionSelect.value === "spinal-injury" || notes.includes("wheelchair") || notes.includes("chair");
  if (key === "oneArm") return supports.includes("one-arm") || activeMode === "oneArm" || notes.includes("one arm") || notes.includes("one-arm") || notes.includes("single arm");
  if (key === "gaze") return supports.includes("head") || activeMode === "headTracking" || notes.includes("eye gaze") || notes.includes("gaze") || notes.includes("blink") || notes.includes("head");
  if (key === "assisted") return mobilitySelect.value === "assisted" || accessSelect.value === "assisted" || notes.includes("assisted") || notes.includes("caregiver") || notes.includes("partner");
  if (key === "switch") return supports.includes("switch") || accessSelect.value === "switch" || activeMode === "keyboard" || notes.includes("switch") || notes.includes("tap only") || notes.includes("one tap");
  if (key === "sensory") return supports.includes("sensory-soft") || conditionSelect.value === "autism" || reducedToggle.checked || notes.includes("sensory") || notes.includes("low stim") || notes.includes("calm");
  return false;
}

function updateAdaptiveGuide(announce = false) {
  const key = getAdaptiveProfileKey();
  const preset = profilePresets[key];
  if (!preset) return;
  stage.dataset.adaptiveProfile = key;
  cameraGuide.dataset.guide = preset.guide;
  guideCopyTitle.textContent = preset.title;
  guideCopyText.textContent = preset.copy;
  setupChecks.forEach((item, index) => {
    item.textContent = preset.checks[index] || "";
    item.hidden = !preset.checks[index];
  });
  document.querySelectorAll("[data-profile-preset]").forEach((button) => {
    const active = presetMatchesRequirements(button.dataset.profilePreset);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (announce) {
    coachPrompt.textContent = preset.coach;
    movementLabel.textContent = preset.copy;
  }
}

function syncRequirementsToMovement(announce = false) {
  const supports = getCheckedSupports();
  const notes = conditionNotes.value.toLowerCase();
  const wantsSwitch = supports.includes("switch") || notes.includes("switch") || notes.includes("tap only") || notes.includes("one tap");
  const wantsGaze = supports.includes("head") || notes.includes("eye gaze") || notes.includes("gaze") || notes.includes("blink") || notes.includes("head");
  const wantsOneArm = supports.includes("one-arm") || notes.includes("one arm") || notes.includes("one-arm") || notes.includes("single arm");
  const wantsSensory = supports.includes("sensory-soft") || notes.includes("sensory") || notes.includes("low stim") || notes.includes("calm") || notes.includes("autism");
  const noFeet = supports.includes("no-left-foot") && supports.includes("no-right-foot") || notes.includes("no feet") || notes.includes("no legs") || notes.includes("no lower body");
  const wheelchair = mobilitySelect.value === "wheelchair" || notes.includes("wheelchair") || notes.includes("chair");
  const assisted = mobilitySelect.value === "assisted" || notes.includes("assisted") || notes.includes("caregiver") || notes.includes("partner");

  if (wantsSensory) {
    reducedToggle.checked = true;
    intensityRange.value = Math.min(Number(intensityRange.value), 3);
  }

  if (assisted) {
    mobilitySelect.value = "assisted";
    accessSelect.value = "assisted";
    stageAccess.value = "assisted";
    setMode("upperBody");
  } else if (wantsSwitch) {
    accessSelect.value = "switch";
    stageAccess.value = "switch";
    setMode("keyboard");
  } else if (wantsGaze) {
    accessSelect.value = "dwell";
    stageAccess.value = "dwell";
    setMode("headTracking");
  } else if (wantsOneArm) {
    accessSelect.value = "dwell";
    stageAccess.value = "dwell";
    setMode("oneArm");
  } else if (wheelchair || noFeet || mobilitySelect.value === "seated" || mobilitySelect.value === "bed") {
    accessSelect.value = "dwell";
    stageAccess.value = "dwell";
    setMode("upperBody");
  }

  if (notes.includes("small range") || notes.includes("limited range") || notes.includes("low stamina")) {
    motionLevelSelect.value = "small";
    stageMotionLevel.value = "small";
  }

  updateAdaptiveGuide(announce);
  backgroundFrame = null;
  currentMoveIndex = 0;
  applyCurrentMove();
  syncStageOptions();
}

function seedProfilePreset(key) {
  const preset = profilePresets[key];
  if (!preset) return;
  conditionSelect.value = preset.condition;
  mobilitySelect.value = preset.mobility;
  setCheckedSupports(preset.supports);
  motionLevelSelect.value = preset.motion;
  stageMotionLevel.value = preset.motion;
  accessSelect.value = preset.access;
  stageAccess.value = preset.access;
  intensityRange.value = preset.intensity;
  handTrackerSelect.value = preset.tracker;
  reducedToggle.checked = key === "sensory";
  activeMode = key === "switch" ? "keyboard" : preset.mode;
  stage.dataset.trackingMode = activeMode;
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("is-active", item.dataset.mode === activeMode));
  document.querySelectorAll("[data-stage-mode]").forEach((item) => item.classList.toggle("is-active", item.dataset.stageMode === activeMode));
  updateAdaptiveGuide();
}

function applyProfilePreset(key) {
  const preset = profilePresets[key];
  if (!preset) return;
  conditionSelect.value = preset.condition;
  mobilitySelect.value = preset.mobility;
  setCheckedSupports(preset.supports);
  motionLevelSelect.value = preset.motion;
  stageMotionLevel.value = preset.motion;
  accessSelect.value = preset.access;
  stageAccess.value = preset.access;
  intensityRange.value = preset.intensity;
  handTrackerSelect.value = preset.tracker;
  reducedToggle.checked = key === "sensory";
  if (key === "switch") setMode("keyboard");
  else setMode(preset.mode);
  updateAdaptiveGuide(true);
  backgroundFrame = null;
  currentMoveIndex = 0;
  if (gameRunning) applyCurrentMove();
  else placeTarget(true);
  syncStageOptions();
}

function applyDefaults(defaults = {}) {
  if (defaults.mode) setMode(defaults.mode === "handPath" ? "standard" : defaults.mode === "headTracking" ? "upperBody" : defaults.mode);
  if (defaults.access) accessSelect.value = defaults.access;
  if (defaults.sensitivity) sensitivityRange.value = defaults.sensitivity;
  if (defaults.intensity) intensityRange.value = defaults.intensity;
  if (defaults.targetSize) targetRange.value = defaults.targetSize;
  if (defaults.dwellTime) dwellRange.value = defaults.dwellTime;
  if (defaults.tempo) tempoRange.value = defaults.tempo;
  if (typeof defaults.reducedMotion === "boolean") reducedToggle.checked = defaults.reducedMotion;
  if (defaults.suggestedEffect) setEffect(defaults.suggestedEffect, false);
  placeTarget();
}

function isPoseMode(mode = activeMode) {
  return ["standard", "oneArm", "upperBody"].includes(mode);
}

function isHandLikeMode(mode = activeMode) {
  return ["handPath", "oneArm", "standard", "upperBody"].includes(mode);
}

function getMotionLevelSettings() {
  const level = motionLevelSelect.value;
  if (level === "small") return { sensitivity: 1.35, target: 1.32, dwell: 0.72, keyboardStep: 0.18 };
  if (level === "wide") return { sensitivity: 0.88, target: 0.86, dwell: 1.18, keyboardStep: 0.1 };
  return { sensitivity: 1, target: 1, dwell: 1, keyboardStep: 0.14 };
}

function fillProfile(profile) {
  if (!profile) return;
  childName.value = profile.childName || "";
  conditionSelect.value = profile.condition || "unspecified";
  conditionNotes.value = profile.conditionNotes || "";
  mobilitySelect.value = profile.mobility || "seated";
  profileForm.querySelectorAll('input[name="supports"]').forEach((input) => {
    input.checked = (profile.supports || []).includes(input.value);
  });
  updateAdaptiveGuide();
}

async function loadAppState() {
  if (location.protocol === "file:") {
    apiOnline = false;
    sessionSummary.textContent = "Ready";
    updateAdaptiveGuide();
    return;
  }

  try {
    const [{ profile, defaults }, history] = await Promise.all([api("/api/profile"), api("/api/sessions")]);
    currentProfile = profile;
    fillProfile(profile);
    applyDefaults(defaults);
    updateAdaptiveGuide();
  if (!profile) {
    aiAction.textContent = "Waiting for movement";
    movementLabel.textContent = "Start camera, calibrate, then begin your dance.";
  }
    renderHistory(history.sessions || []);
    apiOnline = true;
  } catch (error) {
    apiOnline = false;
    sessionSummary.textContent = "Backend offline; play still works";
  }
}

async function saveProfile(event) {
  event.preventDefault();
  try {
    const result = await api("/api/profile", { method: "POST", body: JSON.stringify(collectProfileFromForm()) });
    currentProfile = result.profile;
    applyDefaults(result.defaults);
    updateAdaptiveGuide(true);
    sessionSummary.textContent = `${currentProfile.childName || "Dancer"} profile saved`;
  } catch (error) {
    sessionSummary.textContent = "Could not save profile";
  }
}

async function saveCalibration() {
  if (!apiOnline) return;
  try {
    await api("/api/calibration", {
      method: "POST",
      body: JSON.stringify({
        noise: calibratedNoise,
        mode: activeMode,
        access: accessSelect.value,
        targetSize: Number(targetRange.value),
        dwellTime: Number(dwellRange.value)
      })
    });
  } catch (error) {
    apiOnline = false;
  }
}

async function startSession() {
  if (currentSession) {
    try {
      await api(`/api/sessions/${currentSession.id}/end`, { method: "POST" });
      const history = await api("/api/sessions");
      renderHistory(history.sessions || []);
    } catch (error) {
      sessionSummary.textContent = "Session ended locally";
    }
    currentSession = null;
    sessionStartedAt = null;
    startSessionButton.textContent = "Start session";
    return;
  }

  try {
    const result = await api("/api/sessions/start", {
      method: "POST",
      body: JSON.stringify({ game: gameSelect.value, routine: routineSelect.value, timeLimit: Number(timeLimitRange.value) })
    });
    currentSession = result.session;
    sessionStartedAt = Date.now();
    startSessionButton.textContent = "End session";
    sessionSummary.textContent = "Session recording play";
  } catch (error) {
    sessionSummary.textContent = "Start the backend to save sessions";
  }
}

function renderHistory(sessions) {
  if (!sessions.length) {
    historyList.innerHTML = "";
    sessionSummary.textContent = "No saved sessions yet";
    return;
  }

  const latest = sessions[0];
  sessionSummary.textContent = `${latest.summary.blooms || 0} dance moments, ${latest.summary.activeSeconds || 0}s flow`;
  historyList.innerHTML = sessions.slice(0, 4).map((session) => {
    const date = new Date(session.startedAt).toLocaleDateString([], { month: "short", day: "numeric" });
    return `<div><span>${date}</span><strong>${session.summary.blooms || 0} dance moments</strong><small>${session.summary.activeSeconds || 0}s flow · ${session.summary.favoriteAction}</small></div>`;
  }).join("");
}

function updateSessionClock() {
  if (!sessionStartedAt) {
    sessionClock.textContent = "00:00";
    return;
  }
  const elapsed = Math.floor((Date.now() - sessionStartedAt) / 1000);
  sessionClock.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
}

function updateGameClock() {
  timeLeftLabel.textContent = `${timeLeft}s`;
}

function updateGameHud(rating = null) {
  levelLabel.textContent = `Scene ${gameLevel}`;
  gameProgress.textContent = `${blooms} moment${blooms === 1 ? "" : "s"}`;
  scoreLabel.textContent = `${score} light`;
  comboLabel.textContent = `Flow ${combo.toFixed(1).replace(".0", "")}x`;
  rankLabel.textContent = rating || (streak ? `${streak} in flow` : "Ready");
}

async function startCamera() {
  try {
    cameraButton.disabled = true;
    cameraButton.querySelector("span:last-child").textContent = "Starting...";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 540 }, frameRate: { ideal: 24, max: 30 } },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    cameraOn = true;
    backgroundFrame = null;
    cameraGuide.classList.remove("is-hidden");
    cameraGuide.classList.add("is-live-overlay");
    cameraStatus.textContent = "Camera on";
    cameraButton.querySelector("span:last-child").textContent = "Camera on";
    movementLabel.textContent = isPoseMode()
      ? "You are framed. Pose skeleton will track wrists, elbows, shoulders, head, and torso."
      : activeMode === "handPath"
        ? "You are framed. Keep your open hand visible so AI fingers can follow it."
      : "You are framed. Calibrate, or tap the head on screen to lock it.";
    if (isPoseMode() || handTrackerSelect.value === "pose") ensurePoseLandmarker();
    if (activeMode === "handPath" && handTrackerSelect.value === "ai") ensureHandLandmarker();
    cameraButton.disabled = false;
    return true;
  } catch (error) {
    cameraStatus.textContent = "Camera blocked";
    cameraButton.disabled = false;
    cameraButton.querySelector("span:last-child").textContent = "Start camera";
    movementLabel.textContent = "Use Switch move, space, or allow camera access.";
    return false;
  }
}

function startCalibration() {
  if (!cameraOn) {
    movementLabel.textContent = "Start the camera first so calibration can learn your space.";
    return false;
  }
  calibrationState = "sampling";
  calibrationStartedAt = performance.now();
  calibrationSamples = [];
  calibrationTrackSamples = [];
  lockedTrack = null;
  lockLostFrames = 0;
  calibratedNoise = 0.04;
  backgroundFrame = null;
  calibrationScore.textContent = "Learning";
  calibrationMeter.style.width = "8%";
  poseCalibration = null;
  movementLabel.textContent = isPoseMode()
    ? "Calibration: rest, then reach comfortably side-to-side and upward. I will learn your personal range."
    : activeMode === "headTracking"
    ? "Look toward the camera for 3 seconds so I can lock onto your head."
    : handTrackerSelect.value === "marker"
      ? "Hold up the bright marker, wristband, or wand for 3 seconds."
      : "Hold up the hand you want to dance with for 3 seconds.";
  return true;
}

function finishCalibration() {
  const sorted = calibrationSamples.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 0.04;
  calibratedNoise = Math.max(0.025, Math.min(0.28, median * 1.8));
  if (isPoseMode()) finalizePoseCalibration();
  lockTrackFromCalibration();
  calibrationState = "done";
  calibrationMeter.style.width = "100%";
  calibrationScore.textContent = lockedTrack ? "Locked" : "Ready";
  movementLabel.textContent = lockedTrack
    ? `${isPoseMode() ? "Pose skeleton" : activeMode === "headTracking" ? "Head" : handTrackerSelect.value === "marker" ? "Marker" : "Hand"} locked. Tap it on screen anytime if I need correcting.`
    : "Ready. Tap the hand/head once if the tracker needs help.";
  saveCalibration();
  if (pendingStartAfterCalibration) {
    pendingStartAfterCalibration = false;
    movementLabel.textContent = "Calibration learned. Opening your dance world.";
    showWorldIntro();
  }
}

function lockTrackFromCalibration() {
  const mode = activeMode;
  if (mode === "keyboard") return;

  if (isPoseMode() && posePoint && performance.now() - posePointAt < 1200) {
    lockedTrack = { mode, point: { ...posePoint }, color: null, confidence: 0.94 };
    motionPoint = { ...posePoint };
    trackerConfidence = 0.94;
    updateMotionFeedback();
    return;
  }

  const faceIsFresh = mode === "headTracking" && facePoint && performance.now() - facePointAt < 1500;
  if (faceIsFresh) {
    lockedTrack = { mode, point: { ...facePoint }, color: sampleColorAtPoint(facePoint), confidence: 0.96 };
    motionPoint = { ...facePoint };
    trackerConfidence = 0.96;
    updateMotionFeedback();
    return;
  }

  if (mode === "handPath" && handTrackerSelect.value === "marker" && markerPoint && performance.now() - markerPointAt < 1200) {
    lockedTrack = { mode, point: { ...markerPoint }, color: markerColor || sampleColorAtPoint(markerPoint), confidence: markerConfidence || 0.9 };
    motionPoint = { ...markerPoint };
    trackerConfidence = lockedTrack.confidence;
    updateMotionFeedback();
    return;
  }

  const samples = calibrationTrackSamples
    .filter((sample) => sample.mode === mode && sample.confidence > 0.18)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 18);
  if (!samples.length) return;

  const totalConfidence = samples.reduce((sum, sample) => sum + sample.confidence, 0) || 1;
  const point = samples.reduce((sum, sample) => ({
    x: sum.x + sample.point.x * sample.confidence,
    y: sum.y + sample.point.y * sample.confidence
  }), { x: 0, y: 0 });
  const colorSamples = samples.filter((sample) => sample.color);
  const color = colorSamples.length
    ? colorSamples.reduce((sum, sample) => ({
      r: sum.r + sample.color.r * sample.confidence,
      g: sum.g + sample.color.g * sample.confidence,
      b: sum.b + sample.color.b * sample.confidence,
      weight: sum.weight + sample.confidence
    }), { r: 0, g: 0, b: 0, weight: 0 })
    : null;

  lockedTrack = {
    mode,
    point: {
      x: point.x / totalConfidence,
      y: point.y / totalConfidence
    },
    color: color && color.weight ? { r: color.r / color.weight, g: color.g / color.weight, b: color.b / color.weight } : null,
    confidence: Math.min(1, totalConfidence / samples.length)
  };
  motionPoint = { ...lockedTrack.point };
  trackerConfidence = lockedTrack.confidence;
  updateMotionFeedback();
}

function sampleColorAtPoint(point) {
  if (!cameraOn || video.readyState < 2) return null;
  const frame = readMotionFrame();
  const centerX = Math.round(point.x * motionWidth);
  const centerY = Math.round(point.y * motionHeight);
  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;
  const radius = activeMode === "headTracking" ? 8 : 5;
  for (let y = Math.max(0, centerY - radius); y <= Math.min(motionHeight - 1, centerY + radius); y += 1) {
    for (let x = Math.max(0, centerX - radius); x <= Math.min(motionWidth - 1, centerX + radius); x += 1) {
      const offset = (y * motionWidth + x) * 4;
      red += frame.data[offset];
      green += frame.data[offset + 1];
      blue += frame.data[offset + 2];
      count += 1;
    }
  }
  if (!count) return null;
  return { r: red / count, g: green / count, b: blue / count };
}

function normalizeColor(color) {
  if (!color) return null;
  const sum = color.r + color.g + color.b || 1;
  return {
    r: color.r / sum,
    g: color.g / sum,
    b: color.b / sum
  };
}

function markerColorSimilarity(color, targetColor) {
  const a = normalizeColor(color);
  const b = normalizeColor(targetColor);
  if (!a || !b) return 0;
  const chromaDistance = Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
  const brightnessDistance = Math.abs((color.r + color.g + color.b) - (targetColor.r + targetColor.g + targetColor.b)) / 765;
  return Math.max(0, 1 - chromaDistance * 4.2 - brightnessDistance * 0.35);
}

function lockTrackAtStagePoint(event) {
  if (!cameraOn || activeMode === "keyboard") return;
  const rect = stage.getBoundingClientRect();
  const point = {
    x: Math.max(0.02, Math.min(0.98, (event.clientX - rect.left) / rect.width)),
    y: Math.max(0.02, Math.min(0.98, (event.clientY - rect.top) / rect.height))
  };
  const sampledColor = sampleColorAtPoint(point);
  if (activeMode === "handPath" && handTrackerSelect.value === "marker") {
    markerColor = sampledColor;
    markerPoint = point;
    markerPointAt = performance.now();
    markerConfidence = 1;
  }
  lockedTrack = {
    mode: activeMode,
    point,
    color: sampledColor,
    confidence: 1
  };
  lockLostFrames = 0;
  previousPoint = motionPoint;
  motionPoint = point;
  trackerConfidence = 1;
  updateMotionFeedback();
  movementLabel.textContent = `${activeMode === "headTracking" ? "Head" : handTrackerSelect.value === "marker" ? "Marker" : "Hand"} locked here. I will follow this spot.`;
}

function getSensitivity() {
  const base = Number(sensitivityRange.value) / 10;
  const modeBoost = isPoseMode() ? 1.18 : activeMode === "headTracking" ? 1.35 : activeMode === "handPath" ? 1.12 : 1;
  return base * modeBoost * getMotionLevelSettings().sensitivity;
}

function getIntensity() {
  const base = Number(intensityRange.value);
  const softened = Math.min(base, 4);
  return reducedToggle.checked ? Math.max(1, Math.floor(softened * 0.38)) : softened;
}

function getTargetRadius() {
  const base = 0.05 + Number(targetRange.value) * 0.008;
  const activeDomain = getActiveMoveDomain();
  const fullBodyBoost = activeMode === "standard" && (activeDomain === "leftFoot" || activeDomain === "rightFoot" || activeDomain === "bodyCenter") ? 1.42 : 1;
  const modeBoost = (activeMode === "keyboard" ? 1.05 : activeMode === "headTracking" || isPoseMode() ? 1.24 : 1.12) * fullBodyBoost;
  return base * modeBoost * getMotionLevelSettings().target;
}

function getMovementSupportPreferences() {
  const notes = conditionNotes.value.toLowerCase();
  const supports = [...profileForm.querySelectorAll('input[name="supports"]:checked')].map((item) => item.value);
  const oneArm = supports.includes("one-arm") || notes.includes("one arm") || notes.includes("one-arm");
  const rightArm = notes.includes("right arm") || notes.includes("right side") || notes.includes("right hand");
  const leftArm = notes.includes("left arm") || notes.includes("left side") || notes.includes("left hand");
  const noLeftHand = supports.includes("no-left-hand") || notes.includes("no left hand") || notes.includes("missing left hand") || notes.includes("left hand missing") || notes.includes("left arm missing");
  const noRightHand = supports.includes("no-right-hand") || notes.includes("no right hand") || notes.includes("missing right hand") || notes.includes("right hand missing") || notes.includes("right arm missing");
  const noLeftFoot = supports.includes("no-left-foot") || notes.includes("no left foot") || notes.includes("missing left foot") || notes.includes("left foot missing") || notes.includes("left leg missing");
  const noRightFoot = supports.includes("no-right-foot") || notes.includes("no right foot") || notes.includes("missing right foot") || notes.includes("right foot missing") || notes.includes("right leg missing");
  const noFeet = noLeftFoot && noRightFoot || notes.includes("no feet") || notes.includes("no legs") || notes.includes("no lower body") || notes.includes("cannot use legs");
  const smallRange = motionLevelSelect.value === "small" || notes.includes("small range") || notes.includes("limited range") || notes.includes("low range") || notes.includes("low stamina");
  const wideRange = motionLevelSelect.value === "wide" && !smallRange;
  const avoidOverhead = notes.includes("avoid overhead") || notes.includes("no overhead") || notes.includes("avoid high") || notes.includes("no high") || notes.includes("shoulder pain");
  const avoidCrossing = notes.includes("no crossing") || notes.includes("avoid crossing") || notes.includes("midline") || notes.includes("same side");
  const slow = notes.includes("slow") || notes.includes("gentle") || notes.includes("fatigue") || notes.includes("tired") || reducedToggle.checked;
  const headOnly = supports.includes("head") && !supports.includes("one-arm") && !notes.includes("hand") && !notes.includes("arm");
  const switchOnly = supports.includes("switch") && accessSelect.value === "switch";
  const seatedLow = mobilitySelect.value === "wheelchair" || mobilitySelect.value === "seated" || mobilitySelect.value === "bed";
  const lowerBodyBlocked = mobilitySelect.value === "wheelchair" || mobilitySelect.value === "bed" || noFeet;
  const upperBodyOnly = activeMode === "upperBody" || activeMode === "headTracking" || lowerBodyBlocked || headOnly || switchOnly;
  const lowerBodyAvailable = activeMode === "standard" && !lowerBodyBlocked && !headOnly && !switchOnly;
  const availableHands = headOnly || switchOnly || activeMode === "headTracking" ? [] : [
    !noLeftHand ? "leftHand" : "",
    !noRightHand ? "rightHand" : ""
  ].filter(Boolean);
  const availableFeet = lowerBodyAvailable ? [
    !noLeftFoot ? "leftFoot" : "",
    !noRightFoot ? "rightFoot" : ""
  ].filter(Boolean) : [];
  let preferredSide = rightArm && !leftArm ? "right" : leftArm && !rightArm ? "left" : null;
  if (oneArm && !preferredSide) preferredSide = noLeftHand ? "right" : noRightHand ? "left" : preferredSide;

  return {
    oneArm,
    preferredSide,
    availableHands,
    availableFeet,
    noLeftHand,
    noRightHand,
    noLeftFoot,
    noRightFoot,
    noFeet,
    upperBodyOnly,
    lowerBodyAvailable,
    smallRange,
    wideRange,
    avoidOverhead,
    avoidCrossing,
    slow,
    seatedLow
  };
}

function clampPathPoint(point, prefs) {
  const minY = prefs.avoidOverhead ? 0.34 : 0.18;
  const maxY = prefs.lowerBodyAvailable ? 0.9 : prefs.seatedLow ? 0.76 : 0.82;
  return {
    ...point,
    x: Math.max(0.14, Math.min(0.86, point.x)),
    y: Math.max(minY, Math.min(maxY, point.y))
  };
}

function pathPoint(point, prefs, domain) {
  return clampPathPoint({ ...point, domain }, prefs);
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function audioReady() {
  if (!soundOn) return null;
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
}

function playTone(force = 1, bloom = false) {
  const now = performance.now();
  const minimumGap = 60000 / Number(tempoRange.value) / (bloom ? 3.3 : 2.2);
  if (now - lastBeat < minimumGap) return;
  lastBeat = now;

  const context = audioReady();
  if (!context) return;
  const chord = bloom ? [392, 493.88, 587.33, 783.99] : [261.63, 329.63, 392];
  chord.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = activeEffect === "bubbles" ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    const start = context.currentTime + index * 0.035;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime((bloom ? 0.055 : 0.035) * force, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, start + (bloom ? 0.58 : 0.34));
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + (bloom ? 0.62 : 0.36));
  });

  if (bloom) {
    const drum = context.createOscillator();
    const drumGain = context.createGain();
    drum.type = "sine";
    drum.frequency.setValueAtTime(120, context.currentTime);
    drum.frequency.exponentialRampToValueAtTime(55, context.currentTime + 0.12);
    drumGain.gain.setValueAtTime(0.07 * force, context.currentTime);
    drumGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);
    drum.connect(drumGain).connect(context.destination);
    drum.start();
    drum.stop(context.currentTime + 0.16);
  }
}

function playSliceTick(force = 1) {
  const context = audioReady();
  if (!context) return;
  const start = context.currentTime;
  [659.25, 880].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.001, start + index * 0.025);
    gain.gain.exponentialRampToValueAtTime(0.035 * force, start + index * 0.025 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + index * 0.025 + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start + index * 0.025);
    oscillator.stop(start + index * 0.025 + 0.18);
  });
}

function playBeatDrop(force = 1) {
  const context = audioReady();
  if (!context) return;
  const beat = 60 / Number(tempoRange.value);
  const start = context.currentTime + 0.02;
  const bass = context.createOscillator();
  const bassGain = context.createGain();
  bass.type = "sawtooth";
  bass.frequency.setValueAtTime(196, start);
  bass.frequency.exponentialRampToValueAtTime(49, start + beat * 0.9);
  bassGain.gain.setValueAtTime(0.001, start);
  bassGain.gain.exponentialRampToValueAtTime(0.11 * force, start + 0.035);
  bassGain.gain.exponentialRampToValueAtTime(0.001, start + beat * 1.25);
  bass.connect(bassGain).connect(context.destination);
  bass.start(start);
  bass.stop(start + beat * 1.35);

  [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    const noteStart = start + index * beat * 0.12;
    gain.gain.setValueAtTime(0.001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.035 * force, noteStart + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + beat * 0.55);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + beat * 0.6);
  });
}

function updateBackingTrack() {
  if (!gameRunning || !soundOn) return;
  const context = audioReady();
  if (!context) return;
  const beat = 60 / Number(tempoRange.value);
  if (!nextMusicStepAt) nextMusicStepAt = context.currentTime;

  while (nextMusicStepAt < context.currentTime + 0.18) {
    const step = musicStepIndex % 8;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = step % 4 === 0 ? "triangle" : "sine";
    oscillator.frequency.value = [220, 277.18, 329.63, 392, 440, 392, 329.63, 277.18][step];
    gain.gain.setValueAtTime(0.001, nextMusicStepAt);
    gain.gain.exponentialRampToValueAtTime(step % 4 === 0 ? 0.025 : 0.014, nextMusicStepAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, nextMusicStepAt + beat * 0.45);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(nextMusicStepAt);
    oscillator.stop(nextMusicStepAt + beat * 0.5);
    nextMusicStepAt += beat / 2;
    musicStepIndex += 1;
  }

  if (pendingDropAt && context.currentTime >= pendingDropAt) {
    pendingDropAt = 0;
    playBeatDrop(1);
  }
}

function queueBeatDrop() {
  const context = audioReady();
  if (!context) return;
  const beat = 60 / Number(tempoRange.value);
  const elapsed = context.currentTime % beat;
  pendingDropAt = context.currentTime + Math.max(0.03, beat - elapsed);
}

function readMotionFrame() {
  motionCtx.save();
  motionCtx.scale(-1, 1);
  motionCtx.drawImage(video, -motionWidth, 0, motionWidth, motionHeight);
  motionCtx.restore();
  return motionCtx.getImageData(0, 0, motionWidth, motionHeight);
}

function ensureFaceDetector() {
  if (faceDetector || !("FaceDetector" in window)) return;
  try {
    faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
  } catch (error) {
    faceDetector = null;
  }
}

function updateFaceTrackingCandidate() {
  ensureFaceDetector();
  if (!faceDetector || activeMode !== "headTracking" || faceDetecting || video.readyState < 2) return;
  const now = performance.now();
  if (now - lastFaceAttemptAt < 220) return;

  faceDetecting = true;
  lastFaceAttemptAt = now;
  faceDetector.detect(video).then((faces) => {
    faceDetecting = false;
    if (!faces.length || !video.videoWidth || !video.videoHeight) return;
    const box = faces[0].boundingBox;
    const rawX = (box.x + box.width * 0.5) / video.videoWidth;
    const rawY = (box.y + box.height * 0.42) / video.videoHeight;
    facePoint = {
      x: mirrorToggle.checked ? 1 - rawX : rawX,
      y: rawY
    };
    facePointAt = performance.now();
  }).catch(() => {
    faceDetecting = false;
    faceDetector = null;
  });
}

async function ensurePoseLandmarker() {
  if (poseLandmarker || poseModelState === "loading") return;
  poseModelState = "loading";
  aiAction.textContent = "Loading pose skeleton";
  try {
    const visionTasks = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm");
    const vision = await visionTasks.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
    );
    const poseOptions = {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numPoses: 1,
      minPoseDetectionConfidence: 0.45,
      minPosePresenceConfidence: 0.45,
      minTrackingConfidence: 0.45
    };
    try {
      poseLandmarker = await visionTasks.PoseLandmarker.createFromOptions(vision, poseOptions);
    } catch (gpuError) {
      poseLandmarker = await visionTasks.PoseLandmarker.createFromOptions(vision, {
        ...poseOptions,
        baseOptions: {
          ...poseOptions.baseOptions,
          delegate: "CPU"
        }
      });
    }
    poseModelState = "ready";
    aiAction.textContent = "Pose skeleton ready";
  } catch (error) {
    poseModelState = "failed";
    aiAction.textContent = "Pose skeleton unavailable";
  }
}

function mirrorLandmark(landmark) {
  return {
    x: mirrorToggle.checked ? 1 - landmark.x : landmark.x,
    y: landmark.y,
    z: landmark.z || 0,
    visibility: landmark.visibility ?? landmark.presence ?? 1
  };
}

function getLandmark(index) {
  const point = poseLandmarks[index];
  return point && point.visibility > 0.28 ? point : null;
}

function getBodyScale() {
  const leftShoulder = getLandmark(poseIndexes.leftShoulder);
  const rightShoulder = getLandmark(poseIndexes.rightShoulder);
  const leftHip = getLandmark(poseIndexes.leftHip);
  const rightHip = getLandmark(poseIndexes.rightHip);
  const shoulderWidth = leftShoulder && rightShoulder ? Math.abs(leftShoulder.x - rightShoulder.x) : 0.24;
  const shoulderCenter = leftShoulder && rightShoulder
    ? { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 }
    : { x: 0.5, y: 0.36 };
  const hipCenter = leftHip && rightHip
    ? { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 }
    : { x: shoulderCenter.x, y: shoulderCenter.y + 0.28 };
  const torsoHeight = Math.max(0.18, Math.abs(hipCenter.y - shoulderCenter.y));
  return { shoulderWidth: Math.max(0.12, shoulderWidth), torsoHeight, shoulderCenter, hipCenter };
}

function chooseActiveArm() {
  const notes = conditionNotes.value.toLowerCase();
  const rightRequested = notes.includes("right arm") || notes.includes("right hand") || notes.includes("right side");
  const leftRequested = notes.includes("left arm") || notes.includes("left hand") || notes.includes("left side");
  if (rightRequested && !leftRequested) return "right";
  if (leftRequested && !rightRequested) return "left";
  const leftWrist = getLandmark(poseIndexes.leftWrist);
  const rightWrist = getLandmark(poseIndexes.rightWrist);
  const leftShoulder = getLandmark(poseIndexes.leftShoulder);
  const rightShoulder = getLandmark(poseIndexes.rightShoulder);
  const leftReach = leftWrist && leftShoulder ? Math.hypot(leftWrist.x - leftShoulder.x, leftWrist.y - leftShoulder.y) : 0;
  const rightReach = rightWrist && rightShoulder ? Math.hypot(rightWrist.x - rightShoulder.x, rightWrist.y - rightShoulder.y) : 0;
  return rightReach >= leftReach ? "right" : "left";
}

function getActiveMoveDomain() {
  return sweepPath[sweepStep]?.domain || getCurrentMove()?.domain || (activeMode === "oneArm" ? `${chooseActiveArm()}Hand` : "rightHand");
}

function getPoseTrackedPoint() {
  if (!poseLandmarks.length) return null;
  const domain = getActiveMoveDomain();
  const side = domain.includes("left") ? "left" : domain.includes("right") ? "right" : chooseActiveArm();
  const wrist = getLandmark(side === "right" ? poseIndexes.rightWrist : poseIndexes.leftWrist);
  const elbow = getLandmark(side === "right" ? poseIndexes.rightElbow : poseIndexes.leftElbow);
  const shoulder = getLandmark(side === "right" ? poseIndexes.rightShoulder : poseIndexes.leftShoulder);
  const ankle = getLandmark(side === "right" ? poseIndexes.rightAnkle : poseIndexes.leftAnkle);
  const knee = getLandmark(side === "right" ? poseIndexes.rightKnee : poseIndexes.leftKnee);
  const hip = getLandmark(side === "right" ? poseIndexes.rightHip : poseIndexes.leftHip);
  const nose = getLandmark(poseIndexes.nose);
  const scale = getBodyScale();

  if (domain === "head" && nose) {
    return { point: nose, side: "head", domain, rel: { x: 0, y: 0 }, scale, confidence: nose.visibility || 0.74 };
  }

  if (domain === "bodyCenter") {
    return { point: scale.hipCenter, side: "center", domain, rel: { x: 0, y: 0 }, scale, confidence: 0.76 };
  }

  if (domain === "shoulders" && shoulder) {
    return { point: shoulder, side, domain, wrist: null, elbow, shoulder, rel: { x: 0, y: 0 }, scale, confidence: shoulder.visibility || 0.7 };
  }

  if ((domain === "leftFoot" || domain === "rightFoot") && ankle && hip) {
    const rel = {
      x: (ankle.x - hip.x) / scale.shoulderWidth,
      y: (ankle.y - hip.y) / scale.torsoHeight
    };
    return { point: ankle, side, domain, ankle, knee, hip, rel, scale, confidence: ankle.visibility || 0.82 };
  }

  if ((domain === "leftHand" || domain === "rightHand") && wrist && shoulder) {
    const rel = {
      x: (wrist.x - shoulder.x) / scale.shoulderWidth,
      y: (wrist.y - shoulder.y) / scale.torsoHeight
    };
    return { point: wrist, side, domain, wrist, elbow, shoulder, rel, scale, confidence: wrist.visibility || 0.82 };
  }

  if (activeMode === "upperBody" && shoulder) {
    return { point: shoulder, side, domain: "shoulders", wrist: null, elbow, shoulder, rel: { x: 0, y: 0 }, scale, confidence: shoulder.visibility || 0.7 };
  }

  return null;
}

function updateTrackingDebug() {
  if (!debugStatus || !debugDetails) return;
  if (!cameraOn) {
    debugStatus.textContent = "Tracker waiting";
    debugDetails.textContent = "Start camera to see body landmarks.";
    return;
  }

  if (isPoseMode()) {
    const tracked = getPoseTrackedPoint();
    const visible = Object.entries({
      head: poseIndexes.nose,
      leftShoulder: poseIndexes.leftShoulder,
      rightShoulder: poseIndexes.rightShoulder,
      leftElbow: poseIndexes.leftElbow,
      rightElbow: poseIndexes.rightElbow,
      leftWrist: poseIndexes.leftWrist,
      rightWrist: poseIndexes.rightWrist,
      leftHip: poseIndexes.leftHip,
      rightHip: poseIndexes.rightHip
    }).filter(([, index]) => getLandmark(index)).map(([name]) => name);
    debugStatus.textContent = poseModelState === "ready"
      ? tracked ? `Pose skeleton: tracking ${domainLabels[tracked.domain] || tracked.side}` : "Pose skeleton: no active landmark, using motion fallback"
      : poseModelState === "loading" ? "Pose skeleton loading" : poseModelState === "failed" ? "Pose skeleton failed" : "Pose skeleton idle";
    debugDetails.textContent = visible.length
      ? `Visible: ${visible.join(", ")}. Confidence ${Math.round(trackerConfidence * 100)}%.`
      : `No pose landmarks visible yet. ${motionLevel > 0.025 ? "Motion fallback is active." : "Keep head, shoulders, and at least one arm in frame."}`;
    return;
  }

  if (activeMode === "handPath") {
    debugStatus.textContent = handTrackerSelect.value === "ai"
      ? handModelState === "ready" ? "Hand AI: looking for fingers" : `Hand AI: ${handModelState}`
      : handTrackerSelect.value === "marker" ? markerColor ? "Marker tracker locked" : "Marker tracker needs tap" : "Motion fallback";
    debugDetails.textContent = handTrackerSelect.value === "ai"
      ? `${handLandmarks.length ? "Finger landmarks visible" : "No finger landmarks visible"}. Confidence ${Math.round(trackerConfidence * 100)}%.`
      : handTrackerSelect.value === "marker" ? "Tap a bright wristband/sticker/wand once, then move." : "Uses broad motion only.";
    return;
  }

  debugStatus.textContent = "Tracker active";
  debugDetails.textContent = `${trackingLabel.textContent}. Confidence ${Math.round(trackerConfidence * 100)}%.`;
}

function updatePoseCandidate() {
  if (!cameraOn || !isPoseMode() || video.readyState < 2) return;
  ensurePoseLandmarker();
  if (!poseLandmarker || poseDetecting) return;
  const now = performance.now();
  if (now - lastPoseAttemptAt < 70) return;
  lastPoseAttemptAt = now;
  poseDetecting = true;

  try {
    const result = poseLandmarker.detectForVideo(video, now);
    poseDetecting = false;
    const landmarks = result.landmarks?.[0];
    if (!landmarks?.length) {
      if (now - posePointAt > 700) poseLandmarks = [];
      return;
    }
    poseLandmarks = landmarks.map(mirrorLandmark);
    const tracked = getPoseTrackedPoint();
    if (!tracked) return;
    posePoint = tracked.point;
    posePointAt = performance.now();
    trackerConfidence = trackerConfidence * 0.58 + tracked.confidence * 0.42;
    if (calibrationState === "sampling") collectPoseCalibration(tracked);
  } catch (error) {
    poseDetecting = false;
    poseModelState = "failed";
  }
}

function collectPoseCalibration(tracked) {
  const emptyCalibration = {
    neutral: { ...tracked.rel },
    minX: tracked.rel.x,
    maxX: tracked.rel.x,
    minY: tracked.rel.y,
    maxY: tracked.rel.y,
    samples: 0,
    side: tracked.side,
    shoulderWidth: tracked.scale.shoulderWidth,
    torsoHeight: tracked.scale.torsoHeight
  };
  poseCalibration = poseCalibration || emptyCalibration;
  poseCalibration.samples += 1;
  const neutralWeight = poseCalibration.samples < 22 ? 0.18 : 0.03;
  poseCalibration.neutral.x = poseCalibration.neutral.x * (1 - neutralWeight) + tracked.rel.x * neutralWeight;
  poseCalibration.neutral.y = poseCalibration.neutral.y * (1 - neutralWeight) + tracked.rel.y * neutralWeight;
  poseCalibration.minX = Math.min(poseCalibration.minX, tracked.rel.x);
  poseCalibration.maxX = Math.max(poseCalibration.maxX, tracked.rel.x);
  poseCalibration.minY = Math.min(poseCalibration.minY, tracked.rel.y);
  poseCalibration.maxY = Math.max(poseCalibration.maxY, tracked.rel.y);
  poseCalibration.shoulderWidth = tracked.scale.shoulderWidth;
  poseCalibration.torsoHeight = tracked.scale.torsoHeight;
}

function finalizePoseCalibration() {
  if (!poseCalibration) {
    poseCalibration = {
      neutral: { x: 0, y: 0 },
      minX: -0.75,
      maxX: 0.75,
      minY: -0.65,
      maxY: 0.45,
      samples: 0,
      side: "right",
      shoulderWidth: 0.24,
      torsoHeight: 0.28
    };
  }
  poseCalibration.rangeX = Math.max(0.28, poseCalibration.maxX - poseCalibration.minX);
  poseCalibration.rangeUp = Math.max(0.22, poseCalibration.neutral.y - poseCalibration.minY);
  poseCalibration.rangeDown = Math.max(0.18, poseCalibration.maxY - poseCalibration.neutral.y);
}

async function ensureHandLandmarker() {
  if (handLandmarker || handModelState === "loading" || !isHandLikeMode()) return;
  handModelState = "loading";
  aiAction.textContent = "Loading hand AI";
  try {
    const visionTasks = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm");
    const vision = await visionTasks.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
    );
    const handOptions = {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 1,
      minHandDetectionConfidence: 0.45,
      minHandPresenceConfidence: 0.45,
      minTrackingConfidence: 0.45
    };
    try {
      handLandmarker = await visionTasks.HandLandmarker.createFromOptions(vision, handOptions);
    } catch (gpuError) {
      handLandmarker = await visionTasks.HandLandmarker.createFromOptions(vision, {
        ...handOptions,
        baseOptions: {
          ...handOptions.baseOptions,
          delegate: "CPU"
        }
      });
    }
    handModelState = "ready";
    aiAction.textContent = "Hand AI ready";
  } catch (error) {
    handModelState = "failed";
    aiAction.textContent = "Hand AI unavailable";
  }
}

function updateHandLandmarkCandidate() {
  if (!isHandLikeMode() || !cameraOn || video.readyState < 2) return;
  const shouldUseHandAi = handTrackerSelect.value === "ai" || (isPoseMode() && poseModelState !== "ready");
  if (!shouldUseHandAi) return;
  ensureHandLandmarker();
  if (!handLandmarker || handDetecting) {
    if (performance.now() - handPointAt > 700) handLandmarks = [];
    return;
  }

  const now = performance.now();
  if (now - lastHandAttemptAt < 70) return;
  lastHandAttemptAt = now;
  handDetecting = true;

  try {
    const result = handLandmarker.detectForVideo(video, now);
    handDetecting = false;
    const landmarks = result.landmarks?.[0];
    if (!landmarks?.length) {
      if (performance.now() - handPointAt > 700) {
        handLandmarks = [];
        trackerConfidence *= 0.86;
      }
      return;
    }

    handLandmarks = landmarks.map((landmark) => ({
      x: mirrorToggle.checked ? 1 - landmark.x : landmark.x,
      y: landmark.y,
      z: landmark.z || 0
    }));
    const fingertipIndexes = [4, 8, 12, 16, 20];
    const fingertips = fingertipIndexes.map((index) => handLandmarks[index]).filter(Boolean);
    const palm = handLandmarks[9] || handLandmarks[0] || fingertips[0];
    const tipCenter = fingertips.reduce((sum, point) => ({
      x: sum.x + point.x,
      y: sum.y + point.y
    }), { x: 0, y: 0 });
    const confidence = result.handedness?.[0]?.[0]?.score || 0.9;
    handPoint = {
      x: (tipCenter.x / fingertips.length) * 0.7 + palm.x * 0.3,
      y: (tipCenter.y / fingertips.length) * 0.7 + palm.y * 0.3
    };
    handPointAt = performance.now();
    trackerConfidence = trackerConfidence * 0.58 + confidence * 0.42;
  } catch (error) {
    handDetecting = false;
    handModelState = "failed";
  }
}

function skinLikelihood(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const warm = r > 70 && g > 35 && b > 18 && max - min > 14 && r > b * 1.04 && g > b * 0.72;
  const litWarm = r > 115 && g > 72 && b > 48 && r > g * 0.92 && r > b * 1.08;
  const softShadow = r > 55 && g > 36 && b > 26 && r > b * 1.08 && max - min < 85;
  if (warm) return 1;
  if (litWarm) return 0.72;
  if (softShadow) return 0.42;
  return 0;
}

function makeTrackingCells() {
  return Array.from({ length: gridCols * gridRows }, () => ({
    motion: 0,
    skin: 0,
    dark: 0,
    skinPixels: 0,
    motionPixels: 0,
    minX: motionWidth,
    maxX: 0,
    minY: motionHeight,
    maxY: 0,
    red: 0,
    green: 0,
    blue: 0,
    colorWeight: 0,
    x: 0,
    y: 0,
    weight: 0
  }));
}

function addTrackingSample(cells, x, y, motionEnergy, skin, grayValue, red, green, blue) {
  const col = Math.min(gridCols - 1, Math.floor((x / motionWidth) * gridCols));
  const row = Math.min(gridRows - 1, Math.floor((y / motionHeight) * gridRows));
  const cell = cells[row * gridCols + col];
  const skinEnergy = skin * (0.025 + motionEnergy * 0.42);
  const darkEnergy = grayValue < 0.28 ? Math.max(0.01, motionEnergy * 0.35) : 0;
  const trackingWeight = motionEnergy + skinEnergy + darkEnergy * 0.45;
  const colorWeight = Math.max(0.08, trackingWeight);
  cell.motion += motionEnergy;
  cell.skin += skinEnergy;
  cell.dark += darkEnergy;
  if (skin > 0.35) cell.skinPixels += 1;
  if (motionEnergy > 0) cell.motionPixels += 1;
  if (skin > 0.35 || motionEnergy > 0) {
    cell.minX = Math.min(cell.minX, x);
    cell.maxX = Math.max(cell.maxX, x);
    cell.minY = Math.min(cell.minY, y);
    cell.maxY = Math.max(cell.maxY, y);
  }
  cell.red += red * colorWeight;
  cell.green += green * colorWeight;
  cell.blue += blue * colorWeight;
  cell.colorWeight += colorWeight;
  cell.x += x * trackingWeight;
  cell.y += y * trackingWeight;
  cell.weight += trackingWeight;
}

function trackMarker(frame) {
  if (activeMode !== "handPath" || isPoseMode() || handTrackerSelect.value !== "marker" || !markerColor) {
    markerConfidence = 0;
    return null;
  }

  const previous = markerPoint || motionPoint;
  const searchRadius = markerConfidence > 0.35 ? 0.36 : 1;
  let weight = 0;
  let weightedX = 0;
  let weightedY = 0;
  let bestScore = 0;
  let bestPoint = null;

  for (let y = 0; y < motionHeight; y += 2) {
    for (let x = 0; x < motionWidth; x += 2) {
      const nx = x / motionWidth;
      const ny = y / motionHeight;
      if (Math.hypot(nx - previous.x, ny - previous.y) > searchRadius) continue;
      const offset = (y * motionWidth + x) * 4;
      const color = { r: frame.data[offset], g: frame.data[offset + 1], b: frame.data[offset + 2] };
      const similarity = markerColorSimilarity(color, markerColor);
      if (similarity < 0.72) continue;
      const saturation = (Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b)) / 255;
      const brightness = (color.r + color.g + color.b) / 765;
      const proximity = Math.max(0.2, 1 - Math.hypot(nx - previous.x, ny - previous.y) / Math.max(0.001, searchRadius));
      const score = Math.pow(similarity, 3) * (0.65 + saturation) * (0.55 + brightness) * proximity;
      weight += score;
      weightedX += nx * score;
      weightedY += ny * score;
      if (score > bestScore) {
        bestScore = score;
        bestPoint = { x: nx, y: ny };
      }
    }
  }

  if (weight < 0.035 && !bestPoint) {
    markerConfidence *= 0.72;
    return null;
  }

  const point = weight > 0.035 ? { x: weightedX / weight, y: weightedY / weight } : bestPoint;
  markerPoint = point;
  markerPointAt = performance.now();
  markerConfidence = Math.min(1, markerConfidence * 0.68 + Math.min(1, weight / 0.8) * 0.32);
  return {
    point,
    color: markerColor,
    confidence: Math.max(0.45, markerConfidence),
    zone: getDominantZoneFromPoint(point)
  };
}

function getCellColor(cell) {
  if (!cell.colorWeight) return null;
  return {
    r: cell.red / cell.colorWeight,
    g: cell.green / cell.colorWeight,
    b: cell.blue / cell.colorWeight
  };
}

function colorSimilarity(a, b) {
  if (!a || !b) return 0.55;
  const distance = Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
  return Math.max(0, 1 - distance / 165);
}

function getNeighborMass(cells, index, key) {
  const col = index % gridCols;
  const row = Math.floor(index / gridCols);
  let mass = 0;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (!rowOffset && !colOffset) continue;
      const neighborCol = col + colOffset;
      const neighborRow = row + rowOffset;
      if (neighborCol < 0 || neighborCol >= gridCols || neighborRow < 0 || neighborRow >= gridRows) continue;
      mass += cells[neighborRow * gridCols + neighborCol][key];
    }
  }
  return mass;
}

function scoreTrackingCell(cell, index, cells) {
  if (!cell.weight) return 0;

  const col = index % gridCols;
  const row = Math.floor(index / gridCols);
  const nx = (col + 0.5) / gridCols;
  const ny = (row + 0.5) / gridRows;
  const lockDistance = lockedTrack && lockedTrack.mode === activeMode
    ? Math.hypot(nx - lockedTrack.point.x, ny - lockedTrack.point.y)
    : null;
  const lockBoost = lockDistance === null ? 1 : Math.max(0.42, Math.min(1.65, 1.55 - lockDistance * 2.7));

  if (activeMode === "handPath") {
    const neighborSkin = getNeighborMass(cells, index, "skin");
    const neighborMotion = getNeighborMass(cells, index, "motion");
    const skinDominance = cell.skin / (cell.motion + cell.skin + 0.001);
    const skinDensity = cell.skinPixels / Math.max(1, cell.skinPixels + cell.motionPixels);
    const broadBlob = (neighborSkin + neighborMotion * 0.5) / (cell.skin + cell.motion + 0.01);
    const boxWidth = Math.max(1, cell.maxX - cell.minX);
    const boxHeight = Math.max(1, cell.maxY - cell.minY);
    const compactShape = Math.min(1.3, Math.max(0.45, 18 / (boxWidth + boxHeight)));
    const sideBias = 0.74 + Math.min(1.12, Math.abs(nx - 0.5) * 2.5);
    const handHeight = ny > 0.08 && ny < 0.74 ? 1 : ny < 0.86 ? 0.58 : 0.28;
    const faceAvoidance = ny < 0.62 && Math.abs(nx - 0.5) < 0.16 ? 0.48 : 1;
    const shoulderAvoidance = ny > 0.62 && Math.abs(nx - 0.5) > 0.22 ? 0.52 : 1;
    const isolation = Math.max(0.36, Math.min(1.18, 1.08 - broadBlob * 0.1));
    const handLikeness = 0.55 + skinDominance * 0.75 + skinDensity * 0.4;
    return (cell.motion * 0.72 + cell.skin * 3.8) * handLikeness * compactShape * sideBias * handHeight * faceAvoidance * shoulderAvoidance * isolation * lockBoost;
  }

  if (activeMode === "headTracking") {
    const upperZone = ny < 0.66 ? 1.45 : 0.18;
    const topAvoidance = ny < 0.08 ? 0.35 : 1;
    const handEdgeAvoidance = Math.abs(nx - 0.5) > 0.36 && cell.motion > cell.skin * 5 ? 0.42 : 1;
    return (cell.skin * 2.1 + cell.dark * 0.74 + cell.motion * 0.44) * upperZone * topAvoidance * handEdgeAvoidance * lockBoost;
  }

  return cell.motion;
}

function selectTrackingCandidate(cells, genericPoint, total) {
  if (activeMode === "keyboard") {
    return { point: motionPoint, confidence: 1, zone: "keyboard" };
  }

  const scoreByCell = cells.map((cell, index) => scoreTrackingCell(cell, index, cells));
  let bestIndex = -1;
  let bestScore = 0;
  for (let index = 0; index < scoreByCell.length; index += 1) {
    const score = scoreByCell[index];
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  if (bestIndex < 0 || bestScore < 0.006) {
    return { point: genericPoint, confidence: Math.min(0.32, total / 8), zone: getDominantZone(cells.map((cell) => cell.motion)) };
  }

  const best = cells[bestIndex];
  const col = bestIndex % gridCols;
  const row = Math.floor(bestIndex / gridCols);
  const cellCenter = { x: (col + 0.5) / gridCols, y: (row + 0.5) / gridRows };
  const rawPoint = best.weight
    ? { x: best.x / best.weight / motionWidth, y: best.y / best.weight / motionHeight }
    : cellCenter;
  const confidence = Math.max(0.18, Math.min(1, bestScore / (activeMode === "handPath" ? 0.18 : 0.13)));

  return {
    point: {
      x: rawPoint.x * 0.72 + cellCenter.x * 0.28,
      y: rawPoint.y * 0.72 + cellCenter.y * 0.28
    },
    color: getCellColor(best),
    confidence,
    zone: getDominantZone(scoreByCell)
  };
}

function selectLockedColorCandidate(cells, fallbackCandidate) {
  if (!lockedTrack || lockedTrack.mode !== activeMode) return fallbackCandidate;

  let best = null;
  for (let index = 0; index < cells.length; index += 1) {
    const cell = cells[index];
    if (!cell.colorWeight && !cell.weight) continue;
    const col = index % gridCols;
    const row = Math.floor(index / gridCols);
    const center = { x: (col + 0.5) / gridCols, y: (row + 0.5) / gridRows };
    const color = getCellColor(cell);
    const distance = Math.hypot(center.x - lockedTrack.point.x, center.y - lockedTrack.point.y);
    const nearScore = Math.max(0, 1 - distance / (activeMode === "headTracking" ? 0.34 : 0.42));
    const colorScore = colorSimilarity(color, lockedTrack.color);
    const signal = activeMode === "headTracking" ? cell.skin + cell.dark * 0.5 + cell.motion * 0.25 : cell.skin + cell.motion * 0.35;
    const motionHelp = cell.motionPixels ? 1.12 : 0.92;
    const score = signal * (0.18 + nearScore * 1.85) * (0.42 + colorScore * 1.1) * motionHelp;
    if (!best || score > best.score) best = { score, cell, index, center, color, colorScore, nearScore };
  }

  if (!best || best.score < 0.015 || (best.nearScore < 0.08 && best.colorScore < 0.72)) {
    return {
      point: lockedTrack.point,
      color: lockedTrack.color,
      confidence: Math.max(0.22, lockedTrack.confidence * 0.72),
      zone: fallbackCandidate.zone
    };
  }

  const rawPoint = best.cell.weight
    ? { x: best.cell.x / best.cell.weight / motionWidth, y: best.cell.y / best.cell.weight / motionHeight }
    : best.center;
  return {
    point: {
      x: rawPoint.x * 0.62 + best.center.x * 0.38,
      y: rawPoint.y * 0.62 + best.center.y * 0.38
    },
    color: best.color || lockedTrack.color,
    confidence: Math.max(0.28, Math.min(1, best.score / 0.11)),
    zone: getDominantZone(cells.map((cell) => cell.skin + cell.motion))
  };
}

function smoothTrackedPoint(candidate, confidence) {
  const mobilityFactor = motionLevelSelect.value === "small" ? 0.46 : motionLevelSelect.value === "wide" ? 0.32 : 0.38;
  const modeFactor = activeMode === "headTracking" ? mobilityFactor * 0.72 : mobilityFactor;
  const alpha = Math.max(0.16, Math.min(0.58, modeFactor + confidence * 0.16));
  return {
    x: motionPoint.x * (1 - alpha) + candidate.x * alpha,
    y: motionPoint.y * (1 - alpha) + candidate.y * alpha
  };
}

function updateLockedTrack(candidate) {
  if (activeMode === "keyboard") return candidate;
  if (!lockedTrack || lockedTrack.mode !== activeMode) {
    lockedTrack = { mode: activeMode, point: { ...candidate.point }, color: candidate.color || null, confidence: candidate.confidence };
    lockLostFrames = 0;
    return candidate;
  }

  const distance = Math.hypot(candidate.point.x - lockedTrack.point.x, candidate.point.y - lockedTrack.point.y);
  const canFollow = candidate.confidence > 0.22 && (distance < 0.34 || candidate.confidence > 0.78);
  if (!canFollow) {
    lockLostFrames += 1;
    if (lockLostFrames > 28) lockedTrack.confidence *= 0.82;
    return { point: lockedTrack.point, confidence: lockedTrack.confidence * 0.76, zone: candidate.zone };
  }

  const alpha = activeMode === "headTracking" ? 0.28 : 0.42;
  lockedTrack.point = {
    x: lockedTrack.point.x * (1 - alpha) + candidate.point.x * alpha,
    y: lockedTrack.point.y * (1 - alpha) + candidate.point.y * alpha
  };
  if (candidate.color) {
    lockedTrack.color = lockedTrack.color
      ? {
        r: lockedTrack.color.r * 0.88 + candidate.color.r * 0.12,
        g: lockedTrack.color.g * 0.88 + candidate.color.g * 0.12,
        b: lockedTrack.color.b * 0.88 + candidate.color.b * 0.12
      }
      : candidate.color;
  }
  lockedTrack.confidence = lockedTrack.confidence * 0.72 + candidate.confidence * 0.28;
  lockLostFrames = 0;
  return { point: lockedTrack.point, confidence: lockedTrack.confidence, zone: candidate.zone };
}

function detectMotion() {
  if (!cameraOn || video.readyState < 2) return;
  if (activeMode === "keyboard") return;
  const now = performance.now();
  const detectGap = calibrationState === "sampling" ? 30 : 45;
  if (now - lastMotionDetectAt < detectGap) return;
  lastMotionDetectAt = now;
  updatePoseCandidate();
  updateFaceTrackingCandidate();
  updateHandLandmarkCandidate();

  const frame = readMotionFrame();
  const gray = grayFrame;
  for (let i = 0, p = 0; i < frame.data.length; i += 4, p += 1) {
    gray[p] = (frame.data[i] * 0.299 + frame.data[i + 1] * 0.587 + frame.data[i + 2] * 0.114) / 255;
  }

  if (!backgroundFrame) {
    backgroundFrame = gray.slice();
    return;
  }

  const cells = makeTrackingCells();
  let total = 0;
  let weightedX = 0;
  let weightedY = 0;

  const learnRate = calibrationState === "sampling" ? 0.16 : 0.035;
  const threshold = Math.max(0.018, calibratedNoise * (1.35 - getSensitivity() * 0.52));
  const sampleStep = calibrationState === "sampling" ? 2 : 3;

  for (let y = 0; y < motionHeight; y += sampleStep) {
    for (let x = 0; x < motionWidth; x += sampleStep) {
      const index = y * motionWidth + x;
      const diff = Math.abs(gray[index] - backgroundFrame[index]);
      backgroundFrame[index] = backgroundFrame[index] * (1 - learnRate) + gray[index] * learnRate;
      const red = frame.data[index * 4];
      const green = frame.data[index * 4 + 1];
      const blue = frame.data[index * 4 + 2];
      const skin = skinLikelihood(red, green, blue);
      const motionEnergy = diff > threshold ? diff - threshold : 0;
      if (!motionEnergy && !skin) continue;

      addTrackingSample(cells, x, y, motionEnergy, skin, gray[index], red, green, blue);
      if (!motionEnergy) continue;

      total += motionEnergy;
      weightedX += x * motionEnergy;
      weightedY += y * motionEnergy;
    }
  }

  const visualTotal = cells.reduce((sum, cell) => sum + cell.weight, 0);

  if (calibrationState === "sampling") {
    const genericPoint = total > 0.08
      ? { x: weightedX / total / motionWidth, y: weightedY / total / motionHeight }
      : motionPoint;
    const markerCandidate = trackMarker(frame);
    const visualCandidate = selectTrackingCandidate(cells, genericPoint, total);
    const poseIsFresh = isPoseMode() && posePoint && performance.now() - posePointAt < 850;
    const faceIsFresh = activeMode === "headTracking" && facePoint && performance.now() - facePointAt < 1100;
    const handIsFresh = isHandLikeMode() && handPoint && performance.now() - handPointAt < 650;
    const candidate = poseIsFresh
      ? { point: posePoint, color: null, confidence: 0.96, zone: getDominantZoneFromPoint(posePoint) }
      : markerCandidate
      ? markerCandidate
      : faceIsFresh
      ? { point: facePoint, color: sampleColorAtPoint(facePoint), confidence: 0.96, zone: "high-center" }
      : handIsFresh
        ? { point: handPoint, color: sampleColorAtPoint(handPoint), confidence: 0.98, zone: getDominantZoneFromPoint(handPoint) }
      : visualCandidate;
    const acceptVisualFallback = visualTotal > 0.12 || total > 0.025;
    if (poseIsFresh || handIsFresh || faceIsFresh || markerCandidate || acceptVisualFallback || candidate.confidence > 0.42) {
      calibrationTrackSamples.push({ mode: activeMode, point: candidate.point, color: candidate.color, confidence: candidate.confidence });
      previousPoint = motionPoint;
      motionPoint = smoothTrackedPoint(candidate.point, candidate.confidence);
      trackerConfidence = trackerConfidence * 0.65 + candidate.confidence * 0.35;
      updateMotionFeedback();
    }
    const progress = Math.min(1, (performance.now() - calibrationStartedAt) / 3000);
    calibrationSamples.push(Math.min(0.4, total / 850));
    calibrationMeter.style.width = `${Math.round(progress * 100)}%`;
    if (progress >= 1) finishCalibration();
    return;
  }

  const rawLevel = Math.min(1, Math.max(0, total / 42));
  motionLevel = motionLevel * 0.72 + rawLevel * 0.28;
  movementMeter.style.width = `${Math.round(motionLevel * 100)}%`;
  movementScore.textContent = `${Math.round(motionLevel * 100)}%`;

  const genericPoint = total > 0.025
    ? { x: weightedX / Math.max(total, 0.0001) / motionWidth, y: weightedY / Math.max(total, 0.0001) / motionHeight }
    : motionPoint;
  const markerCandidate = trackMarker(frame);
  const visualCandidate = selectLockedColorCandidate(cells, selectTrackingCandidate(cells, genericPoint, total));
  const poseIsFresh = isPoseMode() && posePoint && performance.now() - posePointAt < 850;
  const faceIsFresh = activeMode === "headTracking" && facePoint && performance.now() - facePointAt < 1100;
  const handIsFresh = isHandLikeMode() && handPoint && performance.now() - handPointAt < 850;
  const visualFallbackReady = total > 0.025 || visualTotal > 0.12 || visualCandidate.confidence > 0.22;

  if (poseIsFresh || handIsFresh || faceIsFresh || markerCandidate || visualFallbackReady) {
    previousPoint = motionPoint;
    const rawCandidate = poseIsFresh
      ? { point: posePoint, color: null, confidence: 0.96, zone: getDominantZoneFromPoint(posePoint) }
      : handIsFresh
        ? { point: handPoint, color: sampleColorAtPoint(handPoint), confidence: 0.98, zone: getDominantZoneFromPoint(handPoint) }
        : markerCandidate
          ? markerCandidate
          : faceIsFresh
            ? { point: facePoint, color: sampleColorAtPoint(facePoint), confidence: 0.96, zone: "high-center" }
            : visualCandidate;
    const candidate = updateLockedTrack(rawCandidate);
    motionPoint = smoothTrackedPoint(candidate.point, candidate.confidence);
    trackerConfidence = trackerConfidence * 0.68 + candidate.confidence * 0.32;
    motionVelocity = Math.hypot(motionPoint.x - previousPoint.x, motionPoint.y - previousPoint.y);
    dominantZone = candidate.zone;
    updateMotionFeedback();
    const reliableTracker = trackerConfidence > 0.35;
    if (motionLevel > 0.025) {
      const rect = stage.getBoundingClientRect();
      addMovement(motionPoint.x * rect.width, motionPoint.y * rect.height, Math.max(0.55, motionLevel * 2.8));
    }
    if (motionLevel > 0.025 || reliableTracker) {
      updatePathGlow();
      updateGame();
    }
    if (motionLevel > 0.025 || (gameRunning && reliableTracker)) {
      mapMovement();
    }
  }
}

function getDominantZone(cellEnergy) {
  let best = 0;
  for (let i = 1; i < cellEnergy.length; i += 1) {
    if (cellEnergy[i] > cellEnergy[best]) best = i;
  }
  const col = best % gridCols;
  const row = Math.floor(best / gridCols);
  const horizontal = col < 4 ? "left" : col > 7 ? "right" : "center";
  const vertical = row < 3 ? "high" : row > 5 ? "low" : "middle";
  return `${vertical}-${horizontal}`;
}

function getDominantZoneFromPoint(point) {
  const horizontal = point.x < 0.34 ? "left" : point.x > 0.66 ? "right" : "center";
  const vertical = point.y < 0.34 ? "high" : point.y > 0.66 ? "low" : "middle";
  return `${vertical}-${horizontal}`;
}

async function mapMovement(force = false, targetHit = false) {
  const now = performance.now();
  if (!apiOnline || (!force && now - lastMapAt < 650)) return;
  lastMapAt = now;
  const moveForEvent = getCurrentMove();

  try {
    const result = await api("/api/ai/map-movement", {
      method: "POST",
      body: JSON.stringify({
        features: {
          level: motionLevel,
          x: motionPoint.x,
          y: motionPoint.y,
          velocity: motionVelocity,
          zone: dominantZone,
          mode: activeMode,
          access: accessSelect.value,
          effect: activeEffect,
          game: gameSelect.value,
          movementGoal: moveForEvent.id,
          wellness: moveForEvent.wellness,
          calibratedNoise,
          targetHit
        }
      })
    });

    aiAction.textContent = result.action;
    aiConfidence.textContent = result.model
      ? `${Math.round(result.confidence * 100)}% ML`
      : `${Math.round(result.confidence * 100)}%`;
    result.wellness = moveForEvent.wellness;
    if (result.effect && result.confidence > 0.35) setEffect(result.effect, false);
    if (celebrateToggle.checked) movementLabel.textContent = result.praise;
    recordSessionEvent(result, targetHit);
  } catch (error) {
    apiOnline = false;
    aiAction.textContent = "Local movement mode";
  }
}

async function recordSessionEvent(mapping, targetHit = false) {
  const now = performance.now();
  if (!currentSession || now - lastEventAt < (targetHit ? 300 : 1600)) return;
  lastEventAt = now;
  try {
    const result = await api(`/api/sessions/${currentSession.id}/events`, {
      method: "POST",
      body: JSON.stringify({
        level: motionLevel,
        action: mapping.action,
        confidence: mapping.confidence,
        targetHit,
        game: gameSelect.value,
        routine: routineSelect.value,
        wellness: mapping.wellness || getCurrentMove().wellness,
        activeSeconds,
        breaths: breathsCompleted,
        score
      })
    });
    sessionSummary.textContent = `${result.session.summary.blooms || 0} blooms, ${result.session.summary.activeSeconds || activeSeconds}s flow`;
  } catch (error) {
    sessionSummary.textContent = "Session recording paused";
  }
}

function updateMotionFeedback() {
  updateTrackingDebug();
  const rect = stage.getBoundingClientRect();
  const x = motionPoint.x * rect.width;
  const y = motionPoint.y * rect.height;
  const handAiFresh = activeMode === "handPath" && handPoint && performance.now() - handPointAt < 700;
  const markerFresh = activeMode === "handPath" && markerPoint && performance.now() - markerPointAt < 900;
  const poseFresh = isPoseMode() && posePoint && performance.now() - posePointAt < 700;
  const activeDomain = getActiveMoveDomain();
  const profileKey = getAdaptiveProfileKey();
  const label = poseFresh
    ? `Tracking ${domainLabels[activeDomain] || "body"}`
    : activeMode === "headTracking"
    ? "Tracking head"
    : activeMode === "keyboard"
      ? "Keyboard cursor"
      : handTrackerSelect.value === "marker" && markerColor && markerFresh
        ? "Tracking marker"
        : handAiFresh
          ? "Tracking fingers"
          : handTrackerSelect.value === "marker"
            ? "Tap marker"
            : profileKey === "gaze"
              ? "Find face"
              : profileKey === "switch"
                ? "Press switch"
                : "Find movement";
  trackingTarget = activeMode === "headTracking" || activeDomain === "head" ? "head" : activeMode === "keyboard" ? "keyboard" : activeDomain?.includes("Foot") ? "foot" : "hand";
  trackingLabel.textContent = label;
  detectionRing.classList.toggle("is-hand", trackingTarget === "hand");
  detectionRing.classList.toggle("is-foot", trackingTarget === "foot");
  detectionRing.classList.toggle("is-head", trackingTarget === "head");
  detectionRing.classList.toggle("is-keyboard", trackingTarget === "keyboard");
  const scale = activeMode === "keyboard" ? 0.86 : 0.74 + Math.min(0.45, motionLevel * 0.72) + trackerConfidence * 0.08;
  const confidenceOpacity = activeMode === "keyboard" ? 0.92 : Math.min(0.94, 0.16 + motionLevel * 0.48 + trackerConfidence * 0.5);
  detectionRing.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
  detectionRing.style.opacity = String(confidenceOpacity);
}

function addMovement(x, y, force = 1) {
  const rect = stage.getBoundingClientRect();
  const localX = Math.max(0, Math.min(rect.width, x));
  const localY = Math.max(0, Math.min(rect.height, y));
  const intensity = getIntensity();
  const count = Math.min(10, Math.ceil(intensity * force * 0.62));

  if (activeEffect === "ribbons" || gameSelect.value === "paint") {
    if (ribbons.length < 14) ribbons.push({ x: localX, y: localY, life: 1, color: accent, width: 8 + intensity * 1.4, points: [] });
  }

  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.7 + Math.random() * (activeEffect === "bubbles" ? 1.7 : 3.6);
    particles.push({
      x: localX,
      y: localY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.7,
      size: 5 + Math.random() * (activeEffect === "flowers" ? 18 : 12),
      life: 1,
      spin: Math.random() * Math.PI,
      color: [accent, "#45c4b0", "#f7c948", "#7b8cff"][Math.floor(Math.random() * 4)],
      kind: activeEffect
    });
  }

  playTone(Math.min(1, 0.25 + force / 2));
}

function distanceToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSq = dx * dx + dy * dy || 0.0001;
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq));
  const closest = { x: start.x + dx * t, y: start.y + dy * t };
  return { distance: Math.hypot(point.x - closest.x, point.y - closest.y), progress: t, closest };
}

function updatePathGlow() {
  if (!gameRunning || !sweepPath.length || (!isHandLikeMode() && activeMode !== "handPath" && activeMode !== "headTracking")) return;
  const now = performance.now();
  if (now - lastPathGlowAt < 110) return;
  const current = sweepPath[Math.max(0, sweepStep - 1)] || sweepPath[0];
  const next = sweepPath[sweepStep] || sweepPath[sweepPath.length - 1];
  const segment = distanceToSegment(motionPoint, current, next);
  const range = getMovementSupportPreferences().smallRange ? 0.2 : 0.15;
  if (segment.distance > range) return;
  lastPathGlowAt = now;

  const rect = stage.getBoundingClientRect();
  const strength = Math.max(0.2, 1 - segment.distance / range);
  pathGlows.push({
    x: motionPoint.x * rect.width,
    y: motionPoint.y * rect.height,
    life: 1,
    radius: 20 + strength * 38,
    color: strength > 0.68 ? "#f7c948" : "#45c4b0"
  });
  if (strength > 0.35) {
    addMovement(motionPoint.x * rect.width, motionPoint.y * rect.height, 0.12 + strength * 0.22);
  }
}

function updateQuickPreviewMotion() {
  if (!quickPreviewMode || !gameRunning || !sweepPath.length) return;

  const now = performance.now();
  const beatMs = Math.max(420, 60000 / Number(tempoRange.value));
  const progress = (now - gameStartedAt) / beatMs;
  const index = Math.floor(progress) % sweepPath.length;
  const nextIndex = (index + 1) % sweepPath.length;
  const blend = (1 - Math.cos((progress % 1) * Math.PI)) / 2;
  const start = sweepPath[index];
  const end = sweepPath[nextIndex];
  const x = start.x + (end.x - start.x) * blend;
  const y = start.y + (end.y - start.y) * blend;

  previousPoint = { ...motionPoint };
  motionPoint = { x, y };
  motionVelocity = Math.hypot(motionPoint.x - previousPoint.x, motionPoint.y - previousPoint.y) * 7;
  motionLevel = Math.max(0.28, Math.min(1, 0.36 + motionVelocity));
  trackerConfidence = 1;
  dominantZone = start.domain || (activeMode === "headTracking" ? "head" : activeMode === "keyboard" ? "keyboard" : "bodyCenter");

  updateMotionFeedback();
  updatePathGlow();

  if (now - lastPreviewSparkAt > 190) {
    const rect = stage.getBoundingClientRect();
    addMovement(motionPoint.x * rect.width, motionPoint.y * rect.height, 0.34);
    lastPreviewSparkAt = now;
  }
}

function setGameRunning(next) {
  if (next) {
    showWorldIntro();
    return;
  }
  gameRunning = false;
  pausedMidDance = true;
  quickPreviewMode = false;
  gameStartedAt = null;
  pendingStartAfterCalibration = false;
  danceFlowRunning = false;
  stage.classList.remove("is-playing");
  stage.classList.add("is-paused");
  motionRoute.className = "motion-route";
  gameButton.setAttribute("aria-pressed", "false");
  gameButton.textContent = "Resume dance";
  stagePauseButton.setAttribute("aria-pressed", "false");
  stagePauseButton.setAttribute("aria-label", "Resume dance");
  targetDwellStartedAt = null;
  targetLeftAt = 0;
  setTargetProgress(0);
  targetInstruction.textContent = "Hold here";
  movementLabel.textContent = "Paused. Your body still belongs in the dance.";
  if (document.fullscreenElement === stage) {
    stageOptionsPanel.hidden = false;
    stageOptionsButton.setAttribute("aria-expanded", "true");
  }
}

function resumePausedDance() {
  pausedMidDance = false;
  gameRunning = true;
  danceFlowRunning = false;
  stage.classList.add("is-playing");
  stage.classList.remove("is-paused");
  gameButton.disabled = false;
  gameButton.setAttribute("aria-pressed", "true");
  gameButton.textContent = "Pause dance";
  stagePauseButton.setAttribute("aria-pressed", "true");
  stagePauseButton.setAttribute("aria-label", "Pause dance");
  lastActiveTick = performance.now();
  targetDwellStartedAt = null;
  targetLeftAt = 0;
  setTargetProgress(0);
  movementLabel.textContent = "Resumed. Keep moving in the way that feels possible.";
}

async function startGameFromButton() {
  if (gameRunning) {
    setGameRunning(false);
    return;
  }
  if (pausedMidDance) {
    resumePausedDance();
    return;
  }
  if (danceFlowRunning) return;
  danceFlowRunning = true;
  gameButton.disabled = true;
  gameButton.textContent = "Starting...";

  quickPreviewMode = false;
  if (!cameraOn && accessSelect.value !== "switch") {
    movementLabel.textContent = "Starting camera. Place yourself comfortably in frame.";
    const cameraStarted = await startCamera();
    if (!cameraStarted) {
      danceFlowRunning = false;
      gameButton.disabled = false;
      gameButton.textContent = "Start dance";
      return;
    }
  }

  if (document.fullscreenElement !== stage) {
    try {
      movementLabel.textContent = "Opening full-screen dance space.";
      await stage.requestFullscreen();
      scheduleResize();
    } catch (error) {
      movementLabel.textContent = "Fullscreen was blocked, so we will keep dancing here.";
    }
  }

  if (accessSelect.value === "switch") {
    showWorldIntro();
    return;
  }

  movementLabel.textContent = "Learning your comfortable movement range before the music starts.";
  pendingStartAfterCalibration = true;
  if (!startCalibration()) {
    pendingStartAfterCalibration = false;
    danceFlowRunning = false;
    gameButton.disabled = false;
    gameButton.textContent = "Start dance";
  }
}

function showWorldIntro() {
  worldIntro.classList.add("is-visible");
  gameButton.disabled = true;
  gameButton.textContent = "Opening...";
  setTimeout(() => {
    worldIntro.classList.remove("is-visible");
    startGameAfterIntro();
  }, 900);
}

function startGameAfterIntro() {
    danceFlowRunning = false;
    pausedMidDance = false;
    syncStageOptions();
    gameRunning = true;
    gameStartedAt = performance.now();
    nextMusicStepAt = 0;
    musicStepIndex = 0;
    pendingDropAt = 0;
    stage.classList.add("is-playing");
    stage.classList.remove("is-paused");
    gameButton.disabled = false;
    gameButton.setAttribute("aria-pressed", "true");
    gameButton.textContent = "Pause dance";
    stagePauseButton.setAttribute("aria-pressed", "true");
    stagePauseButton.setAttribute("aria-label", "Pause dance");
    blooms = 0;
    wellnessPoints = 0;
    score = 0;
    gameLevel = 1;
    combo = 1;
    streak = 0;
    bestStreak = 0;
    perfectHits = 0;
    goodHits = 0;
    movesCompleted = 0;
    breathsCompleted = 0;
    activeSeconds = 0;
    timeLeft = Number(timeLimitRange.value);
    lastActiveTick = performance.now();
    currentMoveIndex = 0;
    targetDwellStartedAt = null;
    targetLeftAt = 0;
    setTargetProgress(0);
    updateGameHud();
    updateGameClock();
    updateWellness();
    applyCurrentMove();
    if (quickPreviewMode) {
      cameraGuide.classList.remove("is-visible");
      aiAction.textContent = "Adaptive preview running";
      movementLabel.textContent = "Quick preview: this profile turns available input into music, light, and dance.";
    } else {
      movementLabel.textContent = "Welcome to your dance world. Move in whatever way feels possible today.";
    }
}

function placeTarget(random = false) {
  const rect = stage.getBoundingClientRect();
  const radius = getTargetRadius();
  target.radius = radius;
  if (gameRunning && !random) {
    const move = getCurrentMove();
    const stepTarget = sweepPath[sweepStep] || move;
    target.x = stepTarget.x;
    target.y = stepTarget.y;
  } else if (random) {
    const mobilityLow = activeMode === "chair" || mobilitySelect.value === "wheelchair";
    const headHigh = activeMode === "headTracking";
    const marginX = Math.max(0.18, radius * 1.25);
    const marginY = Math.max(0.18, radius * 1.25);
    target.x = marginX + Math.random() * (1 - marginX * 2);
    if (headHigh) target.y = marginY + Math.random() * 0.26;
    else if (mobilityLow) target.y = 0.5 + Math.random() * Math.max(0.1, 1 - marginY - 0.5);
    else target.y = marginY + Math.random() * (1 - marginY * 2);
  }
  const size = Math.max(86, Math.min(220, Math.min(rect.width, rect.height) * radius * 2));
  targetZone.style.width = `${size}px`;
  targetZone.style.height = `${size}px`;
  targetZone.style.left = `${target.x * 100}%`;
  targetZone.style.top = `${target.y * 100}%`;
  targetZone.style.transform = "translate(-50%, -50%)";
}

function setTargetProgress(progress) {
  targetDwellProgress = Math.max(0, Math.min(1, progress));
  targetZone.style.setProperty("--dwell-progress", `${Math.round(targetDwellProgress * 100)}%`);
}

function flashHud(rating) {
  rankLabel.textContent = rating;
  rankLabel.classList.remove("is-pop");
  targetZone.classList.remove("is-hit");
  void rankLabel.offsetWidth;
  rankLabel.classList.add("is-pop");
  targetZone.classList.add("is-hit");
}

function makeMove({ id, name, purpose, coach, domain, effect = "ribbons", wellness = "mobility", floor = false }) {
  const isLeft = domain?.includes("left");
  const isFoot = domain?.includes("Foot");
  return {
    id,
    name,
    purpose,
    coach,
    x: isFoot ? (isLeft ? 0.38 : 0.62) : isLeft ? 0.3 : 0.7,
    y: floor ? 0.76 : isFoot ? 0.8 : 0.42,
    mode: isFoot ? "footPath" : domain === "bodyCenter" ? "bodyPath" : "handPath",
    domain,
    effect,
    wellness,
    floor
  };
}

function getFullBodyDanceProgram(prefs, handDomains, footDomains) {
  const hands = handDomains.length ? handDomains : [];
  const feet = footDomains.length ? footDomains : [];
  const moves = [];

  if (feet.length) {
    const firstFoot = feet.includes("leftFoot") ? "leftFoot" : feet[0];
    const secondFoot = feet.includes("rightFoot") ? "rightFoot" : feet[0];
    moves.push(makeMove({
      id: `floor-${firstFoot}-travel`,
      name: `${domainLabels[firstFoot]} side step`,
      purpose: "Step, tap, or slide sideways through a lower path scaled to the dancer's range.",
      coach: `Use your ${domainLabels[firstFoot]} for a side step. Tap, slide, or step through the lower arrows.`,
      domain: firstFoot,
      effect: "stars",
      wellness: "cardio",
      floor: true
    }));
    moves.push(makeMove({
      id: `floor-${secondFoot}-return`,
      name: `${domainLabels[secondFoot]} side step`,
      purpose: "Step, tap, or slide the other way so the dance has lower-body rhythm.",
      coach: `Now use your ${domainLabels[secondFoot]} to move back. Small step, big step, or assisted step all count.`,
      domain: secondFoot,
      effect: "stars",
      wellness: "cardio",
      floor: true
    }));
  }

  hands.forEach((domain, index) => {
    moves.push(makeMove({
      id: `arm-${domain}-sweep`,
      name: `${domainLabels[domain]} ribbon sweep`,
      purpose: "Add an expressive arm phrase above the floor path, scaled to comfortable reach.",
      coach: `Let your ${domainLabels[domain]} paint the air while your feet own the floor.`,
      domain,
      effect: index % 2 ? "flowers" : "ribbons",
      wellness: routineSelect.value === "strength" ? "strength" : "mobility"
    }));
  });

  moves.push(makeMove({
    id: "full-body-groove",
    name: "Lean and groove",
    purpose: "Shift, center, shift, then settle. This links the dance together without needing a big step.",
    coach: "Shift left, center softly, shift right, then settle. Keep it smooth and inside your safe range.",
    domain: "bodyCenter",
    effect: "bubbles",
    wellness: "posture"
  }));

  return moves;
}

function getProgram() {
  const prefs = getMovementSupportPreferences();
  const base = movementPrograms[routineSelect.value] || movementPrograms.confidence;
  if (activeMode === "headTracking" || prefs.availableHands.length === 0 && getCheckedSupports().includes("head")) {
    return [
      {
        id: `${routineSelect.value}-gaze-dwell`,
        name: "Gaze glow",
        purpose: "Use eye gaze, dwell, blink, or a tiny head tilt to bloom the target.",
        coach: "Look toward the glow, blink, dwell, or make a tiny head tilt. No hand movement is needed.",
        x: 0.5,
        y: 0.42,
        mode: "headTracking",
        domain: "head",
        effect: "stars",
        wellness: "calm"
      },
      {
        id: `${routineSelect.value}-head-tilt`,
        name: "Head tilt ribbon",
        purpose: "A small left or right head tilt sweeps color across the stage.",
        coach: "Tilt or turn your head a little toward the glow. Stillness and dwell can count too.",
        x: 0.5,
        y: 0.5,
        mode: "headTracking",
        domain: "head",
        effect: "ribbons",
        wellness: "posture"
      }
    ];
  }
  const handDomains = activeMode === "oneArm"
    ? [prefs.preferredSide === "left" && prefs.availableHands.includes("leftHand") ? "leftHand" : prefs.availableHands.includes("rightHand") ? "rightHand" : prefs.availableHands[0]].filter(Boolean)
    : prefs.availableHands;
  const footDomains = activeMode === "standard" ? prefs.availableFeet : [];

  if (routineSelect.value === "calm") {
    return base.map((move) => ({
      ...move,
      domain: move.id === "settle" ? "keyboard" : "head",
      label: move.id === "settle" ? "Ready sparkle" : "Head glow"
    }));
  }

  if (activeMode === "standard") {
    const fullBodyMoves = getFullBodyDanceProgram(prefs, handDomains, footDomains);
    if (fullBodyMoves.length) return fullBodyMoves;
  }

  const moves = [];
  handDomains.forEach((domain, index) => {
    moves.push({
      id: `${routineSelect.value}-${domain}-${index}`,
      name: domain === "leftHand" ? "Left hand glow path" : "Right hand glow path",
      purpose: "Follow a hand path scaled to the dancer's comfortable reach.",
      coach: `Let your ${domainLabels[domain]} lead this part of the dance. Sweep through the arrows in whatever range feels safe.`,
      x: domain === "leftHand" ? 0.32 : 0.68,
      y: prefs.upperBodyOnly ? 0.54 : 0.42,
      mode: "handPath",
      domain,
      effect: index % 2 ? "flowers" : "ribbons",
      wellness: routineSelect.value === "strength" ? "strength" : "mobility"
    });
  });

  if (footDomains.length) {
    footDomains.forEach((domain, index) => {
      moves.push({
        id: `${routineSelect.value}-${domain}-${index}`,
        name: domain === "leftFoot" ? "Left foot step path" : "Right foot step path",
        purpose: "Follow a lower-body path only when the dancer has that movement available and visible.",
        coach: `Now the arrows move to your ${domainLabels[domain]}. A tap, slide, step, or assisted shift can count.`,
        x: domain === "leftFoot" ? 0.42 : 0.58,
        y: 0.78,
        mode: "footPath",
        domain,
        effect: "stars",
        wellness: "cardio"
      });
    });
  }

  moves.push({
    id: `${routineSelect.value}-shoulders`,
    name: prefs.upperBodyOnly ? "Seated shoulder groove" : "Shoulder groove reset",
    purpose: prefs.upperBodyOnly
      ? "A seated-friendly upper-body move for posture, rhythm, and expression."
      : "A body-center move that keeps the dance flowing between limb paths.",
    coach: "Let the shoulders or upper body guide this glow. Small shifts still count.",
    x: 0.5,
    y: prefs.upperBodyOnly ? 0.48 : 0.42,
    mode: "upperBody",
    domain: "shoulders",
    effect: "bubbles",
    wellness: "posture"
  });

  return moves.length ? moves : base;
}

function getCurrentMove() {
  const program = getProgram();
  return program[currentMoveIndex % program.length];
}

function getCapabilityLabel(domain, fallback = "Move here") {
  if (activeMode === "headTracking" || domain === "head") return "Look here";
  if (activeMode === "keyboard" || domain === "keyboard") return "Press here";
  if (domain === "shoulders") return "Shoulders or upper body";
  if (domain === "bodyCenter") return "Center your body";
  if (domain === "leftFoot" || domain === "rightFoot") return `Use ${domainLabels[domain]}`;
  if (domain === "leftHand" || domain === "rightHand") return `Use ${domainLabels[domain]}`;
  return fallback;
}

function getBodyCenterLabels(prefs) {
  if (activeMode === "headTracking") return ["Look left", "Look center", "Look right", "Rest here"];
  if (activeMode === "keyboard") return ["Press left", "Press center", "Press right", "Rest here"];
  if (prefs.seatedLow || prefs.upperBodyOnly) return ["Shift left", "Center softly", "Shift right", "Settle here"];
  return ["Lean left", "Rise softly", "Lean right", "Settle here"];
}

function getPathActionLabel(domain, action, prefs) {
  if (activeMode === "headTracking" || domain === "head") {
    if (action === "start") return "Look here";
    if (action === "middle") return prefs.slow ? "Dwell softly" : "Tiny tilt";
    return "Rest gaze";
  }
  if (activeMode === "keyboard" || domain === "keyboard") {
    if (action === "start") return "Ready";
    if (action === "middle") return "Press through";
    return "Press to glow";
  }
  if (domain === "shoulders") {
    if (action === "start") return "Shoulders here";
    if (action === "middle") return "Center softly";
    return "Let it settle";
  }
  if (domain === "bodyCenter") {
    const labels = getBodyCenterLabels(prefs);
    return action === "start" ? labels[0] : action === "middle" ? labels[1] : labels[3];
  }
  if (domain === "leftFoot" || domain === "rightFoot") {
    if (action === "start") return `Use ${domainLabels[domain]}`;
    if (action === "middle") return "Slide or tap";
    return "Rest in glow";
  }
  if (domain === "leftHand" || domain === "rightHand") {
    if (action === "start") return `Use ${domainLabels[domain]}`;
    if (action === "middle") return prefs.avoidOverhead ? "Sweep across" : "Lift your way";
    return "Flow through";
  }
  return action === "middle" ? "Move your way" : "Let it glow";
}

function getSweepPath(move) {
  const prefs = getMovementSupportPreferences();
  if (isPoseMode()) {
    const domain = move.domain || (activeMode === "upperBody" ? "shoulders" : `${poseCalibration?.side || prefs.preferredSide || "right"}Hand`);
    const isFoot = domain === "leftFoot" || domain === "rightFoot";
    const isBodyCenter = domain === "shoulders" || domain === "head" || domain === "bodyCenter";
    const side = domain.includes("left") ? "left" : domain.includes("right") ? "right" : poseCalibration?.side || prefs.preferredSide || "right";
    const sameSide = activeMode === "oneArm" || prefs.avoidCrossing || isFoot;
    const range = poseCalibration?.rangeX || (prefs.smallRange ? 0.32 : 0.52);
    const span = isFoot
      ? (prefs.smallRange ? randomRange(0.16, 0.24) : prefs.wideRange ? randomRange(0.4, 0.54) : randomRange(0.28, 0.4))
      : isBodyCenter
        ? (prefs.smallRange ? randomRange(0.1, 0.18) : randomRange(0.16, 0.28))
        : Math.min(prefs.smallRange ? 0.28 : 0.52, Math.max(0.2, range * 0.32));
    const center = isBodyCenter ? 0.5 : sameSide ? (side === "left" ? 0.36 : 0.64) : 0.5;
    const startX = center - span / 2;
    const endX = center + span / 2;
    const baseY = isFoot
      ? randomRange(0.72, 0.86)
      : isBodyCenter
        ? randomRange(0.4, 0.54)
        : activeMode === "upperBody" || prefs.seatedLow ? randomRange(0.46, 0.66) : randomRange(0.34, 0.62);
    const upAmount = isFoot
      ? randomRange(-0.03, 0.04)
      : prefs.avoidOverhead ? randomRange(0.02, 0.08) : randomRange(0.08, 0.18);
    const startLabel = isFoot ? `Use ${domainLabels[domain]}` : isBodyCenter ? getPathActionLabel(domain, "start", prefs) : getPathActionLabel(domain, "start", prefs);
    const midLabel = isFoot ? "Slide or tap" : isBodyCenter ? getPathActionLabel(domain, "middle", prefs) : getPathActionLabel(domain, "middle", prefs);
    if (isFoot && move.floor) {
      const footStart = side === "left" ? center - span * 0.42 : center + span * 0.42;
      const footEnd = side === "left" ? center + span * 0.42 : center - span * 0.42;
      const floorLift = prefs.smallRange ? 0.025 : 0.055;
      return [
        pathPoint({ x: footStart, y: baseY, label: `Use ${domainLabels[domain]}` }, prefs, domain),
        pathPoint({ x: center, y: baseY - floorLift, label: getPathActionLabel(domain, "middle", prefs) }, prefs, domain),
        pathPoint({ x: footEnd, y: baseY + randomRange(-0.02, 0.02), label: getPathActionLabel(domain, "end", prefs) }, prefs, domain)
      ];
    }
    if (domain === "bodyCenter") {
      const grooveSpan = prefs.smallRange ? 0.12 : prefs.wideRange ? 0.28 : 0.2;
      const labels = getBodyCenterLabels(prefs);
      return [
        pathPoint({ x: 0.5 - grooveSpan / 2, y: 0.5, label: labels[0] }, prefs, domain),
        pathPoint({ x: 0.5, y: 0.44, label: labels[1] }, prefs, domain),
        pathPoint({ x: 0.5 + grooveSpan / 2, y: 0.5, label: labels[2] }, prefs, domain),
        pathPoint({ x: 0.5, y: 0.55, label: labels[3] }, prefs, domain)
      ];
    }
    return [
      pathPoint({ x: startX, y: baseY + (isFoot ? 0.01 : 0.08), label: startLabel }, prefs, domain),
      pathPoint({ x: center, y: baseY - upAmount, label: midLabel }, prefs, domain),
      pathPoint({ x: endX, y: baseY + randomRange(-0.02, isFoot ? 0.03 : 0.08), label: getPathActionLabel(domain, "end", prefs) }, prefs, domain)
    ];
  }

  if (activeMode === "keyboard") {
    return [
      { x: 0.5, y: 0.62, label: "Ready" },
      clampPathPoint({ x: randomRange(0.28, 0.72), y: randomRange(0.34, 0.7), label: "Press through" }, prefs)
    ];
  }

  if (move.mode === "headTracking" || activeMode === "headTracking") {
    const baseX = randomRange(0.38, 0.62);
    const endY = prefs.avoidOverhead ? randomRange(0.36, 0.5) : randomRange(0.24, 0.62);
    const startY = endY < 0.46 ? Math.min(0.68, endY + (prefs.smallRange ? 0.14 : 0.24)) : Math.max(0.28, endY - (prefs.smallRange ? 0.12 : 0.2));
    return [
      pathPoint({ x: baseX, y: startY, label: "Look here" }, prefs, "head"),
      pathPoint({ x: baseX + randomRange(-0.06, 0.06), y: endY, label: endY < startY ? "Tilt up" : "Dwell here" }, prefs, "head")
    ];
  }

  const span = prefs.smallRange ? randomRange(0.22, 0.34) : prefs.wideRange ? randomRange(0.54, 0.68) : randomRange(0.38, 0.52);
  const baseY = prefs.seatedLow ? randomRange(0.52, 0.7) : randomRange(0.38, 0.64);
  const goingLeft = prefs.preferredSide === "left" ? true : prefs.preferredSide === "right" ? false : Math.random() > 0.5;
  let startX = goingLeft ? 0.5 + span / 2 : 0.5 - span / 2;
  let endX = goingLeft ? 0.5 - span / 2 : 0.5 + span / 2;
  if (prefs.avoidCrossing || prefs.preferredSide) {
    const sideCenter = prefs.preferredSide === "left" ? 0.32 : prefs.preferredSide === "right" ? 0.68 : goingLeft ? 0.34 : 0.66;
    startX = sideCenter + (goingLeft ? span * 0.32 : -span * 0.32);
    endX = sideCenter + (goingLeft ? -span * 0.32 : span * 0.32);
  }
  const middleX = (startX + endX) / 2 + randomRange(-0.05, 0.05);
  const yLift = prefs.slow || prefs.avoidOverhead ? randomRange(-0.06, 0.04) : randomRange(-0.16, -0.08);
  return [
    pathPoint({ x: startX, y: baseY + randomRange(0.04, 0.12), label: getCapabilityLabel(move.domain, prefs.slow ? "Begin gently" : "Start here") }, prefs, move.domain || "rightHand"),
    pathPoint({ x: middleX, y: baseY + yLift, label: getPathActionLabel(move.domain || "rightHand", "middle", prefs) }, prefs, move.domain || "rightHand"),
    pathPoint({ x: endX, y: baseY + randomRange(-0.03, 0.09), label: "Let it glow" }, prefs, move.domain || "rightHand")
  ];
}

function formatCoachLine(move) {
  const total = sweepPath.length || 1;
  const step = Math.min(sweepStep + 1, total);
  const domain = sweepPath[sweepStep]?.domain || move.domain;
  const bodyPart = domainLabels[domain] || "body";
  const currentLabel = sweepPath[sweepStep]?.label || "Move";
  if (activeMode === "keyboard") return `Step ${step}/${total}: press through the glow.`;
  if (activeMode === "headTracking") return `Step ${step}/${total}: move your head toward the glow. Tiny movement counts.`;
  if (activeMode === "standard" && (domain === "leftHand" || domain === "rightHand")) return `Step ${step}/${total}: ${currentLabel}. Stay inside your own reach.`;
  if (domain === "leftFoot" || domain === "rightFoot") return `Step ${step}/${total}: ${currentLabel}. Tap, slide, or step.`;
  if (domain === "bodyCenter") return `Step ${step}/${total}: ${currentLabel}. Small lean or big groove, both count.`;
  if (domain === "shoulders") return `Step ${step}/${total}: ${currentLabel} with shoulders or upper body.`;
  const direction = target.x < motionPoint.x ? "left" : "right";
  return `Step ${step}/${total}: sweep your ${bodyPart} ${direction}. Tiny, strong, slow, or assisted all count.`;
}

function applyCurrentMove() {
  const move = getCurrentMove();
  const prefs = getMovementSupportPreferences();
  moveName.textContent = move.name;
  movePurpose.textContent = move.purpose;
  sweepPath = getSweepPath(move);
  sweepStep = 0;
  setEffect(move.effect, false);
  target.x = sweepPath[0]?.x || move.x;
  target.y = sweepPath[0]?.y || move.y;
  targetInstruction.textContent = sweepPath[0]?.label || "Hit this";
  pathStartedAt = performance.now();
  checkpointStartedAt = pathStartedAt;
  placeTarget();
  updateMotionRoute(move);
  coachPrompt.textContent = formatCoachLine(move);
  if (conditionNotes.value.trim()) {
    const adjustments = [
      prefs.avoidOverhead ? "keeping the path below overhead reach" : "",
      prefs.preferredSide ? `favoring the ${prefs.preferredSide} side` : "",
      prefs.smallRange ? "using a smaller range" : "",
      prefs.avoidCrossing ? "staying on one side of the body" : "",
      prefs.slow ? "making the prompt gentler" : ""
    ].filter(Boolean);
    if (adjustments.length) coachPrompt.textContent = `${coachPrompt.textContent} I am ${adjustments.join(", ")}.`;
  }
}

function advanceMove() {
  currentMoveIndex += 1;
  applyCurrentMove();
}

function updateWellness(move = null) {
  wellnessScore.textContent = String(wellnessPoints);
  freedomMoves.textContent = String(movesCompleted);
  breathCount.textContent = String(breathsCompleted);
  flowTime.textContent = `${activeSeconds}s`;
  if (move) {
    moveName.textContent = move.name;
    movePurpose.textContent = move.purpose;
  }
}

function armRoutesAllowed(move = getCurrentMove()) {
  const supports = [...profileForm.querySelectorAll('input[name="supports"]:checked')].map((item) => item.value);
  const notes = conditionNotes.value.toLowerCase();
  const deniesArmMotion = notes.includes("no arm") || notes.includes("avoid arm") || notes.includes("no reach") || notes.includes("avoid reach");
  const armCapableMode = move.mode === "handPath" || isHandLikeMode();
  const accessAllows = isHandLikeMode();
  const postureAllows = !["bed"].includes(mobilitySelect.value) || supports.includes("one-arm");
  return armCapableMode && accessAllows && postureAllows && !deniesArmMotion;
}

function updateRouteGeometry() {
  const points = sweepPath.length ? sweepPath : [{ x: 0.2, y: 0.64 }, { x: 0.5, y: 0.36 }, { x: 0.8, y: 0.64 }];
  const padded = [points[0], points[Math.floor((points.length - 1) / 2)] || points[0], points[points.length - 1] || points[0]];
  padded.forEach((point, index) => {
    const key = ["a", "b", "c"][index];
    motionRoute.style.setProperty(`--route-${key}-x`, `${point.x * 100}%`);
    motionRoute.style.setProperty(`--route-${key}-y`, `${point.y * 100}%`);
  });
  const current = points[sweepStep] || points[0];
  motionRoute.style.setProperty("--route-label-x", `${current.x * 100}%`);
  motionRoute.style.setProperty("--route-label-y", `${Math.max(0.12, current.y - 0.15) * 100}%`);
}

function updateMotionRoute(move = getCurrentMove()) {
  motionRoute.className = "motion-route";
  if (!gameRunning || (!armRoutesAllowed(move) && activeMode !== "headTracking" && activeMode !== "keyboard" && !isPoseMode())) return;

  let direction = "right";
  if (move.x < 0.38) direction = "left";
  if (activeMode === "headTracking" || activeMode === "upperBody") direction = "lift";
  const domain = sweepPath[sweepStep]?.domain || move.domain;
  if (domain === "leftFoot" || domain === "rightFoot") direction = "foot";
  if (domain === "shoulders") direction = "lift";
  if (domain === "bodyCenter") direction = "floor";
  if (move.id === "open") direction = "open";
  motionRoute.classList.add("is-visible", `route-${direction}`);
  updateRouteGeometry();
  routeLabel.textContent = sweepPath[sweepStep]?.label || (direction === "floor" ? "Floor groove" : direction === "foot" ? "Step path" : direction === "left" ? "Sweep left" : direction === "open" ? "Open wide" : "Sweep right");
}

function updateGame() {
  if (!gameRunning) return;
  if (performance.now() - lastCheckpointAt < 850) return;
  const distance = Math.hypot(motionPoint.x - target.x, motionPoint.y - target.y);
  const hitRadius = target.radius * (activeMode === "headTracking" ? 1.34 : activeMode === "keyboard" ? 1.12 : 1.24);
  if (distance > hitRadius) {
    if (!targetLeftAt) targetLeftAt = performance.now();
    if (targetDwellStartedAt && performance.now() - targetLeftAt > 650) {
      streak = 0;
      combo = 1;
      updateGameHud("Still here");
      targetDwellStartedAt = null;
      targetLeftAt = 0;
      setTargetProgress(0);
    }
    return;
  }

  targetLeftAt = 0;
  const move = getCurrentMove();
  const sweepStyle = activeMode === "handPath" || activeMode === "keyboard" || isPoseMode();
  if (sweepStyle && sweepPath.length > 1) {
    if (motionVelocity < 0.004 && activeMode !== "keyboard" && trackerConfidence < 0.45) return;
    if (!targetDwellStartedAt) targetDwellStartedAt = performance.now();
    const checkpointDwellMs = Math.max(950, Number(dwellRange.value) * getMotionLevelSettings().dwell * 0.72);
    const checkpointProgress = (performance.now() - targetDwellStartedAt) / checkpointDwellMs;
    setTargetProgress(checkpointProgress);
    if (checkpointProgress < 1) return;
    completeSweepCheckpoint();
    return;
  }

  if (!targetDwellStartedAt) targetDwellStartedAt = performance.now();
  const dwellMs = Math.max(1250, Number(dwellRange.value) * getMotionLevelSettings().dwell);
  const progress = (performance.now() - targetDwellStartedAt) / dwellMs;
  setTargetProgress(progress);
  if (progress < 1) return;

  bloomTarget();
}

function completeSweepCheckpoint() {
  const move = getCurrentMove();
  const now = performance.now();
  lastCheckpointAt = now;
  const elapsed = now - checkpointStartedAt;
  const poseQuality = isPoseMode() ? getPoseMovementQuality() : null;
  const rangeQuality = poseQuality ? Math.max(poseQuality.sideMatch, poseQuality.upMatch) : null;
  const speedScore = activeMode === "keyboard" ? 0.018 : motionVelocity;
  const rating = poseQuality
    ? rangeQuality > 0.7 ? "Radiant" : rangeQuality > 0.42 ? "Expressive" : "Gentle"
    : elapsed < 1700 && speedScore > 0.014 ? "Radiant" : elapsed < 3100 || speedScore > 0.008 ? "Expressive" : "Gentle";
  if (rating === "Radiant") perfectHits += 1;
  if (rating === "Expressive") goodHits += 1;
  streak += 1;
  bestStreak = Math.max(bestStreak, streak);
  combo = Math.min(4, 1 + streak * 0.18);
  const checkpointPoints = Math.round((rating === "Radiant" ? 18 : rating === "Expressive" ? 12 : 8) * combo);
  setTargetProgress(1);
  playSliceTick(rating === "Radiant" ? 1.25 : 1);
  addMovement(target.x * stage.getBoundingClientRect().width, target.y * stage.getBoundingClientRect().height, 2.4);
  score += checkpointPoints;
  updateGameHud(rating);
  flashHud(rating);

  if (sweepStep < sweepPath.length - 1) {
    sweepStep += 1;
    target.x = sweepPath[sweepStep].x;
    target.y = sweepPath[sweepStep].y;
    targetInstruction.textContent = sweepPath[sweepStep].label;
    targetDwellStartedAt = null;
    targetLeftAt = 0;
    setTargetProgress(0);
    checkpointStartedAt = now;
    placeTarget();
    updateMotionRoute(move);
    coachPrompt.textContent = formatCoachLine(move);
    movementLabel.textContent = `${sweepPath[sweepStep].label}. Keep flowing.`;
    return;
  }

  bloomTarget(rating);
}

function bloomTarget(finalRating = "Gentle") {
  const move = getCurrentMove();
  lastCheckpointAt = performance.now();
  blooms += 1;
  movesCompleted += 1;
  if (move.wellness === "calm") breathsCompleted += 1;
  if (blooms > 0 && blooms % 4 === 0) gameLevel = Math.min(5, gameLevel + 1);
  const basePoints = move.wellness === "calm" ? 20 : armRoutesAllowed(move) ? 35 : 30;
  const finishBonus = finalRating === "Radiant" ? 30 : finalRating === "Expressive" ? 18 : 10;
  const points = Math.round((basePoints + finishBonus + gameLevel * 5) * combo);
  wellnessPoints += move.wellness === "calm" ? 2 : 3;
  score += points;
  updateGameHud("Celebrated");
  flashHud("Celebrated");
  movementLabel.textContent = move.wellness === "calm" ? "That breath belongs in the dance." : `${finalRating} finish. Your movement led the music.`;
  coachPrompt.textContent = blooms % 4 === 0 ? `Scene ${gameLevel}. A new expression path is opening. Keep flowing in the way that feels good.` : "Movement moment complete. The next invitation is loading with the music.";
  setEffect(gameSelect.value === "paint" ? "ribbons" : "flowers", false);
  const rect = stage.getBoundingClientRect();
  addMovement(target.x * rect.width, target.y * rect.height, 4.2);
  queueBeatDrop();
  targetDwellStartedAt = null;
  targetLeftAt = 0;
  setTargetProgress(0);
  targetInstruction.textContent = "Celebrate";
  updateWellness(move);
  mapMovement(true, true);
  advanceMove();
}

function burstFromCurrent(force = 2) {
  const rect = stage.getBoundingClientRect();
  motionLevel = Math.max(motionLevel, 0.5);
  addMovement(motionPoint.x * rect.width, motionPoint.y * rect.height, force);
  if (gameRunning) bloomTarget();
  else mapMovement(true);
}

function drawParticle(particle) {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.spin + performance.now() / 1000);
  ctx.globalAlpha = particle.life;
  ctx.fillStyle = particle.color;
  ctx.strokeStyle = particle.color;
  ctx.lineWidth = 2;

  if (particle.kind === "bubbles") {
    ctx.globalAlpha = particle.life * 0.65;
    ctx.beginPath();
    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    ctx.stroke();
  } else if (particle.kind === "flowers") {
    for (let i = 0; i < 6; i += 1) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath();
      ctx.ellipse(0, particle.size * 0.48, particle.size * 0.28, particle.size * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const radius = i % 2 === 0 ? particle.size : particle.size * 0.42;
      const angle = (Math.PI * 2 * i) / 8;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawHandSkeleton() {
  if (isPoseMode() || activeMode !== "handPath" || !handLandmarks.length || performance.now() - handPointAt > 700) return;
  const rect = stage.getBoundingClientRect();
  const chains = [
    [0, 1, 2, 3, 4],
    [0, 5, 6, 7, 8],
    [0, 9, 10, 11, 12],
    [0, 13, 14, 15, 16],
    [0, 17, 18, 19, 20],
    [5, 9, 13, 17]
  ];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.86)";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(17, 194, 178, 0.8)";
  ctx.shadowBlur = 16;
  chains.forEach((chain) => {
    ctx.beginPath();
    chain.forEach((landmarkIndex, index) => {
      const point = handLandmarks[landmarkIndex];
      if (!point) return;
      const x = point.x * rect.width;
      const y = point.y * rect.height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  [4, 8, 12, 16, 20].forEach((landmarkIndex) => {
    const point = handLandmarks[landmarkIndex];
    if (!point) return;
    ctx.fillStyle = "rgba(247, 201, 72, 0.92)";
    ctx.beginPath();
    ctx.arc(point.x * rect.width, point.y * rect.height, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawPoseSkeleton() {
  if (!isPoseMode() || !poseLandmarks.length) return;
  const rect = stage.getBoundingClientRect();
  const tracked = activeMode === "oneArm" ? chooseActiveArm() : null;
  const chains = activeMode === "standard"
    ? [
      [11, 13, 15],
      [12, 14, 16],
      [11, 12, 24, 23, 11],
      [23, 25, 27],
      [24, 26, 28],
      [0, 11],
      [0, 12]
    ]
    : activeMode === "oneArm"
      ? [[tracked === "left" ? 11 : 12, tracked === "left" ? 13 : 14, tracked === "left" ? 15 : 16], [11, 12], [0, 11], [0, 12]]
      : [[11, 13, 15], [12, 14, 16], [11, 12, 24, 23, 11], [0, 11], [0, 12]];

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(69, 196, 176, 0.75)";
  ctx.shadowBlur = 16;
  chains.forEach((chain) => {
    ctx.beginPath();
    let started = false;
    chain.forEach((landmarkIndex) => {
      const point = getLandmark(landmarkIndex);
      if (!point) return;
      const x = point.x * rect.width;
      const y = point.y * rect.height;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    if (started) ctx.stroke();
  });

  const labels = [
    ["head", poseIndexes.nose],
    ["L shoulder", poseIndexes.leftShoulder],
    ["R shoulder", poseIndexes.rightShoulder],
    ["L elbow", poseIndexes.leftElbow],
    ["R elbow", poseIndexes.rightElbow],
    ["L wrist", poseIndexes.leftWrist],
    ["R wrist", poseIndexes.rightWrist],
    ["L hip", poseIndexes.leftHip],
    ["R hip", poseIndexes.rightHip],
    ["L knee", poseIndexes.leftKnee],
    ["R knee", poseIndexes.rightKnee],
    ["L ankle", poseIndexes.leftAnkle],
    ["R ankle", poseIndexes.rightAnkle]
  ];

  labels.forEach(([label, index]) => {
    const raw = poseLandmarks[index];
    const point = raw && raw.visibility > 0.08 ? raw : null;
    if (!point) return;
    const accepted = point.visibility > 0.28;
    const isWrist = index === poseIndexes.leftWrist || index === poseIndexes.rightWrist;
    const isAnkle = index === poseIndexes.leftAnkle || index === poseIndexes.rightAnkle;
    const domain = getActiveMoveDomain();
    const isActiveHand = domain === "leftHand" && index === poseIndexes.leftWrist || domain === "rightHand" && index === poseIndexes.rightWrist;
    const isActiveFoot = domain === "leftFoot" && index === poseIndexes.leftAnkle || domain === "rightFoot" && index === poseIndexes.rightAnkle;
    ctx.fillStyle = accepted
      ? isActiveHand || isActiveFoot ? "rgba(247, 201, 72, 0.98)" : isWrist || isAnkle ? "rgba(123, 140, 255, 0.86)" : "rgba(255, 255, 255, 0.88)"
      : "rgba(255, 111, 174, 0.45)";
    ctx.beginPath();
    ctx.arc(point.x * rect.width, point.y * rect.height, isActiveHand || isActiveFoot ? 9 : isWrist || isAnkle ? 7 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "700 11px system-ui, sans-serif";
    ctx.fillStyle = accepted ? "rgba(36, 31, 43, 0.92)" : "rgba(102, 63, 143, 0.72)";
    ctx.fillText(label, point.x * rect.width + 8, point.y * rect.height - 8);
  });

  const trackedPoint = getPoseTrackedPoint();
  if (trackedPoint?.wrist && trackedPoint?.shoulder) {
    ctx.strokeStyle = "rgba(247, 201, 72, 0.95)";
    ctx.lineWidth = 5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(trackedPoint.shoulder.x * rect.width, trackedPoint.shoulder.y * rect.height);
    ctx.lineTo(trackedPoint.wrist.x * rect.width, trackedPoint.wrist.y * rect.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (trackedPoint?.ankle && trackedPoint?.hip) {
    ctx.strokeStyle = "rgba(123, 140, 255, 0.96)";
    ctx.lineWidth = 5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(trackedPoint.hip.x * rect.width, trackedPoint.hip.y * rect.height);
    if (trackedPoint.knee) ctx.lineTo(trackedPoint.knee.x * rect.width, trackedPoint.knee.y * rect.height);
    ctx.lineTo(trackedPoint.ankle.x * rect.width, trackedPoint.ankle.y * rect.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function getPoseMovementQuality() {
  if (!poseCalibration || !poseLandmarks.length) return null;
  const tracked = getPoseTrackedPoint();
  if (!tracked) return null;
  const sideRange = poseCalibration.rangeX || 0.35;
  const upRange = poseCalibration.rangeUp || 0.28;
  return {
    sideMatch: Math.min(1, Math.abs(tracked.rel.x - poseCalibration.neutral.x) / sideRange),
    upMatch: Math.min(1, Math.max(0, poseCalibration.neutral.y - tracked.rel.y) / upRange),
    confidence: tracked.confidence
  };
}

function drawRoutePath() {
  if (!gameRunning || !motionRoute.classList.contains("is-visible") || sweepPath.length < 2) return;
  const rect = stage.getBoundingClientRect();
  const points = sweepPath.map((point) => ({ x: point.x * rect.width, y: point.y * rect.height }));
  const progressIndex = Math.max(0, Math.min(sweepStep, points.length - 1));
  const domain = sweepPath[progressIndex]?.domain || getCurrentMove().domain;
  const isFoot = domain === "leftFoot" || domain === "rightFoot";
  const accent = isFoot ? "rgba(123, 140, 255, 0.94)" : domain === "bodyCenter" || domain === "shoulders" ? "rgba(69, 196, 176, 0.95)" : "rgba(255, 111, 174, 0.88)";

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(247, 201, 72, 0.72)";
  ctx.shadowBlur = 18;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.58)";
  ctx.lineWidth = 16;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  ctx.shadowColor = "rgba(255, 111, 174, 0.65)";
  ctx.shadowBlur = 20;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const mid = { x: start.x * 0.42 + end.x * 0.58, y: start.y * 0.42 + end.y * 0.58 };
    ctx.save();
    ctx.translate(mid.x, mid.y);
    ctx.rotate(angle);
    ctx.fillStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-10, -11);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-10, 11);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (progressIndex > 0) {
    ctx.shadowColor = "rgba(69, 196, 176, 0.86)";
    ctx.strokeStyle = "rgba(69, 196, 176, 0.95)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    points.slice(0, progressIndex + 1).forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  }

  const current = points[progressIndex];
  if (current) {
    ctx.fillStyle = "rgba(247, 201, 72, 0.92)";
    ctx.beginPath();
    ctx.arc(current.x, current.y, 10 + Math.sin(performance.now() / 180) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "900 13px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.strokeStyle = "rgba(36, 31, 43, 0.36)";
    ctx.lineWidth = 4;
    const label = `${domainLabels[domain] || "move"} path`;
    ctx.strokeText(label, current.x + 14, current.y - 16);
    ctx.fillText(label, current.x + 14, current.y - 16);
  }
  ctx.restore();
}

function drawDanceFloor() {
  if (!gameRunning || activeMode !== "standard" || !getMovementSupportPreferences().lowerBodyAvailable) return;
  const rect = stage.getBoundingClientRect();
  const floorTop = rect.height * 0.66;
  const floorHeight = rect.height * 0.24;

  ctx.save();
  ctx.globalAlpha = 0.62;
  const gradient = ctx.createLinearGradient(0, floorTop, 0, floorTop + floorHeight);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.18)");
  gradient.addColorStop(1, "rgba(123, 140, 255, 0.16)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(rect.width * 0.12, floorTop, rect.width * 0.76, floorHeight, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i += 1) {
    const x = rect.width * (0.12 + 0.76 * i / 4);
    ctx.beginPath();
    ctx.moveTo(x, floorTop + 8);
    ctx.lineTo(x, floorTop + floorHeight - 8);
    ctx.stroke();
  }
  ctx.font = "900 12px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.fillText("floor movement zone", rect.width * 0.14, floorTop + 22);
  ctx.restore();
}

function animate() {
  const rect = stage.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  drawDanceFloor();
  drawRoutePath();
  detectMotion();
  updateQuickPreviewMotion();
  if (gameRunning) updateGame();
  updateBackingTrack();
  updateTrackingDebug();
  drawPoseSkeleton();
  drawHandSkeleton();
  if (gameRunning && performance.now() - lastActiveTick > 1000) {
    activeSeconds += 1;
    timeLeft = Math.max(0, Number(timeLimitRange.value) - activeSeconds);
    lastActiveTick = performance.now();
    updateGameClock();
    updateWellness();
    if (timeLeft === 0) finishGame();
  }

  ribbons = ribbons.filter((ribbon) => ribbon.life > 0.02);
  particles = particles.filter((particle) => particle.life > 0.02);
  pathGlows = pathGlows.filter((glow) => glow.life > 0.03);

  pathGlows.forEach((glow) => {
    glow.life *= reducedToggle.checked ? 0.82 : 0.88;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
    gradient.addColorStop(0, `${glow.color}dd`);
    gradient.addColorStop(0.45, `${glow.color}55`);
    gradient.addColorStop(1, `${glow.color}00`);
    ctx.globalAlpha = glow.life;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ribbons.forEach((ribbon) => {
    ribbon.life *= reducedToggle.checked ? 0.91 : 0.965;
    ribbon.points.push({ x: ribbon.x + Math.sin(performance.now() / 420 + ribbon.y) * 2.4, y: ribbon.y });
    ribbon.y -= 1.4 + getIntensity() * 0.07;
    if (ribbon.points.length > 30) ribbon.points.shift();

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = ribbon.color;
    ctx.globalAlpha = 0.25 * ribbon.life;
    ctx.lineWidth = ribbon.width;
    ctx.beginPath();
    ribbon.points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  });

  ctx.globalCompositeOperation = "screen";
  particles.forEach((particle) => {
    particle.life *= reducedToggle.checked ? 0.9 : 0.955;
    particle.vy += activeEffect === "bubbles" ? -0.012 : 0.018;
    particle.x += particle.vx;
    particle.y += particle.vy;
    drawParticle(particle);
  });
  ctx.globalCompositeOperation = "source-over";

  requestAnimationFrame(animate);
}

function setMode(mode) {
  activeMode = mode;
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("is-active", item.dataset.mode === mode));
  document.querySelectorAll("[data-stage-mode]").forEach((item) => item.classList.toggle("is-active", item.dataset.stageMode === mode));
  stage.dataset.trackingMode = mode;
  movementLabel.textContent = modePrompts[activeMode];
  if (mode === "keyboard") accessSelect.value = "switch";
  if (mode === "headTracking" || isPoseMode()) accessSelect.value = "dwell";
  if (mode === "handPath") accessSelect.value = "dwell";
  if (isPoseMode() && cameraOn) ensurePoseLandmarker();
  if (mode === "handPath" && cameraOn && handTrackerSelect.value === "ai") ensureHandLandmarker();
  trackerConfidence = mode === "keyboard" ? 1 : 0;
  lockedTrack = null;
  lockLostFrames = 0;
  calibrationTrackSamples = [];
  if (mode === "handPath") {
    markerPoint = null;
    markerPointAt = 0;
    markerConfidence = 0;
  }
  backgroundFrame = null;
  updateAdaptiveGuide();
  updateMotionFeedback();
  if (gameRunning) applyCurrentMove();
  else placeTarget(true);
}

function closeStageOptions() {
  stageOptionsPanel.hidden = true;
  stageOptionsButton.setAttribute("aria-expanded", "false");
}

function toggleStageOptions() {
  const willOpen = stageOptionsPanel.hidden;
  stageOptionsPanel.hidden = !willOpen;
  stageOptionsButton.setAttribute("aria-expanded", String(willOpen));
}

function syncStageOptions() {
  document.querySelectorAll("[data-stage-mode]").forEach((item) => item.classList.toggle("is-active", item.dataset.stageMode === activeMode));
  stageMotionLevel.value = motionLevelSelect.value;
  stageAccess.value = accessSelect.value;
  stageSensitivityRange.value = sensitivityRange.value;
  stageDwellRange.value = dwellRange.value;
}

function finishGame() {
  gameRunning = false;
  pausedMidDance = false;
  stage.classList.add("is-paused");
  quickPreviewMode = false;
  stage.classList.remove("is-playing");
  motionRoute.className = "motion-route";
  gameButton.setAttribute("aria-pressed", "false");
  gameButton.textContent = "Start dance";
  stagePauseButton.setAttribute("aria-pressed", "false");
  stagePauseButton.setAttribute("aria-label", "Resume dance");
  movementLabel.textContent = "You danced, and that was extraordinary.";
  coachPrompt.textContent = `You created ${blooms} dance moment${blooms === 1 ? "" : "s"} and filled the room with ${activeSeconds}s of flow. There was no score here, only expression.`;
  updateGameHud("Celebrated");
  targetDwellStartedAt = null;
  targetLeftAt = 0;
  setTargetProgress(0);
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await stage.requestFullscreen();
    }
  } catch (error) {
    movementLabel.textContent = "Fullscreen was blocked by the browser. The dance still works here.";
  }
}

function setEffect(effect, announce = true) {
  activeEffect = effect;
  document.querySelectorAll("[data-effect]").forEach((item) => item.classList.toggle("is-active", item.dataset.effect === effect));
  effectLabel.textContent = effects[activeEffect];
  if (announce) aiAction.textContent = `Effect set to ${effects[activeEffect]}`;
}

cameraButton.addEventListener("click", startCamera);
calibrateButton.addEventListener("click", startCalibration);
gameButton.addEventListener("click", startGameFromButton);
stagePauseButton.addEventListener("click", startGameFromButton);
fullscreenButton.addEventListener("click", toggleFullscreen);
stageOptionsButton.addEventListener("click", toggleStageOptions);
document.querySelectorAll("[data-profile-preset]").forEach((button) => {
  button.addEventListener("click", () => applyProfilePreset(button.dataset.profilePreset));
});
document.querySelectorAll("[data-stage-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.stageMode);
    currentMoveIndex = 0;
    applyCurrentMove();
    syncStageOptions();
    coachPrompt.textContent = `${modePrompts[activeMode]} The next path has been remade for this mode.`;
  });
});
stageMotionLevel.addEventListener("change", () => {
  motionLevelSelect.value = stageMotionLevel.value;
  backgroundFrame = null;
  if (gameRunning) applyCurrentMove();
  else placeTarget(true);
  coachPrompt.textContent = `Motion level changed to ${stageMotionLevel.options[stageMotionLevel.selectedIndex].text.toLowerCase()}.`;
});
stageAccess.addEventListener("change", () => {
  accessSelect.value = stageAccess.value;
  if (stageAccess.value === "switch") setMode("keyboard");
  if (stageAccess.value === "camera" || stageAccess.value === "dwell") setMode(activeMode === "keyboard" ? "standard" : activeMode);
  if (gameRunning) applyCurrentMove();
  else placeTarget(true);
  syncStageOptions();
});
stageSensitivityRange.addEventListener("input", () => {
  sensitivityRange.value = stageSensitivityRange.value;
  updateMotionFeedback();
});
stageDwellRange.addEventListener("input", () => {
  dwellRange.value = stageDwellRange.value;
});
sparkleButton.addEventListener("click", () => burstFromCurrent(2.8));
profileForm.addEventListener("submit", saveProfile);
profileForm.querySelectorAll('input[name="supports"], #mobilitySelect, #conditionSelect').forEach((input) => {
  input.addEventListener("change", () => {
    syncRequirementsToMovement(true);
    if (gameRunning) applyCurrentMove();
    else {
      movementLabel.textContent = "Movement domains updated for this dancer.";
    }
  });
});
startSessionButton.addEventListener("click", startSession);
stage.addEventListener("pointerdown", lockTrackAtStagePoint);

soundButton.addEventListener("click", () => {
  soundOn = !soundOn;
  soundButton.setAttribute("aria-pressed", String(soundOn));
  soundButton.textContent = soundOn ? "Sound on" : "Sound off";
});

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code) && activeMode === "keyboard") {
    event.preventDefault();
    const step = getMotionLevelSettings().keyboardStep;
    if (event.code === "ArrowLeft") motionPoint.x = Math.max(0.05, motionPoint.x - step);
    if (event.code === "ArrowRight") motionPoint.x = Math.min(0.95, motionPoint.x + step);
    if (event.code === "ArrowUp") motionPoint.y = Math.max(0.08, motionPoint.y - step);
    if (event.code === "ArrowDown") motionPoint.y = Math.min(0.92, motionPoint.y + step);
    motionLevel = Math.max(motionLevel, 0.35);
    dominantZone = "keyboard";
    updateMotionFeedback();
    const rect = stage.getBoundingClientRect();
    addMovement(motionPoint.x * rect.width, motionPoint.y * rect.height, 1.4);
    updateGame();
    mapMovement(true);
  }

  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    if (activeMode === "keyboard" && gameRunning) updateGame();
    else burstFromCurrent(3);
  }
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
    burstFromCurrent(1.5);
  });
});

document.querySelectorAll("[data-effect]").forEach((button) => {
  button.addEventListener("click", () => {
    setEffect(button.dataset.effect);
    burstFromCurrent(2.4);
  });
});

document.querySelectorAll("[data-color]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-color]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    accent = button.dataset.color;
    document.documentElement.style.setProperty("--rose", accent);
    burstFromCurrent(2);
  });
});

gameSelect.addEventListener("change", () => {
  gameName.textContent = gameLabels[gameSelect.value];
  if (gameSelect.value === "paint") setEffect("ribbons", false);
  if (gameSelect.value === "follow") setEffect("stars", false);
  if (gameSelect.value === "freedom") setEffect("flowers", false);
  if (gameRunning) applyCurrentMove();
  else placeTarget(true);
  syncStageOptions();
});

routineSelect.addEventListener("change", () => {
  currentMoveIndex = 0;
  applyCurrentMove();
  movementLabel.textContent = getCurrentMove().purpose;
  syncStageOptions();
});

conditionNotes.addEventListener("input", () => {
  syncRequirementsToMovement(false);
  if (gameRunning) return;
  const prefs = getMovementSupportPreferences();
  const adjustments = [
    prefs.avoidOverhead ? "lower reaches" : "",
    prefs.preferredSide ? `${prefs.preferredSide}-side paths` : "",
    prefs.smallRange ? "small range" : "",
    prefs.avoidCrossing ? "same-side movement" : "",
    prefs.upperBodyOnly ? "upper-body only" : "",
    prefs.noLeftHand ? "left hand removed" : "",
    prefs.noRightHand ? "right hand removed" : "",
    prefs.noLeftFoot ? "left foot removed" : "",
    prefs.noRightFoot ? "right foot removed" : "",
    prefs.slow ? "gentler pacing" : ""
  ].filter(Boolean);
  coachPrompt.textContent = adjustments.length
    ? `Movement support noted: ${adjustments.join(", ")}.`
    : "Add notes like avoid overhead, right arm stronger, small range, or prefers slow prompts.";
});

accessSelect.addEventListener("change", () => {
  if (accessSelect.value === "switch") setMode("keyboard");
  if (accessSelect.value === "camera" || accessSelect.value === "dwell") setMode(activeMode === "keyboard" ? "handPath" : activeMode);
  updateAdaptiveGuide(true);
  placeTarget(true);
  syncStageOptions();
});

handTrackerSelect.addEventListener("change", () => {
  lockedTrack = null;
  markerColor = null;
  markerPoint = null;
  markerConfidence = 0;
  handPoint = null;
  handLandmarks = [];
  trackerConfidence = 0;
  if (handTrackerSelect.value === "pose" && cameraOn) ensurePoseLandmarker();
  if (handTrackerSelect.value === "ai" && cameraOn && activeMode === "handPath") ensureHandLandmarker();
  movementLabel.textContent = handTrackerSelect.value === "pose"
    ? "Pose skeleton mode is on. I will track wrists through shoulders and elbows."
    : handTrackerSelect.value === "marker"
    ? "Use a bright wristband, sticker, or wand. Tap it once on screen to lock tracking."
    : handTrackerSelect.value === "ai"
      ? "AI fingers mode is on. Keep the hand open and visible."
      : "Motion fallback is on. Use larger, clearer movements if possible.";
  updateMotionFeedback();
});

targetRange.addEventListener("input", () => placeTarget());
sensitivityRange.addEventListener("input", () => {
  stageSensitivityRange.value = sensitivityRange.value;
  updateMotionFeedback();
});
dwellRange.addEventListener("input", () => {
  stageDwellRange.value = dwellRange.value;
});
motionLevelSelect.addEventListener("change", () => {
  backgroundFrame = null;
  if (gameRunning) applyCurrentMove();
  else placeTarget();
  coachPrompt.textContent = `${getCurrentMove().coach} I adjusted the path for ${motionLevelSelect.options[motionLevelSelect.selectedIndex].text.toLowerCase()}.`;
  syncStageOptions();
});
timeLimitRange.addEventListener("input", () => {
  if (!gameRunning) {
    timeLeft = Number(timeLimitRange.value);
    updateGameClock();
  }
});
mirrorToggle.addEventListener("change", () => video.classList.toggle("is-not-mirrored", !mirrorToggle.checked));
reducedToggle.addEventListener("change", () => {
  if (reducedToggle.checked) intensityRange.value = Math.min(Number(intensityRange.value), 4);
  updateAdaptiveGuide(true);
});

window.addEventListener("resize", scheduleResize);
window.visualViewport?.addEventListener("resize", scheduleResize);
document.addEventListener("fullscreenchange", () => {
  const isFullscreen = document.fullscreenElement === stage;
  fullscreenButton.setAttribute("aria-pressed", String(isFullscreen));
  fullscreenButton.textContent = isFullscreen ? "Exit full screen" : "Full screen";
  if (!isFullscreen) closeStageOptions();
  scheduleResize();
});

const stageObserver = new ResizeObserver(scheduleResize);
stageObserver.observe(stage);

seedProfilePreset("wheelchair");
resizeCanvas();
applyCurrentMove();
movementLabel.textContent = "Place the camera, start it, calibrate, then choose your dance.";
updateWellness();
updateGameClock();
animate();
const deferStartup = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 1));
deferStartup(loadAppState);
setInterval(updateSessionClock, 500);
