<template>
  <!-- Page renders the vocabulary modal and the hidden teacher menu
       (opened by clicking the lesson title five times). -->
  <Page
    title="Lesson 2 - Planning a Fair Test Experiment"
    label="Lesson 2: Planning a Fair Test Experiment"
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
      <Section name="discoverVariables">
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
      <Section name="variableTypes">
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
      <Section name="sortVariablesOne" class="sort-variables-section">
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
      <Section name="sortVariablesTwo" class="sort-variables-section">
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
      <Section name="chooseBallPair">
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
        <MultipleChoice
          id="ballPairActivity"
          :options="ballPairActivityOptions"
        >
          <div
            id="ballPairGrid"
            class="ball-pair-grid"
            data-mc-question
            data-mc-answer="basketballs"
          >
            <!-- Correct: different size, same material and shape -->
            <button
              type="button"
              class="ball-pair-card"
              data-mc-choice="basketballs"
              data-feedback-title="Yes — this pair can be used for a fair test experiment"
              data-feedback="
                These basketballs are different sizes, but they have the same shape and are made from the same material.
                Ball size is the only variable changed, so this pair can be used in a <strong>fair test</strong>."
              aria-pressed="false"
            >
              <span class="ball-pair-images">
                <img
                  class="ball-pair-image"
                  src="../images/lesson2/l2-mcq1.png"
                  alt="A large basketball beside a small basketball"
                />
              </span>
              <span
                class="ball-pair-card-feedback"
                data-mc-choice-feedback
                role="status"
                aria-live="polite"
              ></span>
            </button>
            <!-- Incorrect: material also changes -->
            <button
              type="button"
              class="ball-pair-card"
              data-mc-choice="basketball-tennis"
              data-feedback-title="Not a fair test experiment - two variables are changed"
              data-feedback="
                These balls are different sizes, but they are also made of different materials.
                You could not know whether the height of the bounce changes because of size or material.
                Try again."
              aria-pressed="false"
            >
              <span class="ball-pair-images">
                <img
                  class="ball-pair-image"
                  src="../images/lesson2/l2-mcq2.png"
                  alt="A basketball beside a tennis ball"
                />
              </span>
              <span
                class="ball-pair-card-feedback"
                data-mc-choice-feedback
                role="status"
                aria-live="polite"
              ></span>
            </button>
            <!-- Incorrect: shape also changes -->
            <button
              type="button"
              class="ball-pair-card"
              data-mc-choice="soccer-football"
              data-feedback-title="Not a fair test experiment - two variables are changed"
              data-feedback="
              These balls are different sizes and have different shapes.
              The size and shape could both affect the bounce height.
              Try again."
              aria-pressed="false"
            >
              <span class="ball-pair-images">
                <img
                  class="ball-pair-image"
                  src="../images/lesson2/l2-mcq3.png"
                  alt="A soccer ball beside an oval football"
                />
              </span>
              <span
                class="ball-pair-card-feedback"
                data-mc-choice-feedback
                role="status"
                aria-live="polite"
              ></span>
            </button>
            <!-- Incorrect: no size change -->
            <button
              type="button"
              class="ball-pair-card"
              data-mc-choice="same-size"
              data-feedback-title="Not a fair test experiment - no variables are changed"
              data-feedback="
              These balls have the same size, shape, and they are made of the same material.
              This investigation is testing the effect of ball size, so the balls must be different sizes.
              Try again."
              aria-pressed="false"
            >
              <span class="ball-pair-images">
                <img
                  class="ball-pair-image"
                  src="../images/lesson2/l2-mcq4.png"
                  alt="Two basketballs of the same size"
                />
              </span>
              <span
                class="ball-pair-card-feedback"
                data-mc-choice-feedback
                role="status"
                aria-live="polite"
              ></span>
            </button>
          </div>
          <div class="reset-button-container">
            <button
              type="button"
              class="general-button reset-btn"
              data-reset-trigger
            >
              Reset
            </button>
          </div>
        </MultipleChoice>
      </Section>
      <!-- ==================================================
             DESIGN A QUESTION AND MAKE A PREDICTION
             ================================================== -->
      <Section name="designQuestion">
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
          id="investigationQuestionActivity"
          :options="investigationQuestionActivityOptions"
          feeds="reasonedPredictionActivity"
          @change="onQuestionChange"
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
        <PredictionTable id="reasonedPredictionActivity" />
        <!-- One reset button for both activities -->
        <div class="reset-button-container">
          <button
            type="button"
            class="general-button reset-btn"
            @click="resetQuestionAndPrediction"
          >
            Reset
          </button>
        </div>
      </Section>
      <!-- ==================================================
             OPEN VARIABLE SELECTION
             ================================================== -->
      <Section name="sortVariablesThree" class="sort-variables-section">
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
      <Section name="buildExperiment">
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

