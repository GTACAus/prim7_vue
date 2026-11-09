<script>
import { ActivityBase, whenCommonFunctionsReady } from './Activity.vue'

/* ==================================================
   INVESTIGATION (TESTABLE) QUESTION BUILDER
   Pick a question structure ("If I change the ___, what happens to the
   ___?"), then fill in its two blanks from a list of variables, to build
   one testable question. Pair with Activity.vue.

   Markup contract:

     <div id="myQuestion" data-activity>
       <div>
         <button type="button" data-question-structure="what" aria-pressed="false">
           When I change the ______, what happens to the ______?
         </button>
         <button type="button" data-question-structure="how" aria-pressed="false">...</button>
         <button type="button" data-question-structure="does" aria-pressed="false">...</button>
         <button type="button" data-question-structure="if" aria-pressed="false">...</button>
       </div>

       <div data-question-builder aria-live="polite">
         <p class="question-builder-placeholder">Select a question structure above to begin.</p>
       </div>
     </div>

   Usage:

     const activity = new InvestigationQuestionActivity(root, {
       variableOptions: ["ball size", "ball material", "drop height", ...],
       onChange: function(state) { ... }   // see getState() below
       // templates: {...}  // optional - see DEFAULT_TEMPLATES for the shape
     });

   options.variableOptions is the list of words/phrases offered in each
   blank's dropdown - always page-specific (different lessons study
   different variables), so there's no default: pass it in.

   options.inputType: "text" makes each blank a free-text field (saved on
   Enter or blur, checked by the classroom language filter) instead of a
   dropdown; variableOptions is then not needed. options.textInputClass
   sets that field's class (default "question-blank-input").

   options.templates optionally overrides the four built-in question
   structures (what/how/does/if). Each entry is:
     { parts: [before-first-blank, between-blanks, after-second-blank],
       firstPlaceholder, secondPlaceholder }

   API (beyond the shared Activity API - isComplete/reset/...):
     activity.getState() -> { structure, firstAnswer, secondAnswer, text }
       text is the fully-written question once both blanks are filled,
       else "".
     root event "question:change" -> same as onChange (detail = state)

   The activity is data-activity-complete once a structure is chosen and
   both blanks are filled in.
   ================================================== */


var DEFAULT_TEMPLATES = {
  what: {
    parts: ["When I change the ", ", what happens to the ", "?"],
    firstPlaceholder: "What will you change?",
    secondPlaceholder: "What will you measure?"
  },
  how: {
    parts: ["How does changing the ", " affect the ", "?"],
    firstPlaceholder: "What will you change?",
    secondPlaceholder: "What will you measure?"
  },
  does: {
    parts: ["Does changing the ", " affect the ", "?"],
    firstPlaceholder: "What will you change?",
    secondPlaceholder: "What will you measure?"
  },
  if: {
    parts: ["If I change the ", ", what happens to the ", "?"],
    firstPlaceholder: "What will you change?",
    secondPlaceholder: "What will you measure?"
  }
};

function InvestigationQuestionActivity(root, options) {
  ActivityBase.call(this, root, options);

  this.templates = this.options.templates || DEFAULT_TEMPLATES;
  this.variableOptions = this.options.variableOptions || [];

  this.structureButtons = root.querySelectorAll("[data-question-structure]");
  this.builder = root.querySelector("[data-question-builder]");
  this.completedElement = null;

  this.state = { structure: "", firstAnswer: "", secondAnswer: "" };

  var self = this;
  Array.prototype.forEach.call(this.structureButtons, function (button) {
    button.addEventListener("click", function () {
      self._selectStructure(button.dataset.questionStructure);
    });
  });

  this._renderPlaceholder();
  this.setComplete(false);
}

InvestigationQuestionActivity.prototype = Object.create(ActivityBase.prototype);
InvestigationQuestionActivity.prototype.constructor = InvestigationQuestionActivity;

/* ---------- public API ---------- */

InvestigationQuestionActivity.prototype.getState = function () {
  return {
    structure: this.state.structure,
    firstAnswer: this.state.firstAnswer,
    secondAnswer: this.state.secondAnswer,
    text: this._getCompletedText()
  };
};

