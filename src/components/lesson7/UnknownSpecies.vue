<script setup>
/*
  Mission 4 finale: sonar -> tracking -> observe -> capture -> drawing.
    sonar     pick one of five contacts; an animal is chosen (once - it
              stays assigned through reloads and resets)
    tracking  a short lock-on
    observe   the animal's gif plays for a few seconds; capture it before
              it swims away, or go back to the sonar for another animal
    capture   "writing the frame..."
    drawing   the camera fails, so students draw it and tick when finished

    <UnknownSpecies :m5="state.mission5" @find-another="..." />

  m5 is the saved mission-5 state (reactive); this component updates it.
*/
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import {
  MISSION5_OBSERVE_SECONDS,
  gifSrc,
  mission5SpeciesPool,
  staticSrc,
} from "./expedition.js";

const props = defineProps({
  m5: { type: Object, required: true },
});
const emit = defineEmits(["find-another"]);

const SONAR_SWEEP_SECONDS = 5;
const SWIM_AWAY_SECONDS = 1; // --swim-away-duration in lesson5.css
const TRACKING_MS = 1150;
const CAPTURE_MS = 900;

const species = computed(
  () => mission5SpeciesPool.find((s) => s.id === props.m5.speciesId) ?? null,
);

/* ---------- sonar ---------- */

const CONTACTS = ["A", "B", "C", "D", "E"];
// safe spots inside the radar, shuffled rather than fully random so the
// dots never overlap badly or sit outside the circle
const SAFE_POSITIONS = [
  [26, 28], [43, 20], [67, 27], [77, 43], [73, 67],
  [55, 77], [34, 74], [22, 55], [40, 42], [62, 52],
];
const positions = ref([
  [28, 37], [69, 26], [76, 67], [41, 76], [55, 49],
]);
const sonarActive = ref(true);

// each contact lights up as the sweep (clockwise from the top) passes it
function revealDelay([x, y]) {
  let angle = Math.atan2(x - 50, -(y - 50)) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  return ((angle / 360) * SONAR_SWEEP_SECONDS).toFixed(3) + "s";
}

async function restartSweep() {
  sonarActive.value = false;
  await nextTick();
  requestAnimationFrame(() => (sonarActive.value = true));
}

function randomiseContacts() {
  const shuffled = [...SAFE_POSITIONS].sort(() => Math.random() - 0.5);
  positions.value = CONTACTS.map((_, i) => shuffled[i]);
  restartSweep();
}

/* ---------- choosing the animal ---------- */

function chooseSpeciesOnce() {
  if (species.value) return;
  // avoid animals already watched swimming away, unless none are left
  let candidates = mission5SpeciesPool.filter(
    (s) => !props.m5.skippedSpeciesIds.includes(s.id),
  );
  if (!candidates.length) {
    props.m5.skippedSpeciesIds = [];
    candidates = mission5SpeciesPool;
  }
  props.m5.speciesId =
    candidates[Math.floor(Math.random() * candidates.length)].id;
  props.m5.optionIds = [];
}

let trackingTimer = null;
function selectContact(contactId) {
  if (props.m5.phase !== "sonar") return;
  chooseSpeciesOnce();
  props.m5.contactId = contactId;
  props.m5.observeEnded = false;
  props.m5.phase = "tracking";
  randomiseContacts();
  trackingTimer = setTimeout(() => {
    if (props.m5.phase === "tracking" && props.m5.contactId === contactId)
      props.m5.phase = "observe";
  }, TRACKING_MS);
}

/* ---------- observation window ---------- */

const liveGif = ref("");
const swimming = ref(false);
let observeTimer = null;
let swimTimer = null;

function clearTimers() {
  clearTimeout(observeTimer);
  clearTimeout(swimTimer);
  observeTimer = null;
  swimTimer = null;
  swimming.value = false;
}

// restart the gif from its first frame and start the observation window
function startObservation() {
  clearTimers();
  if (!species.value) return;
  liveGif.value = gifSrc(species.value) + "?t=" + Date.now();
  observeTimer = setTimeout(endObservation, MISSION5_OBSERVE_SECONDS * 1000);
}

function endObservation() {
  observeTimer = null;
  if (props.m5.phase !== "observe") return;
  props.m5.observeEnded = true;
  swimming.value = true;
  swimTimer = setTimeout(() => {
    swimTimer = null;
    swimming.value = false;
  }, SWIM_AWAY_SECONDS * 1000);
}

watch(
  () => [props.m5.phase, props.m5.speciesId],
  ([phase]) => {
    if (phase !== "observe") {
      clearTimers();
      return;
    }
    if (!props.m5.observeEnded && observeTimer === null) startObservation();
  },
  { immediate: true },
);

const lost = computed(() => props.m5.observeEnded && !swimming.value);

function findAnother() {
  if (props.m5.phase !== "observe") return;
  clearTimers();
  if (props.m5.speciesId && !props.m5.skippedSpeciesIds.includes(props.m5.speciesId))
    props.m5.skippedSpeciesIds.push(props.m5.speciesId);
  Object.assign(props.m5, {
    speciesId: "",
    optionIds: [],
    contactId: "",
    observeEnded: false,
    phase: "sonar",
  });
  emit("find-another");
}

/* ---------- capture -> drawing ---------- */

const drawingCheck = ref(null);
let captureTimer = null;

