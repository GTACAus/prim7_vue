<script setup>
import { computed, ref } from "vue";
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import StopAndCheck from "../components/StopAndCheck.vue";
import InvestigationQuestion from "../components/activities/InvestigationQuestion.vue";
import DiscoverVariables from "../components/lesson2/DiscoverVariables.vue";
import BallPairChoice from "../components/lesson2/BallPairChoice.vue";
import PredictionTable from "../components/activities/PredictionTable.vue";
import VariableSort from "../components/activities/VariableSort.vue";
import FairTestBuilder from "../components/lesson2/FairTestBuilder.vue";

// Options passed to the activity components
const sortVariablesOneActivityOptions = {
  answers: {
    independent: "bounce-surface",
    dependent: "bounce-height",
    controlled: [
      "ball-size",
      "ball-material",
      "drop-height",
      "ball-squashiness",
    ],
  },
};

const sortVariablesTwoActivityOptions = {
  answers: {
    independent: "ball-size",
    dependent: "bounce-height",
    controlled: [
      "ball-material",
      "drop-height",
      "ball-squashiness",
      "bounce-surface",
    ],
  },
};

const sortVariablesThreeActivityOptions = {
  options: {
    independent: [
      "ball-size",
      "ball-material",
      "drop-height",
      "ball-squashiness",
      "bounce-surface",
    ],
    dependent: ["bounce-height", "number-of-bounces", "time-spent-bouncing"],
    controlled: [
      "ball-size",
      "ball-material",
      "drop-height",
      "ball-squashiness",
      "bounce-surface",
    ],
  },
};

const dropdownAnswers = [
  "ball size",
  "ball material",
  "drop height",
  "ball squashiness",
  "bounce surface",
  "bounce height",
  "number of bounces",
  "time spent bouncing",
];

// The student's testable question, from <InvestigationQuestion @change>.
// It fills in the prediction table's change / measure and the question
// shown above the variable sort.
const question = ref({
  structure: "",
  firstAnswer: "",
  secondAnswer: "",
  text: "",
});
const testableQuestion = computed(() => question.value.text);
const predictionContext = computed(() => ({
  structure: question.value.structure,
  change: question.value.firstAnswer,
  measure: question.value.secondAnswer,
}));

// One reset button for the question and the prediction
const questionActivity = ref(null);
const predictionActivity = ref(null);
function resetQuestionAndPrediction() {
  questionActivity.value?.reset();
  predictionActivity.value?.reset();
}
import LessonIntro from "../components/LessonIntro.vue";
import Button from "../components/Button.vue";

// Learning objective and success criteria shown in the lesson intro
const objective =
  "We are learning to plan a fair test and draw it as a diagram.";
const criteria = [
  "I can identify <strong>variables</strong> in a fair test.",
  "To plan a fair test, I can select: <ul> <li>The <strong>independent variable</strong> (thing I change),</li> <li>The <strong>dependent variable</strong> (thing I measure) and</li> <li>The <strong>controlled variables</strong> (things I keep the same) </li> </ul>",
  "I can use a diagram to describe my <strong>fair test</strong>",
];

// Terms shown in the vocabulary modal: { word: description }
const glossary = {
  Variable:
    "An aspect of an investigation that can be different or can change.",
  "Independent variable":
    "The one <strong>variable</strong> changed during a <strong>fair test</strong> experiment.",
  "Dependent variable":
    "The result that is observed or measured during a <strong>fair test</strong> experiment.",
  "Controlled variables":
    "The <strong>variables</strong> kept the same so the experiment is fair.",
  "Fair test Experiment":
    "An experiment where one <strong>variable</strong> is changed, one is measured, and all others are kept the same.",
};

// Sections of the page. Order defines the unlock chain (next-id) and which
// sections start locked; override per section where needed.
const sections = [
  {
    id: "discover-variables",
    title: "Planning a ball bounce fair test",
  },
  {
    id: "variable-types",
    title: "Using variables to design a fair test",
  },
  {
    id: "sort-variables-one",
    title: "Practice reading a fair test question",
  },
  {
    id: "sort-variables-two",
    title: "Try another testable question to practice identifying variables",
  },
  {
    id: "choose-ball-pair",
    title: "Select the picture showing a fair test",
  },
  {
    id: "design-question",
    title: "Write your own fait test question",
  },
  {
    id: "sort-variables-three",
    title: "Identify all variables for your fair test.",
  },
  {
    id: "build-experiment",
    title: "Build Your Fair Test Plan",
  },
];
</script>