InvestigationQuestionActivity.prototype.reset = function () {
  this.state = { structure: "", firstAnswer: "", secondAnswer: "" };

  Array.prototype.forEach.call(this.structureButtons, function (button) {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });

  this._renderPlaceholder();
  this._notify();
  this.setComplete(false);
};

/* ---------- rendering ---------- */

InvestigationQuestionActivity.prototype._renderPlaceholder = function () {
  if (!this.builder) return;
  this.completedElement = null;
  this.builder.classList.remove("builder-active");
  this.builder.innerHTML = '<p class="question-builder-placeholder">Select a question structure above to begin.</p>';
};

InvestigationQuestionActivity.prototype._selectStructure = function (structureName) {
  var template = this.templates[structureName];
  if (!template || !this.builder) return;

  this.state = { structure: structureName, firstAnswer: "", secondAnswer: "" };

  Array.prototype.forEach.call(this.structureButtons, function (button) {
    var isSelected = button.dataset.questionStructure === structureName;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  this.builder.classList.add("builder-active");
  this.builder.innerHTML = "";

  var sentence = document.createElement("div");
  sentence.className = "question-builder-sentence";
  sentence.appendChild(document.createTextNode(template.parts[0]));
  sentence.appendChild(this._createBlank("firstAnswer", template.firstPlaceholder));
  sentence.appendChild(document.createTextNode(template.parts[1]));
  sentence.appendChild(this._createBlank("secondAnswer", template.secondPlaceholder));
  sentence.appendChild(document.createTextNode(template.parts[2]));

  this.completedElement = document.createElement("div");
  this.completedElement.className = "completed-investigation-question";
  this.completedElement.hidden = true;

  this.builder.appendChild(sentence);
  this.builder.appendChild(this.completedElement);

  this._notify();
  this.setComplete(false);
};

InvestigationQuestionActivity.prototype._createBlank = function (fieldName, placeholderText) {
  var self = this;

  var wrapper = document.createElement("span");
  wrapper.className = "question-blank";

  var inputRow = document.createElement("span");
  inputRow.className = "question-blank-input-row";

  var isText = this.options.inputType === "text";
  var input;

  if (isText) {
    input = document.createElement("input");
    input.type = "text";
    input.maxLength = 50;
    input.placeholder = placeholderText;
    input.className = this.options.textInputClass || "question-blank-input";
  } else {
    input = document.createElement("select");
    input.className = "question-blank-input";

    var placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholderText;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    input.appendChild(placeholderOption);

    this.variableOptions.forEach(function (answer) {
      var option = document.createElement("option");
      option.value = answer;
      option.textContent = answer;
      input.appendChild(option);
    });
  }

  input.name = fieldName;
  input.setAttribute("aria-label", placeholderText);

  var answerBox = document.createElement("span");
  answerBox.className = "question-blank-answer";

  inputRow.appendChild(input);
  wrapper.appendChild(inputRow);
  wrapper.appendChild(answerBox);

  function saveAnswer() {
    var value = isText ? getValidStudentInput(input) : input.value;
    if (value === null || value === "") return;

    self.state[fieldName] = value;

    answerBox.innerHTML = "";

    var answerText = document.createElement("span");
    answerText.className = "question-blank-answer-text";
    answerText.textContent = value;

    var deleteButton = createDeleteAnswerButton("Edit " + value, function () {
      self.state[fieldName] = "";
      answerBox.classList.remove("visible");
      answerBox.innerHTML = "";
      inputRow.style.display = isText ? "inline-block" : "block";
      input.value = "";
      input.focus();

      self._renderCompleted();
      self._notify();
      self.setComplete(self._isComplete());
    });

    answerBox.appendChild(answerText);
    answerBox.appendChild(deleteButton);

    inputRow.style.display = "none";
    answerBox.classList.add("visible");
    input.value = "";

    self._renderCompleted();
    self._notify();
    self.setComplete(self._isComplete());
  }

  if (isText) {
    /* Enter or clicking away saves the answer */
    connectEnterAndBlurSave(input, saveAnswer);
  } else {
    input.addEventListener("change", function () {
      if (input.value === "") return;
      saveAnswer();
    });
  }

  return wrapper;
};

InvestigationQuestionActivity.prototype._renderCompleted = function () {
  if (!this.completedElement) return;

  var text = this._getCompletedText();

  if (!text) {
    this.completedElement.hidden = true;
    this.completedElement.textContent = "";
    return;
  }

  this.completedElement.textContent = text;
  this.completedElement.hidden = false;
};

/* ---------- internals ---------- */

InvestigationQuestionActivity.prototype._isComplete = function () {
  return Boolean(this.state.structure && this.state.firstAnswer && this.state.secondAnswer);
};

InvestigationQuestionActivity.prototype._getCompletedText = function () {
  var template = this.templates[this.state.structure];
  if (!template || !this.state.firstAnswer || !this.state.secondAnswer) return "";

  return template.parts[0] + this.state.firstAnswer + template.parts[1] + this.state.secondAnswer + template.parts[2];
};

InvestigationQuestionActivity.prototype._notify = function () {
  var state = this.getState();
  if (typeof this.options.onChange === "function") this.options.onChange(state);
  this.root.dispatchEvent(new CustomEvent("question:change", { detail: state, bubbles: true }));
};
</script>

<script setup>
/*
  Build a testable question: pick a structure, then fill in the two blanks
  from a list of variables (or type them in).

    <InvestigationQuestion id="investigationQuestionActivity"
                           :options="{ variableOptions: [...] }"
                           feeds="reasonedPredictionActivity"
                           @change="onQuestionChange" />

  - options is the options object of InvestigationQuestionActivity
    (variableOptions, inputType, textInputClass, templates, ...).
  - feeds: id of a <PredictionTable>; each change is passed to its setContext(),
    so the prediction organiser shows the student's change / measure variables.
  - @change gets the question state: { structure, firstAnswer, secondAnswer, text }.
  - the activity instance is also reachable from the page as getActivity(id).
*/
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Activity from './Activity.vue'

const props = defineProps({
  tag: { type: String, default: 'div' },
  options: { type: Object, default: () => ({}) },
  feeds: { type: String, default: '' },
})

const emit = defineEmits(['change'])

const structures = [
  { key: 'what', text: 'When I change the ______, what happens to the ______?' },
  { key: 'how', text: 'How does changing the ______ affect the ______?' },
  { key: 'does', text: 'Does changing the ______ affect the ______?' },
  { key: 'if', text: 'If I change the ______, what happens to the ______?' },
]

const root = ref(null)
let activity = null

onMounted(() => {
  whenCommonFunctionsReady(() => {
    activity = new InvestigationQuestionActivity(root.value?.$el, {
      ...props.options,
      onChange(state) {
        if (props.options.onChange) props.options.onChange(state)

        const target = props.feeds && window.getActivity(props.feeds)
        if (target) {
          target.setContext({
            structure: state.structure,
            change: state.firstAnswer,
            measure: state.secondAnswer,
          })
        }

        emit('change', state)
      },
    })
  })
})

onBeforeUnmount(() => {
  activity = null
})

defineExpose({ getActivity: () => activity })
</script>

<template>
  <Activity :tag="tag" ref="root">
    <div class="question-structure-grid" id="questionStructureGrid">
      <button
        v-for="structure in structures"
        :key="structure.key"
        type="button"
        class="question-structure-card"
        :class="'question-structure-' + structure.key"
        :data-question-structure="structure.key"
        aria-pressed="false"
      >
        {{ structure.text }}
      </button>
    </div>

    <div class="investigation-question-builder" id="investigationQuestionBuilder" data-question-builder aria-live="polite">
      <p class="question-builder-placeholder">Select a question structure above to begin.</p>
    </div>

    <slot />
  </Activity>
</template>

<style>
.question-structure-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.question-structure-card {
  min-height: 110px;
  margin-bottom: 0;
  padding: 18px;
  border: 3px solid var(--line);
  border-radius: 18px;
  background: var(--paper);
  box-shadow: 0 4px 0 var(--line);
  color: var(--text);
  font: inherit;
  font-weight: 700;
  line-height: 1.45;
  cursor: pointer;
}

/* ==================================================
      DESIGN AN INVESTIGATION QUESTION
      ================================================== */
.question-blank-answer.visible {
  display: flex;
}

.question-blank-answer .delete-answer {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 auto;

  width: 24px;
  height: 24px;
  padding: 0;

  line-height: 1;
  font-size: 0.95rem;
}

.question-structure-card {
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.question-structure-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--line);
}

.question-structure-card.question-structure-what {
  border-top: 4px solid var(--yellow);
}

.question-structure-card.question-structure-how {
  border-top: 4px solid var(--blue);
}

.question-structure-card.question-structure-does {
  border-top: 4px solid var(--green);
}

.question-structure-card.question-structure-if {
  border-top: 4px solid var(--purple);
}

.question-structure-card.question-structure-what.selected {
  color: var(--text);
  background: var(--soft-yellow);
  transform: translateY(0);
  box-shadow: none;
}

.question-structure-card.question-structure-how.selected {
  color: var(--text);
  background: var(--soft-blue);
  transform: translateY(0);
  box-shadow: none;
}

.question-structure-card.question-structure-does.selected {
  color: var(--text);
  background: var(--soft-green);
  transform: translateY(0);
  box-shadow: none;
}

.question-structure-card.question-structure-if.selected {
  color: var(--text);
  background: var(--soft-purple);
  transform: translateY(0);
  box-shadow: none;
}

.investigation-question-builder {
  margin: 18px 0 24px;
  padding: 24px;

  background: var(--paper);
  border: 2px dashed var(--line);
  border-radius: 18px;

  color: var(--text);
}

.investigation-question-builder.builder-active {
  border-style: solid;
  background: var(--soft-blue);
}

.question-builder-placeholder {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
  text-align: center;
}

.question-builder-sentence {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin: 0;

  color: var(--text);
  font-size: 1.08rem;
  font-weight: 700;
  line-height: 1.8;
}

.question-blank {
  display: inline-block;
  min-width: 190px;
  max-width: 100%;
  vertical-align: middle;
}

.question-blank-input-row {
  display: inline-block;
  position: relative;
  width: fit-content;
}

.question-blank-input {
  width: auto;
  min-width: 225px;
  min-height: 44px;
  padding: 9px 12px;

  background: white;
  color: var(--text);

  border: 2px solid var(--line);
  border-radius: 12px;

  font: inherit;
  font-weight: 600;
}

.question-blank-input:focus {
  border: 3px solid rgba(78, 50, 232, 0.18);
  border-color: var(--purple);
}

.question-blank-input-row select {
  box-sizing: border-box;
}

.question-blank-input-row label {
  position: absolute;
  top: 8px;
  left: 10px;
  justify-content: center;
  align-items: center;

  pointer-events: none;
}

.question-blank-answer {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  width: 100%;
  min-height: 44px;
  padding: 9px 11px;

  background: white;
  border: 2px solid var(--line);
  border-radius: 12px;

  color: var(--text);
  font-weight: 700;
  overflow-wrap: anywhere;
}

.question-blank-answer.visible {
  display: flex;
}

.question-blank-answer-text {
  flex: 1;
  min-width: 0;
}

.completed-investigation-question {
  margin: 20px 0 0;
  padding: 16px 18px;

  background: var(--soft-green);
  border: 2px solid var(--line);
  border-radius: 16px;

  color: var(--text);
  font-weight: 700;
  line-height: 1.55;
  text-align: center;
}

.completed-investigation-question[hidden] {
  display: none;
}

@media (max-width: 650px) {
  .question-builder-sentence {
    align-items: stretch;
    flex-direction: column;
  }

  .question-blank {
    width: 100%;
  }

}

@media (max-width: 650px) {
  .question-structure-grid {
    grid-template-columns: 1fr;
  }
}
</style>
