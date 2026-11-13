<script setup>
/*
  Lesson 2 "build your fair test plan": pick what to change, measure and keep
  the same, and watch two experiments (A and B) update as a diagram and a
  blueprint.

    <FairTestBuilder />

  "Check fair test experiment design" lists anything still missing (and keeps
  the list up to date after that). Complete once checked with nothing
  missing. The choices are saved through <Activity :state>.
*/
import { computed, reactive, ref } from "vue";
import Activity from "../activities/Activity.vue";
import Button from "../Button.vue";

const variableConfig = {
  size: {
    label: "Ball size",
    changeOptions: [
      {
        value: "small-large",
        label: "Small ball vs large ball",
        pair: ["small", "large"],
      },
      {
        value: "large-small",
        label: "Large ball vs small ball",
        pair: ["large", "small"],
      },
    ],
    controlOptions: [
      { value: "large", label: "Large ball" },
      { value: "small", label: "Small ball" },
    ],
  },
  material: {
    label: "Ball material",
    changeOptions: [
      {
        value: "basketball-pingpong",
        label: "Rubber vs plastic",
        pair: ["basketball", "pingpong"],
      },
      {
        value: "basketball-tennis",
        label: "Rubber vs furry",
        pair: ["basketball", "tennis"],
      },
      {
        value: "tennis-pingpong",
        label: "Furry vs plastic",
        pair: ["tennis", "pingpong"],
      },
    ],
    controlOptions: [
      { value: "basketball", label: "Rubber" },
      { value: "pingpong", label: "Plastic" },
      { value: "tennis", label: "Furry" },
    ],
  },
  height: {
    label: "Drop height",
    changeOptions: [
      { value: "1-1.5", label: "1 m vs 1.5 m", pair: ["1", "1.5"] },
      { value: "1.5-1", label: "1.5 m vs 1 m", pair: ["1.5", "1"] },
    ],
    controlOptions: [
      { value: "1", label: "1 m" },
      { value: "1.5", label: "1.5 m" },
    ],
  },
  firmness: {
    label: "Squashiness",
    changeOptions: [
      {
        value: "firm-soft",
        label: "Firm ball vs soft ball",
        pair: ["firm", "soft"],
      },
      {
        value: "soft-firm",
        label: "Soft ball vs firm ball",
        pair: ["soft", "firm"],
      },
    ],
    controlOptions: [
      { value: "firm", label: "Firm ball" },
      { value: "soft", label: "Soft ball" },
    ],
  },
  surface: {
    label: "Bounce surface",
    changeOptions: [
      {
        value: "hard-soft",
        label: "Hard surface vs soft surface",
        pair: ["hard-surface", "soft-surface"],
      },
      {
        value: "soft-hard",
        label: "Soft surface vs hard surface",
        pair: ["soft-surface", "hard-surface"],
      },
    ],
    controlOptions: [
      { value: "hard-surface", label: "Hard surface" },
      { value: "soft-surface", label: "Soft surface" },
    ],
  },
};

const measureOutcomes = [
  { value: "bounceHeight", label: "Bounce height" },
  { value: "bounceCount", label: "Number of bounces" },
  { value: "bounceTime", label: "Time spent bouncing" },
];
const measureTools = [
  { value: "measuringTape", label: "Use measuring tape" },
  { value: "ruler", label: "Use ruler" },
  { value: "stopwatch", label: "Use stopwatch" },
  { value: "count", label: "Count the bounces" },
  { value: "video", label: "Record a video" },
  { value: "estimate", label: "Estimate by eye" },
];

const stages = [
  { id: "change", label: "1. Change" },
  { id: "measure", label: "2. Measure" },
  { id: "control", label: "3. Control" },
];

const variables = Object.entries(variableConfig).map(([value, config]) => ({
  value,
  label: config.label,
}));

function initialControls() {
  return {
    size: "large",
    material: "basketball",
    height: "1.5",
    firmness: "firm",
    surface: "hard-surface",
  };
}

const state = reactive({
  stage: "change",
  changeVariable: null,
  changeSelections: {},
  measureOutcome: null,
  measureTool: null,
  selectedControlVariable: null,
  controls: initialControls(),
});
const checked = ref(false); // "Check" pressed at least once

