<script setup>
/*
  Lesson 5 Part A spotlighting survey of Site 1.
    1. "Wait until night" darkens the forest photo; the pointer becomes a torch.
    2. Clicking a hidden animal marks it found and adds it to that animal's
       counter (clicking again un-marks it).
    3. "Check my count" compares each counter with the real number hiding.
       When every count is right the photo returns to day and the counts can
       be shown as stacked counters or laid flat in lines (like a bar graph).

    <SpotlightSurvey ref="survey" name="spotlight-survey" />

  Complete (and exposes countsCorrect) once every count is right. Night, the
  found animals, the check and the stack view are saved through <Activity :state>.
*/
import { computed, nextTick, onMounted, ref } from "vue";
import Activity from "../activities/Activity.vue";
import ContentBox from "../ContentBox.vue";
import Button from "../Button.vue";

const IMG = "../images/lesson4/";

// Hidden animals, positioned over the forest photo.
const hotspots = [
  {
    animal: "Powerful Owl",
    src: "powerful_owl_1.png",
    style: "left: 76%; top: 18%; width: 5%;",
  },
  {
    animal: "Leadbeater's Possum",
    src: "leadbeaters_possum_1.png",
    style: "left: 55%; top: 10%; width: 7%;",
    imgStyle: "transform: scaleX(-1)",
  },
  {
    animal: "Leadbeater's Possum",
    src: "leadbeaters_possum_2.png",
    style: "left: 50.5%; top: 14%; width: 4%;",
  },
  {
    animal: "Leadbeater's Possum",
    src: "leadbeaters_possum_3.png",
    style: "left: 20%; top: 16%; width: 6.5%;",
  },
  {
    animal: "Leadbeater's Possum",
    src: "leadbeaters_possum_4.png",
    style: "left: 26%; top: 14%; width: 4.5%;",
  },
  {
    animal: "Leadbeater's Possum",
    src: "leadbeaters_possum_5.png",
    style: "left: 43%; top: 28%; width: 6%; transform: rotate(-90deg);",
  },
  {
    animal: "Yellow Bellied Glider",
    src: "YBGlider_2.png",
    style: "left: 12%; top: 11%; width: 7%;",
    imgStyle: "transform: scaleX(-1)",
  },
  {
    animal: "Yellow Bellied Glider",
    src: "YBGlider_3.png",
    style: "left: 4%; top: 25%; width: 7%;",
  },
  {
    animal: "Ringtail Possum",
    src: "ringtail_1.png",
    style: "left: 84%; top: 40%; width: 5%; transform: scaleX(-1);",
  },
  {
    animal: "Ringtail Possum",
    src: "ringtail_2.png",
    style: "left: 78%; top: 33%; width: 8%;",
  },
  {
    animal: "Ringtail Possum",
    src: "ringtail_3.png",
    style: "left: 83%; top: 0%; width: 6%; transform: scaleX(-1);",
  },
].map((h) => ({ ...h, src: IMG + h.src }));

// The overlay that colours a found animal is masked to that animal's own sprite.
function overlayStyle(h) {
  const mask = `url("${h.src}")`;
  return {
    maskImage: mask,
    webkitMaskImage: mask,
    transform: h.imgStyle?.replace("transform: ", ""),
  };
}

// One counter per animal type (in the order they appear), plus feral deer,
// which isn't hiding at Site 1 (zero is still data).
const counters = [
  ...new Map(
    hotspots.map((h) => [h.animal, { type: h.animal, src: h.src }]),
  ).values(),
  { type: "Feral Deer", src: IMG + "male_deer_1.png" },
].map((c) => ({
  ...c,
  actual: hotspots.filter((h) => h.animal === c.type).length,
}));

/* ---------- saved state ---------- */

const night = ref(false);
const found = ref([]); // hotspot indexes
const results = ref(null); // { type: correct } from the last check, cleared by a change
const stackMode = ref("bar");
const state = { night, found, results, stackMode };

const counts = computed(() =>
  Object.fromEntries(
    counters.map((c) => [
      c.type,
      found.value.filter((i) => hotspots[i].animal === c.type).length,
    ]),
  ),
);
const countsCorrect = computed(
  () => !!results.value && counters.every((c) => results.value[c.type]),
);

