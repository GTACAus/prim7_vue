<script setup>
import Page from "../components/Page.vue";
import Modal from "../components/Modal.vue";
import Section from "../components/Section.vue";
import Flashcards from "../components/lesson1/Flashcards.vue";
import QuestionWheel from "../components/lesson1/QuestionWheel.vue";
import PredictionTests from "../components/lesson1/PredictionTests.vue";
import PredictionTable from "../components/activities/PredictionTable.vue";
import LessonIntro from "../components/LessonIntro.vue";

// Learning objective and success criteria shown in the lesson intro
const objective =
  "Learn to ask <strong>testable questions</strong> and make reasoned predictions for a scientific <strong>experiment</strong>";
const criteria = [
  "I can classify whether a <strong>question</strong> is testable or untestable",
  "I can write a <strong>testable question</strong>",
  "I can make <strong>predictions</strong> and give a reason for my choice",
];

// Terms shown in the vocabulary modal: { word: description }
const glossary = {
  Experiment:
    "A test scientists carry out to answer a testable question by changing one thing and measuring the effect it has on something else.",
  Question:
    "Something you are curious about after making an observation. In science, a good question leads to an investigation.",
  Observation:
    "Something you notice happening by using your senses, such as seeing, hearing, or feeling. In science, observations help you ask questions and understand what is happening.",
  Prediction:
    "An educated guess about what the result of an experiment will be, based on your knowledge of the relationship between two things.",
  "Reasoned Prediction":
    "A prediction that is based on scientific knowledge and evidence, explaining why a particular outcome is expected.",
  Measure:
    "To observe and record the effect that a change has on something. This is the result you collect during an experiment using a tool or method such as a ruler, stopwatch, or scale.",
  Change:
    "To make something different from what it was. In an experiment, this is the one thing you deliberately adjust to see what effect it has on something else.",
  "Testable question":
    "A question that can be answered by doing an experiment where you change something and measure the effect it has on something else.",
  "Untestable question":
    "A question that cannot be answered through an experiment, usually because it is based on personal opinion or cannot be measured.",
};

// Experiments for the "test reasoned predictions" activity
const predictionTests = [
  {
    title: "Changing the ramp angle",
    question:
      "Does <strong>changing</strong> the angle of the ramp <strong>affect</strong> how far the car travels?",
    prediction:
      "If I <strong>increase the angle of the ramp</strong>, then this will <strong>increase how far the car will travel</strong>. This is because the car gains more speed travelling down the ramp.",
    image: "../images/lesson1/l1-example1.png",
    answer: "true",
    correct:
      "It is supported. Increasing the angle of the ramp causes the car to travel further.",
    incorrect:
      "Try again. The results show that increasing the angle of the ramp causes the car to travel further.",
  },
  {
    title: "Changing the car colour",
    question:
      "Does <strong>changing</strong> the colour of a car <strong>affect</strong> how far the car travels?",
    prediction:
      "If I <strong>change the colour of the car from blue to red</strong>, then <strong>the distance the car travels will stay the same</strong>. This is because colour does not affect how fast the car travels down the ramp.",
    image: "../images/lesson1/l1-example2.png",
    answer: "true",
    correct:
      "It is supported because the results show that both cars travel the same distance.",
    incorrect:
      "Try again. The results show that both cars travel the same distance.",
  },
  {
    title: "Changing the size of the car",
    question:
      "If we <strong>change</strong> the size of a car, how does this <strong>affect</strong> the distance it travels?",
    prediction:
      "If I <strong>increase the size of the car</strong>, then <strong>the distance the car travels will decrease</strong>. This is because bigger objects stop rolling sooner.",
    image: "../images/lesson1/l1-example3.png",
    answer: "false",
    correct:
      "It is not supported. The bigger car travels further than the smaller car.",
    incorrect:
      "Try again. The results show that the bigger car travels further than the smaller car.",
  },
  {
    title: "Changing the wheel size",
    question:
      "How does <strong>changing</strong> the size of a car's wheels <strong>affect</strong> the distance it will travel?",
    prediction:
      "If I <strong>increase the size of the car's wheels</strong>, then <strong>the distance the car travels will increase</strong>. This is because bigger wheels will make it travel faster.",
    image: "../images/lesson1/l1-example4.png",
    answer: "false",
    correct:
      "It is not supported because the results show that the car with smaller wheels travels further than the car with bigger wheels.",
    incorrect:
      "Try again. The results show that the car with smaller wheels travels further than the car with bigger wheels.",
  },
];

