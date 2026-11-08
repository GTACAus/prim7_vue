<script>
import { Activity, whenCommonFunctionsReady } from './activity-base.js'

/* ==================================================
   REASONED PREDICTION TABLE
   A graphic-organiser activity: pick a cause/effect relationship between
   a testable question's two variables, then write a reason, to build one
   full "reasoned prediction" sentence. Pair with activity-base.js and
   styles/reasoned_prediction_builder.css.

   Markup contract:

     <div id="myPrediction" data-activity>
       <div data-prediction-change class="generated-text placeholder">...</div>
       <!-- or <select data-prediction-change>...</select> for a standalone
            activity that isn't fed by an outside testable-question builder -->
       <div data-prediction-measure class="generated-text placeholder">...</div>

       <select data-prediction-cause-type>
         <option value="">Choose a relationship type</option>
         <option value="increase-decrease">Increase / decrease</option>
         <option value="with-without">With / without</option>
         <option value="condition-comparison">Condition 1 versus condition 2</option>
       </select>
       <div data-prediction-cause-buttons></div>             <!-- filled in by the activity -->
       <div data-prediction-condition-inputs>                 <!-- shown only for condition-comparison -->
         <input data-prediction-condition-one placeholder="Starting condition, e.g. blue">
         <input data-prediction-condition-two placeholder="New condition, e.g. red">
       </div>

       <div>
         <button type="button" data-prediction-effect="increase">Increase</button>
         <button type="button" data-prediction-effect="decrease">Decrease</button>
         <button type="button" data-prediction-effect="stay-the-same">Stay the same</button>
       </div>

       <div data-prediction-cause-text class="generated-text placeholder">...</div>
       <div data-prediction-effect-text class="generated-text placeholder">...</div>

       <div data-prediction-reason-row>
         <!-- the reason, condition 1 and condition 2 boxes are <StudentEntry>s -->
       </div>
       <div data-prediction-reason-answer></div>

       <div data-prediction-full-text class="generated-text final-prediction placeholder">...</div>
     </div>

   Usage:

     const activity = new PredictionTableActivity(document.getElementById("myPrediction"));

     // Call this whenever an outside "design a testable question" builder
     // changes structure/change/measure. Not needed when data-prediction-change
     // and data-prediction-measure are <select> elements of their own -
     // those drive the activity directly.
     activity.setContext({ structure: "if", change: "the ramp angle", measure: "distance travelled" });

   data-prediction-change/-measure elements that aren't <select>s take their
   placeholder text from a data-placeholder attribute, falling back to
   "The thing I am changing" / "The thing I am measuring".

   The activity is data-activity-complete once a full prediction sentence
   and a reason have both been written. A [data-reset-trigger] button
   inside the root clears everything back to its starting placeholders.
   ================================================== */


var DEFAULT_CAUSE_OPTIONS = {
  "increase-decrease": [
    { value: "increase", label: "Increase" },
    { value: "decrease", label: "Decrease" }
  ],
  "with-without": [
    { value: "with", label: "With" },
    { value: "without", label: "Without" }
  ],
  "condition-comparison": [
    { value: "condition-one-to-two", label: "Condition 1" },
    { value: "condition-two-to-one", label: "Condition 2" }
  ]
};

var EFFECT_PHRASES = {
  increase: "increase",
  decrease: "decrease",
  "stay-the-same": "stay the same"
};