function takePhoto() {
  if (props.m5.phase !== "observe" || props.m5.observeEnded) return;
  clearTimers();
  props.m5.phase = "capture";
  props.m5.drawingFinished = false;
  captureTimer = setTimeout(async () => {
    if (props.m5.phase !== "capture") return;
    props.m5.phase = "drawing";
    await nextTick();
    drawingCheck.value?.focus({ preventScroll: true });
  }, CAPTURE_MS);
}

onBeforeUnmount(() => {
  clearTimers();
  clearTimeout(trackingTimer);
  clearTimeout(captureTimer);
});

defineExpose({ clearTimers });
</script>

<template>
  <!-- SONAR PHASE: the CSS radar can later be swapped for artwork; the
       contacts stay clickable buttons laid over it. -->
  <div v-if="m5.phase === 'sonar'" class="m5-phase">
    <div class="m5-panel">
      <div class="m5-status-strip">
        <span><span class="m5-status-light"></span>Sonar array online</span>
        <span>Scan sector 05</span>
      </div>
      <div class="sonar-layout">
        <div
          class="sonar-radar"
          :class="{ 'sonar-active': sonarActive }"
          aria-label="Sonar display with several detected contacts"
        >
          <span class="sonar-crosshair-x" aria-hidden="true"></span>
          <span class="sonar-crosshair-y" aria-hidden="true"></span>
          <span class="sonar-sweep" aria-hidden="true"></span>
          <span class="sonar-centre" aria-hidden="true"></span>
          <button
            v-for="(contact, i) in CONTACTS"
            :key="contact"
            type="button"
            class="sonar-contact"
            :class="{ selected: m5.contactId === contact }"
            :style="{
              '--contact-x': positions[i][0] + '%',
              '--contact-y': positions[i][1] + '%',
              '--contact-reveal-delay': revealDelay(positions[i]),
            }"
            :aria-label="'Investigate sonar contact ' + contact"
            @click="selectContact(contact)"
          ></button>
        </div>
        <article class="sonar-instructions">
          <h4>Multiple contacts detected</h4>
          <p>
            The sonar cannot identify what is moving through the water. Choose
            one contact to investigate.
          </p>
          <p>
            Once a contact is acquired, that organism stays assigned to your
            expedition even if the page is refreshed or the mission is reset.
          </p>
          <div class="sonar-legend">
            <span>● Yellow pulse = possible biological contact</span>
            <span>◎ Sweep = active sonar scan</span>
          </div>
        </article>
      </div>
    </div>
  </div>

  <div v-else-if="m5.phase === 'tracking'" class="m5-phase">
    <div class="m5-panel tracking-card">
      <div class="tracking-spinner" aria-hidden="true"></div>
      <h4>Tracking selected contact...</h4>
      <p>Matching sonar movement with the live observation feed.</p>
    </div>
  </div>

  <div v-else-if="m5.phase === 'observe'" class="m5-phase">
    <div class="m5-panel">
      <div class="m5-status-strip">
        <span><span class="m5-status-light"></span>Live observation feed</span>
        <span>{{
          m5.contactId ? `Contact ${m5.contactId} acquired` : "Contact acquired"
        }}</span>
      </div>
      <div class="creature-console">
        <div class="creature-feed">
          <span class="live-badge">Live feed</span>
          <img
            :src="liveGif || null"
            :class="{ 'swim-away': swimming, gone: lost }"
            alt="Deep-sea organism selected for observation"
          />
        </div>
        <article v-if="!lost" class="camera-side-card">
          <h4>Visual contact acquired</h4>
          <p>
            Observe the organism carefully. Try to capture a photograph for the
            expedition record before it moves away.
          </p>
          <button
            type="button"
            class="expedition-button capture-button"
            :disabled="m5.observeEnded"
            @click="takePhoto"
          >
            <span>Capture image</span>
          </button>
        </article>
        <article v-else class="camera-side-card">
          <h4>Contact lost</h4>
          <p>
            The organism swam out of range before an image could be captured.
            Return to the sonar to find another animal.
          </p>
          <button
            type="button"
            class="expedition-button capture-button"
            @click="findAnother"
          >
            <span>Find another animal</span>
          </button>
        </article>
      </div>
    </div>
  </div>

  <div v-else-if="m5.phase === 'capture'" class="m5-phase">
    <div class="m5-panel tracking-card">
      <div style="font-size: 4rem" aria-hidden="true">📷</div>
      <h4>Capturing image...</h4>
      <p>Writing observation frame to the expedition record.</p>
    </div>
  </div>

  <div v-else-if="m5.phase === 'drawing'" class="m5-phase">
    <div class="drawing-mission-grid">
      <div class="creature-feed">
        <span class="image-captured-badge">Image Captured</span>
        <img
          :src="species ? staticSrc(species) : null"
          alt="Static image of the deep-sea organism for scientific drawing"
        />
      </div>
      <article class="drawing-instructions-card">
        <h4>Create the expedition record</h4>
        <p>
          Draw the organism from observation. Use the
          <strong>Science Check</strong> panel to review the same
          scientific-drawing rules.
        </p>
        <p>
          The computer is not judging your drawing. The checklist is your
          self-assessment before you complete the expedition.
        </p>
        <label class="drawing-finish-check">
          <input
            ref="drawingCheck"
            v-model="m5.drawingFinished"
            type="checkbox"
          />
          <span>I have finished my scientific drawing.</span>
        </label>
      </article>
    </div>
  </div>
</template>