/* ---------- torch ---------- */

const stage = ref(null);
const spot = ref({ x: -50, y: -50 });

function moveTorch(clientX, clientY) {
  const rect = stage.value.getBoundingClientRect();
  spot.value = {
    x: ((clientX - rect.left) / rect.width) * 100,
    y: ((clientY - rect.top) / rect.height) * 100,
  };
}

function onTouch(event) {
  const touch = event.touches[0];
  if (!touch) return;
  moveTorch(touch.clientX, touch.clientY);
  event.preventDefault();
}

/* ---------- searching and counting ---------- */

function toggleFound(index) {
  if (countsCorrect.value) return;
  found.value = found.value.includes(index)
    ? found.value.filter((i) => i !== index)
    : [...found.value, index];
  results.value = null;
}

const intro = ref(null);

async function checkCount() {
  results.value = Object.fromEntries(
    counters.map((c) => [c.type, counts.value[c.type] === c.actual]),
  );
  if (countsCorrect.value) {
    night.value = false;
    stackMode.value = "bar";
    await nextTick();
    intro.value?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

const feedback = computed(() => {
  if (!results.value) {
    return {
      variant: "",
      title: "Use the torch to search first.",
      text: " Set each counter to how many of that animal you found hiding in the photo.",
    };
  }
  if (countsCorrect.value) {
    return {
      variant: "success",
      title: "All counts match!",
      text: " You found and counted every animal correctly.",
    };
  }
  const wrong = counters.find((c) => !results.value[c.type]);
  return {
    variant: "try-again",
    title: wrong.type + " needs another look.",
    text: " Move the torch around the whole photo, then adjust the counter to match what you found.",
  };
});

// The counter dots use each animal's colour from spotlight-game.css.
const colours = ref({});
onMounted(() => {
  const result = {};
  for (const c of counters) {
    const el = stage.value?.querySelector(
      `.animal-hotspot[data-animal="${c.type}"]`,
    );
    const colour =
      el && getComputedStyle(el).getPropertyValue("--animal-colour").trim();
    result[c.type] = colour || "var(--orange)";
  }
  colours.value = result;
});

/* ---------- stacked counters ---------- */

const PALETTE = [
  "var(--yellow)",
  "var(--mint)",
  "var(--blue)",
  "var(--lavender)",
  "var(--green)",
  "var(--purple)",
];
const STRIPS = 12;
const DIAMETER = 46;
const HEIGHT = 7;
const RADIUS = DIAMETER / 2;
const STRIP_WIDTH = ((2 * Math.PI * RADIUS) / STRIPS) * 1.12; // slight overlap hides gaps

const strips = Array.from({ length: STRIPS }, (_, i) => {
  const angle = (360 / STRIPS) * i;
  return {
    width: STRIP_WIDTH + "px",
    height: HEIGHT + "px",
    marginLeft: -(STRIP_WIDTH / 2) + "px",
    transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
    filter: `brightness(${0.72 + 0.28 * Math.max(0, Math.cos((angle * Math.PI) / 180))})`,
  };
});

const unitStyle = {
  "--cylinder-diameter": DIAMETER + "px",
  "--cylinder-height": HEIGHT + "px",
};

function reset() {
  night.value = false;
  found.value = [];
  results.value = null;
  stackMode.value = "bar";
}

defineExpose({ countsCorrect, reset });
</script>

<template>
  <Activity :complete="countsCorrect" :state="state" @reset="reset">
    <div class="challenge-spotlight-game noselect">
      <div class="wrap">
        <div
          id="stage"
          ref="stage"
          class="stage"
          :class="{ 'is-night': night }"
          :style="{ '--x': spot.x + '%', '--y': spot.y + '%', '--r': '140px' }"
          @mousemove="moveTorch($event.clientX, $event.clientY)"
          @mouseleave="spot = { x: -50, y: -50 }"
          @touchmove="onTouch"
        >
          <img
            id="photoDay"
            :src="IMG + 'habitat_day.png'"
            alt="Day Time Habitat"
          />
          <img
            id="photo"
            :src="IMG + 'habitat_night.png'"
            alt="Night Time Habitat"
          />
          <div id="animalLayer" class="animal-layer">
            <button
              v-for="(h, i) in hotspots"
              :key="i"
              type="button"
              class="animal-hotspot"
              :class="{ found: found.includes(i) }"
              :data-animal="h.animal"
              :style="h.style"
              :aria-label="h.animal"
              @click="toggleFound(i)"
            >
              <img :src="h.src" :alt="h.animal" :style="h.imgStyle" />
              <span
                class="animal-overlay"
                aria-hidden="true"
                :style="overlayStyle(h)"
              ></span>
            </button>
          </div>
          <div id="glow" class="glow"></div>
          <div class="moon-light"></div>
          <div v-if="!countsCorrect" id="nightPrompt" class="night-prompt">
            <Button
              id="waitForNightButton"
              :disabled="night"
              symbol="🌙"
              @click="night = true"
              >Wait until night</Button
            >
          </div>
        </div>
      </div>
    </div>

    <template v-if="night || countsCorrect">
      <div
        id="animalCounterPanel"
        class="animal-counter-panel pop-in"
        aria-label="Count the hidden animals"
      >
        <div
          v-for="c in counters"
          :key="c.type"
          class="animal-counter"
          :class="
            results
              ? results[c.type]
                ? 'counter-correct'
                : 'counter-incorrect'
              : null
          "
        >
          <p class="animal-counter-label">{{ c.type }}</p>
          <div class="counter-circle" aria-hidden="true">
            <img class="counter-image" :src="c.src" :alt="c.type" />
            <span
              v-for="n in counts[c.type]"
              :key="n"
              class="counter-dot"
              :style="{ backgroundColor: colours[c.type] }"
            ></span>
          </div>
          <p class="counter-value-text">{{ counts[c.type] }}</p>
        </div>
      </div>

      <div class="reset-button-container">
        <Button @click="checkCount"> Check my count </Button>
      </div>
    </template>

    <div
      class="challenge-feedback"
      :class="feedback.variant"
      role="status"
      aria-live="polite"
    >
      <strong>{{ feedback.title }}</strong
      >{{ feedback.text }}
    </div>

    <template v-if="countsCorrect">
      <ContentBox ref="intro">
        <span class="challenge-step-label">Visualise your data</span>
        <p>
          Look at the counters that show how many of each animal you found. Now
          compare three different ways to visualise or view your data:
        </p>
        <ul>
          <li>Look at the counters in the circles first.</li>
          <li>Click <strong>Show counters stacked up</strong>.</li>
          <li>Click <strong>Show counters laid flat in lines</strong>.</li>
        </ul>
      </ContentBox>

      <div class="stack-buttons-row">
        <Button
          class="stack-toggle-button"
          :class="{ 'stack-active': stackMode === 'bar' }"
          @click="stackMode = 'bar'"
        >
          Show Counters Stacked Up
        </Button>
        <Button
          class="stack-toggle-button"
          :class="{ 'stack-active': stackMode === 'circle' }"
          @click="stackMode = 'circle'"
        >
          Show Counters Laid Flat in Lines
        </Button>
      </div>

      <div class="animal-stack-visual">
        <p class="stack-visual-title">Each counter is one animal you found</p>
        <div
          class="bar-stack-row"
          :class="{ 'circle-mode': stackMode === 'circle' }"
        >
          <div v-for="(c, g) in counters" :key="c.type" class="stack-group">
            <div class="bar-stack-column">
              <div
                v-for="n in counts[c.type]"
                :key="n"
                class="stack-unit"
                :style="{ ...unitStyle, animationDelay: (n - 1) * 0.05 + 's' }"
              >
                <div class="cylinder">
                  <div
                    v-for="(strip, s) in strips"
                    :key="s"
                    class="cylinder-strip"
                    :style="{
                      ...strip,
                      backgroundColor: PALETTE[g % PALETTE.length],
                    }"
                  ></div>
                  <div
                    class="cylinder-top"
                    :style="{ backgroundColor: PALETTE[g % PALETTE.length] }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="bar-stack-label">
              {{ c.type }}<span>{{ counts[c.type] }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Activity>
</template>

<style>
/* Moved from styles/lesson4_styles/lesson4.css. Not scoped: some rules style child components' content. */

.challenge-spotlight-game {
  margin: 0 0 20px;
  width: 100%;
  /* height: 100%; */
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--paper);
}
</style>