function PredictionTableActivity(root, options) {
  Activity.call(this, root, options);

  this.causeOptions = this.options.causeOptions || DEFAULT_CAUSE_OPTIONS;

  this.els = {
    change: root.querySelector("[data-prediction-change]"),
    measure: root.querySelector("[data-prediction-measure]"),
    causeType: root.querySelector("[data-prediction-cause-type]"),
    causeButtons: root.querySelector("[data-prediction-cause-buttons]"),
    conditionInputs: root.querySelector("[data-prediction-condition-inputs]"),
    conditionOne: root.querySelector("[data-prediction-condition-one]"),
    conditionTwo: root.querySelector("[data-prediction-condition-two]"),
    effectButtons: root.querySelectorAll("[data-prediction-effect]"),
    causeText: root.querySelector("[data-prediction-cause-text]"),
    effectText: root.querySelector("[data-prediction-effect-text]"),
    reasonEntry: root.querySelector("[data-prediction-reason]"),
    fullText: root.querySelector("[data-prediction-full-text]")
  };

  this.usesDropdowns = Boolean(this.els.change) && this.els.change.tagName === "SELECT";

  this.context = { structure: this.usesDropdowns ? "if" : "", change: "", measure: "" };
  this.selectedCause = "";
  this.selectedEffect = "";
  this.reason = "";

  this._bind();
  this._renderCauseButtons();
}

PredictionTableActivity.prototype = Object.create(Activity.prototype);
PredictionTableActivity.prototype.constructor = PredictionTableActivity;

/* ---------- public API ---------- */

/* Call whenever an outside "design a testable question" builder changes
   structure/change/measure. */
PredictionTableActivity.prototype.setContext = function (context) {
  context = context || {};
  this.context.structure = context.structure || "if";

  if (!this.usesDropdowns) {
    this.context.change = context.change || "";
    this.context.measure = context.measure || "";
    this._setVariableText(this.els.change, this.context.change);
    this._setVariableText(this.els.measure, this.context.measure);
  }

  this._render();
};

PredictionTableActivity.prototype.reset = function () {
  this.reason = "";
  this.selectedCause = "";
  this.selectedEffect = "";

  this._resetEntry(this.els.reasonEntry);

  this.context.structure = this.usesDropdowns ? "if" : "";
  this.context.change = "";
  this.context.measure = "";

  if (this.usesDropdowns) {
    this.els.change.selectedIndex = 0;
    this.els.measure.selectedIndex = 0;
  } else {
    this._setVariableText(this.els.change, "");
    this._setVariableText(this.els.measure, "");
  }

  if (this.els.causeType) this.els.causeType.selectedIndex = 0;
  this._resetEntry(this.els.conditionOne);
  this._resetEntry(this.els.conditionTwo);
  if (this.els.conditionInputs) this.els.conditionInputs.classList.remove("visible");

  Array.prototype.forEach.call(this.els.effectButtons, function (button) {
    button.classList.remove("selected");
  });

  this._renderCauseButtons();
};

/* ---------- wiring ---------- */

PredictionTableActivity.prototype._bind = function () {
  var self = this;

  if (this.usesDropdowns) {
    this.els.change.addEventListener("change", function () { self._render(); });
    this.els.measure.addEventListener("change", function () { self._render(); });
  }

  if (this.els.causeType) {
    this.els.causeType.addEventListener("change", function () { self._renderCauseButtons(); });
  }

  /* The two condition boxes and the reason are <StudentEntry>s: the answer is on the
     wrapper's data-value, and it fires "entry:change" when that changes. */
  if (this.els.conditionOne) this.els.conditionOne.addEventListener("entry:change", function () { self._render(); });
  if (this.els.conditionTwo) this.els.conditionTwo.addEventListener("entry:change", function () { self._render(); });

  Array.prototype.forEach.call(this.els.effectButtons, function (button) {
    button.addEventListener("click", function () { self._selectEffect(button); });
  });

  if (this.els.reasonEntry) {
    this.els.reasonEntry.addEventListener("entry:change", function () {
      self.reason = self.els.reasonEntry.dataset.value || "";
      self._render();
    });
  }
};

/* ---------- rendering ---------- */

PredictionTableActivity.prototype._setVariableText = function (element, value) {
  if (!element) return;
  setGeneratedText(element, value, element.dataset.placeholder || "The thing I am changing");
};

