<script setup>
/*
  Lesson 3 Part A "Build and complete the yeast data table":
    1. drag the labels into the table (<DragDrop>)
    2. watch the three test videos and type in the results (<InputResponse>)
    3. stop and think about unusual results, then calculate each row's average
    4. interpret the results (<PredictionCheck>), then a final stop and think,
       which shows the Next: Lesson 4 and Save my work buttons.

    <YeastResultsTable @reset="section.reset()" />

  Each step appears once the one before it is done. Every activity is saved
  through its own <Activity :state>; the watched videos and calculated
  averages are saved here.
*/
import { computed, ref, watch } from "vue";
import Activity from "../activities/Activity.vue";
import DragDrop from "../activities/DragDrop.vue";
import DragItem from "../activities/DragItem.vue";
import DropSlot from "../activities/DropSlot.vue";
import InputResponse from "../activities/InputResponse.vue";
import ResponseBox from "../activities/ResponseBox.vue";
import PredictionCheck from "../activities/PredictionCheck.vue";
import McQuestion from "../activities/McQuestion.vue";
import McChoice from "../activities/McChoice.vue";
import StopAndCheck from "../StopAndCheck.vue";
import Button from "../Button.vue";
import { openVideo } from "../../composables/useModal.js";
import { downloadLessonPDF } from "../../composables/usePrintLesson.js";

const emit = defineEmits(["reset"]);

/* ---------- content ---------- */

const labels = [
  { name: "yeast-dv", text: "Circumference of balloon (cm)" },
  { name: "yeast-iv", text: "Temperature (°C)" },
  { name: "yeast-test-1", text: "Test 1" },
  { name: "yeast-test-2", text: "Test 2" },
  { name: "yeast-test-3", text: "Test 3" },
  { name: "yeast-temp-2", text: "2" },
  { name: "yeast-temp-22", text: "22" },
  { name: "yeast-temp-37", text: "37" },
  { name: "yeast-temp-80", text: "80" },
];

const videos = [
  { test: 1, src: "../videos/lesson3/Yeast Timelapse.mp4" },
  { test: 2, src: "../videos/lesson3/Yeast Timelapse 2.mp4" },
  { test: 3, src: "../videos/lesson3/Yeast Timelapse 3.mp4" },
];

// One row per temperature; answers are the correct Test 1-3 results (cm).
const rows = [
  { temp: "2", answers: ["0", "0", "0"] },
  { temp: "22", answers: ["15", "16", "17"] },
  { temp: "37", answers: ["19", "17", "19"] },
  { temp: "80", answers: ["3", "0", "17"] },
].map((row, r) => ({
  ...row,
  cells: row.answers.map((answer, t) => ({
    key: `yeast-result-${r * 3 + t + 1}`,
    answer,
    label: `${row.temp}°C test ${t + 1}`,
  })),
}));

const numberInputProps = {
  step: "any",
  inputmode: "decimal",
  autocomplete: "off",
};

/* ---------- saved here: videos watched, averages calculated ---------- */

const watched = ref({}); // test number -> true
const calculated = ref({}); // row index -> true
const progress = { watched, calculated };

function resetProgress() {
  watched.value = {};
  calculated.value = {};
  averageError.value = false;
}

/* ---------- step 1: labels ---------- */

const labelsActivity = ref(null);
const labelsDone = computed(() => labelsActivity.value?.done ?? false);

/* ---------- step 2: results ---------- */

const resultsActivity = ref(null);

function watchVideo(video) {
  watched.value = { ...watched.value, [video.test]: true };
  openVideo(video.src, `Yeast Experiment - Test ${video.test}`);
}

// the numbers typed into one row, NaN where a cell is empty
function rowNumbers(row) {
  const answers = resultsActivity.value?.getAnswers() ?? {};
  return row.cells.map((cell) => {
    const text = answers[cell.key]?.[0] ?? "";
    return text === "" ? NaN : Number(text);
  });
}

const allEntered = computed(() =>
  rows.every((row) => !rowNumbers(row).some(Number.isNaN)),
);
const resultsCorrect = computed(
  () => resultsActivity.value?.isCorrect() ?? false,
);

