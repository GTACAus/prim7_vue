<script setup>
/*
  Lesson 7: the Expedition Log game. Four missions, each a series of stages
  shown one at a time in the centre console:
    - mission log (left): missions, the current mission's stages, depth
    - stage console (centre): the stage, then CHECK / RESET / NEXT
    - Science Check (right): drawing rules, unlocked by Mission 2 stage 4
  CHECK validates the current stage (see stage types in expedition.js) and
  logs it; NEXT moves to the next stage, or unlocks the next mission.

    <Expedition :glossary="glossary" />

  Progress (one reactive object, see createFreshState) is saved to
  localStorage under prim7:lesson7. The hidden teacher menu (click the
  lesson title five times) jumps to / unlocks missions.
*/
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  watch,
  watchEffect,
} from "vue";
import Modal from "../Modal.vue";
import DragDrop from "../activities/DragDrop.vue";
import DragItem from "../activities/DragItem.vue";
import DropSlot from "../activities/DropSlot.vue";
import StudentEntry from "../StudentEntry.vue";
import MissionStage from "./MissionStage.vue";
import RustSymbolMatch from "./RustSymbolMatch.vue";
import RustDiagram from "./RustDiagram.vue";
import UnknownSpecies from "./UnknownSpecies.vue";
import FieldGuide from "./FieldGuide.vue";
import { openGlossary, openModal } from "../../composables/useModal.js";
import {
  FROGFISH_LABELS,
  RUST_SYMBOL_ROUNDS,
  SCIENCE_CHECK_RULES,
  createFreshState,
  mission5SpeciesPool,
  missionConfig,
  staticSrc,
} from "./expedition.js";

const props = defineProps({
  glossary: { type: Object, default: null },
});

const IMG = "../images/lesson5/";

/* ---------- saved state ---------- */

const STORAGE_KEY = "prim7:lesson7";

function load() {
  const fresh = createFreshState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return fresh;
    const state = {
      ...fresh,
      ...saved,
      selections: { ...fresh.selections, ...saved.selections },
      mission5: { ...fresh.mission5, ...saved.mission5 },
    };
    // tracking and capturing are transient: a reload resumes before / after them
    const m5 = state.mission5;
    if (m5.phase === "tracking") m5.phase = m5.speciesId ? "observe" : "sonar";
    if (m5.phase === "capture") m5.phase = "drawing";
    return state;
  } catch (error) {
    console.warn("Could not restore Expedition Log progress:", error);
    return fresh;
  }
}

const state = reactive(load());

watch(
  state,
  () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not save Expedition Log progress:", error);
    }
  },
  { deep: true },
);

const mission = computed(() => missionConfig[state.currentMissionIndex]);
const stage = computed(
  () => mission.value?.stages[state.currentStageIndex] ?? null,
);
const isActive = (id) => state.started && stage.value?.id === id;
const missionIndexOf = (s) => missionConfig.findIndex((m) => m.stages.includes(s));
const isLastStageOf = (s) => {
  const m = missionConfig[missionIndexOf(s)];
  return m.stages[m.stages.length - 1] === s;
};
const stageById = (id) => missionConfig.flatMap((m) => m.stages).find((s) => s.id === id);

/* ---------- feedback ---------- */

const feedback = reactive({}); // stage id -> { variant, title, text }
const marks = reactive({}); // stage id -> "correct" | "incorrect" on the picked card

function clearFeedback() {
  if (stage.value) delete feedback[stage.value.id];
}

const stageScreen = ref(null);
async function scrollToFeedback(stageId) {
  await nextTick();
  const box = stageScreen.value?.querySelector(
    `[data-stage-id="${stageId}"] .stage-feedback`,
  );
  if (!box) return;
  const container = stageScreen.value.getBoundingClientRect();
  const rect = box.getBoundingClientRect();
  if (rect.bottom > container.bottom)
    stageScreen.value.scrollBy({ top: rect.bottom, behavior: "smooth" });
  else if (rect.top < container.top)
    stageScreen.value.scrollBy({ top: rect.top, behavior: "smooth" });
}

/* ---------- multiple-choice stages ---------- */

const CHOICES = {
  "m2-choose-scientific-drawing": [
    { value: "option-1", image: IMG + "mission2/choose_drawing/rust-drawing-option-1.png", alt: "Scientific drawing option 1", title: "Option A" },
    { value: "option-2", image: IMG + "mission2/choose_drawing/rust-drawing-option-3.png", alt: "Scientific drawing option 2", title: "Option B" },
    { value: "option-3", image: IMG + "mission2/choose_drawing/rust-drawing-option-2.png", alt: "Scientific drawing option 3", title: "Option C" },
  ],
  "m4-identify": [
    { value: "perch", image: IMG + "mission4/yellowfin-tuna.png", alt: "Reference fish A", title: "Reference A" },
    { value: "pike-perch", image: IMG + "mission4/yellowperch.png", alt: "Reference fish B", title: "Reference B" },
    { value: "rudd", image: IMG + "mission4/bluestripe-snapper.png", alt: "Reference fish C", title: "Reference C" },
  ],
  "m4-clownfish": [
    { value: "colour", image: IMG + "mission4/clownfish3.png", alt: "Clownfish drawing option A with colour", title: "Drawing A", text: "A colourful representation." },
    { value: "over-detailed", image: IMG + "mission4/clownfish2.png", alt: "Clownfish drawing option B with heavy texture and shading", title: "Drawing B", text: "Lots of texture and decorative detail." },
    { value: "scientific", image: IMG + "mission4/clownfish1.png", alt: "Clownfish drawing option C using clear simple lines and main observable features", title: "Drawing C", text: "Clear lines and the main visible features only." },
  ],
};

/* Correct animal plus two others, shuffled once and saved so a reload keeps them. */
const speciesChoices = computed(() => {
  const m5 = state.mission5;
  if (!m5.speciesId) return [];
  return m5.optionIds.map((id, i) => {
    const species = mission5SpeciesPool.find((s) => s.id === id);
    return {
      value: id,
      image: staticSrc(species),
      alt: "Option " + String.fromCharCode(65 + i),
      title: "Option " + String.fromCharCode(65 + i),
    };
  });
});