PredictionTableActivity.prototype._renderCauseButtons = function () {
  var self = this;

  if (this.els.causeType && this.els.causeButtons) {
    var relationshipType = this.els.causeType.value;
    var choices = this.causeOptions[relationshipType] || [];

    this.selectedCause = "";
    this.els.causeButtons.innerHTML = "";

    choices.forEach(function (choice) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "relationship-option";
      button.textContent = choice.label;

      button.addEventListener("click", function () {
        self.selectedCause = choice.value;
        Array.prototype.forEach.call(self.els.causeButtons.querySelectorAll(".relationship-option"), function (other) {
          other.classList.remove("selected");
        });
        button.classList.add("selected");
        self._render();
      });

      self.els.causeButtons.appendChild(button);
    });

    if (this.els.conditionInputs) {
      this.els.conditionInputs.classList.toggle("visible", relationshipType === "condition-comparison");
    }
  }

  this._render();
};

PredictionTableActivity.prototype._selectEffect = function (button) {
  this.selectedEffect = button.dataset.predictionEffect;
  Array.prototype.forEach.call(this.els.effectButtons, function (other) { other.classList.remove("selected"); });
  button.classList.add("selected");
  this._render();
};

PredictionTableActivity.prototype._resetEntry = function (entry) {
  if (entry) entry.dispatchEvent(new CustomEvent("entry:reset"));
};

PredictionTableActivity.prototype._render = function () {
  var change = this.usesDropdowns ? (this.els.change.value || "") : this.context.change;
  var measure = this.usesDropdowns ? (this.els.measure.value || "") : this.context.measure;

  this.context.change = change;
  this.context.measure = measure;

  var prediction = this._buildPredictionPhrases(change, measure);

  if (this.els.causeText) setGeneratedText(this.els.causeText, prediction.cause, "Choose a cause relationship.");
  if (this.els.effectText) setGeneratedText(this.els.effectText, prediction.effect, "Choose an effect or result.");

  var fullPrediction = "";
  if (prediction.cause !== "" && prediction.effect !== "") {
    var separator = (this.context.structure === "how" || this.context.structure === "does") ? " " : ", ";
    fullPrediction = prediction.cause + separator + prediction.effect + ".";
  }

  var complete = fullPrediction !== "" && this.reason !== "";
  if (complete) fullPrediction += " This is because " + this.reason + ".";

  if (this.els.fullText) {
    setGeneratedText(this.els.fullText, fullPrediction, "Complete the organiser to build your reasoned prediction.");
  }

  this.setComplete(complete);
};

PredictionTableActivity.prototype._buildPredictionPhrases = function (change, measure) {
  var structure = this.context.structure;
  var causeAction = this._getCauseActionPhrase(change);
  var effectAction = EFFECT_PHRASES[this.selectedEffect] || "";

  if (!structure || !measure || !causeAction || !effectAction) {
    return { cause: "", effect: "" };
  }

  switch (structure) {
    /* When I change the _____, what happens to the _____? */
    case "what":
      return {
        cause: "When I " + causeAction.verb,
        effect: measure + " will " + effectAction
      };

    /* How does changing the _____ affect the _____? */
    case "how":
    case "does":
      return {
        cause: causeAction.gerund.charAt(0).toUpperCase() + causeAction.gerund.slice(1),
        effect: "will cause " + measure + " to " + effectAction
      };

    /* If I change the _____, what happens to the _____? */
    case "if":
      return {
        cause: "If I " + causeAction.verb,
        effect: "then " + measure + " will " + effectAction
      };

    default:
      return { cause: "", effect: "" };
  }
};