/* ---------- step 3: averages ---------- */

const unusualCheck = ref(null);
const averagesShown = computed(() => unusualCheck.value?.pressed ?? false);
const averageError = ref(false);

function average(row) {
  const values = rowNumbers(row);
  const mean =
    values.reduce((total, value) => total + value, 0) / values.length;
  return Number.isInteger(mean)
    ? String(mean)
    : mean.toFixed(1).replace(/\.0$/, "");
}

function calculate(index) {
  if (rowNumbers(rows[index]).some(Number.isNaN)) {
    averageError.value = true;
    return;
  }
  averageError.value = false;
  calculated.value = { ...calculated.value, [index]: true };
}

function clearAverage(index) {
  const { [index]: _, ...rest } = calculated.value;
  calculated.value = rest;
}

// an average goes back to a Calculate button once one of its numbers is cleared
watch(
  () => rows.map((row) => rowNumbers(row).some(Number.isNaN)),
  (missing) =>
    missing.forEach((isMissing, index) => {
      if (isMissing && calculated.value[index]) clearAverage(index);
    }),
);

const allCalculated = computed(() =>
  rows.every((_, index) => calculated.value[index]),
);

/* ---------- table feedback ---------- */

const feedback = computed(() => {
  if (averageError.value)
    return {
      variant: "feedback-try-again",
      title: "Add all three results first.",
      text: "The average can be calculated once each test has a number.",
    };
  if (!allEntered.value) return null;
  if (!resultsCorrect.value)
    return {
      variant: "feedback-try-again",
      title: "Check your measurements.",
      text: "Make sure all your answers are correct before moving on.",
    };
  if (labelsDone.value)
    return {
      variant: "feedback-success",
      title: "Results recorded!",
      text: "All of your measurements are correct.",
    };
  return null;
});

/* ---------- step 4: interpret the results ---------- */

const interpretActivity = ref(null);
const interpretDone = computed(
  () => interpretActivity.value?.isComplete ?? false,
);
const finalCheck = ref(null);
const finished = computed(() => finalCheck.value?.pressed ?? false);

const choices = [
  { value: "increases", text: "Increases" },
  { value: "decreases", text: "Decreases" },
  { value: "same", text: "Does not change" },
];
</script>