watchEffect(() => {
  const m5 = state.mission5;
  if (!m5.speciesId) return;
  if (m5.optionIds.length === 3 && m5.optionIds.includes(m5.speciesId)) return;
  const others = mission5SpeciesPool
    .filter((s) => s.id !== m5.speciesId)
    .map((s) => s.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  m5.optionIds = [...others, m5.speciesId].sort(() => Math.random() - 0.5);
});

const answerOf = (s) => (s.id === "m5-identify" ? state.mission5.speciesId : s.answer);

function choose(stageId, value) {
  const s = stageById(stageId);
  state.selections[s.selectionKey] = value;
  delete marks[stageId];
  // changing a logged answer means it has to be checked again
  if (state.completedStages[stageId]) {
    state.completedStages[stageId] = false;
    if (isLastStageOf(s)) state.completedMissions[missionIndexOf(s)] = false;
  }
  clearFeedback();
}

function choiceClass(stageId, value) {
  const s = stageById(stageId);
  if (state.selections[s.selectionKey] !== value) return null;
  const mark = marks[stageId] ?? (state.completedStages[stageId] ? "correct" : null);
  return ["selected", mark];
}

const fishPreview = computed(() =>
  CHOICES["m4-identify"].find((c) => c.value === state.selections.shallowFish1),
);

/* ---------- drag-and-drop stages ---------- */

const diagramLabels = ref(null);
const batfishLabels = ref(null);
const dragDrops = {
  "m2-drag-and-drop": { ref: diagramLabels, slots: 3 },
  "m4-batfish-labels": { ref: batfishLabels, slots: 5 },
};

function onPlacements(stageId, placements) {
  state.selections[stageById(stageId).selectionKey] = placements;
  clearFeedback();
}

const placedCount = (stageId) =>
  Object.keys(state.selections[stageById(stageId).selectionKey] ?? {}).length;

/* ---------- other stage activities ---------- */

const rustRounds = RUST_SYMBOL_ROUNDS.length;
const symbolIndex = computed({
  get: () => state.selections.rustSymbolMatchTest?.index ?? 0,
  set: (index) => {
    state.selections.rustSymbolMatchTest = { index };
    clearFeedback();
  },
});

function onSymbolIncorrect() {
  feedback["m2-symbol-match"] = {
    variant: "try-again",
    title: "Try again",
    text: "That symbol does not match the highlighted part. Look carefully at its shape and try another symbol.",
  };
}

const frogfishDone = computed(() =>
  FROGFISH_LABELS.every((l) => state.selections.frogfishLabels[l.key]?.length),
);

watch(
  () => JSON.stringify(state.selections.frogfishLabels),
  () => {
    // changing a submitted answer means CHECK again before NEXT
    if (!frogfishDone.value && state.completedStages["m4-frogfish-labels"]) {
      state.completedStages["m4-frogfish-labels"] = false;
      state.completedMissions[2] = false;
    }
    clearFeedback();
  },
);

watch(() => state.mission5.drawingFinished, clearFeedback);

const rusted = ref(false); // the Mission 2 camera: working gif or rusted photo

/* "Go to shallow waters": bubbles, then the shallow-water footage loops. */
const showBubbles = ref(false);
const bubblesVisible = ref(false);
const waterVisible = ref(false);
const bubblesVideo = ref(null);
const waterVideo = ref(null);
let waterTimers = [];

function clearWaterTimers() {
  waterTimers.forEach(clearTimeout);
  waterTimers = [];
}

async function goShallowWaters() {
  clearWaterTimers();
  state.selections.shallowWatersPressed = true;
  showBubbles.value = true;
  bubblesVisible.value = false;
  waterVisible.value = false;
  clearFeedback();
  await nextTick();
  waterTimers.push(
    setTimeout(() => {
      waterVideo.value?.play().catch(() => {});
      bubblesVisible.value = false;
      waterVisible.value = true;
      waterTimers.push(setTimeout(() => (showBubbles.value = false), 300));
    }, 1500),
  );
}

function playBubbles() {
  if (!showBubbles.value) return;
  bubblesVisible.value = true;
  bubblesVideo.value?.play().catch(() => {});
}

function resetShallowWaters() {
  clearWaterTimers();
  showBubbles.value = false;
  bubblesVisible.value = false;
  waterVisible.value = false;
  state.selections.shallowWatersPressed = false;
}

/* ---------- CHECK / RESET / NEXT ---------- */

function validate(s) {
  switch (s.type) {
    case "read":
      return true;
    case "multiple-choice":
      return Boolean(answerOf(s)) && state.selections[s.selectionKey] === answerOf(s);
    case "button-reveal":
      return state.selections.shallowWatersPressed;
    case "text-response":
      return frogfishDone.value;
    case "dragdrop":
      return dragDrops[s.id].ref.value?.done ?? false;
    case "item-match":
      return symbolIndex.value >= rustRounds;
    case "finale":
      return state.mission5.phase === "drawing" && state.mission5.drawingFinished;
    default:
      return false;
  }
}

function tryAgainMessage(s) {
  if (s.tryAgainMessage) return s.tryAgainMessage;
  switch (s.type) {
    case "multiple-choice":
      return "That does not match the current scientific criteria. Review the options and try again.";
    case "button-reveal":
      return "Press the button before checking.";
    case "dragdrop":
      return placedCount(s.id) === dragDrops[s.id].slots
        ? "Some labels are on the wrong part of the diagram. Follow each line back to its part and try again."
        : "Drag every label to the end of its line before checking.";
    case "item-match":
      return "Select the matching symbol for the photo shown before checking.";
    case "text-response":
      return "Complete all six frogfish labels before checking.";
    case "finale":
      return "Finish your scientific drawing and tick the box to say it is done before completing the expedition.";
    default:
      return "Review the current stage and try again.";
  }
}

const frogfishOpen = ref(false);

function check() {
  const s = stage.value;
  if (!s) return;

  // once the frogfish is done, CHECK reopens the comparison example
  if (s.id === "m4-frogfish-labels" && state.completedStages[s.id]) {
    frogfishOpen.value = true;
    return;
  }

  if (!validate(s)) {
    feedback[s.id] = { variant: "try-again", title: "Not quite yet", text: tryAgainMessage(s) };
    if (s.type === "multiple-choice") marks[s.id] = "incorrect";
    scrollToFeedback(s.id);
    return;
  }

  state.completedStages[s.id] = true;

  if (s.type === "finale") {
    // Complete moves straight on to identifying the animal
    unlockStage(state.currentStageIndex + 1);
    state.currentStageIndex++;
    return;
  }

  const isLast = state.currentStageIndex === mission.value.stages.length - 1;
  if (isLast) state.completedMissions[state.currentMissionIndex] = true;

  const finalMission = state.currentMissionIndex === missionConfig.length - 1;
  feedback[s.id] = {
    variant: "success",
    title: s.successTitle || (isLast ? "Mission complete" : "Stage complete"),
    text:
      s.successMessage ||
      (isLast
        ? finalMission
          ? "You have reached the end of the current concept flow."
          : "This mission is complete. NEXT will unlock the next mission."
        : "This stage is complete. NEXT will move to the next part of the same mission."),
  };
  if (s.type === "multiple-choice") marks[s.id] = "correct";
  scrollToFeedback(s.id);

  if (s.id === "m4-frogfish-labels") frogfishOpen.value = true;
}

function unlockStage(index) {
  const mi = state.currentMissionIndex;
  state.unlockedStageIndices[mi] = Math.max(state.unlockedStageIndices[mi], index);
}

function next() {
  const s = stage.value;
  if (!s || !state.completedStages[s.id]) return;
  const mi = state.currentMissionIndex;
  const isLast = state.currentStageIndex === mission.value.stages.length - 1;

  if (!isLast) {
    unlockStage(state.currentStageIndex + 1);
    state.currentStageIndex++;
    return;
  }
  if (!state.completedMissions[mi] || mi >= missionConfig.length - 1) return;

  state.unlockedMissionIndex = Math.max(state.unlockedMissionIndex, mi + 1);
  state.currentMissionIndex = mi + 1;
  state.currentStageIndex = 0;
}

const openFish = ref(null); // the field guide's open species file
const unknownSpecies = ref(null);

function reset() {
  const s = stage.value;
  if (!s) return;

  if (s.id === "m5-field-guide") {
    openFish.value = null; // RESET is "Close info" here
    return;
  }
  if (s.id === "m5-finale" || s.id === "m5-identify") {
    state.completedStages["m5-field-guide"] = false;
    state.completedMissions[3] = false;
  }

  state.completedStages[s.id] = false;
  if (state.currentStageIndex === mission.value.stages.length - 1)
    state.completedMissions[state.currentMissionIndex] = false;

  switch (s.type) {
    case "multiple-choice":
      state.selections[s.selectionKey] = "";
      delete marks[s.id];
      break;
    case "button-reveal":
      resetShallowWaters();
      break;
    case "text-response":
      state.selections.frogfishLabels = {};
      break;
    case "dragdrop":
      state.selections[s.selectionKey] = {};
      dragDrops[s.id].ref.value?.reset();
      break;
    case "item-match":
      symbolIndex.value = 0;
      break;
    case "finale":
      // speciesId is kept on purpose, so Reset does not reroll the animal
      unknownSpecies.value?.clearTimers();
      Object.assign(state.mission5, {
        phase: "sonar",
        contactId: "",
        observeEnded: false,
        drawingFinished: false,
      });
      state.completedStages["m5-identify"] = false;
      state.selections.species = "";
      delete marks["m5-identify"];
      state.unlockedStageIndices[state.currentMissionIndex] = 0;
      state.completedMissions[state.currentMissionIndex] = false;
      break;
  }
  clearFeedback();
}

// reaching the field guide (after identifying the animal) completes the expedition
watchEffect(() => {
  if (stage.value?.id === "m5-field-guide" && state.completedStages["m5-identify"]) {
    state.completedStages["m5-field-guide"] = true;
    state.completedMissions[3] = true;
  }
});

/* ---------- controls ---------- */

function hasInput(s) {
  switch (s.type) {
    case "multiple-choice":
      return Boolean(state.selections[s.selectionKey]);
    case "button-reveal":
      return state.selections.shallowWatersPressed;
    case "text-response":
      return frogfishDone.value;
    case "dragdrop":
      return placedCount(s.id) > 0;
    case "item-match":
      return symbolIndex.value >= rustRounds;
    case "finale":
      return state.mission5.phase === "drawing" && state.mission5.drawingFinished;
    default:
      return true;
  }
}

function hasResettableInput(s) {
  switch (s.type) {
    case "read":
      return Boolean(state.completedStages[s.id]);
    case "text-response":
      return Object.keys(state.selections.frogfishLabels).length > 0;
    case "item-match":
      return symbolIndex.value > 0;
    case "finale":
      return state.mission5.phase !== "sonar" || Boolean(state.completedStages[s.id]);
    default:
      return hasInput(s);
  }
}

const controls = computed(() => {
  const s = stage.value;
  if (!state.started)
    return {
      check: { label: "Check", disabled: true },
      reset: { label: "Reset", disabled: true },
      next: { disabled: true },
      status: ["Stand by.", " Start the expedition to load Mission 1."],
    };

  if (s.id === "m5-field-guide")
    return {
      check: { hidden: true },
      reset: { label: "Close info", disabled: !openFish.value },
      next: { hidden: true },
      status: ["Field guide.", " Select an animal to learn about its adaptations."],
    };

  const completed = Boolean(state.completedStages[s.id]);
  const isLast = state.currentStageIndex === mission.value.stages.length - 1;
  const finalMission = state.currentMissionIndex === missionConfig.length - 1;

  if (s.type === "finale" && !completed) {
    const m5 = state.mission5;
    const status = {
      sonar: ["Unknown Species · Sonar scan.", " Select one detected contact to investigate."],
      tracking: ["Tracking contact.", " Stand by while the observation feed locks on."],
      observe: m5.observeEnded
        ? ["Contact lost.", " The organism swam away. Find another animal on the sonar."]
        : ["Visual contact acquired.", " Observe the organism, then attempt to capture an image."],
      capture: ["Capturing image.", " Writing the observation frame to the expedition record..."],
      drawing: [
        "Camera failure — make a scientific drawing.",
        " Use the Science Check rules, then tick the box when you are finished.",
      ],
    }[m5.phase];
    return {
      check: { label: "Complete", disabled: !hasInput(s) },
      reset: { label: "Reset", disabled: m5.phase === "sonar" && !m5.speciesId },
      next: { disabled: true },
      status,
    };
  }

  const reopensExample = s.id === "m4-frogfish-labels" && completed;
  let status;
  if (!completed)
    status = [`${mission.value.title} · ${s.label}.`, " Complete this stage, then press CHECK."];
  else if (!isLast)
    status = ["Stage logged.", ` Press NEXT to continue through ${mission.value.title}.`];
  else if (finalMission)
    status = [
      "Expedition complete.",
      " This is where the final save/export or teacher review action can be added.",
    ];
  else status = ["Mission logged.", " Press NEXT to unlock the next mission."];

  return {
    check: {
      label: s.type === "finale" ? "Complete" : "Check",
      disabled: reopensExample ? false : completed || !hasInput(s),
    },
    reset: { label: "Reset", disabled: !hasResettableInput(s) && !completed },
    next: { disabled: !completed || (isLast && finalMission) },
    status,
  };
});

/* ---------- navigation ---------- */

function start() {
  state.started = true;
  state.currentMissionIndex = 0;
  state.currentStageIndex = 0;
}

function setMission(index) {
  if (index > state.unlockedMissionIndex) return;
  state.started = true;
  state.currentMissionIndex = index;
  state.currentStageIndex = Math.min(
    state.unlockedStageIndices[index] || 0,
    missionConfig[index].stages.length - 1,
  );
}

function setStage(index) {
  if (index > (state.unlockedStageIndices[state.currentMissionIndex] || 0)) return;
  state.currentStageIndex = index;
}

const missionAvailable = computed(
  () => state.started || state.unlockedMissionIndex > 0,
);

// on narrow screens the stage list sits under the whole mission list
const NARROW = "(max-width: 1100px)";
const media = window.matchMedia(NARROW);
const narrow = ref(media.matches);
const onMedia = () => (narrow.value = media.matches);
media.addEventListener("change", onMedia);

const depth = computed(
  () =>
    Math.round(
      (state.completedMissions.filter(Boolean).length / missionConfig.length) * 100,
    ) + "%",
);

const scienceUnlocked = computed(() =>
  Boolean(state.completedStages["m2-drag-and-drop"]),
);

// bring the mission into view whenever the stage changes
const missionEls = ref([]);
watch(
  () => [state.started, state.currentMissionIndex, state.currentStageIndex],
  async () => {
    if (!state.started) return;
    await nextTick();
    missionEls.value[state.currentMissionIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  },
);

/* ---------- teacher menu ---------- */

const modal = ref(null);
const main = ref(null);

function unlockMissionsUpTo(upTo) {
  for (let i = 0; i <= upTo; i++) {
    state.unlockedMissionIndex = Math.max(state.unlockedMissionIndex, i);
    if (i < upTo) {
      state.unlockedStageIndices[i] = missionConfig[i].stages.length - 1;
      state.completedMissions[i] = true;
    }
  }
  main.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function teacherJump(id) {
  const index = missionConfig.findIndex((m) => m.id === id);
  if (index < 0) return;
  unlockMissionsUpTo(index);
  setMission(index);
}

function teacherShowAll() {
  unlockMissionsUpTo(missionConfig.length - 1);
  missionConfig.forEach((m, i) => (state.unlockedStageIndices[i] = m.stages.length - 1));
}

function teacherResetView() {
  Object.assign(state, createFreshState());
  for (const key of Object.keys(feedback)) delete feedback[key];
  for (const key of Object.keys(marks)) delete marks[key];
  diagramLabels.value?.reset();
  batfishLabels.value?.reset();
  resetShallowWaters();
  unknownSpecies.value?.clearTimers();
  openFish.value = null;
  rusted.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

provide("lessonPage", {
  sections: computed(() =>
    missionConfig.map((m) => ({ id: m.id, label: m.nav.subtitle })),
  ),
  teacherJump,
  teacherShowAll,
  teacherResetView,
});

let teacherClicks = 0;
let teacherTimer = null;
function onDocumentClick(event) {
  if (!event.composedPath().some((node) => node?.id === "teacherTrigger")) return;
  teacherClicks++;
  clearTimeout(teacherTimer);
  if (teacherClicks >= 5) {
    teacherClicks = 0;
    modal.value?.open("teacher", {}, event.target);
  } else {
    teacherTimer = setTimeout(() => (teacherClicks = 0), 1800);
  }
}

/* ---------- full screen ---------- */

const zoomStage = ref(null);
const fullscreen = ref(false);

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else zoomStage.value?.requestFullscreen?.();
}

function onFullscreenChange() {
  fullscreen.value = Boolean(document.fullscreenElement);
  if (fullscreen.value) return;
  // jump (not glide) back to the console after leaving full screen
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  main.value?.scrollIntoView({ block: "start" });
  html.style.scrollBehavior = previous;
}

/* ---------- scroll zoom ----------
   As the console scrolls up from the bottom of the window to the top, it
   stretches from its natural size to (nearly) fill the window, and the page
   header slides away. */

const MAX_WIDTH_FRACTION = 0.97;
const MAX_HEIGHT_FRACTION = 0.98;
const TOP_GAP = 16; // #expedition-main's sticky top
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let natural = { left: 0, width: 0, height: 0 };
let ticking = false;

function measure() {
  const el = main.value;
  if (!el) return;
  el.style.width = "";
  el.style.marginLeft = "";
  el.style.height = "";
  const rect = el.getBoundingClientRect();
  natural = { left: rect.left, width: rect.width, height: rect.height };
  updateZoom();
}

function updateZoom() {
  ticking = false;
  const el = main.value;
  if (!el || !zoomStage.value) return;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const progress = Math.min(
    1,
    Math.max(0, (vh - zoomStage.value.getBoundingClientRect().top) / vh),
  );

  const targetWidth = vw * MAX_WIDTH_FRACTION;
  const targetLeft = (vw - targetWidth) / 2;
  const naturalRight = natural.left + natural.width;
  const left = natural.left + (targetLeft - natural.left) * progress;
  const right = naturalRight + (targetLeft + targetWidth - naturalRight) * progress;
  el.style.width = right - left + "px";
  el.style.marginLeft = left - natural.left + "px";

  const available = vh - TOP_GAP;
  el.style.height =
    Math.min(
      natural.height + (available * MAX_HEIGHT_FRACTION - natural.height) * progress,
      available,
    ) + "px";

  const header = document.querySelector(".page-header");
  if (header) header.style.transform = `translateY(${(-200 * progress).toFixed(2)}%)`;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateZoom);
}

/* ---------- the submarine model in the banner ---------- */

const MODEL_VIEWER = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js";
const submarine = ref(null);
const submarineBox = ref(null);
let glowFrame = null;

function loadModelViewer() {
  if (customElements.get("model-viewer") || document.querySelector(`script[src="${MODEL_VIEWER}"]`)) return;
  const script = document.createElement("script");
  script.type = "module";
  script.src = MODEL_VIEWER;
  document.head.appendChild(script);
}

// the glow follows the submarine round its 9-second loop
function updateGlow() {
  const time = submarine.value?.currentTime || 0;
  const angle = (time / 9) * Math.PI * 2;
  submarineBox.value?.style.setProperty("--glow-x", 50 + Math.sin(angle) * 130 + "%");
  submarineBox.value?.style.setProperty("--glow-y", 50 + Math.cos(angle) * 65 + "%");
  glowFrame = requestAnimationFrame(updateGlow);
}

function onSubmarineLoad() {
  cancelAnimationFrame(glowFrame);
  updateGlow();
}

/* ---------- lifecycle ---------- */

const absolute = (src) => new URL(src, window.location.href).href;

function onKeydown(event) {
  if (event.key === "Escape") frogfishOpen.value = false;
}

onMounted(async () => {
  loadModelViewer();
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("keydown", onKeydown);

  // put saved labels back once the drop slots exist
  await nextTick();
  diagramLabels.value?.setPlacements(state.selections.diagramLabels);
  batfishLabels.value?.setPlacements(state.selections.batfishLabels);

  // after a reload the shallow-water footage just plays (no bubbles)
  if (state.selections.shallowWatersPressed) {
    waterVisible.value = true;
    waterVideo.value?.play().catch(() => {});
  }

  if (reduceMotion) return;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  measure();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick, true);
  document.removeEventListener("fullscreenchange", onFullscreenChange);
  document.removeEventListener("keydown", onKeydown);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", measure);
  media.removeEventListener("change", onMedia);
  clearTimeout(teacherTimer);
  clearWaterTimers();
  cancelAnimationFrame(glowFrame);
  const header = document.querySelector(".page-header");
  if (header) header.style.transform = "";
});
</script>

<template>
  <div ref="zoomStage" class="expedition-zoom-stage" :class="{ 'no-zoom': reduceMotion }">
    <!-- inside the zoom stage so they still show in full screen -->
    <Modal
      ref="modal"
      label="Lesson 7 &middot; Drawing Scientific Diagrams"
      title="Key science language"
      :glossary="props.glossary"
      pdf-label="Project Possum resource"
      note="Jumping between activities changes navigation only. Reset student view clears every answer on this page."
    />

    <!-- Frogfish reference example: shown after students submit their own labels -->
    <div
      id="frogfishExampleModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="frogfishExampleTitle"
      :aria-hidden="!frogfishOpen"
      :style="{ display: frogfishOpen ? 'grid' : 'none' }"
      @click.self="frogfishOpen = false"
    >
      <div class="frogfish-example-content">
        <div class="frogfish-example-header">
          <div>
            <h2 id="frogfishExampleTitle">Compare with an example</h2>
            <p>
              Your labels are not automatically marked right or wrong. Compare
              your descriptions with this example and notice any scientific
              terms you may want to remember.
            </p>
          </div>
          <button
            type="button"
            class="frogfish-example-close"
            aria-label="Close example"
            @click="frogfishOpen = false"
          >
            ×
          </button>
        </div>
        <img
          class="frogfish-example-image"
          :src="IMG + 'mission4/frogfish_answers.png'"
          alt="Example frogfish scientific diagram with labels"
        />
        <div class="frogfish-example-actions">
          <button type="button" class="expedition-button" @click="frogfishOpen = false">
            <span>Continue</span>
          </button>
        </div>
      </div>
    </div>

    <div id="expedition-main" ref="main">
      <header class="expedition-banner" aria-label="Expedition Log header">
        <div ref="submarineBox" class="submarine-container">
          <div class="submarine-glow"></div>
          <model-viewer
            ref="submarine"
            :src="IMG + 'models/cartoon_submarine_animated.glb'"
            alt="Animated cartoon submarine"
            autoplay
            disable-zoom
            shadow-intensity="3"
            exposure="0.5"
            camera-target="auto"
            camera-orbit="135deg 75deg auto"
            field-of-view="40deg"
            @load="onSubmarineLoad"
          ></model-viewer>
        </div>
        <div class="banner-copy">
          <h1>Expedition Log</h1>
          <h2>Deep Sea Explorers</h2>
        </div>
        <div class="banner-actions">
          <button type="button" class="expedition-button" @click="toggleFullscreen">
            <span>{{ fullscreen ? "Close Full Screen" : "Full Screen" }}</span>
          </button>
          <button type="button" class="expedition-button field-guide-button" @click="openGlossary">
            <span>Field guide</span>
          </button>
        </div>
      </header>

      <div class="game-shell">
        <!-- ==================================================
             LEFT: mission navigation / game progress
             ================================================== -->
        <aside class="console-panel mission-nav" aria-label="Mission log">
          <h2 class="console-heading">
            <span class="light" aria-hidden="true"></span>Mission log
          </h2>
          <nav class="mission-list">
            <template v-for="(m, i) in missionConfig" :key="m.id">
              <button
                type="button"
                class="mission-button"
                :class="{
                  active: state.started && i === state.currentMissionIndex,
                  complete: state.completedMissions[i],
                }"
                :data-number="m.nav.number"
                :disabled="i > state.unlockedMissionIndex || !missionAvailable"
                @click="setMission(i)"
              >
                <strong>{{ m.nav.title }}</strong>
                <span>{{ m.nav.subtitle }}</span>
              </button>
              <div
                v-if="state.started && !narrow && i === state.currentMissionIndex"
                class="substage-nav"
                aria-label="Current mission stages"
              >
                <p class="substage-nav-title">Current mission</p>
                <button
                  v-for="(s, si) in m.stages"
                  :key="s.id"
                  type="button"
                  class="substage-button"
                  :class="{
                    active: si === state.currentStageIndex,
                    complete: state.completedStages[s.id],
                  }"
                  :disabled="si > state.unlockedStageIndices[i]"
                  @click="setStage(si)"
                >
                  {{ s.label }}
                </button>
              </div>
            </template>
          </nav>
          <div
            v-if="state.started && narrow"
            class="substage-nav"
            aria-label="Current mission stages"
          >
            <p class="substage-nav-title">Current mission</p>
            <button
              v-for="(s, si) in mission.stages"
              :key="s.id"
              type="button"
              class="substage-button"
              :class="{
                active: si === state.currentStageIndex,
                complete: state.completedStages[s.id],
              }"
              :disabled="si > state.unlockedStageIndices[state.currentMissionIndex]"
              @click="setStage(si)"
            >
              {{ s.label }}
            </button>
          </div>
          <div class="mission-nav-footer">
            <strong>Expedition depth</strong>
            <div class="depth-meter">
              <span>{{ depth }}</span>
              <div class="depth-track" aria-hidden="true">
                <div class="depth-fill" :style="{ width: depth }"></div>
              </div>
            </div>
          </div>
        </aside>

        <!-- ==================================================
             CENTRE: one reusable stage; missions swap inside it
             ================================================== -->
        <section class="console-panel stage-panel" aria-label="Mission stage">
          <div ref="stageScreen" class="stage-screen">
            <section v-if="!state.started" class="start-screen">
              <div class="start-card pop-in">
                <p class="start-eyebrow">Expedition systems online</p>
                <h3>Click start to dive into the deep</h3>
                <p>
                  Move through each mission one stage at a time. CHECK confirms
                  the current stage, RESET clears the current response, and
                  NEXT advances only after the stage is complete.
                </p>
                <button type="button" class="expedition-button start-button" @click="start">
                  <span>Start expedition</span>
                </button>
              </div>
            </section>

            <section
              v-for="(m, i) in missionConfig"
              :id="m.id"
              :key="m.id"
              ref="missionEls"
              class="section expedition-mission"
              :class="{
                active: state.started && i === state.currentMissionIndex,
                locked: i > state.unlockedMissionIndex,
                completed: state.completedMissions[i],
              }"
            >
              <!-- ================= MISSION 1: BRIEFING ================= -->
              <template v-if="m.id === 'mission-1'">
                <MissionStage
                  id="m1-exploration"
                  bar="mission 1: briefing"
                  label="Mission 01"
                  chip="Stage 1 of 2"
                  :active="isActive('m1-exploration')"
                  :feedback="feedback['m1-exploration']"
                >
                  <h3>What is deep sea exploration?</h3>
                  <p class="mission-subtitle">
                    <strong>Did you know?</strong>
                    We know more about the surface of Mars than we do about the
                    deepest parts of our own ocean! Deep sea exploration is how
                    scientists use submarines, robots and underwater cameras to
                    explore the ocean floor.
                  </p>
                  <div class="story-grid">
                    <figure class="media-card">
                      <img :src="IMG + 'mission1/deep-sea.png'" alt="Deep-sea camera used to observe the ocean floor" />
                      <figcaption>The deep-sea</figcaption>
                    </figure>
                    <div class="story-copy">
                      <p>
                        The deep sea has tough conditions: it is extremely dark,
                        cold and has many layers that challenge animals to
                        survive.
                      </p>
                    </div>
                  </div>
                  <div class="story-grid">
                    <div class="story-copy">
                      <h4>Where does the deep sea begin?</h4>
                      <p>
                        The deep sea begins where sunlight can no longer reach
                        underwater. This is generally around
                        <strong>200 metres deep</strong>.
                      </p>
                    </div>
                    <figure class="media-card">
                      <img :src="IMG + 'mission1/hercules-rov.jpg'" alt="Remotely operated vehicle Hercules exploring underwater" />
                      <figcaption>Remotely operated vehicle “Hercules”</figcaption>
                    </figure>
                  </div>
                  <p class="activity-prompt">
                    When you have reviewed the briefing, press <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m1-failure"
                  bar="mission 1: equipment failure"
                  label="Mission 01"
                  chip="Stage 2 of 2"
                  :active="isActive('m1-failure')"
                  :feedback="feedback['m1-failure']"
                >
                  <h3>What can go wrong?</h3>
                  <p class="mission-subtitle">
                    Technology does not always work perfectly in the deep sea.
                    Cameras can fail, footage can become corrupted, and the
                    extreme pressure can damage equipment.
                  </p>
                  <div class="media-compare">
                    <figure class="media-card">
                      <div
                        class="glitch-frame"
                        :style="{ '--glitch-src': `url('${absolute(IMG + 'mission1/camera-footage.webp')}')` }"
                      >
                        <img :src="IMG + 'mission1/camera-footage.webp'" alt="Corrupted camera footage from the remotely operated vehicle Hercules" />
                      </div>
                      <figcaption>Corrupted camera feed</figcaption>
                    </figure>
                    <figure class="media-card">
                      <img :src="IMG + 'mission1/camera-footage.webp'" alt="Clear camera footage from the remotely operated vehicle Hercules" />
                      <figcaption>Clear camera feed</figcaption>
                    </figure>
                  </div>
                  <div class="story-copy" style="margin-top: 16px">
                    <h4>What happens if the image is lost?</h4>
                    <p>
                      If a camera fails, scientists still need a way to
                      preserve what they observed. Careful observations and
                      <strong>scientific drawings</strong> can provide a visual
                      record when photographs or video are unavailable.
                    </p>
                  </div>
                  <p class="activity-prompt">
                    Press <strong>CHECK</strong> when you understand why
                    scientists need another way to record their observations.
                  </p>
                </MissionStage>
              </template>

              <!-- ================= MISSION 2: RUST INVESTIGATION ================= -->
              <template v-else-if="m.id === 'mission-2'">
                <MissionStage
                  id="m2-rust-alert"
                  bar="mission 2: camera damage"
                  label="Mission 02"
                  chip="Stage 1 of 8"
                  :active="isActive('m2-rust-alert')"
                  :feedback="feedback['m2-rust-alert']"
                >
                  <h3>New mission alert</h3>
                  <p class="mission-subtitle">
                    <strong>The submersible camera has been damaged!</strong>
                    Inspect the camera closely and see if you can identify what
                    is happening.
                  </p>
                  <div class="story-copy">
                    <h4>Inspect the camera</h4>
                    <p>
                      Click the camera to switch between the working camera and
                      the damaged camera. Click it again to switch back.
                    </p>
                    <p style="margin-top: 12px">
                      <strong>Can you identify what is going on?</strong>
                    </p>
                  </div>
                  <div class="mission-image-container">
                    <div class="rust-camera-stack">
                      <img class="rust-camera-base" :src="IMG + 'mission2/rusted-hercules.png'" alt="Rusted hercules vessel" />
                      <img
                        class="rust-camera-gif"
                        :src="rusted ? IMG + 'rusted-camera.png' : IMG + 'animations/camera_shutter.gif'"
                        :alt="rusted ? 'Rusted and damaged submersible camera' : 'Working submersible camera animation'"
                        role="button"
                        tabindex="0"
                        :aria-pressed="rusted"
                        title="Click to inspect the camera"
                        style="cursor: pointer"
                        @click="rusted = !rusted"
                        @keydown.enter.space.prevent="rusted = !rusted"
                      />
                    </div>
                  </div>
                  <p class="activity-prompt">
                    When you have inspected the camera, press
                    <strong>CHECK</strong> to reveal the answer.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m2-rust-experiment"
                  bar="mission 2: rust experiment"
                  label="Mission 02"
                  chip="Stage 2 of 8"
                  :active="isActive('m2-rust-experiment')"
                  :feedback="feedback['m2-rust-experiment']"
                >
                  <h3>Rust experiment</h3>
                  <p class="mission-subtitle">
                    You will be investigating what happens to metal when it
                    reacts with different liquids.
                  </p>
                  <figure class="media-card">
                    <img :src="IMG + 'mission2/rust-experiment.png'" alt="Three jars containing iron wool in water, saltwater and oil" />
                    <figcaption>Iron wool in water, saltwater and oil</figcaption>
                  </figure>
                  <div class="story-copy" style="margin-top: 16px">
                    <p>
                      This experiment uses <strong>iron wool</strong> to
                      represent the metal of the deep-sea camera.
                    </p>
                    <p>
                      You will observe what happens to the iron in
                      <strong>three different liquids</strong> over time.
                    </p>
                  </div>
                  <p class="activity-prompt">
                    Review the experiment set-up, then press <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m2-symbol-match"
                  bar="mission 2: scientific symbols"
                  label="Mission 02"
                  chip="Stage 3 of 8"
                  :active="isActive('m2-symbol-match')"
                  :feedback="feedback['m2-symbol-match']"
                >
                  <h3>Draw the experiment using scientific symbols</h3>
                  <p class="mission-subtitle">
                    <strong>Your task:</strong>
                    Identify each highlighted part of the experiment and select
                    the scientific symbol that best represents it.
                  </p>
                  <RustSymbolMatch
                    v-model:index="symbolIndex"
                    @incorrect="onSymbolIncorrect"
                  />
                  <p class="activity-prompt">
                    Match all four parts of the experiment. When all four are
                    complete, press <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m2-drag-and-drop"
                  bar="mission 2: label the diagram"
                  label="Mission 02"
                  chip="Stage 4 of 8"
                  :active="isActive('m2-drag-and-drop')"
                  :feedback="feedback['m2-drag-and-drop']"
                >
                  <h3>Label the scientific diagram</h3>
                  <p class="mission-subtitle">
                    <strong>Your task:</strong>
                    Here is the diagram you built. Drag each label to the end of
                    the line that points to it.
                  </p>
                  <DragDrop
                    :ref="(el) => (diagramLabels = el)"
                    class="dd-activity diagram-label-dd"
                    @change="onPlacements('m2-drag-and-drop', $event)"
                  >
                    <div class="diagram-label-board">
                      <!-- the diagram built in the previous stage -->
                      <RustDiagram
                        class="diagram-label-diagram"
                        view-box="-120 -110 480 440"
                        :pieces="symbolIndex"
                        aria-label="Completed rust experiment diagram"
                      />
                      <svg class="diagram-label-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <line data-dl-line="jar-lid" x1="90" y1="35" x2="74" y2="35"></line>
                        <line data-dl-line="jar" x1="90" y1="50" x2="74" y2="50"></line>
                        <line data-dl-line="steel-wool" x1="90" y1="65" x2="70" y2="58"></line>
                      </svg>
                      <DropSlot name="label-jar-lid" answer="jar-lid" style="--dd-x: 90%; --dd-y: 35%" aria-label="Drop the label for the jar lid here" />
                      <DropSlot name="label-jar" answer="jar" style="--dd-x: 90%; --dd-y: 50%" aria-label="Drop the label for the jar here" />
                      <DropSlot name="label-steel-wool" answer="steel-wool" style="--dd-x: 90%; --dd-y: 65%" aria-label="Drop the label for the steel wool here" />
                    </div>
                    <div class="dd-tray diagram-label-tray" data-dd-tray aria-label="Diagram labels">
                      <DragItem class="m4-label-token" name="jar">Jar</DragItem>
                      <DragItem class="m4-label-token" name="jar-lid">Jar Lid</DragItem>
                      <DragItem class="m4-label-token" name="steel-wool">Steel Wool</DragItem>
                    </div>
                  </DragDrop>
                  <p class="activity-prompt">
                    Place all three labels, then press <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m2-draw-rust-experiment"
                  bar="mission 2: scientific drawing"
                  label="Mission 02"
                  chip="Stage 5 of 8"
                  :active="isActive('m2-draw-rust-experiment')"
                  :feedback="feedback['m2-draw-rust-experiment']"
                >
                  <h3>Draw the rust experiment</h3>
                  <p class="mission-subtitle">
                    <strong>Your task:</strong>
                    Draw a scientific diagram of this experiment.
                  </p>
                  <figure class="media-card">
                    <img :src="IMG + 'mission2/rust-experiment.png'" alt="Rust experiment showing iron wool in water, saltwater and oil" />
                    <figcaption>
                      Use this experiment set-up as the reference for your
                      scientific drawing.
                    </figcaption>
                  </figure>
                  <div class="story-copy" style="margin-top: 16px">
                    <h4>Use your Science Check</h4>
                    <p>
                      Use the checklist you unlocked earlier to help you create
                      your scientific diagram.
                    </p>
                    <p style="margin-top: 10px">
                      Remember to use the scientific symbols you identified in
                      the previous stage.
                    </p>
                  </div>
                  <p class="activity-prompt">
                    When you have finished your scientific drawing, press
                    <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m2-choose-scientific-drawing"
                  bar="mission 2: scientific drawing check"
                  label="Mission 02"
                  chip="Stage 6 of 8"
                  :active="isActive('m2-choose-scientific-drawing')"
                  :feedback="feedback['m2-choose-scientific-drawing']"
                >
                  <h3>Which is the correct scientific drawing?</h3>
                  <p class="mission-subtitle">
                    Compare the drawings below with the experiment. Select the
                    option that best follows the rules of a scientific drawing.
                  </p>
                  <div class="mission-image-container">
                    <img
                      :src="IMG + 'mission2/rust-experiment.png'"
                      alt="Reference image of the rust experiment with iron wool in water, saltwater and oil"
                      style="max-width: 420px"
                    />
                  </div>
                  <p class="activity-prompt">
                    <strong>Your task:</strong>
                    Select the correct scientific drawing of this experiment.
                  </p>
                  <div class="choice-grid" role="group" aria-label="Scientific drawing options">
                    <button
                      v-for="c in CHOICES['m2-choose-scientific-drawing']"
                      :key="c.value"
                      type="button"
                      class="choice-card media-choice"
                      :class="choiceClass('m2-choose-scientific-drawing', c.value)"
                      :aria-pressed="state.selections.rustScientificDrawing === c.value"
                      @click="choose('m2-choose-scientific-drawing', c.value)"
                    >
                      <img class="choice-image" :src="c.image" :alt="c.alt" />
                      <h4>{{ c.title }}</h4>
                    </button>
                  </div>
                  <p class="activity-prompt">
                    Select one drawing, then press <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m2-rust-results"
                  bar="mission 2: experiment results"
                  label="Mission 02"
                  chip="Stage 7 of 8"
                  :active="isActive('m2-rust-results')"
                  :feedback="feedback['m2-rust-results']"
                >
                  <h3>Rust experiment results</h3>
                  <p class="mission-subtitle">
                    Here are the results from the rust experiment after
                    <strong>24 hours</strong>.
                  </p>
                  <figure class="media-card">
                    <img :src="IMG + 'mission2/rust-experiment-after.png'" alt="Rust experiment after 24 hours showing iron wool in water, saltwater and oil" />
                    <figcaption>Rust experiment after 24 hours</figcaption>
                  </figure>
                  <div class="story-copy" style="margin-top: 16px">
                    <h4>What can you conclude?</h4>
                    <p>
                      Compare the iron wool in the three jars. Which liquid
                      caused the most rust?
                    </p>
                    <p style="margin-top: 10px">
                      Which liquid appears to protect the iron from rusting?
                    </p>
                  </div>
                  <p class="activity-prompt">
                    Think about your conclusion, then press
                    <strong>CHECK</strong> to reveal the answer.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m2-camera-fixed"
                  bar="mission 2: fixed camera"
                  label="Mission 02"
                  chip="Stage 8 of 8"
                  :active="isActive('m2-camera-fixed')"
                  :feedback="feedback['m2-camera-fixed']"
                >
                  <h3>Mission 2 Complete</h3>
                  <div class="story-copy">
                    <h4>The camera is fixed!</h4>
                    <p>We used oil on the camera to keep it from rusting.</p>
                  </div>
                  <div
                    v-if="state.selections.shallowWatersPressed"
                    class="shallow-waters-media"
                  >
                    <video
                      v-if="showBubbles"
                      :ref="(el) => (bubblesVideo = el)"
                      :src="'../videos/lesson5/bubbles.mp4'"
                      muted
                      playsinline
                      preload="auto"
                      :class="{ 'is-visible': bubblesVisible }"
                      aria-label="Bubbles rising through the water"
                      @canplay="playBubbles"
                    ></video>
                    <video
                      :ref="(el) => (waterVideo = el)"
                      :src="'../videos/lesson5/shallow-waters.mp4'"
                      muted
                      playsinline
                      loop
                      preload="auto"
                      :class="{ 'is-visible': waterVisible }"
                      aria-label="Camera footage of the shallow ocean waters"
                    ></video>
                  </div>
                  <div
                    v-else
                    role="group"
                    aria-label="Go to shallow waters"
                    style="display: flex; justify-content: center; margin-top: 20px"
                  >
                    <button
                      type="button"
                      class="choice-card media-choice"
                      style="width: 30%"
                      @click="goShallowWaters"
                    >
                      <h4>Press to Go to Shallow Waters</h4>
                    </button>
                  </div>
                  <p class="activity-prompt">
                    Before we go to the deep sea, let's make sure that you can
                    use the camera to capture some animals in the shallow ocean
                    waters.
                  </p>
                </MissionStage>
              </template>

              <!-- ================= MISSION 3: SHALLOW-WATER CAMERA TRIALS ================= -->
              <template v-else-if="m.id === 'mission-4'">
                <MissionStage
                  id="m4-identify"
                  bar="mission 3: shallow-water camera test"
                  label="Mission 03 · Activity 1"
                  chip="Activity 1 of 4"
                  :active="isActive('m4-identify')"
                  :feedback="feedback['m4-identify']"
                >
                  <h3>Camera repaired — test it in shallow water</h3>
                  <div class="m4-preamble">
                    <strong>System update:</strong>
                    The camera repairs are complete. Before taking it back into
                    the deep sea, test it in shallow water where the animals are
                    easier to observe. Watch the camera footage carefully, then
                    identify the fish by comparing its
                    <strong>observable features</strong>.
                  </div>
                  <div class="m4-feature-cues" aria-label="Features to compare">
                    <span>Body shape</span>
                    <span>Fin shape &amp; position</span>
                    <span>Mouth shape</span>
                    <span>Markings</span>
                  </div>
                  <article class="shallow-fish-question">
                    <h4>Live camera observation</h4>
                    <p>
                      Watch the footage, then select the reference fish that
                      best matches the animal shown by the camera.
                    </p>
                    <div class="fish-question-image">
                      <video
                        :src="'../videos/lesson5/visdeurbel-fish-1.mp4'"
                        autoplay
                        muted
                        loop
                        playsinline
                        controls
                        preload="metadata"
                        aria-label="Underwater camera footage showing a fish to identify"
                        style="width: 100%; display: block"
                      >
                        Your browser does not support the video element.
                      </video>
                    </div>
                    <div v-if="fishPreview" class="m4-fish-preview pop-in">
                      <p><strong>{{ fishPreview.title }}</strong></p>
                      <img :src="fishPreview.image" :alt="fishPreview.alt" />
                    </div>
                    <div class="choice-grid" role="group" aria-label="Choose the fish that matches the underwater footage">
                      <button
                        v-for="c in CHOICES['m4-identify']"
                        :key="c.value"
                        type="button"
                        class="choice-card media-choice"
                        :class="choiceClass('m4-identify', c.value)"
                        :aria-pressed="state.selections.shallowFish1 === c.value"
                        @click="choose('m4-identify', c.value)"
                      >
                        <img class="choice-image" :src="c.image" :alt="c.alt" />
                        <h4>{{ c.title }}</h4>
                      </button>
                    </div>
                  </article>
                  <p class="activity-prompt">
                    Select the fish that best matches the footage, then press
                    <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m4-clownfish"
                  bar="mission 3: scientific drawing test"
                  label="Mission 03 · Activity 2"
                  chip="Activity 2 of 4"
                  :active="isActive('m4-clownfish')"
                  :feedback="feedback['m4-clownfish']"
                >
                  <div class="mission-image-zoom-container">
                    <button
                      type="button"
                      class="mission-image-trigger"
                      aria-label="Zoom in on a photo of the clownfish"
                      @click="openModal('image', { src: IMG + 'mission4/clownfish.png', title: 'Clownfish', alt: 'Photo of a clownfish' })"
                    >
                      <img :src="IMG + 'mission4/clownfish.png'" alt="" />
                    </button>
                    <p>Click the image to zoom in</p>
                  </div>
                  <h3>Which clownfish is drawn like a scientist?</h3>
                  <p class="mission-subtitle">
                    A scientific drawing should show the important observable
                    structures clearly. It is not an artwork: colour,
                    decorative shading and unnecessary detail can make the
                    record harder to interpret.
                  </p>
                  <div class="drawing-choice-grid">
                    <button
                      v-for="c in CHOICES['m4-clownfish']"
                      :key="c.value"
                      type="button"
                      class="choice-card m4-clownfish-choice"
                      :class="choiceClass('m4-clownfish', c.value)"
                      :aria-pressed="state.selections.clownfishDiagram === c.value"
                      @click="choose('m4-clownfish', c.value)"
                    >
                      <img class="choice-image" :src="c.image" :alt="c.alt" />
                      <h4>{{ c.title }}</h4>
                      <p>{{ c.text }}</p>
                    </button>
                  </div>
                  <p class="activity-prompt">
                    Choose the best scientific drawing, then press
                    <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m4-batfish-labels"
                  bar="mission 3: guided labelling"
                  label="Mission 03 · Activity 3"
                  chip="Activity 3 of 4"
                  :active="isActive('m4-batfish-labels')"
                  :feedback="feedback['m4-batfish-labels']"
                >
                  <div class="mission-image-zoom-container">
                    <button
                      type="button"
                      class="mission-image-trigger"
                      aria-label="Zoom in on a photo of the red-lipped batfish"
                      @click="openModal('image', { src: IMG + 'mission4/red-lipped-batfish.jpg', title: 'Red-lipped batfish', alt: 'Photo of a red-lipped batfish' })"
                    >
                      <img :src="IMG + 'mission4/red-lipped-batfish.jpg'" alt="" />
                    </button>
                    <p>Click the image to zoom in</p>
                  </div>
                  <h3>Label the red-lipped batfish</h3>
                  <p class="mission-subtitle">
                    The labels are provided for you this time. Follow each
                    leader line from the fish to its end, then drag the correct
                    label beside that line. This is guided practice before you
                    label the next organism independently.
                  </p>
                  <DragDrop
                    :ref="(el) => (batfishLabels = el)"
                    class="dd-activity m4-batfish-dd"
                    @change="onPlacements('m4-batfish-labels', $event)"
                  >
                    <div class="dd-board">
                      <div class="dd-target m4-batfish-target">
                        <span class="dd-caption">Scientific drawing</span>
                        <img
                          class="m4-batfish-diagram"
                          :src="IMG + 'mission4/red-lipped-batfish-diagram.png'"
                          alt="Front-view scientific drawing of a red-lipped batfish with five leader lines for guided labelling"
                        />
                        <!-- drop zones beside the ends of the five leader lines in the 4:3 image -->
                        <DropSlot name="batfish-eye" answer="eye" style="--dd-x: 16.2%; --dd-y: 21.4%; --dd-w: 24.7%" aria-label="Drop the label for the eye here" />
                        <DropSlot name="batfish-dorsal" answer="dorsal-fin" style="--dd-x: 79.7%; --dd-y: 13.1%; --dd-w: 25%" aria-label="Drop the label for the dorsal fin here" />
                        <DropSlot name="batfish-snout" answer="snout" style="--dd-x: 88%; --dd-y: 35.7%; --dd-w: 23%" aria-label="Drop the label for the snout here" />
                        <DropSlot name="batfish-pectoral" answer="pectoral-fin" style="--dd-x: 16%; --dd-y: 86.6%; --dd-w: 24.5%" aria-label="Drop the label for the pectoral fin here" />
                        <DropSlot name="batfish-mouth" answer="mouth" style="--dd-x: 82.5%; --dd-y: 83.1%; --dd-w: 22.5%" aria-label="Drop the label for the mouth and red lips here" />
                      </div>
                    </div>
                    <div class="dd-tray m4-label-tray" data-dd-tray aria-label="Batfish labels">
                      <DragItem class="m4-label-token" name="eye">Eye</DragItem>
                      <DragItem class="m4-label-token" name="mouth">Mouth (red lips)</DragItem>
                      <DragItem class="m4-label-token" name="snout">Snout</DragItem>
                      <DragItem class="m4-label-token" name="dorsal-fin">Dorsal fin</DragItem>
                      <DragItem class="m4-label-token" name="pectoral-fin">Pectoral fin</DragItem>
                    </div>
                  </DragDrop>
                  <p class="activity-prompt">
                    Place all five labels beside the ends of the leader lines,
                    then press <strong>CHECK</strong>.
                  </p>
                </MissionStage>

                <MissionStage
                  id="m4-frogfish-labels"
                  bar="mission 3: independent labelling"
                  label="Mission 03 · Activity 4"
                  chip="Activity 4 of 4"
                  :active="isActive('m4-frogfish-labels')"
                  :feedback="feedback['m4-frogfish-labels']"
                >
                  <div class="mission-image-zoom-container">
                    <button
                      type="button"
                      class="mission-image-trigger"
                      aria-label="Zoom in on a photo of the frogfish"
                      @click="openModal('image', { src: IMG + 'mission4/Frogfish.webp', title: 'Frogfish', alt: 'Photo of a frogfish' })"
                    >
                      <img :src="IMG + 'mission4/Frogfish.webp'" alt="" />
                    </button>
                    <p>Click the image to zoom in</p>
                  </div>
                  <h3>Now label the frogfish yourself</h3>
                  <p class="mission-subtitle">
                    This time there is no word bank. Follow each leader line
                    from the frogfish to a blank field and type the scientific
                    label yourself. Use visible structures from the drawing,
                    then press <strong>CHECK</strong> when all six labels are
                    complete.
                  </p>
                  <div class="frogfish-labelling-grid">
                    <div class="frogfish-image-stage">
                      <img
                        class="m4-frogfish-diagram"
                        :src="IMG + 'mission4/frogfish-diagram.png'"
                        alt="Front-view scientific drawing of a frogfish with five leader lines for guided labelling"
                      />
                      <div
                        v-for="entry in FROGFISH_LABELS"
                        :key="entry.key"
                        class="frogfish-label-entry"
                        :style="{
                          '--frog-left': entry.left,
                          '--frog-top': entry.top,
                          '--frog-width': entry.width,
                        }"
                      >
                        <StudentEntry
                          v-model:answers="state.selections.frogfishLabels[entry.key]"
                          :multiple-inputs="false"
                          :maxlength="30"
                          placeholder="Type label"
                          :aria-label="entry.aria"
                          :input-props="{ autocomplete: 'off' }"
                        />
                      </div>
                    </div>
                  </div>
                  <p class="activity-prompt">
                    Label all six structures in your own words. Press
                    <strong>ENTER</strong> or click elsewhere to save each
                    label, then press <strong>CHECK</strong> to compare your
                    work with an example.
                  </p>
                </MissionStage>
              </template>

              <!-- ================= MISSION 4: UNKNOWN SPECIES ================= -->
              <template v-else-if="m.id === 'mission-5'">
                <MissionStage
                  id="m5-finale"
                  bar="unknown contact"
                  label="Mission 04"
                  chip="Final application"
                  :active="isActive('m5-finale')"
                  :feedback="feedback['m5-finale']"
                >
                  <h3>Unknown Species Detected</h3>
                  <p class="mission-subtitle">
                    Sonar has detected movement near the expedition vehicle.
                    Locate a contact, observe the organism, and create a
                    scientific record if the camera system cannot capture it.
                  </p>
                  <UnknownSpecies
                    :ref="(el) => (unknownSpecies = el)"
                    :m5="state.mission5"
                    @find-another="state.selections.species = ''"
                  />
                </MissionStage>

                <MissionStage
                  id="m5-identify"
                  bar="species identification"
                  label="Mission 04"
                  chip="Identify the species"
                  :active="isActive('m5-identify')"
                  :feedback="feedback['m5-identify']"
                >
                  <h3>Which animal did you see?</h3>
                  <p class="mission-subtitle">
                    This is the image the camera recorded. Click the animal you
                    think matches it, then press CHECK.
                  </p>
                  <div class="fish-question-image">
                    <img
                      :src="state.mission5.speciesId ? staticSrc(mission5SpeciesPool.find((s) => s.id === state.mission5.speciesId)) : null"
                      alt="Static image of the organism recorded by the camera"
                    />
                  </div>
                  <div class="choice-grid">
                    <button
                      v-for="c in speciesChoices"
                      :key="c.value"
                      type="button"
                      class="choice-card media-choice"
                      :class="choiceClass('m5-identify', c.value)"
                      :aria-pressed="state.selections.species === c.value"
                      @click="choose('m5-identify', c.value)"
                    >
                      <img class="choice-image" :src="c.image" :alt="c.alt" />
                      <h4>{{ c.title }}</h4>
                    </button>
                  </div>
                  <div
                    v-if="state.completedStages['m5-identify']"
                    class="m5-complete-card pop-in"
                  >
                    <template
                      v-for="species in mission5SpeciesPool.filter((s) => s.id === state.mission5.speciesId)"
                      :key="species.id"
                    >
                      <img :src="staticSrc(species)" alt="Deep-sea organism from the completed expedition" />
                      <div>
                        <p class="mission-label">Expedition complete</p>
                        <h4>Scientific record secured</h4>
                        <p>
                          The camera failed, but your scientific drawing
                          preserved an observation of the organism.
                        </p>
                        <span class="m5-species-reveal">Field guide match: {{ species.name }}</span>
                        <p>{{ species.note }}</p>
                      </div>
                    </template>
                  </div>
                </MissionStage>

                <MissionStage
                  id="m5-field-guide"
                  bar="species archive"
                  :dots="false"
                  :active="isActive('m5-field-guide')"
                  :feedback="feedback['m5-field-guide']"
                >
                  <h3>Deep-Sea Field Guide</h3>
                  <p>Click a creature to learn more about it!</p>
                  <FieldGuide v-model:selected="openFish" />
                  <p class="activity-prompt">
                    Explore the different ocean creatures and discover how their
                    adaptations help them survive! Click CLOSE INFO to hide the
                    information panel.
                  </p>
                </MissionStage>
              </template>
            </section>
          </div>

          <footer class="stage-controls" aria-label="Mission controls">
            <div class="control-status">
              <strong>{{ controls.status[0] }}</strong>{{ controls.status[1] }}
            </div>
            <button
              v-show="!controls.check.hidden"
              id="checkButton"
              type="button"
              class="expedition-button control-button"
              :disabled="controls.check.disabled"
              @click="check"
            >
              <span>{{ controls.check.label }}</span>
            </button>
            <button
              id="resetButton"
              type="button"
              class="expedition-button control-button"
              :disabled="controls.reset.disabled"
              @click="reset"
            >
              <span>{{ controls.reset.label }}</span>
            </button>
            <button
              v-show="!controls.next.hidden"
              id="nextButton"
              type="button"
              class="expedition-button control-button"
              :disabled="controls.next.disabled"
              @click="next"
            >
              <span>Next</span>
            </button>
          </footer>
        </section>

        <!-- ==================================================
             RIGHT: Science Check (reference only)
             ================================================== -->
        <aside
          class="console-panel science-panel"
          :class="{ unlocked: scienceUnlocked }"
          aria-label="Science check"
        >
          <h2 class="console-heading">🔬 Science check</h2>
          <div class="science-body">
            <div class="science-lock">
              <div class="lock-icon" aria-hidden="true">🔒</div>
              <strong>Field drawing checklist locked</strong>
              <p>Unlocks after you complete the scientific symbols activity.</p>
            </div>
            <div class="checkpoint-list">
              <label v-for="rule in SCIENCE_CHECK_RULES" :key="rule" class="checkpoint">
                <input type="checkbox" /> {{ rule }}
              </label>
            </div>
          </div>
          <div class="science-footer">
            <strong>Science Check:</strong> the scientific-drawing rules.
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-actions {
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
</style>