<script setup>
import { ref } from "vue";
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import StopAndCheck from "../components/StopAndCheck.vue";
import InvestigationQuestion from "../components/activities/InvestigationQuestion.vue";
import DiscoverVariables from "../components/lesson2/DiscoverVariables.vue";
import MultipleChoice from "../components/activities/MultipleChoice.vue";
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

const ballPairActivityOptions = {
  completionMode: "live",
  classes: {
    selected: "selected",
    correct: "correct-selection",
    incorrect: "incorrect-selection",
    feedbackCorrect: "feedback-success",
    feedbackIncorrect: "feedback-try-again",
    feedbackTitle: "ball-pair-feedback-title",
    feedbackText: "ball-pair-feedback-text",
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

const testableQuestion = ref("");

function onQuestionChange(state) {
  testableQuestion.value = state?.text ?? "";
}

// One reset button for the question and the prediction
function resetQuestionAndPrediction() {
  getActivity("investigationQuestionActivity")?.reset();
  getActivity("reasonedPredictionActivity")?.reset();
}

const investigationQuestionActivityOptions = {
  variableOptions: dropdownAnswers,
};
import LessonIntro from "../components/LessonIntro.vue";

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
    key: "discoverVariables",
    id: "discover-variables",
    label: "Discover possible variables",
    title: "Planning a ball bounce fair test",
  },
  {
    key: "variableTypes",
    id: "variable-types",
    label: "Learn the three variable types",
    title: "Using variables to design a fair test",
    hideNext: true,
  },
  {
    key: "sortVariablesOne",
    id: "sort-variables-one",
    label: "Sort variables: floor surface",
    title: "Practice reading a fair test question",
    nextButtonId: "sortVariablesOneNext",
    hideNext: true,
  },
  {
    key: "sortVariablesTwo",
    id: "sort-variables-two",
    label: "Sort variables: ball size",
    title: "Try another testable question to practice identifying variables",
    nextButtonId: "sortVariablesTwoNext",
    hideNext: true,
  },
  {
    key: "chooseBallPair",
    id: "choose-ball-pair",
    label: "Choose the right pair for a fair test experiment",
    title: "Select the picture showing a fair test",
    hideNext: true,
  },
  {
    key: "designQuestion",
    id: "design-question",
    label: "Design a question and make a prediction",
    title: "Write your own fait test question",
    nextButtonId: "designQuestionNext",
    hideNext: true,
  },
  {
    key: "sortVariablesThree",
    id: "sort-variables-three",
    label: "Choose variables for your investigation",
    title: "Identify all variables for your fair test.",
    nextButtonId: "sortVariablesThreeNext",
    hideNext: true,
  },
  {
    key: "buildExperiment",
    id: "build-experiment",
    label: "Describe the fair-test procedure",
    title: "Build Your Fair Test Plan",
  },
];

// Called by the shared PDF function in common_functions.js.
// Add localStorage saving here when Lesson 2 interactions are built.
window.saveCurrentPageData = () => {
  console.log("Lesson 2 skeleton: no saved activity data yet.");
};

</script>
