<template>
  <!-- ==================================================
       VOCABULARY MODAL
       Placeholder definitions can be refined later.
       ================================================== -->
  <Modal
    label="Lesson 3 Part B: Using a Table to Record Data for a Fair Test"
    :glossary="glossary"
    note="Jumping between activities changes navigation only. Reset student view clears every answer on this page."
  />

  <!-- ==================================================
       HIDDEN TEACHER MENU
       Opened by clicking the lesson title five times.
       ================================================== -->

  <main class="page lesson3-page">
    <LessonIntro
      label="Lesson 3 &middot; Part B"
      title="Using a Table to Record Data for a Fair Test - Part B"
      intro-class="lesson3-intro"
      worksheet="../worksheets/l3b-worksheet.pdf"
    >
      Practice what you have learned by doing a ball bounce experiment
    </LessonIntro>

    <section
      class="intro-card objectives-card objectives-card-wide practice-plan-card"
    >
      <p class="intro-eyebrow">Put it into practice</p>

      <h2>Practice what you have learned by doing a ball-bounce experiment</h2>

      <div class="practice-plan">
        <div class="yeast-results-step-heading practice-plan-step">
          <span>STEP 1</span>

          <div>
            <h3>Plan a fair test</h3>
          </div>
        </div>

        <div class="yeast-results-step-heading practice-plan-step">
          <span>STEP 2</span>

          <div>
            <h3>Collect results into a table</h3>
          </div>
        </div>

        <div class="yeast-results-step-heading practice-plan-step">
          <span>STEP 3</span>

          <div>
            <h3>Use the results to check your prediction</h3>
          </div>
        </div>
      </div>
    </section>

    <div class="intro-grid">
      <section class="intro-card observation-card">
        <p class="intro-eyebrow">Think like a scientist</p>
        <h2>The Fair-Test Formula</h2>

        <p>
          A <strong>fair test</strong> experiment helps us to find out if
          changing one thing causes a measureable effect in another thing.
        </p>

        <div class="formula-card">
          <div class="formula-step">
            <div id="formula-step-independent" class="formula-step-number">
              1
            </div>
            <div>
              <strong>Change one factor</strong>
              <span>Choose the independent variable.</span>
            </div>
          </div>

          <div class="formula-step">
            <div id="formula-step-dependent" class="formula-step-number">2</div>
            <div>
              <strong>Measure the effect this causes</strong>
              <span>Measure the dependent variable.</span>
            </div>
          </div>

          <div class="formula-step">
            <div id="formula-step-units" class="formula-step-number">3</div>
            <div>
              <strong>Keep everything else the same</strong>
              <span>Control all other variables.</span>
            </div>
          </div>
        </div>
      </section>

      <section class="intro-card observation-card">
        <p class="intro-eyebrow">Think like a scientist</p>
        <h2>Scientific Table Formula</h2>

        <p>
          When scientists carry out fair tests, they use tables to record
          <strong>data</strong>. This helps them to see patterns, trends, and
          relationships in the <strong>data</strong>.
        </p>

        <div class="formula-card">
          <div class="formula-step">
            <div id="formula-step-independent" class="formula-step-number">
              1
            </div>
            <div>
              <strong
                >The independent variable and how you will change it</strong
              >
              <span> This goes in the left-hand column of the table </span>
            </div>
          </div>

          <div class="formula-step">
            <div id="formula-step-dependent" class="formula-step-number">2</div>
            <div>
              <strong
                >The dependent variable and the measurements you make</strong
              >
              <span> Put in the column to the right </span>
            </div>
          </div>

          <div class="formula-step">
            <div id="formula-step-units" class="formula-step-number">3</div>
            <div>
              <strong>Repeat each test three times</strong>
              <span>
                Record each repeat as test 1, test 2, and test 3. This helps you
                to spot errors should they occur
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Section
      id="build-your-own-table"
      title="Complete a Scientific Table for the Ball-Bounce Experiment"
      last
      class="data-table-section"
    >
      <!-- ==================================================
     BALL BOUNCE EXPERIMENT SETUP
     ================================================== -->

      <div class="ball-bounce-setup">
        <div class="lesson3-planning-heading">
          <span>1</span>

          <div>
            <p class="lesson3-planning-eyebrow">Experiment setup</p>

            <h3>Look at the ball-bounce experiment</h3>
          </div>
        </div>

        <p class="lesson3-planning-instruction">
          A table tennis ball is dropped from the same height onto two different
          surfaces. The number of bounces is counted before the ball stops.
        </p>

        <div class="ball-bounce-setup-image">
          <img
            src="../images/lesson3/Ball Bounce.png"
            alt="Ball bounce experiment setup"
          />
        </div>
      </div>

      <!-- ==================================================
     BALL BOUNCE VARIABLES
     ================================================== -->

      <div class="ball-bounce-variables" id="ballBounceVariables">
        <div class="lesson3-planning-heading">
          <span>2</span>

          <div>
            <p class="lesson3-planning-eyebrow">Variables</p>

            <h3>Identify the variables in the fair test</h3>
          </div>
        </div>

        <p class="lesson3-planning-instruction">
          Complete the table to identify what is changed, what is measured, and
          what needs to stay the same.
        </p>

        <div class="ball-bounce-variables-table">
          <div class="ball-bounce-variable-row">
            <div class="ball-bounce-variable-label">
              <strong>Independent variable</strong>
              <span>What is changed?</span>
            </div>

            <div class="ball-bounce-variable-answer">
              <select id="ballBounceIndependent">
                <option value="">Choose...</option>
                <option value="surface">Type of surface</option>
                <option value="bounces">Number of bounces</option>
                <option value="ball">Type of ball</option>
              </select>
            </div>
          </div>

          <div class="ball-bounce-variable-row">
            <div class="ball-bounce-variable-label">
              <strong>Dependent variable</strong>
              <span>What is measured?</span>
            </div>

            <div class="ball-bounce-variable-answer">
              <select id="ballBounceDependent">
                <option value="">Choose...</option>
                <option value="surface">Type of surface</option>
                <option value="bounces">Number of bounces</option>
                <option value="height">Drop height</option>
              </select>
            </div>
          </div>

          <div class="ball-bounce-variable-row">
            <div class="ball-bounce-variable-label">
              <strong>Controlled variables</strong>
              <span>What must stay the same?</span>
            </div>

            <div
              class="ball-bounce-variable-answer ball-bounce-controlled-options"
            >
              <label>
                <input
                  type="checkbox"
                  value="same-ball"
                  data-ball-control="same-ball"
                />
                Same table tennis ball
              </label>

              <label>
                <input
                  type="checkbox"
                  value="same-height"
                  data-ball-control="same-height"
                />
                Same drop height
              </label>

              <label>
                <input
                  type="checkbox"
                  value="same-method"
                  data-ball-control="same-method"
                />
                Same dropping method
              </label>

              <label>
                <input
                  type="checkbox"
                  value="same-surface"
                  data-ball-control="same-surface"
                />
                Same surface
              </label>
            </div>
          </div>
        </div>
        <div
          id="ballBounceVariablesFeedback"
          class="variable-feedback"
          role="status"
          aria-live="polite"
          hidden
        >
          Choose the independent variable, dependent variable and controlled
          variables.
        </div>

        <div class="reset-button-container">
          <button
            type="button"
            id="ballBounceVariablesCheck"
            class="general-button"
          >
            Check Answers
          </button>
        </div>
      </div>

      <!-- ==================================================
          PLAN THE BALL BOUNCE INVESTIGATION
          ================================================== -->

      <div
        class="lesson3-planning-activity pop-in"
        id="ballBouncePlanning"
        hidden
      >
        <!-- ---------- TESTABLE QUESTION ---------- -->

        <div class="lesson3-planning-heading">
          <span>3</span>

          <div>
            <p class="lesson3-planning-eyebrow">Testable question</p>
            <h3>Create your testable question</h3>
          </div>
        </div>

        <p class="lesson3-planning-instruction">
          Choose a question structure, then enter the
          <strong>independent variable</strong> and
          <strong>dependent variable</strong> for your ball-bounce experiment.
        </p>

        <InvestigationQuestion
          name="ball-bounce-question"
          input-type="text"
          @change="question = $event"
        />

        <!-- ---------- REASONED PREDICTION ---------- -->

        <PredictionTable
          id="predictionTable"
          name="ball-bounce-prediction"
          class="pop-in"
          data-activity-depends-on="ballBounceQuestion"
          :context="predictionContext"
        >
          <template #before>
            <div class="lesson3-planning-heading prediction-heading">
              <span>4</span>
              <div>
                <p class="lesson3-planning-eyebrow">Reasoned prediction</p>
                <h3>Make your reasoned prediction</h3>
              </div>
            </div>
            <p class="lesson3-planning-instruction">
              Use your testable question to predict what you think will happen
              and explain why.
            </p>
          </template>
        </PredictionTable>

        <!-- ==================================================
     WHY REPEAT EACH TEST? - Insertion - initially this was in the yeast section
     ================================================== -->

        <div class="repeat-tests-inline pop-in" id="repeatTestsInline" hidden>
          <div class="repeat-tests-card">
            <div class="repeat-tests-explanation">
              <h3>Why repeat each test 3 times?</h3>

              <p>
                In a fair test experiment, we repeat each test
                <strong>3 times</strong> using the same conditions.
              </p>

              <p>We do this to:</p>

              <ul>
                <li>Check for mistakes when setting up each test.</li>
                <li>Check for errors when making measurements.</li>
                <li>Spot any strange results.</li>
                <li>Make the results more reliable and trustworthy.</li>
              </ul>
            </div>

            <div class="repeat-tests-example">
              <p class="repeat-tests-label">Example</p>

              <h3>Three table tennis-ball bounce tests</h3>

              <p>
                Look at the results from three repeats of the same table
                tennis-ball test.
              </p>

              <img
                class="repeat-tests-image"
                src="../images/lesson3/Repeat Tests.png"
                alt="Diagram showing three table tennis-ball bounce tests on grass, with one unusual result"
              />
            </div>
          </div>

          <div id="repeatTestsStop" class="stop-and-check">
            <div class="stop-and-check-content">
              <p>
                Look at the diagram above. A fair test was repeated 3 times to
                see how high a table tennis ball bounces on grass.
              </p>

              <p>
                <strong>Why is it important to repeat a test 3 times?</strong>
              </p>

              <p>
                <strong
                  >What would happen if you only did the first test?</strong
                >
              </p>
            </div>

            <div class="stop-and-check-answer" hidden>
              Repeating a test helps us check whether the results are consistent
              and makes it easier to spot mistakes or unusual results. If we
              only used one result, that result might be unusual or affected by
              an error, so our conclusion could be misleading.
            </div>

            <button
              type="button"
              class="stop-and-check-button general-button"
              onclick="ballBounceRepeatStopAndCheck(this)"
            >
              <p>Check Your Answer</p>
              <p class="bounce-symbol">✅</p>
            </button>
          </div>
        </div>
        <!-- ---------- OBSERVE THE EXPERIMENT ---------- -->
      </div>
      <div id="ballBounceTests" class="lesson3-planning-activity pop-in" hidden>
        <div class="lesson3-planning-heading observation-heading">
          <span>5</span>

          <div>
            <p class="lesson3-planning-eyebrow">Observe the experiment</p>
            <h3>Watch the ball-bounce tests</h3>
          </div>
        </div>

        <p class="lesson3-planning-instruction">
          Watch both videos and record the number of bounces from each test in
          your data table below.
        </p>

        <div class="ball-bounce-video-grid">
          <div class="ball-bounce-video-card">
            <p class="ball-bounce-video-label">Condition 1</p>
            <h3>Hard surface</h3>
            <p>Watch all three tests and record the number of bounces.</p>

            <button
              type="button"
              class="general-button watch-video-button"
              onclick="
                openLesson3Video(
                  this,
                  '../videos/lesson3/Hard Trial 2.mp4',
                  'Ball Bounce Experiment - Hard Surface',
                )
              "
            >
              <p class="bounce-symbol">▶</p>
              <p>Watch</p>
            </button>
          </div>

          <div class="ball-bounce-video-card">
            <p class="ball-bounce-video-label">Condition 2</p>
            <h3>Soft surface</h3>
            <p>Watch all three tests and record the number of bounces.</p>

            <button
              type="button"
              class="general-button watch-video-button"
              onclick="
                openLesson3Video(
                  this,
                  '../videos/lesson3/Soft Trial 2.mp4',
                  'Ball Bounce Experiment - Soft Surface',
                )
              "
            >
              <p class="bounce-symbol">▶</p>
              <p>Watch</p>
            </button>
          </div>
        </div>

        <div class="data-table-card bounce-table-card">
          <div class="custom-table-note">
            <p>Number boxes only accept numbers.</p>
            <p class="custom-table-note-detail">
              The variables in this experiment have no units, so you can leave
              the units boxes empty.
            </p>
          </div>
          <div class="experiment-table-scroll">
            <table
              class="experiment-table experiment-table-average custom-table"
              aria-label="Student-built experiment table"
            >
              <thead>
                <tr>
                  <th class="independent-heading" rowspan="2">
                    <div class="table-heading-fields">
                      <input
                        class="table-text-input axis-text-input lesson3-filtered-text"
                        type="text"
                        maxlength="50"
                        placeholder="Independent variable"
                        aria-label="Independent variable"
                      />

                      <input
                        class="table-text-input table-units-input lesson3-filtered-text"
                        type="text"
                        maxlength="15"
                        placeholder="Units"
                        aria-label="Independent variable units"
                      />
                    </div>
                  </th>

                  <th class="dependent-heading bounce-dependent" colspan="4">
                    <div class="table-heading-fields">
                      <input
                        class="table-text-input table-heading-input lesson3-filtered-text"
                        type="text"
                        maxlength="70"
                        placeholder="Dependent variable"
                        aria-label="Dependent variable"
                      />

                      <input
                        class="table-text-input table-units-input lesson3-filtered-text"
                        type="text"
                        maxlength="15"
                        placeholder="Units"
                        aria-label="Dependent variable units"
                      />
                    </div>
                  </th>
                </tr>

                <tr>
                  <th class="test-heading bounce-heading">
                    <input
                      class="table-text-input lesson3-filtered-text"
                      type="text"
                      maxlength="30"
                      placeholder="Test 1"
                      aria-label="First test heading"
                    />
                  </th>

                  <th class="test-heading bounce-heading">
                    <input
                      class="table-text-input lesson3-filtered-text"
                      type="text"
                      maxlength="30"
                      placeholder="Test 2"
                      aria-label="Second test heading"
                    />
                  </th>

                  <th class="test-heading bounce-heading">
                    <input
                      class="table-text-input lesson3-filtered-text"
                      type="text"
                      maxlength="30"
                      placeholder="Test 3"
                      aria-label="Third test heading"
                    />
                  </th>

                  <th class="average-heading">Average</th>
                </tr>
              </thead>
              <tbody>
                <tr data-input-average-row>
                  <th class="independent-value bounce-value">
                    <input
                      class="table-text-input lesson3-filtered-text"
                      type="text"
                      maxlength="35"
                      placeholder="Row label"
                      aria-label="First row label"
                    />
                  </th>
                  <td>
                    <input
                      class="table-number-input"
                      type="number"
                      step="any"
                      inputmode="decimal"
                      aria-label="First row test 1"
                    />
                  </td>
                  <td>
                    <input
                      class="table-number-input"
                      type="number"
                      step="any"
                      inputmode="decimal"
                      aria-label="First row test 2"
                    />
                  </td>
                  <td>
                    <input
                      class="table-number-input"
                      type="number"
                      step="any"
                      inputmode="decimal"
                      aria-label="First row test 3"
                    />
                  </td>
                  <td class="average-cell">
                    <button
                      class="average-button general-button"
                      type="button"
                      onclick="calculateInputAverage(this)"
                    >
                      Calculate
                    </button>
                  </td>
                </tr>
                <tr data-input-average-row>
                  <th class="independent-value bounce-value">
                    <input
                      class="table-text-input lesson3-filtered-text"
                      type="text"
                      maxlength="35"
                      placeholder="Row label"
                      aria-label="Second row label"
                    />
                  </th>
                  <td>
                    <input
                      class="table-number-input"
                      type="number"
                      step="any"
                      inputmode="decimal"
                      aria-label="Second row test 1"
                    />
                  </td>
                  <td>
                    <input
                      class="table-number-input"
                      type="number"
                      step="any"
                      inputmode="decimal"
                      aria-label="Second row test 2"
                    />
                  </td>
                  <td>
                    <input
                      class="table-number-input"
                      type="number"
                      step="any"
                      inputmode="decimal"
                      aria-label="Second row test 3"
                    />
                  </td>
                  <td class="average-cell">
                    <button
                      class="average-button general-button"
                      type="button"
                      onclick="calculateInputAverage(this)"
                    >
                      Calculate
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="reset-button-container lesson3-reset-container">
            <button
              type="button"
              class="general-button reset-btn"
              onclick="resetBallBounceTable()"
            >
              Reset
            </button>
          </div>
        </div>
        <div
          class="activity-feedback table-activity-feedback"
          id="customTableFeedback"
          hidden
        ></div>

        <MultipleChoice
          class="prediction-check"
          id="ballBouncePredictionCheck"
          hidden
          :options="ballBouncePredictionCheckOptions"
        >
          <p class="prediction-label">Interpret the results</p>

          <h3>Use your averages to interpret the results</h3>

          <div class="ball-bounce-interpretation">
            <div class="ball-bounce-interpretation-row">
              <span
                >The average number of bounces on a
                <strong>hard surface</strong> was</span
              >

              <input
                type="number"
                class="table-number-input result-average-input"
                step="any"
                inputmode="decimal"
                aria-label="Average number of bounces on the hard surface"
              />

              <span>bounces.</span>
            </div>

            <div class="ball-bounce-interpretation-row">
              <span
                >The average number of bounces on a
                <strong>soft surface</strong> was</span
              >

              <input
                type="number"
                class="table-number-input result-average-input"
                step="any"
                inputmode="decimal"
                aria-label="Average number of bounces on the soft surface"
              />

              <span>bounces.</span>
            </div>

            <div class="ball-bounce-prediction-result" data-mc-question>
              <strong>My reasoned prediction was</strong>

              <div class="prediction-buttons" data-mc-choices>
                <button
                  id="ballBouncePredictionSupported"
                  type="button"
                  data-mc-choice="supported"
                  class="general-button prediction-button"
                >
                  Supported
                </button>

                <button
                  id="ballBouncePredictionUnsupported"
                  type="button"
                  data-mc-choice="unsupported"
                  class="general-button prediction-button"
                >
                  Not supported
                </button>
              </div>
            </div>
          </div>
        </MultipleChoice>
      </div>
      <button
        type="button"
        class="save-work-button general-button"
        onclick="downloadLessonPDF()"
      >
        <p class="bounce-symbol">💾</p>
        <p>Save my work</p>
      </button>
    </Section>
    <!-- Lesson 3 inline video panel for data-entry videos -->
    <div class="video-dropdown-panel" id="lesson3VideoPanel" hidden>
      <div class="video-dropdown-header">
        <h2 id="lesson3VideoTitle">Video guide</h2>

        <button
          type="button"
          class="close-button"
          onclick="closeLesson3Video()"
          aria-label="Close video"
        >
          ×
        </button>
      </div>

      <video
        id="lesson3VideoPlayer"
        class="video-modal-player"
        controls
        preload="metadata"
      >
        Your browser does not support video playback.
      </video>
    </div>

    <div class="return-to-top">
      <a class="return-to-top-button general-button" href="#">
        <p class="bounce-symbol">↑</p>
        <p>Return to Top</p>
      </a>
    </div>
  </main>

  <!-- Shared functions include section unlocking, PDF printing and the cypher-based classroom language filter. -->
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Modal from "../components/Modal.vue";
import Section from "../components/Section.vue";
import InvestigationQuestion from "../components/activities/InvestigationQuestion.vue";
import MultipleChoice from "../components/activities/MultipleChoice.vue";
import PredictionTable from "../components/activities/PredictionTable.vue";