// What <Activity> saves and restores (the refs themselves, so restoring works)
const saved = { plan: state, checked };

const getOptionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label || "Not selected";

/* ---------- controls ---------- */

const changeConfig = computed(() =>
  state.changeVariable ? variableConfig[state.changeVariable] : null,
);
const changeSelected = computed(() =>
  changeConfig.value
    ? state.changeSelections[state.changeVariable] ||
      changeConfig.value.changeOptions[0].value
    : null,
);
const outcomeLabel = computed(() =>
  getOptionLabel(measureOutcomes, state.measureOutcome),
);
const toolLabel = computed(() =>
  getOptionLabel(measureTools, state.measureTool),
);
const controlConfig = computed(() =>
  state.selectedControlVariable &&
  state.selectedControlVariable !== state.changeVariable
    ? variableConfig[state.selectedControlVariable]
    : null,
);

function chooseChange(value) {
  state.changeVariable = value;
  state.selectedControlVariable = null;
  if (!state.changeSelections[value])
    state.changeSelections[value] =
      variableConfig[value].changeOptions[0].value;
}

function chooseMeasure(value) {
  state.measureOutcome = value;
  if (!state.measureTool) state.measureTool = measureTools[0].value;
}

/* ---------- diagram ---------- */

const experiments = computed(() => {
  const a = { ...state.controls };
  const b = { ...state.controls };
  if (state.changeVariable) {
    const pair = changeConfig.value.changeOptions.find(
      (option) => option.value === changeSelected.value,
    ).pair;
    a[state.changeVariable] = pair[0];
    b[state.changeVariable] = pair[1];
  }
  return { a, b };
});

function ballProps(values) {
  return {
    class: [values.material, { soft: values.firmness === "soft" }],
    style: {
      "--size": values.size === "small" ? "82px" : "120px",
      top: values.height === "1" ? "39%" : "21%",
    },
  };
}

const surfaceLabel = (type) =>
  getOptionLabel(variableConfig.surface.controlOptions, type);

/* ---------- copy and blueprint ---------- */

const stageCopy = computed(() => {
  if (state.stage === "change") {
    return {
      prompt: "Choose the one variable that will be different.",
      status:
        "After choosing a variable, its comparison menu appears underneath.",
    };
  }
  if (state.stage === "measure") {
    return {
      prompt: "Choose one outcome to measure.",
      status: "The same measurement-method menu is available for each outcome.",
    };
  }
  return {
    prompt: "Choose the settings that both experiments will share.",
    status: state.changeVariable
      ? `${changeConfig.value.label} cannot be controlled because it is being changed.`
      : "Choose a Change variable first to disable it here.",
  };
});

const blueprintChange = computed(() =>
  state.changeVariable
    ? `${changeConfig.value.label}: ${getOptionLabel(changeConfig.value.changeOptions, changeSelected.value)}`
    : "Not selected yet",
);
const blueprintMeasure = computed(() =>
  state.measureOutcome
    ? `${outcomeLabel.value}: ${toolLabel.value}`
    : "Not selected yet",
);
const blueprintControl = computed(() =>
  Object.keys(variableConfig)
    .filter((key) => key !== state.changeVariable)
    .map(
      (key) =>
        `${variableConfig[key].label}: ${getOptionLabel(variableConfig[key].controlOptions, state.controls[key])}`,
    )
    .join("; "),
);
const measurementNote = computed(() =>
  state.measureOutcome
    ? `${outcomeLabel.value}\n${toolLabel.value}`
    : "Choose what you will measure.",
);

/* ---------- check and reset ---------- */

const missing = computed(() => {
  const found = [];
  if (!state.changeVariable) found.push("a Change variable");
  if (!state.measureOutcome) found.push("a Measure outcome");
  if (!state.measureTool) found.push("a Measurement tool");
  if (!state.selectedControlVariable) found.push("a Control variable");
  return found;
});

const isComplete = computed(() => checked.value && missing.value.length === 0);

function check() {
  checked.value = true;
}