PredictionTableActivity.prototype._getCauseActionPhrase = function (change) {
  if (!change || !this.selectedCause) return null;

  var conditionOne = this.els.conditionOne ? this.els.conditionOne.dataset.value || "" : "";
  var conditionTwo = this.els.conditionTwo ? this.els.conditionTwo.dataset.value || "" : "";

  switch (this.selectedCause) {
    case "increase":
      return { verb: "increase " + change, gerund: "increasing " + change };

    case "decrease":
      return { verb: "decrease " + change, gerund: "decreasing " + change };

    case "with":
      return {
        verb: "conduct the experiment with " + change,
        gerund: "conducting the experiment with " + change
      };

    case "without":
      return {
        verb: "conduct the experiment without " + change,
        gerund: "conducting the experiment without " + change
      };

    case "condition-one-to-two":
      return {
        verb: "change " + change + " from " + (conditionOne || "condition 1") + " to " + (conditionTwo || "condition 2"),
        gerund: "changing " + change + " from " + (conditionOne || "condition 1") + " to " + (conditionTwo || "condition 2")
      };

    case "condition-two-to-one":
      return {
        verb: "change " + change + " from " + (conditionTwo || "condition 2") + " to " + (conditionOne || "condition 1"),
        gerund: "changing " + change + " from " + (conditionTwo || "condition 2") + " to " + (conditionOne || "condition 1")
      };

    default:
      return null;
  }
};
</script>

<script setup>
/*
  <PredictionTable> wraps the markup of one activity (the data-* contract described
  above) and starts PredictionTableActivity on it once mounted.

    <PredictionTable id="reasonedPredictionActivity" :change-options="[...]" :measure-options="[...]" show-reset />
    <PredictionTable id="predictionTable">            <!-- filled from an InvestigationQuestion -->
      <template #before> ...heading... </template>
    </PredictionTable>

  - id, class and any data-* attributes fall through to the root element
    (tag="section" etc. changes the element; default is div).
  - options is the options object of PredictionTableActivity. Callbacks (onChange, ...) are
    read when they fire, so a page script can attach one after mount:
      getActivity("myActivity").options.onChange = function () { ... }
  - the activity instance is also reachable from the page as getActivity(id).
*/
import { onBeforeUnmount, onMounted, ref } from 'vue'
import StudentEntry from '../StudentEntry.vue'

const props = defineProps({
  tag: { type: String, default: 'div' },
  options: { type: Object, default: () => ({}) },
  // Lower-case phrases the student picks from ("the angle of the ramp"). Leave both
  // out when the change / measure boxes are filled in from an <InvestigationQuestion>
  // (the page calls setContext() on this activity).
  changeOptions: { type: Array, default: null },
  measureOptions: { type: Array, default: null },
  // add a Reset button under the organiser
  showReset: { type: Boolean, default: false },
})