<template>
  <!-- Page renders the vocabulary modal and the hidden teacher menu
       (opened by clicking the lesson title five times). -->
  <Page
    lessonId="lesson2"
    title="Lesson 2 - Planning a Fair Test Experiment"
    :sections="sections"
    :glossary="glossary"
  >
    <!-- ==================================================
         LESSON INTRODUCTION
         ================================================== -->
    <template #lesson-intro>
      <LessonIntro
        label="Lesson 2"
        title="Planning a Fair Test Experiment"
        worksheet="../worksheets/l2-worksheet.pdf"
        :objective="objective"
        :criteria="criteria"
      >
        Learn how scientists identify variables and plan an experiment that is
        fair.

        <template #title
          >Planning a <strong>Fair Test</strong> Experiment</template
        >

        <template #observation>
          <h2>The fair test rules</h2>

          <p>
            Use a <strong>fair test</strong> to find out if changing one thing
            causes an effect in another thing.
          </p>

          <div class="fair-test-formula">
            <div class="formula-step change">
              <div class="formula-step-number">1</div>
              <div>
                <strong>Change one factor</strong>
                <span>Choose the independent variable.</span>
              </div>
            </div>

            <div class="formula-step measure">
              <div class="formula-step-number">2</div>
              <div>
                <strong>Measure the effect this causes</strong>
                <span>Measure the dependent variable.</span>
              </div>
            </div>

            <div class="formula-step control">
              <div class="formula-step-number">3</div>
              <div>
                <strong>Keep everything else the same</strong>
                <span>Control all other variables.</span>
              </div>
            </div>
          </div>
        </template>
      </LessonIntro>
    </template>

    <template #sections>
      <!-- ==================================================
           2. DISCOVER VARIABLES
           ================================================== -->
      <Section name="discover-variables">
        <DiscoverVariables
          id="discoverVariablesActivity"
          image="../images/lesson2/l2-stw.png"
          image-alt="Bouncing ball investigation showing possible variables"
        >
          <template #intro>
            <div class="diagram-box diagram-activity">
              <p class="activity-instruction">
                The image below shows a mind map for a ball bounce
                <strong>fair test</strong>. To design a
                <strong>fair test</strong> start by identifying all
                <strong>variables</strong>.
              </p>
              <p class="activity-instruction">
                A <strong>variable</strong> is any factor that can vary. For
                example, the size of the ball used could be small or big. These
                factors can affect the result of a <strong>fair test</strong>.
              </p>
              <p class="activity-instruction">
                The <strong>variables</strong> have been identified. Use the
                boxes to type in how each varies or can be different.
              </p>
            </div>
          </template>
          <template #between>
            <div class="diagram-box diagram-activity">
              <p class="activity-instruction">
                Now record the <strong>variables</strong> for the ball bounce
                <strong>fair test</strong> in a table. Use the mind map above to
                help you do this.
              </p>
            </div>
          </template>
        </DiscoverVariables>
      </Section>
      <!-- ==================================================
          3. VARIABLE TYPES
          ================================================== -->
      <Section name="variable-types">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            In a <strong>fair test</strong>, you change one
            <strong>variable</strong> and measure the effect this causes on
            another <strong>variable</strong>. You keep all other
            <strong>variables</strong> the same.
          </p>
        </div>
        <div class="variable-type-grid">
          <article class="variable-type-card independent">
            <p class="intro-eyebrow">Change</p>
            <h3>Independent variable</h3>
            <p>
              Does this <strong>cause</strong> an effect on another
              <strong>variable</strong>?
            </p>
          </article>
          <article class="variable-type-card dependent">
            <p class="intro-eyebrow">Measure</p>
            <h3>Dependent variable</h3>
            <p>
              To observe the <strong>effect</strong> cause by the thing you
              change.
            </p>
          </article>
          <article class="variable-type-card controlled">
            <p class="intro-eyebrow">Keep the same</p>
            <h3>Controlled variables</h3>
            <p>
              Be sure that the <strong>effect</strong> you measure can only be
              <strong>caused</strong> by the thing you measure.
            </p>
          </article>
        </div>
        <div class="fair-test-rule">
          We write a testable question to show what is changed and what is
          measured in a <strong>fair test</strong>.
        </div>
        <StopAndCheck class="stop-and-check">
          <template #content>
            In a <strong>fair test</strong>, why is it important to only change
            one <strong>variable</strong>? Why should you keep all other
            <strong>variables</strong> the same?
          </template>
          <template #answer>
            Only changing one <strong>variable</strong> allows you to know that
            no other <strong>variable</strong> has affected the results of the
            test. Any effect or result you measure in the
            <strong>dependent variable</strong> is caused by the thing you
            changed (the <strong>independent variable</strong>).
          </template>
        </StopAndCheck>
      </Section>
      <!-- ==================================================
             4. SORT VARIABLES - FLOOR SURFACE
             ================================================== -->
      <Section name="sort-variables-one" class="sort-variables-section">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Read the testable question for a ball bounce fair test.
          </p>
          <ol class="ol-step-count">
            <li>
              Click on the <strong>Independent Variable</strong> button. Then
              select the <strong>variable</strong> being changed.
            </li>
            <li>
              Click on the <strong>Dependent Variable</strong> button. Then
              select the thing being measured.
            </li>
            <li>
              Click on the <strong>Controlled Variable</strong> button. Then
              select the <strong>variables</strong> that are kept the same to
              make sure it is a <strong>fair test</strong>.
            </li>
          </ol>
          <p class="activity-instruction">
            In the following table, select the
            <strong>independent variable</strong> and the
            <strong>dependent variable</strong>. Then select the
            <strong>Controlled Variable</strong> button and identify all parts
            of the <strong>fair test</strong> experiment that must be kept the
            same.
          </p>
        </div>
        <VariableSort
          id="sortVariablesOneActivity"
          :options="sortVariablesOneActivityOptions"
        >
          <template #autofillTestableQuestion>
            How does changing the surface a ball bounces on affect the height it
            will bounce?
          </template>
        </VariableSort>
      </Section>
      <!-- ==================================================
           5. SORT VARIABLES - BALL SIZE
           ================================================== -->
      <Section name="sort-variables-two" class="sort-variables-section">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Follow the steps to identify the <strong>variables</strong> in this
            ball bounce <strong>fair test</strong>.
          </p>
        </div>
        <VariableSort
          id="sortVariablesTwoActivity"
          :options="sortVariablesTwoActivityOptions"
        >
          <template #autofillTestableQuestion>
            If I change the size of the ball, how will it affect the height of
            the first bounce?
          </template>
        </VariableSort>
      </Section>
      <!-- ==================================================
            6. CHOOSE A FAIR-TEST BALL PAIR
            ================================================== -->
      <Section name="choose-ball-pair">
        <p class="variable-question floating-title">
          Does changing the size of a ball effect the height of the first
          bounce?
        </p>
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Look at the four pictures below. Choose the picture showing the
            balls that could be used in this <strong>fair test</strong>.
          </p>
        </div>
        <BallPairChoice />
      </Section>
      <!-- ==================================================
             DESIGN A QUESTION AND MAKE A PREDICTION
             ================================================== -->
      <Section name="design-question">
        <!-- ================================
         PART 1: INVESTIGATION QUESTION
         ================================ -->
        <div class="diagram-box diagram-activity">
          <div class="activity-instruction">
            <ol class="ol-step-count">
              <li>
                Look at the ball bounce <strong>fair test</strong> mind map
                diagram. It is near the top of the page.
              </li>
              <li>
                Choose the <strong>independent variable</strong> (what you want
                to change)
              </li>
              <li>
                Choose the <strong>dependent variable</strong> (the thing you
                will measure).
              </li>
              <li>Select one of the question structures below.</li>
              <li>
                Enter your <strong>variables</strong> to create your question.
              </li>
            </ol>
          </div>
        </div>
        <InvestigationQuestion
          ref="questionActivity"
          name="investigation-question"
          :variable-options="dropdownAnswers"
          @change="question = $event"
        >
          <template #autofillTestableQuestion />
        </InvestigationQuestion>
        <!-- ================================
         PART 2: REASONED PREDICTION
         ================================ -->
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Once we have a <strong>fair test</strong> question (testable
            question) we make a prediction to say what we think will happen.
            Then we give a reason for why we think this. This is called a
            reasoned prediction.
          </p>
        </div>
        <PredictionTable
          ref="predictionActivity"
          name="reasoned-prediction"
          :context="predictionContext"
        />
        <!-- One reset button for both activities -->
        <div class="reset-button-container">
          <Button :is-reset="true" @click="resetQuestionAndPrediction" />
        </div>
      </Section>
      <!-- ==================================================
             OPEN VARIABLE SELECTION
             ================================================== -->
      <Section name="sort-variables-three" class="sort-variables-section">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            What will you change? What will you measure? What will you keep the
            same?
          </p>
        </div>
        <VariableSort
          id="sortVariablesThreeActivity"
          :options="sortVariablesThreeActivityOptions"
        >
          <template v-if="testableQuestion" #autofillTestableQuestion>
            {{ testableQuestion }}
          </template>
        </VariableSort>
      </Section>
      <!-- ==================================================
           9. DESCRIBE THE FAIR TEST
           ================================================== -->
      <Section name="build-experiment">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Follow the steps and watch as your
            <strong>fair test</strong> diagram is created.
          </p>
          <ol class="ol-step-count">
            <li>
              Click on the <strong><i>Change</i></strong> button. Then select
              the <strong><i>independent variable</i></strong> - what you will
              change. Then use the drop-down menu to make a choice from the
              selections offered.
            </li>
            <li>
              Click on the <strong><i>Measure</i></strong> button. Then select
              the <strong>dependent variable</strong> - what you will measure.
            </li>
            <li>
              Click on the <strong><i>Control</i></strong> button. Then select
              all the <strong>variables</strong> you must keep the same.
            </li>
          </ol>
        </div>
        <FairTestBuilder />
        <button
          type="button"
          class="save-work-button general-button"
          onclick="downloadLessonPDF()"
        >
          <p class="bounce-symbol">💾</p>
          <p>Save my work</p>
        </button>
      </Section>
    </template>
  </Page>
</template>