const warningClass = computed(() =>
  missing.value.length === 0 ? "blueprint-success" : "blueprint-warning",
);
const warningStyle = computed(() =>
  missing.value.length === 0
    ? { background: "var(--soft-green)", borderTop: "4px solid var(--green)" }
    : {
        background: "var(--soft-orange)",
        borderTop: "4px solid var(--orange)",
      },
);

function reset() {
  state.stage = "change";
  state.changeVariable = null;
  state.changeSelections = {};
  state.measureOutcome = null;
  state.measureTool = null;
  state.selectedControlVariable = null;
  state.controls = initialControls();
  checked.value = false;
}

defineExpose({ reset, isComplete });
</script>

<template>
  <Activity
    class="bk-area"
    :complete="isComplete"
    :state="saved"
    @reset="reset"
  >
    <div class="bk3-page">
      <nav class="bk3-progress" aria-label="Investigation sections">
        <button
          v-for="stage in stages"
          :key="stage.id"
          type="button"
          class="bk3-progress-step"
          :class="{ active: state.stage === stage.id }"
          @click="state.stage = stage.id"
        >
          {{ stage.label }}
        </button>
      </nav>

      <section class="bk3-top-controls" aria-label="Experiment choices">
        <div id="controlsRoot">
          <template v-if="state.stage === 'change'">
            <p class="control-instruction">What will you change?</p>
            <div class="choice-buttons">
              <Button
                v-for="item in variables"
                :key="item.value"
                class="choice-button"
                :class="{ selected: state.changeVariable === item.value }"
                @click="chooseChange(item.value)"
              >
                {{ item.label }}
              </Button>
            </div>
            <div v-if="changeConfig" class="revealed-menu">
              <div class="revealed-copy">
                <strong>{{ changeConfig.label }}</strong>
                <span
                  >Choose how Experiment A and Experiment B will differ.</span
                >
              </div>
              <div class="bk3-control">
                <label for="changePairSelect">Comparison</label>
                <select
                  id="changePairSelect"
                  :value="changeSelected"
                  @change="
                    state.changeSelections[state.changeVariable] =
                      $event.target.value
                  "
                >
                  <option
                    v-for="option in changeConfig.changeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </template>

          <template v-else-if="state.stage === 'measure'">
            <p class="control-instruction">What will you measure?</p>
            <div class="choice-buttons">
              <Button
                v-for="item in measureOutcomes"
                :key="item.value"
                type="button"
                class="choice-button"
                :class="{ selected: state.measureOutcome === item.value }"
                @click="chooseMeasure(item.value)"
              >
                {{ item.label }}
              </Button>
            </div>
            <div v-if="state.measureOutcome" class="revealed-menu">
              <div class="revealed-copy">
                <strong>{{ outcomeLabel }}</strong>
                <span>Choose how students will measure it.</span>
              </div>
              <div class="bk3-control">
                <label for="measureToolSelect">Measurement method</label>
                <select
                  id="measureToolSelect"
                  :value="state.measureTool"
                  @change="state.measureTool = $event.target.value"
                >
                  <option
                    v-for="option in measureTools"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </template>

          <template v-else>
            <p class="control-instruction">What will you keep the same?</p>
            <div class="choice-buttons">
              <Button
                v-for="item in variables"
                :key="item.value"
                type="button"
                class="choice-button"
                :class="{
                  selected: state.selectedControlVariable === item.value,
                }"
                :disabled="state.changeVariable === item.value"
                @click="state.selectedControlVariable = item.value"
              >
                {{ item.label }}
              </Button>
            </div>
            <p
              v-if="state.changeVariable"
              style="margin-top: 9px; color: var(--muted); font-size: 0.9rem"
            >
              {{ changeConfig.label }} is unavailable here because it is the
              variable being changed.
            </p>
            <div v-if="controlConfig" class="revealed-menu control-editor">
              <div class="revealed-copy">
                <strong>{{ controlConfig.label }}</strong>
                <span
                  >This setting will apply to both Experiment A and Experiment
                  B.</span
                >
              </div>
              <div class="bk3-control">
                <label for="controlValueSelect">Shared value</label>
                <select
                  id="controlValueSelect"
                  :value="state.controls[state.selectedControlVariable]"
                  @change="
                    state.controls[state.selectedControlVariable] =
                      $event.target.value
                  "
                >
                  <option
                    v-for="option in controlConfig.controlOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
            <div v-else class="control-editor control-editor-empty">
              Select a controlled variable to choose the value that both
              experiments will share.
            </div>
          </template>
        </div>
      </section>

      <section class="bk3-main-card">
        <div class="bk3-heading-row">
          <div>
            <h1>Your Experiment</h1>
            <p id="stagePrompt">{{ stageCopy.prompt }}</p>
          </div>
          <p class="bk3-status" id="diagramStatus">{{ stageCopy.status }}</p>
        </div>

        <div class="bk3-canvas" aria-label="Visual experiment builder">
          <div class="ruler" aria-hidden="true"></div>
          <div class="lane-label a">Experiment A</div>
          <div class="lane-label b">Experiment B</div>
          <div class="drop-line a"></div>
          <div class="drop-line b"></div>
          <div
            id="ballA"
            class="ball a"
            v-bind="ballProps(experiments.a)"
          ></div>
          <div
            id="ballB"
            class="ball b"
            v-bind="ballProps(experiments.b)"
          ></div>
          <div id="surfaceA" class="surface a" :class="experiments.a.surface">
            <span>{{ surfaceLabel(experiments.a.surface) }}</span>
          </div>
          <div id="surfaceB" class="surface b" :class="experiments.b.surface">
            <span>{{ surfaceLabel(experiments.b.surface) }}</span>
          </div>
          <div class="measurement-note" id="measurementNote">
            {{ measurementNote }}
          </div>
        </div>
      </section>

      <section class="bk3-blueprint">
        <h2>Fair test experiment design</h2>
        <div class="blueprint-grid">
          <article class="blueprint-card independent-card">
            <strong>Change</strong><span>{{ blueprintChange }}</span>
          </article>
          <article class="blueprint-card dependent-card">
            <strong>Measure</strong><span>{{ blueprintMeasure }}</span>
          </article>
          <article class="blueprint-card control-card">
            <strong>Control</strong><span>{{ blueprintControl }}</span>
          </article>
        </div>
        <div
          v-if="checked"
          class="diagram-box diagram-activity blueprint-message"
          :class="warningClass"
          :style="warningStyle"
        >
          <p v-if="!missing.length" class="success-message">
            You have selected all required options. Your experiment blueprint is
            complete!
          </p>
          <ul v-else>
            <li v-for="item in missing" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="bk3-actions">
          <Button :is-reset="true" @click="reset">Reset</Button>
          <Button class="primary" @click="check"
            >Check fair test experiment design
          </Button>
        </div>
      </section>
    </div>
  </Activity>
