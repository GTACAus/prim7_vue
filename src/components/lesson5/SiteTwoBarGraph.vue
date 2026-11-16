<script setup>
/*
  Lesson 5 Part C: graph the Site 2 survey (averages already given).
    1. Drag the right labels onto the x- and y-axes; each settles onto the
       graph as soon as it is right.
    2. Unit check - the graph's scale and categories then appear.
    3. Set each bar's height with a slider, then check all five.
    4. Answer three analysis questions; a summary comparing the sites follows.

    <SiteTwoBarGraph ref="partC" @reset="section.reset()" />

  Exposes barsActive (the section gets .partc-bars-active while the sliders
  are in use). Every step is an activity that saves itself.
*/
import { computed, nextTick, ref, watch } from "vue";
import Button from "../Button.vue";
import DragDrop from "../activities/DragDrop.vue";
import DragItem from "../activities/DragItem.vue";
import DropSlot from "../activities/DropSlot.vue";
import MultipleChoice from "../activities/MultipleChoice.vue";
import McQuestion from "../activities/McQuestion.vue";
import McChoice from "../activities/McChoice.vue";
import BarGraphFrame from "./BarGraphFrame.vue";
import BarSliders from "./BarSliders.vue";
import AnalysisQuestions from "./AnalysisQuestions.vue";
import { PLOT, SITE_2, CHOICE_CLASSES, barBox, yOf } from "./barGraph.js";

const emit = defineEmits(["reset"]);

const AXIS_CARDS = [
  { name: "animal", text: "Type of animal" },
  { name: "number", text: "Number of animals" },
  { name: "night", text: "Night number" },
  { name: "average", text: "Average" },
];

const SLIDER_ROWS = SITE_2.map((item) => ({
  label: item.label,
  targets: { default: item.average },
}));

const QUESTIONS = [
  {
    name: "leadbeaters",
    prompt: "How many Leadbeater's Possums were found on average at Site 2?",
    answer: "1",
    choices: [
      { value: "0", text: "0 animals" },
      { value: "1", text: "1 animal" },
      { value: "2", text: "2 animals" },
    ],
    gridClass: "three-choice",
    incorrectTitle: "Look at the Leadbeater's Possum bar.",
    incorrectText: " Read its height using the y-axis.",
  },
  {
    name: "deer",
    prompt: "How many feral deer were found on average at Site 2?",
    answer: "3",
    choices: ["2", "3", "4"].map((v) => ({ value: v, text: v + " animals" })),
    gridClass: "three-choice",
    incorrectTitle: "Look at the feral deer bar.",
    incorrectText: " Read its height using the y-axis.",
  },
  {
    name: "site",
    prompt: "Which site had more Leadbeater's Possums?",
    answer: "site1",
    choices: [
      { value: "site1", text: "Site 1" },
      { value: "site2", text: "Site 2" },
    ],
    incorrectTitle: "Compare the Leadbeater's Possum results.",
    incorrectText: " Site 1 averaged 6 and Site 2 averaged 1.",
  },
];

/* ---------- the steps ---------- */

const axes = ref(null);
const unit = ref(null);
const sliders = ref(null);
const analysis = ref(null);

const placements = computed(() => axes.value?.getPlacements() ?? {});
const xReady = computed(() => placements.value.x === "animal");
const yReady = computed(() => placements.value.y === "number");
const axesDone = computed(() => xReady.value && yReady.value);
const unitDone = computed(
  () => axesDone.value && (unit.value?.isComplete ?? false),
);
const barsDone = computed(
  () => unitDone.value && (sliders.value?.isComplete ?? false),
);
const analysisDone = computed(() => analysis.value?.isComplete ?? false);

const stepLabel = computed(() => {
  if (barsDone.value) return "Bars complete ✓";
  if (unitDone.value) return "Step 3 · Use the slider to build the bars";
  if (axesDone.value) return "Step 2 · Check the units";
  return "Step 1 · Label the axes";
});

/* ---------- bars from the sliders ---------- */

const values = computed(
  () => sliders.value?.values.default ?? SITE_2.map(() => 0),
);
const checked = computed(
  () => sliders.value?.checked.default ?? SITE_2.map(() => null),
);
const correctBars = computed(() =>
  SITE_2.map((_, i) => i).filter((i) => checked.value[i] === true),
);

/* ---------- analysis ---------- */

const highlight = ref([]);
function onAnalysisAnswer({ question }) {
  highlight.value = [question === "deer" ? 4 : 0];
}

const panel = ref(null);
watch(barsDone, async (done) => {
  if (!done) return;
  await nextTick();
  setTimeout(
    () => panel.value?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    200,
  );
});

defineExpose({ barsActive: computed(() => unitDone.value && !barsDone.value) });
</script>