function optionLabel(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const root = ref(null)
let activity = null

onMounted(() => {
  whenCommonFunctionsReady(() => {
    activity = new PredictionTableActivity(root.value, { ...props.options })
  })
})

onBeforeUnmount(() => {
  activity = null
})

defineExpose({ getActivity: () => activity })
</script>

<template>
  <component :is="tag" ref="root" data-activity>
    <!-- anything that sits above the organiser, e.g. a heading -->
    <slot name="before" />

    <div class="reasoned-builder">
      <div class="prediction-organiser" aria-label="Reasoned prediction graphic organiser">
        <div class="prediction-organiser-row row-header">
          <div class="prediction-organiser-cell"><span class="cell-sublabel"></span></div>
          <div class="prediction-organiser-cell"><span class="cell-sublabel">Change this</span></div>
          <div class="prediction-organiser-cell"><span class="cell-sublabel">Measure this</span></div>
        </div>

        <div class="prediction-organiser-row row-variables">
          <div class="prediction-organiser-cell cell-label">
            <span class="cell-sublabel">Testable Question</span>
            <span class="cell-helper">Identify the two things in your testable question</span>
          </div>

          <div class="prediction-organiser-cell">
            <label class="cell-sublabel" for="changeVariable">The thing I am changing</label>

            <select v-if="changeOptions" id="changeVariable" data-prediction-change class="prediction-select">
              <option value="">Choose what you are changing</option>
              <option v-for="option in changeOptions" :key="option" :value="option">{{ optionLabel(option) }}</option>
            </select>
            <div
              v-else
              id="changeVariable"
              data-prediction-change
              data-placeholder="The thing I am changing"
              class="generated-text placeholder"
            >
              The thing I am changing
            </div>
          </div>

          <div class="prediction-organiser-cell">
            <label class="cell-sublabel" for="measureVariable">The thing I am measuring</label>

            <select v-if="measureOptions" id="measureVariable" data-prediction-measure class="prediction-select">
              <option value="">Choose what you are measuring</option>
              <option v-for="option in measureOptions" :key="option" :value="option">{{ optionLabel(option) }}</option>
            </select>
            <div
              v-else
              id="measureVariable"
              data-prediction-measure
              data-placeholder="The thing I am measuring"
              class="generated-text placeholder"
            >
              The thing I am measuring
            </div>
          </div>
        </div>

        <div class="prediction-organiser-row row-relationship">
          <div class="prediction-organiser-cell cell-label">
            <span class="cell-sublabel">Relationship</span>
            <span class="cell-helper">Choose what you will change and what you think will happen</span>
          </div>
          <div class="prediction-organiser-cell">
            <label class="cell-sublabel" for="causeRelationshipType">Cause</label>
            <div class="relationship-area">
              <select id="causeRelationshipType" data-prediction-cause-type class="prediction-select">
                <option value="">Choose a relationship type</option>
                <option value="increase-decrease">Increase / decrease</option>
                <option value="with-without">With / without</option>
                <option value="condition-comparison">Condition 1 versus condition 2</option>
              </select>
              <div data-prediction-cause-buttons class="relationship-buttons"></div>

              <div data-prediction-condition-inputs class="condition-comparison-inputs">
                <StudentEntry
                  data-prediction-condition-one
                  :max="1"
                  input-class="condition-input"
                  placeholder="Starting condition, e.g. blue"
                  aria-label="Starting condition"
                  list-class="submitted-answer"
                />
                <StudentEntry
                  data-prediction-condition-two
                  :max="1"
                  input-class="condition-input"
                  placeholder="New condition, e.g. red"
                  aria-label="New condition"
                  list-class="submitted-answer"
                />
              </div>
            </div>
          </div>
          <div class="prediction-organiser-cell">
            <span class="cell-sublabel">Effect or result</span>
            <div class="relationship-buttons three-options">
              <button type="button" class="relationship-option" data-prediction-effect="increase">Increase</button>
              <button type="button" class="relationship-option" data-prediction-effect="decrease">Decrease</button>
              <button type="button" class="relationship-option" data-prediction-effect="stay-the-same">Stay the same</button>
            </div>
          </div>
        </div>

        <div class="prediction-organiser-row row-prediction">
          <div class="prediction-organiser-cell cell-label"><span class="cell-sublabel">Prediction</span></div>
          <div class="prediction-organiser-cell"><div data-prediction-cause-text class="generated-text placeholder">Choose a cause relationship.</div></div>
          <div class="prediction-organiser-cell"><div data-prediction-effect-text class="generated-text placeholder">Choose an effect or result.</div></div>
        </div>

        <div class="prediction-organiser-row row-reason">
          <div class="prediction-organiser-cell cell-label"><span class="cell-sublabel">Reason</span></div>
          <div class="prediction-organiser-cell span-2 reason-inline">
            <label class="cell-helper" for="reasonInput">This is because...</label>
            <StudentEntry
              data-prediction-reason
              :max="1"
              input-id="reasonInput"
              input-class="prediction-input"
              placeholder="Explain why you expect this result"
              row-class="permanent-input-row"
              list-class="submitted-answer"
            />
          </div>
        </div>

        <div class="prediction-organiser-row row-full">
          <div class="prediction-organiser-cell cell-label"><span class="cell-sublabel">Reasoned prediction</span></div>
          <div class="prediction-organiser-cell span-2">
            <div data-prediction-full-text class="generated-text final-prediction placeholder" aria-live="polite">Complete the organiser to build your reasoned prediction.</div>
          </div>
        </div>
      </div>

      <div v-if="showReset" class="reset-button-container">
        <button type="button" class="reset-btn general-button" data-reset-trigger>Reset</button>
      </div>
    </div>

    <!-- anything that sits below the organiser -->
    <slot />
  </component>
</template>

<style>
/* ==================================================
   REASONED PREDICTION BUILDER
   
   The prediction organiser table, embedded directly in
   lesson1.html, lesson2.html and lesson3.html.
   ================================================== */

.reasoned-builder {
	width: min(1080px, 100%);
	margin: 0 auto;
}

.prediction-organiser {
	overflow: hidden;
	border: 3px solid var(--line);
	border-radius: 20px;
	box-shadow: 0 5px 0 var(--line);
}

.prediction-organiser-row {
	display: grid;
	grid-template-columns: 180px minmax(0, 1fr) minmax(0, 1fr);
	border-bottom: 2px solid var(--line);
}

.prediction-organiser-row:last-child {
	border-bottom: none;
}

.prediction-organiser-cell {
	min-width: 0;
	padding: 14px 18px;
	border-right: 2px solid var(--line);
	font-size: 0.95rem;
	line-height: 1.55;
}

.prediction-organiser-cell:last-child {
	border-right: none;
}

.prediction-organiser-cell.span-2 {
	grid-column: span 2;
	border-right: none;
}

.row-header {
	background: var(--purple);
}

.row-header .prediction-organiser-cell {
	color: var(--paper);
	font-size: 1rem;
	font-weight: 700;
}

.row-variables {
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

.cell-label {
	background: rgba(0, 0, 0, 0.04);
	font-weight: 700;
}

.cell-sublabel {
	display: block;
	margin-bottom: 5px;
	color: var(--purple);
	font-size: 0.82rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.row-header .cell-sublabel {
	color: var(--cream);
}

.cell-helper {
	display: block;
	color: var(--muted);
	font-size: 0.88rem;
	font-style: italic;
	line-height: 1.5;
}

.prediction-input,
.prediction-select,
.condition-input {
	width: 100%;
	min-height: 44px;
	padding: 9px 11px;
	box-sizing: border-box;
	background: white;
	color: var(--text);
	border: 2px solid var(--line);
	border-radius: 10px;
	font: inherit;
}

.prediction-input:focus,
.prediction-select:focus,
.condition-input:focus {
	outline: 3px solid rgba(78, 50, 232, 0.18);
	border-color: var(--purple);
}

.permanent-input-row {
	display: block;
}

.submitted-answer {
	display: none;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	width: 100%;
	min-height: 44px;
	padding: 9px 11px;
	box-sizing: border-box;
	background: var(--soft-green);
	color: var(--text);
	border: 2px solid var(--line);
	border-radius: 10px;
	font-weight: 700;
}

.submitted-answer.visible {
	display: flex;
}

.submitted-answer .delete-answer {
	flex: 0 0 auto;
}

.relationship-area {
	display: grid;
	gap: 10px;
}

.relationship-buttons {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 8px;
}

.relationship-buttons.three-options {
	grid-template-columns: repeat(3, minmax(0, 1fr));
}

.relationship-option {
	min-height: 42px;
	padding: 8px 10px;
	background: white;
	color: var(--text);
	border: 2px solid var(--line);
	border-radius: 10px;
	font: inherit;
	font-weight: 700;
	cursor: pointer;
}

.relationship-option:hover {
	background: var(--soft-purple);
  cursor: pointer;
}

.prediction-select:hover {
  cursor: pointer;
}

.relationship-option.selected {
	background: var(--purple);
	color: white;
}

.condition-comparison-inputs {
	display: none;
	grid-template-columns: 1fr 1fr;
	gap: 8px;
}

.condition-comparison-inputs.visible {
	display: grid;
}

.generated-text {
	min-height: 48px;
	padding: 10px 12px;
	background: rgba(255, 255, 255, 0.55);
	border: 2px solid var(--line);
	border-radius: 10px;
	font-weight: 700;
	line-height: 1.5;
}

.generated-text.placeholder {
	color: var(--muted);
	font-weight: 500;
}

.reason-inline {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.reason-inline .cell-helper {
	flex: 0 0 auto;
	margin: 0;
	white-space: nowrap;

	color: var(--purple);
	font-size: 0.82rem;
	font-weight: 700;
	font-style: normal;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.reason-inline .permanent-input-row {
	flex: 1;
	min-width: 0;
}

.reason-inline .prediction-input {
	width: 100%;
}

.reason-inline .submitted-answer {
	flex: 1;
	min-width: 0;
}

.prediction-select {
	max-width: 100%;
	text-overflow: ellipsis;
}

.prediction-organiser-cell {
	overflow-wrap: anywhere;
}

.final-prediction {
	background: var(--soft-green);
	font-size: inherit;
}

.reset-button-container {
	display: flex;
	justify-content: center;
	margin-top: 18px;
}

@media (max-width: 1050px) {
	.prediction-organiser-row {
		grid-template-columns:
			155px minmax(0, 1fr) minmax(0, 1fr);
	}

	.prediction-organiser-cell {
		padding: 12px 14px;
		font-size: 0.9rem;
	}

	.cell-sublabel {
		font-size: 0.76rem;
	}

}

@media (max-width: 820px) {
	.reasoned-builder {
		width: 100%;
	}

	.prediction-organiser-row {
		grid-template-columns:
			118px minmax(0, 1fr) minmax(0, 1fr);
	}

	.prediction-organiser-cell {
		padding: 9px 10px;
		font-size: 0.78rem;
		line-height: 1.35;
	}

	.cell-sublabel {
		margin-bottom: 4px;
		font-size: 0.67rem;
		letter-spacing: 0.025em;
	}

	.cell-helper {
		font-size: 0.72rem;
		line-height: 1.35;
	}

	.prediction-input,
	.prediction-select,
	.condition-input {
		min-height: 38px;
		padding: 7px 8px;
		font-size: 0.78rem;
	}

	.relationship-option {
		min-height: 38px;
		padding: 6px 5px;
		font-size: 0.76rem;
	}

	.generated-text {
		min-height: 42px;
		padding: 8px 9px;
		font-size: 0.76rem;
		line-height: 1.35;
	}

	.reason-inline {
		gap: 8px;
	}

	.reason-inline .cell-helper {
		font-size: 0.66rem;
		white-space: nowrap;
	}

	.final-prediction {
		font-size: 0.8rem;
	}

	.reset-button-container {
		margin-top: 14px;
	}

	.reset-btn {
		padding: 9px 16px;
		font-size: 0.8rem;
	}
}

@media (max-width: 600px) {
	.prediction-organiser-row {
		grid-template-columns:
			92px minmax(0, 1fr) minmax(0, 1fr);
	}

	.prediction-organiser-cell {
		padding: 7px 6px;
		font-size: 0.67rem;
	}

	.cell-sublabel {
		font-size: 0.58rem;
	}

	.cell-helper {
		font-size: 0.62rem;
	}

	.prediction-input,
	.prediction-select,
	.condition-input {
		min-height: 34px;
		padding: 5px 6px;
		font-size: 0.68rem;
	}

	.relationship-buttons,
	.relationship-buttons.three-options,
	.condition-comparison-inputs {
		gap: 4px;
		grid-template-columns: 1fr;

	}

	.relationship-option {
		min-height: 34px;
		padding: 4px 3px;
		font-size: 0.64rem;
	}

	.generated-text {
		min-height: 36px;
		padding: 6px;
		font-size: 0.65rem;
	}

	.reason-inline {
		gap: 5px;
	}

	.reason-inline .cell-helper {
		font-size: 0.56rem;
	}

	.final-prediction {
		font-size: 0.68rem;
	}
}

.reasoned-prediction-embed-box {
  width: 100%;
  height: 1150px;
  padding: 12px;

  overflow: hidden;

  background: var(--soft-blue);
  border: 1px dashed var(--line);
  border-radius: 20px;
}

.reasoned-prediction-iframe {
  display: block;

  width: 100%;
  height: 100%;

  background: white;
  border: none;
  border-radius: 16px;
}

@media (max-width: 820px) {
  .reasoned-prediction-embed-box {
    height: 2050px;
  }
}
</style>