// Choices in the reasoned prediction builder
const changeOptions = [
  "the angle of the ramp",
  "the colour of the car",
  "the size of the car",
  "the size of the car's wheels",
];
const measureOptions = ["the distance the car travels"];

// Sections of the page. Order defines the unlock chain (next-id) and which
// sections start locked; override per section where needed.
const sections = [
  {
    key: "observe",
    id: "observe-experiment",
    label: "Observe the experiment",
    title: "Observe the Experiment",
    last: true,
  },
  {
    key: "intro",
    id: "testable-question-intro",
    label: "What is a testable question?",
    title: "Make a testable question",
    locked: false,
  },
  {
    key: "flashcards",
    id: "flashcards",
    label: "Testable or non-testable?",
    title: "Testable or Non-testable?",
    nextButtonId: "flashcardsNextButton",
    hideNext: true,
  },
  {
    key: "questions",
    id: "testable-questions",
    label: "Write testable questions",
    title: "How do we write testable questions?",
    nextButtonId: "testableQuestionsNextButton",
    hideNext: true,
  },
  {
    key: "prediction",
    id: "reasoned-prediction",
    label: "Writing a reasoned prediction",
    title: "Writing a Reasoned Prediction",
  },
  {
    key: "builder",
    id: "reasoned-builder",
    label: "Build a reasoned prediction",
    title: "MAKE A REASONED PREDICTION",
    hideNext: true,
  },
  {
    key: "testing",
    id: "testing-predictions",
    label: "Test reasoned predictions",
    title: "HOW TO TEST REASONED PREDICTIONS",
  },
];