</template>

<style scoped>
/* Scoped: the plain p / h1 / button rules below only touch this builder. */
.bk-area {
  margin-bottom: 10px;
}
[hidden] {
  display: none !important;
}

.bk3-page {
  width: min(1440px, calc(100% - 32px));
  margin: 24px auto;
}

.bk3-progress {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 12px;
}
.bk3-progress-step {
  padding: 12px 16px;
  border: 2px solid var(--charcoal);
  border-radius: 14px;
  background: #fff;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 0 var(--charcoal);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}
.bk3-progress-step:not(.active):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--charcoal);
}
.bk3-progress-step.active {
  color: #fff;
  background: var(--purple);
  border-color: var(--purple);
  box-shadow: 0 0px 0 var(--charcoal);
  transform: translateY(2px);
}

.bk3-top-controls {
  background: var(--paper);
  border: 2px solid var(--charcoal);
  border-radius: 18px;
  padding: 14px;
  margin-bottom: 14px;
  box-shadow: 0 6px 0 rgba(48, 51, 47, 0.12);
}
.control-instruction {
  margin: 0 0 10px;
  font-weight: 700;
}
.choice-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.choice-button {
  --padding: 8px 13px;
  --background: #fff;
  --color: var(--charcoal);
  --font-weight: 700;

  --background-hover: var(--soft-purple);
  --translate-amount-hover: -2px;

  --background-active: var(--purple);
  --color-active: #fff;
  --border-color-active: var(--purple);
  --translate-amount-active: 4px;
}