<template>
  <Activity
    name="yeast-table-progress"
    :complete="true"
    :state="progress"
    :class="{ 'labels-complete': labelsDone }"
    @reset="resetProgress"
  >
    <div class="yeast-results-step yeast-results-step--initial">
      <div class="yeast-results-step-heading">
        <span>STEP 1</span>
        <div>
          <p class="yeast-results-eyebrow">
            Make a scientific <strong>table</strong> for the yeast fair test.
          </p>
          <h3>Drag and drop the labels into the correct cells on the table.</h3>
        </div>
      </div>
    </div>

    <div class="yeast-results-step pop-in">
      <div class="yeast-results-step-heading">
        <span>STEP 2</span>
        <div>
          <p class="yeast-results-eyebrow">Record the results</p>
          <h3>Watch each repeat test</h3>
        </div>
      </div>

      <p class="yeast-results-instruction">
        Watch each video and enter the balloon circumference measurements into
        the correct column of your <strong>table</strong>.
      </p>

      <div class="yeast-results-video-grid">
        <Button
          v-for="video in videos"
          :key="video.test"
          class="watch-video-button"
          :class="{ 'video-watched': watched[video.test] }"
          symbol="▶"
          @click="watchVideo(video)"
        >
          <p>Test {{ video.test }}{{ watched[video.test] ? " ✓" : "" }}</p>
        </Button>
      </div>
    </div>

    <div id="labelsCompleteAfterContainer">
      <StopAndCheck
        v-if="labelsDone && allEntered && resultsCorrect"
        ref="unusualCheck"
        id="yeastLabelsStopAndCheck"
        name="unusual-results-check"
      >
        <template #content>
          <p>
            Look at the <strong>data</strong> in the
            <strong>table</strong> below.
          </p>
          <p>
            <strong>
              Are there any strange or unusual results when you compare Test 1,
              Test 2 and Test 3?
            </strong>
          </p>
          <p>Think about why repeated results might sometimes be different.</p>
        </template>
        <template #answer>
          Some of the repeated results are different. At
          <strong>37°C</strong>, Test 2 is lower than Tests 1 and 3. At
          <strong>80°C</strong>, the results are very different. This could be
          from a setup mistake or a measuring mistake.
        </template>
      </StopAndCheck>

      <div v-if="averagesShown" id="repeat-tests-average-intro" class="pop-in">
        <div class="yeast-results-step-heading">
          <span>3</span>
          <div>
            <p class="yeast-results-eyebrow">Calculate the average results</p>
            <h3>
              Calculate the average results for the three tests of each
              temperature in the yeast fair test experiment.
            </h3>
          </div>
        </div>

        <p>
          You can try working out the averages yourself or use the
          <strong>calculate</strong> button in the <strong>table</strong> below.
        </p>

        <div class="average-worked-example">
          <p class="average-example-label">Worked example — 22°C</p>
          <p>
            Calculating the average size of the balloon circumference at 22°C:
          </p>

          <div class="average-example-steps">
            <div class="average-equation">
              <span class="average-equation-left"
                ><strong>Average</strong> =</span
              >
              <span class="math-fraction">
                <span class="math-numerator">Test 1 + Test 2 + Test 3</span>
                <span class="math-denominator">number of tests</span>
              </span>
            </div>
            <div class="average-equation">
              <span class="average-equation-left">=</span>
              <span class="math-fraction">
                <span class="math-numerator">15 cm + 16 cm + 17 cm</span>
                <span class="math-denominator">3</span>
              </span>
            </div>
            <div class="average-equation">
              <span class="average-equation-left">=</span>
              <span class="math-fraction">
                <span class="math-numerator">48 cm</span>
                <span class="math-denominator">3</span>
              </span>
            </div>
            <div class="average-equation average-equation-result">
              <span class="average-equation-left">=</span>
              <strong>16 cm</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DragDrop
      ref="labelsActivity"
      id="yeastActivity"
      name="yeast-labels"
      class="diagram-activity"
      strict
    >
      <div
        id="yeastLabelBank"
        class="label-bank table-label-bank"
        data-dd-tray
        aria-label="Labels to place in the yeast experiment table"
      >
        <p class="dd-tray-heading">Label Bank</p>
        <DragItem
          v-for="label in labels"
          :key="label.name"
          tag="button"
          class="general-button drag-label"
          :name="label.name"
        >
          {{ label.text }}
        </DragItem>
      </div>

      <div class="data-table-card yeast-table-card">
        <div class="experiment-table-scroll">
          <table
            class="experiment-table yeast-table"
            aria-label="Yeast experiment drag and drop data table"
          >
            <thead>
              <tr>
                <th class="independent-heading" rowspan="2">
                  <DropSlot
                    tag="span"
                    class="label-drop-zone"
                    name="yeast-iv"
                    answer="yeast-iv"
                  >
                    Drop label
                  </DropSlot>
                </th>
                <th class="dependent-heading drop-heading" colspan="4">
                  <DropSlot
                    tag="span"
                    class="label-drop-zone"
                    name="yeast-dv"
                    answer="yeast-dv"
                  >
                    Drop label
                  </DropSlot>
                </th>
              </tr>
              <tr>
                <th v-for="test in 3" :key="test" class="test-heading">
                  <DropSlot
                    tag="span"
                    class="label-drop-zone"
                    :name="`yeast-test-${test}`"
                    :answer="`yeast-test-${test}`"
                  >
                    Drop label
                  </DropSlot>
                </th>
                <th class="average-heading">Average</th>
              </tr>
            </thead>

            <InputResponse
              ref="resultsActivity"
              tag="tbody"
              id="yeastResultsActivity"
              name="yeast-results"
            >
              <tr v-for="(row, index) in rows" :key="row.temp">
                <th class="independent-value">
                  <DropSlot
                    tag="span"
                    class="label-drop-zone"
                    :name="`yeast-temp-${row.temp}`"
                    :answer="`yeast-temp-${row.temp}`"
                  >
                    Drop label
                  </DropSlot>
                </th>
                <ResponseBox
                  v-for="cell in row.cells"
                  :key="cell.key"
                  tag="td"
                  :group-key="cell.key"
                  :min="1"
                  :max="1"
                  :answer="cell.answer"
                  type="number"
                  input-class="table-number-input table-number-control"
                  :input-props="numberInputProps"
                  :aria-label="cell.label"
                  list-class="table-result-list"
                />
                <td
                  class="average-cell"
                  :class="{ 'average-result': calculated[index] }"
                >
                  <div v-if="calculated[index]" class="average-result-wrapper">
                    <span class="average-result-value">{{ average(row) }}</span>
                    <button
                      type="button"
                      class="average-clear-button"
                      aria-label="Clear calculated average"
                      @click="clearAverage(index)"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    v-else-if="averagesShown"
                    type="button"
                    class="average-button general-button"
                    @click="calculate(index)"
                  >
                    Calculate
                  </button>
                </td>
              </tr>
            </InputResponse>
          </table>
        </div>

        <div
          v-if="feedback"
          id="yeastLabelFeedback"
          class="activity-feedback table-activity-feedback"
          :class="feedback.variant"
        >
          <strong>{{ feedback.title }}</strong>
          <span>{{ feedback.text }}</span>
        </div>
      </div>
    </DragDrop>

    <PredictionCheck
      v-if="allCalculated"
      ref="interpretActivity"
      id="yeastPredictionCheck"
      name="yeast-interpretation"
      prediction="As the temperature increases, the amount of gas made by yeast increases. This is because living things need to be warm to survive."
      answer="partly-supported"
    >
      <h3>Use the data to describe the results</h3>

      <McQuestion name="low-temps" answer="increases">
        <p>
          As the temperature increases from <strong>2°C to 37°C</strong>, the
          amount of gas made by yeast:
        </p>
        <div class="prediction-buttons">
          <McChoice
            v-for="choice in choices"
            :key="choice.value"
            :value="choice.value"
            class="prediction-button"
          >
            {{ choice.text }}
          </McChoice>
        </div>
      </McQuestion>

      <McQuestion name="high-temp" answer="decreases">
        <p>
          At <strong>80°C</strong>, the amount of gas made compared with
          <strong>37°C</strong>:
        </p>
        <div class="prediction-buttons">
          <McChoice
            v-for="choice in choices"
            :key="choice.value"
            :value="choice.value"
            class="prediction-button"
          >
            {{ choice.text }}
          </McChoice>
        </div>
      </McQuestion>
    </PredictionCheck>

    <StopAndCheck
      v-if="interpretDone"
      ref="finalCheck"
      id="yeastHotStopAndThink"
      name="hot-yeast-check"
    >
      <template #content>
        <p>
          From <strong>2°C to 37°C</strong>, yeast activity increased and the
          balloons became bigger.
        </p>
        <p>
          <strong>
            Why do you think yeast activity was so low in the test at 80°C?
          </strong>
        </p>
      </template>
      <template #answer>
        Yeast is a living thing. At <strong>80°C</strong>, the temperature is
        too hot for the yeast to survive, so yeast activity slows down and
        stops.
      </template>
    </StopAndCheck>

    <div class="reset-button-container lesson3-reset-container">
      <Button :is-reset="true" @click="emit('reset')" />
    </div>

    <template v-if="finished">
      <Button class="next-page-button" to="/lesson4"> Next: Lesson 4 </Button>
      <Button class="save-work-button" symbol="💾" @click="downloadLessonPDF">
        <p>Save my work</p>
      </Button>
    </template>
  </Activity>
</template>

<style scoped>
/* Step 2 and the number boxes stay hidden until every label is placed */
.labels-complete .yeast-results-step {
  display: block;
}

:deep(.table-number-control) {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.labels-complete :deep(.table-number-control) {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}
</style>