</script>
<template>
  <Page title="Lesson 1 - Questioning and Predicting" :sections="sections" :glossary="glossary">
    <template #lesson-intro>
      <LessonIntro
        label="Lesson 1"
        title="Questioning and Predicting"
        worksheet="../worksheets/l1-worksheet.pdf"
        :objective="objective"
        :criteria="criteria"
      >
        Asking questions and making predictions like a scientist

        <template #observation>
          <h2>See, Think, Wonder</h2>
          <p>
            As scientists we are curious. We observe the world around us. We ask
            <strong>questions</strong> about how the world works. To do this we
            can use a thinking tool called <strong>See, Think, Wonder</strong>.
            Follow these steps to make <strong>observations</strong> and ask
            <strong>questions</strong>:
          </p>
          <div class="stw-explanation">
            <div>
              <strong>See</strong>
              <span>What do you notice?</span>
            </div>
            <div>
              <strong>Think</strong>
              <span>What do you think is happening?</span>
            </div>
            <div>
              <strong>Wonder</strong>
              <span>What questions do you have?</span>
            </div>
          </div>
        </template>
      </LessonIntro>
    </template>

    <template #sections>
      <!-- ---------- Explicit Teaching: Introduction Image ---------- -->
      <Section name="observe">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Look at the image below. It shows a fair test being done. Use the
            <strong><i>See, Think, Wonder</i></strong> tool to make
            <strong>observations</strong> and ask <strong>questions</strong>.
          </p>
        </div>
        <div class="image-box">
          <img src="../images/lesson1/l1-default.png" alt="Toy car example" />
        </div>
      </Section>
      <!-- ---------- Explicit Teaching: What is a Testable Question? ---------- -->
      <Section name="intro">
        <div class="diagram-box diagram-activity">
          <h3>What is a testable question?</h3>
          <p class="activity-instruction">
            It is answered by doing an experiment. You change one thing and
            <strong>measure</strong> the effect on something else. It explores
            the relationship between two different things.
          </p>
        </div>
        <div class="intro-grid question-comparison-grid">
          <div class="intro-card testable-card">
            <p class="intro-eyebrow">Testable questions</p>
            <ul>
              <li>Can be answered by doing an <strong>experiment</strong>.</li>
              <li>Explore the relationship between two things.</li>
              <li>
                One thing is changed and its effect on another thing is
                <strong>measured</strong>.
              </li>
              <li>
                Different scientists should reach a similar answer when
                conducting the same <strong>experiment</strong>.
              </li>
            </ul>
          </div>
          <div class="intro-card untestable-card">
            <p class="intro-eyebrow">Untestable questions</p>
            <ul>
              <li>
                May be answered using personal opinions, values or beliefs.
              </li>
              <li>
                Do not explore the effect of <strong>changing</strong> one
                thing.
              </li>
              <li>
                Cannot be answered using <strong>measurable</strong> evidence
                from an <strong>experiment</strong>.
              </li>
              <li>
                Are not by <strong>changing</strong> one thing and
                <strong>measuring</strong> the effect on another thing.
              </li>
              <li>Different people may provide different answers.</li>
            </ul>
          </div>
        </div>
        <div class="diagram-box diagram-activity question-example-intro">
          <p class="activity-instruction">
            Look at the following examples from our See, Think, Wonder exercise.
          </p>
        </div>
        <div class="intro-grid question-example-grid">
          <div class="intro-card testable-card">
            <p class="intro-eyebrow">Testable question</p>
            <p class="example-question">
              Does changing the angle of the ramp affect how far the car
              travels?
            </p>
            <div class="question-check-list">
              <div class="question-check-row">
                <span class="question-check-icon correct">✓</span>
                <div>
                  <strong>Is something being changed?</strong>
                  <p>Yes. The angle of the ramp is changed.</p>
                </div>
              </div>
              <div class="question-check-row">
                <span class="question-check-icon correct">✓</span>
                <div>
                  <strong>Can the effect be measured?</strong>
                  <p>Yes. Measure the distance the car travels.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="intro-card untestable-card">
            <p class="intro-eyebrow">Untestable question</p>
            <p class="example-question">
              Does changing the angle of the ramp affect how much fun the car
              has?
            </p>
            <div class="question-check-list">
              <div class="question-check-row">
                <span class="question-check-icon correct">✓</span>
                <div>
                  <strong>Is something being changed?</strong>
                  <p>Yes. The angle of the ramp is changed.</p>
                </div>
              </div>
              <div class="question-check-row">
                <span class="question-check-icon incorrect">×</span>
                <div>
                  <strong>Can the effect be measured?</strong>
                  <p>No. Fun is based on personal opinion.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="intro-card testable-card">
            <p class="intro-eyebrow">Testable question</p>
            <p class="example-question">
              What will changing the size of the car do to the distance the car
              travels?
            </p>
            <div class="question-check-list">
              <div class="question-check-row">
                <span class="question-check-icon correct">✓</span>
                <div>
                  <strong>Is something being changed?</strong>
                  <p>Yes. The size of the car is changed.</p>
                </div>
              </div>
              <div class="question-check-row">
                <span class="question-check-icon correct">✓</span>
                <div>
                  <strong>Can the effect be measured?</strong>
                  <p>Yes. Measure the distance the car travels.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="intro-card untestable-card">
            <p class="intro-eyebrow">Untestable question</p>
            <p class="example-question">How far does the red car travel?</p>
            <div class="question-check-list">
              <div class="question-check-row">
                <span class="question-check-icon incorrect">×</span>
                <div>
                  <strong>Is something being changed?</strong>
                  <p>No. Nothing is changed.</p>
                </div>
              </div>
              <div class="question-check-row">
                <span class="question-check-icon correct">✓</span>
                <div>
                  <strong>Can the effect be measured?</strong>
                  <p>Yes. The distance the car travels can be measured.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <!-- ---------- Flashcards ---------- -->
      <Section name="flashcards">
        <Flashcards id="flashcardsActivity" />
      </Section>
      <!-- Part C: How do we write testable questions? -->
      <Section name="questions">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            A <strong>testable question</strong> describes two things:
          </p>
          <ol>
            <li>What is being <strong>changed</strong> and</li>
            <li>What is being <strong>measured</strong>.</li>
          </ol>
          <strong>Testable questions</strong> begin with words like
          <strong><i>What, How, Does and If</i></strong
          >.
        </div>
        <QuestionWheel next-button-id="testableQuestionsNextButton" />
      </Section>
      <Section name="prediction">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            You have a <strong>testable question</strong>. Next you make a
            <strong>reasoned prediction</strong>. State what you think the
            result will be. Then provide a reason for your choice.
          </p>
          <p class="activity-instruction">
            In a <strong>reasoned prediction</strong> you make an educated
            guess. This is based on your knowledge about the relationship
            between two things. The thing you <strong>change</strong> and the
            thing you will <strong>measure</strong>.
          </p>
          <p class="activity-instruction">
            You can use a graphic organiser to help you write a
            <strong>reasoned prediction</strong>.
          </p>
        </div>
        <!-- <div class="diagram-box diagram-activity"> -->
        <div class="prediction-organiser">
          <div class="prediction-organiser-row row-header">
            <div class="prediction-organiser-cell">
              <span class="cell-sublabel" data-template-id="org-col-tq-label"
                >Testable question:</span
              >
            </div>
            <div class="prediction-organiser-cell">
              <span
                class="cell-sublabel"
                data-template-id="org-col-change-label"
                >Change this</span
              >
            </div>
            <div class="prediction-organiser-cell">
              <span
                class="cell-sublabel"
                data-template-id="org-col-measure-label"
                >Measure this</span
              >
            </div>
          </div>
          <!-- Relationship row -->
          <div class="prediction-organiser-row row-relationship">
            <div class="prediction-organiser-cell cell-label">
              <span class="cell-sublabel" data-template-id="org-row-rel-label"
                >Relationship:</span
              >
              <span
                class="cell-helper"
                data-template-id="org-row-rel-label"
              ></span>
            </div>
            <div class="prediction-organiser-cell">
              <span class="cell-sublabel" data-template-id="org-cause-label"
                >Cause</span
              >
              <span class="cell-helper" data-template-id="org-cause-helper"
                >increase / decrease<br />
                with / without<br />
                condition 1 versus condition 2</span
              >
            </div>
            <div class="prediction-organiser-cell">
              <span class="cell-sublabel" data-template-id="org-effect-label"
                >Effect (result)</span
              >
              <span class="cell-helper" data-template-id="org-effect-helper"
                >increase / decrease / stay the same<br
              /></span>
            </div>
          </div>
          <!-- Prediction row -->
          <div class="prediction-organiser-row row-prediction">
            <div class="prediction-organiser-cell cell-label">
              <span class="cell-sublabel" data-template-id="org-row-pred-label"
                >Prediction:</span
              >
            </div>
            <div class="prediction-organiser-cell">
              <span class="cell-helper" data-template-id="org-pred-if"
                >If I do this</span
              >
            </div>
            <div class="prediction-organiser-cell">
              <span class="cell-helper" data-template-id="org-pred-then"
                >then this will happen</span
              >
            </div>
          </div>
          <!-- Reason row -->
          <div class="prediction-organiser-row row-reason">
            <div class="prediction-organiser-cell cell-label">
              <span
                class="cell-sublabel"
                data-template-id="org-row-reason-label"
                >Reason:</span
              >
            </div>
            <div class="prediction-organiser-cell span-2">
              <span class="cell-helper" data-template-id="org-reason-body"
                >This is because…</span
              >
            </div>
          </div>
          <!-- Reasoned prediction row -->
          <div class="prediction-organiser-row row-full">
            <div class="prediction-organiser-cell cell-label">
              <span class="cell-sublabel" data-template-id="org-row-full-label"
                >Reasoned prediction:</span
              >
            </div>
            <div class="prediction-organiser-cell span-2">
              <span class="cell-helper" data-template-id="org-full-body"
                >If I do this then this will happen. This is because of
                this.</span
              >
            </div>
          </div>
        </div>
      </Section>
      <!-- ---------- Reasoned Prediction Builder ---------- -->
      <Section name="builder">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Choose your investigation question. Then use the graphic organiser
            to build a <strong>reasoned prediction</strong>. Watch the two
            videos below to learn how to do this.
          </p>
          <div class="video-help-buttons">
            <button
              type="button"
              class="general-button"
              @click="
                openModal('video', {
                  src: '../videos/lesson1/reasoned-prediction-v2.mp4',
                  title: 'Video guide 1',
                })
              "
            >
              ▶ How to use the reasoned prediction builder
            </button>
            <button
              type="button"
              class="general-button"
              @click="
                openModal('video', {
                  src: '../videos/lesson1/reasoned-prediction-example-v2.mp4',
                  title: 'Video guide 2',
                })
              "
            >
              ▶ Worked example
            </button>
          </div>
        </div>
        <PredictionTable
          id="reasonedPredictionActivity"
          :change-options="changeOptions"
          :measure-options="measureOptions"
          show-reset
        />
      </Section>
      <!-- ---------- Testing Reasoned Predictions ---------- -->
      <Section name="testing">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            To test a <strong>reasoned prediction</strong>, you do an
            <strong>experiment</strong>. Below are four
            <strong>experiments</strong> rolling cars down ramps. For each,
            decide if the <strong>reasoned prediction</strong> is either:
          </p>
          <ol>
            <li><strong>Supported</strong></li>
            <li><strong>Unsupported</strong></li>
          </ol>
        </div>
        <PredictionTests :tests="predictionTests" />
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

  <!-- Question Wheel Script -->