// The student's testable question fills in the prediction table's
// change / measure.
const question = ref({ structure: "", firstAnswer: "", secondAnswer: "", text: "" });
const predictionContext = computed(() => ({
  structure: question.value.structure,
  change: question.value.firstAnswer,
  measure: question.value.secondAnswer,
}));

// Options passed to the activity components

const ballBouncePredictionCheckOptions = {
  classes: {
    selected: "selected-answer",
    correct: "mc-correct",
    incorrect: "mc-incorrect",
  },
};
import LessonIntro from "../components/LessonIntro.vue";

// Terms shown in the vocabulary modal: { word: description }
const glossary = {
  Data: "The observations or measurements you collect during an investigation. Data can be numbers (e.g. temperature, height) or descriptions (e.g. colour, texture).",
  Units:
    "The standard amount or portion of something that is measured, e.g. cm for length, kg for weight, minutes for time.",
  Table: "An organised arrangement of columns and rows used to display data.",
  "Repeat tests":
    "The same test carried out two or more times under exactly the same conditions, to check that your results are consistent.",
  "Independent variable":
    "The one variable changed during a fair test experiment.",
  "Dependent variable":
    "The result that is observed or measured during a fair test experiment.",
};

// Original <head>/<body> resources of lesson3/lesson3-2.html, loaded in document order.
const scripts = [
  { src: "../scripts/common_functions.js" },
  { src: "../scripts/lesson_progress.js", type: "module" },
  {
    type: "module",
    code: String.raw`

            /* ==================================================
               VIDEO PANEL
               ================================================== */

            function openLesson3Video(button, videoSource, videoTitle) {
                const panel = document.getElementById("lesson3VideoPanel");
                const player = document.getElementById("lesson3VideoPlayer");

                player.pause();
                player.src = videoSource;
                document.getElementById("lesson3VideoTitle").textContent = videoTitle || "Video guide";

                button.closest(".ball-bounce-video-grid").insertAdjacentElement("afterend", panel);

                panel.hidden = false;
                player.load();
                panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            function closeLesson3Video() {
                const player = document.getElementById("lesson3VideoPlayer");

                player.pause();
                player.removeAttribute("src");
                player.load();

                document.getElementById("lesson3VideoPanel").hidden = true;
            }

            /* ==================================================
               BALL BOUNCE - IDENTIFY THE VARIABLES
               ================================================== */

            function initialiseBallBounceVariables() {
                const independent = document.getElementById("ballBounceIndependent");
                const dependent = document.getElementById("ballBounceDependent");
                const checkButton = document.getElementById("ballBounceVariablesCheck");
                const feedback = document.getElementById("ballBounceVariablesFeedback");

                checkButton.addEventListener("click", function () {
                    const controls = Array.from(document.querySelectorAll("[data-ball-control]:checked")).map(
                        function (checkbox) {
                            return checkbox.dataset.ballControl;
                        }
                    );

                    const correct =
                        independent.value === "surface" &&
                        dependent.value === "bounces" &&
                        ["same-ball", "same-height", "same-method"].every(function (control) {
                            return controls.includes(control);
                        }) &&
                        !controls.includes("same-surface");

                    feedback.hidden = false;
                    feedback.className = "variable-feedback " + (correct ? "feedback-success" : "feedback-try-again");
                    feedback.textContent = correct
                        ? "Correct! You identified the variables in the ball-bounce fair test."
                        : "Not quite. Check what is changed, what is measured, and what needs to stay the same.";

                    if (!correct) return;

                    const planning = document.getElementById("ballBouncePlanning");

                    planning.hidden = false;
                    planning.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    checkButton.disabled = true;
                });
            }

            /* ==================================================
               BALL BOUNCE - TESTABLE QUESTION AND REASONED PREDICTION
               The question feeds the prediction (it is unavailable until
               the question is complete); the "why repeat" block appears
               once the prediction is complete.
               ================================================== */

            let ballBounceQuestion = null;
            let ballBouncePrediction = null;

            function initialiseBallBounceQuestionAndPrediction() {
                ballBouncePrediction = getActivity("predictionTable");

                const repeatTests = document.getElementById("repeatTestsInline");

                document.addEventListener("activity:change", function (event) {
                    if (event.detail.id !== "predictionTable") return;

                    const wasHidden = repeatTests.hidden;

                    repeatTests.hidden = !event.detail.complete;

                    if (wasHidden && event.detail.complete) {
                        repeatTests.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                });
            }

            /* Reveals the data table after the "why repeat" check. */
            function ballBounceRepeatStopAndCheck(button) {
                showStopAndCheckAnswer(button, function () {
                    const tests = document.getElementById("ballBounceTests");

                    tests.hidden = false;
                    tests.scrollIntoView({ behavior: "smooth", block: "nearest" });
                });
            }

            /* ==================================================
               BALL BOUNCE - SAVED TABLE ENTRIES
               Every text and number box in the table (and the averages
               below it) turns into a saved answer with a clear button.
               The number stays on the hidden input so averages can read it.
               ================================================== */

            function initialiseTableEntries() {
                const inputs = document.querySelectorAll(
                    "#build-your-own-table .lesson3-filtered-text, #build-your-own-table .table-number-input"
                );

                inputs.forEach(function (input) {
                    const isNumber = input.type === "number";

                    const control = document.createElement("div");
                    control.className = "table-entry-control" + (isNumber ? " table-number-control" : "");

                    const inputRow = document.createElement("div");
                    inputRow.className = "table-entry-input-row";

                    const answerBox = document.createElement("div");
                    answerBox.className = "table-entry-answer" + (isNumber ? " table-number-answer" : "");
                    answerBox.setAttribute("aria-live", "polite");

                    input.parentElement.insertBefore(control, input);
                    control.appendChild(inputRow);
                    inputRow.appendChild(input);
                    control.appendChild(answerBox);

                    function saveEntry() {
                        let value;

                        if (isNumber) {
                            value = input.value.trim();

                            if (value === "") return;

                            if (!Number.isFinite(Number(value))) {
                                input.focus();
                                return;
                            }
                        } else {
                            value = getValidStudentInput(input);

                            if (value === null) return;
                        }

                        const answerText = document.createElement("span");
                        answerText.className = "table-entry-answer-text";
                        answerText.textContent = value;

                        const deleteButton = createDeleteAnswerButton("Clear " + value, function () {
                            answerBox.classList.remove("visible");
                            answerBox.innerHTML = "";
                            inputRow.style.display = "block";
                            input.value = "";

                            if (isNumber) resetAverageForNumberInput(input);

                            input.focus();
                        });

                        answerBox.innerHTML = "";
                        answerBox.appendChild(answerText);
                        answerBox.appendChild(deleteButton);

                        inputRow.style.display = "none";
                        answerBox.classList.add("visible");

                        if (!isNumber) input.value = "";
                    }

                    connectEnterAndBlurSave(input, saveEntry);
                });
            }

            /* ==================================================
               BALL BOUNCE - AVERAGES
               ================================================== */

            function formatAverage(value) {
                return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
            }

            function createCalculateButton() {
                const button = document.createElement("button");

                button.type = "button";
                button.classList.add("average-button", "general-button");
                button.textContent = "Calculate";
                button.addEventListener("click", function () {
                    calculateInputAverage(button);
                });

                return button;
            }

            /* Put a Calculate button back in place of a calculated average. */
            function restoreCalculateButton(cell) {
                cell.classList.remove("average-result");
                cell.innerHTML = "";
                cell.appendChild(createCalculateButton());
            }

            function resetAverageForNumberInput(input) {
                const row = input.closest("[data-input-average-row]");
                const cell = row && row.querySelector(".average-cell");

                if (cell && cell.classList.contains("average-result")) {
                    restoreCalculateButton(cell);
                }
            }

            function showAverageValue(button, average) {
                const cell = button.closest(".average-cell");

                cell.innerHTML = "";
                cell.classList.add("average-result");

                const resultWrapper = document.createElement("div");
                resultWrapper.className = "average-result-wrapper";

                const resultText = document.createElement("span");
                resultText.className = "average-result-value";
                resultText.textContent = formatAverage(average);

                const clearButton = document.createElement("button");
                clearButton.type = "button";
                clearButton.className = "average-clear-button";
                clearButton.textContent = "×";
                clearButton.setAttribute("aria-label", "Clear calculated average");
                clearButton.addEventListener("click", function () {
                    restoreCalculateButton(cell);
                });

                resultWrapper.appendChild(resultText);
                resultWrapper.appendChild(clearButton);
                cell.appendChild(resultWrapper);
            }

            function calculateInputAverage(button) {
                const row = button.closest("[data-input-average-row]");
                const feedback = document.getElementById("customTableFeedback");

                const values = Array.from(row.querySelectorAll(".table-number-input")).map(function (input) {
                    return input.value.trim() === "" ? NaN : Number(input.value);
                });

                if (values.some(Number.isNaN)) {
                    feedback.hidden = false;
                    feedback.className = "activity-feedback table-activity-feedback feedback-try-again";
                    feedback.innerHTML =
                        "<strong>Add all three results first.</strong><span>The average can be calculated once each test has a number.</span>";
                    return;
                }

                if (feedback.classList.contains("feedback-try-again")) {
                    feedback.hidden = true;
                }

                const total = values.reduce(function (sum, value) {
                    return sum + value;
                }, 0);

                showAverageValue(button, total / values.length);

                /* Once every average is calculated, the interpretation panel appears. */
                if (!document.querySelector("#build-your-own-table .average-button")) {
                    document.getElementById("ballBouncePredictionCheck").hidden = false;
                }
            }

            /* ==================================================
               BALL BOUNCE - INTERPRET THE RESULTS
               ================================================== */

            /* No right answer here: the activity only records which button is picked. */
            let ballBouncePredictionActivity = null;

            function initialisePredictionCheck() {
                ballBouncePredictionActivity = getActivity("ballBouncePredictionCheck");
            }

            /* ==================================================
               BALL BOUNCE - RESET
               ================================================== */

            function clearTableEntries(scope) {
                scope.querySelectorAll(".table-entry-control").forEach(function (control) {
                    control.querySelector("input").value = "";
                    control.querySelector(".table-entry-input-row").style.display = "block";

                    const answerBox = control.querySelector(".table-entry-answer");

                    answerBox.classList.remove("visible");
                    answerBox.innerHTML = "";
                });
            }

            function resetBallBounceTable() {
                const tableCard = document.querySelector("#build-your-own-table .bounce-table-card");

                clearTableEntries(tableCard);

                tableCard.querySelectorAll(".average-cell").forEach(restoreCalculateButton);

                const feedback = document.getElementById("customTableFeedback");

                feedback.hidden = true;
                feedback.innerHTML = "";

                /* The interpretation panel copies numbers from the table, so it goes back too. */
                const predictionCheck = document.getElementById("ballBouncePredictionCheck");

                predictionCheck.hidden = true;
                clearTableEntries(predictionCheck);

                ballBouncePredictionActivity.reset();
            }

            const DEV_MODE = false;
            if (DEV_MODE) window.addEventListener("DOMContentLoaded", teacherShowAll);

            const sectionIds = [
                { id: "build-your-own-table", label: "Ball bounce experiment: complete the table" },
                { id: "ballBouncePlanning", label: "Create Your Testable Question and Make Your Reasoned Prediction" },
                { id: "ballBounceTests", label: "Why Do We Repeat Experiments 3 Times?" },
            ];

            const teacherBackLink = {
                label: "← Back to Part A",
                href: "/lesson3",
            };

            document.addEventListener("DOMContentLoaded", function () {
                initialiseTeacherMenu(sectionIds, "build-your-own-table", teacherBackLink);

                initialiseTableEntries();
                initialiseBallBounceVariables();
                initialiseBallBounceQuestionAndPrediction();
                initialisePredictionCheck();
            });

          /* Called from inline handlers / shared scripts, which cannot see module scope. */
          Object.assign(window, { openLesson3Video, closeLesson3Video, ballBounceRepeatStopAndCheck, calculateInputAverage, resetBallBounceTable });`,
  },
];

function loadScript(def) {
  return new Promise((resolve) => {
    const el = document.createElement("script");
    if (def.type) el.type = def.type;
    if (def.src) {
      el.src = def.src;
      el.onload = el.onerror = resolve;
      document.body.appendChild(el);
    } else {
      if (def.type === "module") {
        // inline module scripts run async: wait until this one has finished
        window.__inlineScriptDone = resolve;
        el.onerror = resolve;
        el.textContent = def.code + "\n;window.__inlineScriptDone()";
        document.body.appendChild(el);
      } else {
        el.textContent = def.code;
        document.body.appendChild(el);
        resolve();
      }
    }
  });
}

onMounted(async () => {
  document.title =
    "Lesson 3 Part B - Using a Table to Record Data for a Fair Test";
  for (const def of scripts) await loadScript(def);
  // the original scripts wait for DOMContentLoaded, which has already fired
  document.dispatchEvent(new Event("DOMContentLoaded"));
  window.dispatchEvent(new Event("DOMContentLoaded"));
});
</script>