.revealed-menu {
  display: grid;
  grid-template-columns: minmax(170px, 260px) minmax(240px, 440px);
  gap: 12px;
  align-items: end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px dashed var(--line);
}
.revealed-copy strong {
  display: block;
  margin-bottom: 3px;
}
.revealed-copy span {
  color: var(--muted);
  font-size: 0.9rem;
}
.bk3-control {
  display: grid;
  gap: 5px;
}
.bk3-control label {
  font-size: 0.82rem;
  font-weight: 700;
}
.bk3-control select {
  width: 100%;
  min-height: 42px;
  padding: 8px 34px 8px 10px;
  border: 2px solid var(--charcoal);
  border-radius: 10px;
  background: #fff;
  color: var(--charcoal);
}

.control-editor {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px dashed var(--line);
}
.control-editor-empty {
  color: var(--muted);
}

.bk3-main-card,
.bk3-blueprint {
  background: linear-gradient(to bottom, white, var(--soft-blue));
  border: 2px solid var(--charcoal);
  border-radius: 20px;
  box-shadow: 0 7px 0 rgba(48, 51, 47, 0.12);
}
.bk3-main-card {
  padding: 16px;
}
.bk3-heading-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 12px;
}
h1,
h2,
p {
  margin: 0;
}
h1 {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
}
h2 {
  font-size: 1.15rem;
}
.bk3-status {
  max-width: 560px;
  color: var(--muted);
  font-weight: 500;
  text-align: right;
  background: var(--soft-green);
  border: 2px solid var(--charcoal);
  border-radius: 16px;
  box-shadow: 0 4px 0 var(--charcoal);
  padding: 12px;
}

.bk3-canvas {
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border: 2px solid var(--charcoal);
  border-radius: 18px;
  background: linear-gradient(to bottom, #fffdf4 0 88%, #eee7d6 88% 100%);
}
.ruler {
  position: absolute;
  left: 4.5%;
  top: 8%;
  width: 78px;
  height: 70%;

  border: 4px solid var(--charcoal);
  border-radius: 10px;
  background: #fff8c9;
}

/* Horizontal height markers */
.ruler::before,
.ruler::after {
  position: absolute;
  left: 88px;
  width: 72px;

  color: var(--purple);
  font-weight: 700;
  font-size: 1rem;

  /* Put the line above the number */
  padding-top: 7px;
  border-top: 3px solid var(--purple);
}

/*
      The ball at 1.5 m has top: 21%.
      Put its marker lower than the bottom of the ball.
    */
.ruler::before {
  content: "1.5 m";
  top: 32%;
}

/*
      The ball at 1 m has top: 39%.
      Put its marker lower than the bottom of the ball.
    */
.ruler::after {
  content: "1 m";
  top: 58%;
}
.lane-label {
  position: absolute;
  top: 18px;
  transform: translateX(-50%);
  padding: 6px 12px;
  border: 2px solid var(--charcoal);
  border-radius: 999px;
  background: #fff;
  font-weight: 700;
}
.lane-label.a {
  left: 43%;
}
.lane-label.b {
  left: 72%;
}
.drop-line {
  position: absolute;
  top: 17%;
  bottom: 18%;
  border-left: 3px dashed #888;
  opacity: 0.65;
}
.drop-line.a {
  left: 43%;
}
.drop-line.b {
  left: 72%;
}

.ball {
  --size: 110px;
  position: absolute;
  z-index: 3;
  width: var(--size);
  height: var(--size);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 4px solid var(--charcoal);
  box-shadow: 0 8px 0 rgba(48, 51, 47, 0.14);
  transition:
    width 0.25s,
    height 0.25s,
    top 0.25s,
    background 0.25s,
    border-radius 0.25s,
    transform 0.25s;
}
.ball.a {
  left: 43%;
}
.ball.b {
  left: 72%;
}
.ball.basketball {
  background:
    linear-gradient(
      -70deg,
      transparent 48%,
      var(--charcoal) 52.5% 53.5%,
      transparent 50%
    ),
    radial-gradient(
      circle at 2% 160%,
      transparent 56%,
      var(--charcoal) 57% 58%,
      transparent 60%
    ),
    radial-gradient(
      circle at 88% -60%,
      transparent 56%,
      var(--charcoal) 57% 58%,
      transparent 60%
    ),
    linear-gradient(
      20deg,
      transparent 46%,
      var(--charcoal) 49.5% 51.5%,
      transparent 50%
    ),
    #e88d25;
}
.ball.tennis {
  background:
    radial-gradient(
      circle at 50% -5%,
      transparent 54%,
      #fff 55% 59%,
      transparent 60%
    ),
    radial-gradient(
      circle at 50% 105%,
      transparent 54%,
      #fff 55% 59%,
      transparent 60%
    ),
    #cbe934;
}
.ball.pingpong {
  background: radial-gradient(circle at 32% 28%, #fff 0 12%, #f2f2f2 13% 100%);
}
.ball.soft {
  border-radius: 48% 52% 45% 55% / 56% 44% 58% 42%;
  transform: translate(-50%, -50%) scaleY(0.82);
}

.surface {
  position: absolute;
  bottom: 8%;
  width: 28%;
  height: 58px;
  border: 4px solid var(--charcoal);
  border-radius: 10px 10px 4px 4px;
  display: grid;
  place-items: center;
  font-weight: 700;
  transition: background 0.25s;
}
.surface.a {
  left: 29%;
}
.surface.b {
  left: 58%;
}
/* Hard testing surface */
.surface.hard-surface {
  background: repeating-linear-gradient(
    90deg,
    #d5a56e 0 42px,
    #c08d55 42px 45px
  );
}

/* Soft testing surface */
.surface.soft-surface {
  background: repeating-linear-gradient(0deg, #ded7ff 0 7px, #c7b9fa 7px 10px);
}
.measurement-note {
  position: absolute;
  right: 3%;
  top: 42%;
  width: 180px;
  padding: 10px;
  border: 2px dashed var(--purple);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--purple);
  font-weight: 700;
  text-align: center;
  white-space: pre-line;
}

.bk3-blueprint {
  margin-top: 14px;
  padding: 16px;
}
.blueprint-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}
.blueprint-card {
  min-height: 108px;
  padding: 12px;
  border: 2px solid var(--line);
  box-shadow: 0 4px 0 var(--charcoal);
  border-radius: 14px;
  background: #fff;
}
.blueprint-card strong {
  display: block;
  margin-bottom: 6px;
}
.bk3-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
}
.bk3-actions .primary {
  margin-left: auto;
  color: #fff;
  background: var(--purple);
  border-color: var(--purple);
}