</template>

<style>
/* Lesson 1-specific styles only */

ol li::marker {
  color: var(--purple);
  font-weight: 700;
}

/* ==================================================
        REASONED PREDICTION ORGANISER
        ================================================== */
.prediction-organiser {
  border: 3px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 0 var(--line);
}

/* Each row is a horizontal stripe */
.prediction-organiser-row {
  display: grid;
  grid-template-columns: clamp(80px, 18vw, 180px) minmax(0, 1fr) minmax(0, 1fr);
  border-bottom: 2px solid var(--line);
}

.prediction-organiser-row:last-child {
  border-bottom: none;
}

.prediction-organiser-cell {
  padding: 14px 18px;
  font-size: 0.95rem;
  line-height: 1.55;
  border-right: 2px solid var(--line);
}

.prediction-organiser-cell:last-child {
  border-right: none;
}

/* Row-type colour bands */
.row-header {
  background: var(--purple);
}

.row-header .prediction-organiser-cell {
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
}

.row-question {
  background: var(--soft-blue);
}

.row-relationship {
  background: var(--soft-yellow);
}

.row-prediction {
  background: var(--soft-green);
}

.row-reason {
  background: var(--soft-purple);
}

.row-full {
  background: var(--card);
}

/* Span-2 cell (no right border on the spanning cell) */
.prediction-organiser-cell.span-2 {
  grid-column: span 2;
  border-right: none;
}