<template>
  <div class="lesson4-workbench partc-workbench">
    <div class="partc-data-card">
      <span class="challenge-step-label">Survey Results for Site 2</span>
      <p>
        The survey was conducted over three nights. The average results are
        shown in Table 2. The averages have already been calculated for this
        activity. Use the <strong>Average</strong> column when you build each
        bar.
      </p>

      <div class="partc-table-wrap">
        <table
          class="practice-table partc-data-table"
          aria-label="Site 2 animal counts across three spotlight survey nights"
        >
          <caption>
            Table 2. Site 2 animal counts across three nights
          </caption>
          <thead>
            <tr>
              <th>Type of animal</th>
              <th>Night 1</th>
              <th>Night 2</th>
              <th>Night 3</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in SITE_2"
              :key="item.label"
              :class="{ 'partc-complete-row': checked[i] === true }"
            >
              <td>{{ item.label }}</td>
              <td v-for="(n, j) in item.nights" :key="j">{{ n }}</td>
              <td class="partc-average-cell">{{ item.average }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <DragDrop ref="axes" name="partc-axes" class="partc-build-grid" strict>
      <div class="graph-control-card partc-control-card">
        <span class="challenge-step-label">{{ stepLabel }}</span>

        <div
          v-show="!unitDone"
          class="partc-axis-bank"
          data-dd-tray
          aria-label="Axis label cards"
        >
          <DragItem
            v-for="card in AXIS_CARDS"
            :key="card.name"
            tag="button"
            class="partc-axis-card"
            :name="card.name"
          >
            {{ card.text }}
          </DragItem>
        </div>

        <MultipleChoice
          v-if="axesDone"
          v-show="!unitDone"
          ref="unit"
          name="partc-unit"
          class="partc-unit-check"
          completion-mode="live"
          :classes="CHOICE_CLASSES"
        >
          <McQuestion answer="hectare">
            <p>
              <strong>Do these axes need a measurement unit?</strong> Check the
              data before the graph is revealed.
            </p>
            <div class="partc-unit-buttons">
              <McChoice value="none" class="challenge-choice"
                >No unit needed</McChoice
              >
              <McChoice value="hectare" class="challenge-choice"
                >animals per hectare</McChoice
              >
              <McChoice value="seconds" class="challenge-choice"
                >seconds</McChoice
              >
            </div>
          </McQuestion>
        </MultipleChoice>

        <BarSliders
          v-if="unitDone"
          ref="sliders"
          name="partc-sliders"
          class="partc-slider-stage"
          :rows="SLIDER_ROWS"
          id-prefix="partCBarPractice"
          controls-class="partc-bar-builder-controls"
          check-label="Check my bars"
          hide-when-complete
        />
      </div>

      <div class="graph-stage-card partc-graph-card">
        <div class="graph-stage-heading">
          <div>
            <h3>Average animal counts from spotlight surveys at Site 2</h3>
          </div>
        </div>

        <BarGraphFrame
          svg-id="partCGraphSvg"
          aria-label="Student bar graph of average animal counts at Site 2"
          :items="SITE_2"
          x-label="Type of animal"
          y-label="Number of animals"
          :y-unit="unitDone ? ' (animals per hectare)' : ''"
          label-class="partc-final-axis-label"
          :labels-visible="{ x: xReady, y: yReady }"
          scale-class="partc-scaffold-layer"
          :scale-visible="unitDone"
          category-class="tick-label partc-category-label"
          :complete-x="correctBars"
        >
          <rect
            v-for="(item, i) in SITE_2"
            :key="'bar' + i"
            class="partc-practice-bar"
            :class="{
              preview: checked[i] !== true,
              complete: checked[i] === true,
              'analysis-highlight': highlight.includes(i),
            }"
            :x="PLOT.centres[i] - PLOT.barWidth / 2"
            :y="barBox(values[i]).y"
            :width="PLOT.barWidth"
            :height="barBox(values[i]).height"
            rx="4"
            :fill="item.colour"
          />
          <text
            v-for="(item, i) in SITE_2"
            :key="'value' + i"
            class="partc-value-label"
            :class="{ visible: checked[i] === true }"
            :x="PLOT.centres[i]"
            :y="Math.max(PLOT.top + 16, yOf(item.average) - 10)"
          >
            {{ item.average }}
          </text>

          <template #overlay>
            <DropSlot
              name="x"
              answer="animal"
              class="axis-slot axis-slot-x"
              :class="{ 'axis-complete': xReady }"
              aria-label="Drop the x-axis label here"
            >
              x-axis label
            </DropSlot>
            <DropSlot
              name="y"
              answer="number"
              class="axis-slot axis-slot-y"
              :class="{ 'axis-complete': yReady }"
              aria-label="Drop the y-axis label here"
            >
              y-axis label
            </DropSlot>
          </template>
        </BarGraphFrame>
      </div>
    </DragDrop>
  </div>

  <div v-if="barsDone" ref="panel" class="partc-analysis-panel">
    <AnalysisQuestions
      ref="analysis"
      name="partc-analysis"
      prefix="partc"
      :questions="QUESTIONS"
      :initial-feedback="{
        title: 'Read the Leadbeater\'s Possum bar.',
        text: ' What average value does it reach?',
      }"
      @answer="onAnalysisAnswer"
    >
      <span class="challenge-step-label">Step 4 · Analyse your graph</span>
      <h3>What does the Site 2 survey show?</h3>
      <p>
        Use the graph you constructed. The relevant bars will highlight as you
        answer.
      </p>
    </AnalysisQuestions>

    <div v-if="analysisDone" class="partc-complete-card pop-in">
      <span class="challenge-step-label">Site 2 survey complete</span>
      <h3>You now have results from both sites</h3>
      <p class="partc-result-statement">
        Leadbeater's Possums averaged <strong>6 at Site 1</strong> and
        <strong>1 at Site 2</strong>.
        <strong>Site 1 had more Leadbeater's Possums.</strong>
      </p>
      <p class="partc-next-hook">
        <strong>You have now graphed Site 1 and Site 2.</strong><br />
        Next, you can place the two datasets together on a bar graph. This will
        make it easier to compare data from the two sites.
      </p>
    </div>
  </div>

  <div class="reset-button-container">
    <Button :is-reset="true" @click="emit('reset')" />
  </div>
</template>