@media (max-width: 760px) {
  .bk3-page {
    width: min(100% - 18px, 1440px);
  }
  .bk3-progress {
    grid-template-columns: 1fr;
  }
  .revealed-menu {
    grid-template-columns: 1fr;
  }
  .bk3-heading-row {
    display: grid;
  }
  .bk3-status {
    text-align: left;
  }
  .blueprint-grid {
    grid-template-columns: 1fr;
  }
  .measurement-note {
    display: none;
  }
  .ruler {
    left: 1%;
    transform: scale(0.82);
    transform-origin: top left;
  }
  .lane-label.a,
  .drop-line.a,
  .ball.a {
    left: 45%;
  }
  .lane-label.b,
  .drop-line.b,
  .ball.b {
    left: 76%;
  }
  .surface.a {
    left: 31%;
  }
  .surface.b {
    left: 62%;
  }
}

.blueprint-message {
  position: relative;
  margin-top: 20px;
  color: var(--charcoal);
  font-weight: 800;
}
.blueprint-message.blueprint-warning::before {
  content: "YOU STILL NEED TO SELECT";

  position: absolute;
  top: -16px;
  left: 18px;

  padding: 4px 12px;

  background: var(--orange);
  border: 2px solid var(--line);
  border-radius: 999px;

  color: var(--paper);

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.blueprint-message.blueprint-success::before {
  content: "✅ SUCCESS!";

  position: absolute;
  top: -16px;
  left: 18px;

  padding: 4px 12px;

  background: var(--green);
  border: 2px solid var(--line);
  border-radius: 999px;

  color: var(--charcoal);

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.independent-card {
  border-top: 4px solid var(--yellow);
}
.dependent-card {
  border-top: 4px solid var(--purple);
}
.control-card {
  border-top: 4px solid var(--green);
}
</style>