/* Label column — always slightly darker */
.cell-label {
  background: rgba(0, 0, 0, 0.04);
  font-weight: 700;
  overflow-wrap: break-word;
}

/* sub-labels inside cells */
.cell-sublabel {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--purple);
  margin-bottom: 4px;
}

.row-header .cell-sublabel {
  color: var(--cream);
}

/* italic helper lines */
.cell-helper {
  display: block;
  font-size: 0.88rem;
  color: var(--muted);
  font-style: italic;
  line-height: 1.5;
}

/* ==================================================
   LESSON 1 ACTIVITIES
   
   Question wheel, testable-question cards and the
   testing-reasoned-predictions examples.
   Used only by lesson1/lesson1.html.
   ================================================== */

.testable-card {
  background: #f3fff8;
  border-top: 10px solid var(--green);
}

.untestable-card {
  background: #fff8f3;
  border-top: 10px solid var(--orange);
}

.question-check-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.question-check-row {
  display: grid;
  grid-template-columns: 34px 1fr;
  align-items: start;
  gap: 12px;

  padding: 14px 16px;

  background: var(--soft-yellow);
  border: 2px solid var(--line);
  border-radius: 14px;

  box-shadow: 0 3px 0 rgba(48, 51, 47, 0.18);
}

.question-check-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  border: 2px solid var(--line);
  border-radius: 8px;

  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
}

.question-check-row strong {
  display: block;
  margin-bottom: 5px;

  color: var(--text);
}

.question-check-row p {
  margin: 0;

  color: var(--text);
  line-height: 1.5;
}

.video-help-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  margin-top: 16px;
}

/* ----- Moved here from build_style.css: .video-help-buttons is lesson 1 only ----- */

@media (max-width: 600px) {
  .video-help-buttons {
    display: grid;
    grid-template-columns: 1fr;
  }

  .video-help-buttons .general-button {
    width: 100%;
  }
}
</style>
