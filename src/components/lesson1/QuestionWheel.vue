<script setup>
/*
  Lesson 1 question wheel: spin for a question starter (What / How / Does / If),
  fill in the two blanks (what is changed, what is measured), tick the
  testable-question checklist and save the question.

    <QuestionWheel next-button-id="testableQuestionsNextButton" />

  next-button-id is the Section's Next button; it appears once two different
  starters have been saved.
*/
import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'
import { useClassroomLanguageFilter } from '../../composables/useClassroomLanguageFilter.js'

const props = defineProps({
  nextButtonId: { type: String, default: '' },
})

const { ready, loading, containsProfanity, showBlockedLanguageFeedback } = useClassroomLanguageFilter()

/* One entry per segment of the wheel. destination = the wheel angle (deg) that
   brings that segment under the pointer. */
const structures = [
  { word: 'What', cls: 'what', before: 'will changing', between: 'do to', destination: 0 },
  { word: 'How', cls: 'how', before: 'does changing', between: 'affect', destination: 90 },
  { word: 'Does', cls: 'does', before: 'changing', between: 'affect', destination: 270 },
  { word: 'If', cls: 'if', before: 'we change', between: ', how does it affect', destination: 180 },
]

const SPIN_MS = 3250
const START_TEXT = 'Your question structures will appear here.'
const RESET_TEXT = 'Spin the wheel to generate a question starter.'

const rotation = ref(0)
const spinning = ref(false)
const instant = ref(false) // switch the wheel's transition off while it jumps back to 0
const result = ref('Spin the wheel to receive a <strong>question</strong> structure.')
const resultColor = ref('')
const placeholder = ref(START_TEXT)
const cards = ref([])
const usedWords = ref([])
let spinTimer = null
let nextCardId = 1

const allUsed = computed(() => usedWords.value.length === structures.length)
const spinDisabled = computed(() => spinning.value || allUsed.value)

const wheelStyle = computed(() => ({
  transform: `rotate(${rotation.value}deg)`,
  transition: instant.value ? 'none' : undefined,
}))
const labelStyle = computed(() => ({
  transform: `translate(-50%, -50%) rotate(${-rotation.value}deg)`,
  transition: instant.value ? 'none' : undefined,
}))

/* ---------- cards ---------- */

function newPart() {
  return { value: '', text: '', submitted: false }
}

function hasContent(card) {
  return Object.values(card.parts).some((part) => part.submitted || part.value.trim() !== '')
}

function clearMessage(card) {
  card.message.visible = false
  card.message.success = false
  card.message.text = ''
}

function addCard(structure) {
  const card = reactive({
    id: nextCardId++,
    number: cards.value.length + 1,
    structure,
    parts: { changed: newPart(), measured: newPart() },
    checks: { changed: false, measured: false },
    message: { text: '', visible: false, success: false },
    saved: false,
  })
  cards.value.push(card)

  nextTick(() => {
    const el = document.querySelector(`[data-card-id="${card.id}"]`)
    if (!el) return
    const first = el.querySelector('.question-template-input')
    if (first) first.focus()
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  })
}

/* Enter or leaving the box submits it as an answer chip. */
function submitPart(card, partName, event) {
  const part = card.parts[partName]
  const input = event.target

  if (card.saved || part.submitted || !input.isConnected || part.value.trim() === '') return

  const answer = part.value.trim()

  // refused until the word list has loaded, and if it holds a blocked word
  if (!ready.value) {
    input.focus()
    return
  }

  if (containsProfanity(answer)) {
    showBlockedLanguageFeedback(input)
    part.value = ''
    return
  }

  part.text = answer
  part.submitted = true
  clearMessage(card)
}

function deletePart(card, partName) {
  const part = card.parts[partName]
  part.submitted = false
  part.text = ''
  part.value = ''
  clearMessage(card)

  nextTick(() => {
    const el = document.querySelector(`[data-card-id="${card.id}"] [data-question-part="${partName}"]`)
    if (el) el.focus()
  })
}

function canSave(card) {
  return card.parts.changed.submitted && card.parts.measured.submitted
}

function showMessage(card, text) {
  card.message.success = false
  card.message.text = text
  card.message.visible = true
}

function saveCard(card) {
  if (!canSave(card)) {
    showMessage(card, 'Press Enter after completing both sentence blanks.')
    return
  }

  if (!card.checks.changed || !card.checks.measured) {
    showMessage(card, 'Check both boxes before saving your question.')
    return
  }

  card.saved = true
  card.message.text = 'Question saved.'
  card.message.success = true
  card.message.visible = true

  if (!usedWords.value.includes(card.structure.word)) usedWords.value.push(card.structure.word)

  if (usedWords.value.length >= 2 && props.nextButtonId) {
    const nextButton = document.getElementById(props.nextButtonId)
    if (nextButton) nextButton.hidden = false
  }

  if (allUsed.value) result.value = 'You have used all four question starters!'
}

/* ---------- wheel ---------- */

function spin() {
  resultColor.value = 'var(--soft-purple)'
  if (spinning.value) return

  spinning.value = true
  result.value = 'The wheel is spinning...'

  const chosen = structures[Math.floor(Math.random() * structures.length)]

  const position = ((rotation.value % 360) + 360) % 360
  const toDestination = (chosen.destination - position + 360) % 360
  rotation.value += 5 * 360 + toDestination

  spinTimer = window.setTimeout(() => finishSpin(chosen), SPIN_MS)
}

function finishSpin(chosen) {
  spinTimer = null
  const unsaved = cards.value.filter((card) => !card.saved)

  const alreadySaved = usedWords.value.includes(chosen.word)
  const alreadyBeingWritten = unsaved.some((card) => card.structure.word === chosen.word && hasContent(card))

  if (alreadySaved || alreadyBeingWritten) {
    result.value = `<strong>${chosen.word}</strong> has already been used.<br>Spin again to choose a different question starter.`
    resultColor.value = 'var(--orange)'
    spinning.value = false
    return
  }

  result.value = `You landed on <strong>${chosen.word}</strong>.`

  // a different starter: drop the earlier question the student never started
  cards.value = cards.value.filter((card) => card.saved || hasContent(card))

  addCard(chosen)
  spinning.value = false
}

function reset() {
  window.clearTimeout(spinTimer)
  spinTimer = null
  spinning.value = false
  usedWords.value = []
  cards.value = []

  // jump back to 0 without spinning backwards
  instant.value = true
  rotation.value = 0
  nextTick(() => {
    document.getElementById('questionWheel')?.offsetWidth // force a reflow
    instant.value = false
  })

  placeholder.value = RESET_TEXT
  result.value = 'Spin the wheel to receive a question structure.'
  resultColor.value = ''
}

onBeforeUnmount(() => window.clearTimeout(spinTimer))

defineExpose({ reset })
</script>

<template>
  <div class="testable-question-activity">
    <div class="activity-heading">
      <p class="activity-eyebrow">Your turn</p>
      <h3>Create a testable question</h3>
      <p>
        Think back to what you were curious about during the
        <strong>See, Think, Wonder</strong> activity.
        Spin the wheel to choose a <strong>question</strong> structure.
      </p>
    </div>

    <div class="question-wheel-layout">
      <!-- Wheel side -->
      <div class="wheel-panel">
        <div class="question-wheel-wrapper">
          <div class="question-wheel" id="questionWheel" aria-label="Question starter wheel" :style="wheelStyle">
            <span
              v-for="structure in structures"
              :key="structure.word"
              class="wheel-label"
              :class="'wheel-label-' + structure.cls"
              :style="labelStyle"
            >{{ structure.word }}</span>
          </div>
          <div class="wheel-pointer" aria-hidden="true"></div>
        </div>

        <button type="button" class="general-button spin-wheel-button" id="spinQuestionWheel" :disabled="spinDisabled" @click="spin">
          Spin the wheel
        </button>

        <p class="wheel-result" id="wheelResult" aria-live="polite" :style="{ backgroundColor: resultColor }" v-html="result"></p>
      </div>

      <!-- Question-writing side -->
      <div class="question-builder-panel">
        <h4>Your question structures</h4>

        <div class="selected-question-template" id="selectedQuestionTemplate" aria-live="polite">
          <p v-if="!cards.length" class="template-placeholder">{{ placeholder }}</p>

          <div
            v-for="card in cards"
            :key="card.id"
            class="wheel-question-card"
            :class="{ saved: card.saved }"
            :data-card-id="card.id"
            :data-question-starter="card.structure.word"
          >
            <div class="wheel-question-card-header">
              <span class="wheel-question-number">Question {{ card.number }}</span>
            </div>

            <!-- saved: the finished sentence -->
            <div v-if="card.saved" class="question-template-sentence">
              <span class="sentence-starter" :class="'starter-' + card.structure.cls">{{ card.structure.word }}</span>
              <span>
                {{ card.structure.before }}
                <span class="submitted-variable">{{ card.parts.changed.text }}</span>{{ card.structure.between.startsWith(',') ? '' : ' ' }}{{ card.structure.between }}
                <span class="submitted-variable">{{ card.parts.measured.text }}</span>?
              </span>
            </div>

            <!-- editing: the sentence with its two blanks -->
            <div v-else class="question-template-sentence">
              <span class="sentence-starter" :class="'starter-' + card.structure.cls">{{ card.structure.word }}</span>
              <span>{{ card.structure.before }}</span>

              <span v-if="card.parts.changed.submitted" class="submitted-variable submitted-question-part" data-question-part="changed">
                <span class="submitted-question-part-text">{{ card.parts.changed.text }}</span>
                <button type="button" class="delete-answer submitted-part-delete" :aria-label="'Delete ' + card.parts.changed.text" @click="deletePart(card, 'changed')">×</button>
              </span>
              <input
                v-else
                v-model="card.parts.changed.value"
                type="text"
                class="question-template-input"
                data-question-part="changed"
                placeholder="what you will change"
                :disabled="loading"
                @keydown.enter.prevent="submitPart(card, 'changed', $event)"
                @blur="submitPart(card, 'changed', $event)"
              />

              <span>{{ card.structure.between }}</span>

              <span v-if="card.parts.measured.submitted" class="submitted-variable submitted-question-part" data-question-part="measured">
                <span class="submitted-question-part-text">{{ card.parts.measured.text }}</span>
                <button type="button" class="delete-answer submitted-part-delete" :aria-label="'Delete ' + card.parts.measured.text" @click="deletePart(card, 'measured')">×</button>
              </span>
              <input
                v-else
                v-model="card.parts.measured.value"
                type="text"
                class="question-template-input"
                data-question-part="measured"
                placeholder="what you will measure"
                :disabled="loading"
                @keydown.enter.prevent="submitPart(card, 'measured', $event)"
                @blur="submitPart(card, 'measured', $event)"
              />

              <span>?</span>
            </div>

            <div v-if="!card.saved" class="wheel-question-checklist">
              <h5>Check whether your question is testable</h5>

              <label class="check-item">
                <input v-model="card.checks.changed" type="checkbox" data-check="changed" />
                <span>
                  <strong>Is something being changed?</strong>
                  <small>What are you changing?</small>
                </span>
              </label>

              <label class="check-item">
                <input v-model="card.checks.measured" type="checkbox" data-check="measured" />
                <span>
                  <strong>Can the effect be measured?</strong>
                  <small>What will you observe or measure?</small>
                </span>
              </label>
            </div>

            <p
              class="wheel-question-message"
              :class="{ visible: card.message.visible, success: card.message.success }"
              aria-live="polite"
            >{{ card.message.text }}</p>

            <button
              v-if="!card.saved"
              type="button"
              class="general-button wheel-save-button"
              :disabled="!canSave(card)"
              @click="saveCard(card)"
            >Save my question</button>
          </div>
        </div>
      </div>
    </div>

    <div class="reset-button-container">
      <button type="button" class="general-button reset-btn" @click="reset">Reset</button>
    </div>
  </div>
</template>

<style>
.testable-question-activity {
  background: var(--soft-yellow);
}

.activity-heading {
  margin-bottom: 22px;
}

.activity-eyebrow {
  margin: 0 0 5px;

  color: var(--purple);

  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.activity-heading h3 {
  margin: 0 0 8px;

  color: var(--text);

  font-size: 1.4rem;
}

.activity-heading p:last-child {
  margin: 0;

  color: var(--muted);
  line-height: 1.6;
}

.question-wheel-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.8fr) minmax(320px, 1.2fr);
  align-items: start;
  gap: 22px;
}

.wheel-panel,
.question-builder-panel {
  padding: 22px;

  background: var(--paper);
  border: 3px solid var(--line);
  border-radius: 20px;

  box-shadow: 0 4px 0 var(--line);
}

.wheel-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-builder-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-builder-panel h4 {
  margin: 0 0 14px;

  color: var(--purple);

  font-size: 1.05rem;
}

.question-wheel-wrapper {
  position: relative;

  width: min(280px, 78vw);
  aspect-ratio: 1;

  margin: 4px auto 20px;
}

.question-wheel {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  background: conic-gradient(
    from -45deg,
    var(--yellow) 0deg 90deg,
    var(--lavender) 90deg 180deg,
    var(--orange) 180deg 270deg,
    var(--mint) 270deg 360deg
  );

  border: 5px solid var(--line);
  border-radius: 50%;

  transition: transform 3.2s cubic-bezier(0.15, 0.7, 0.1, 1);
}

.question-wheel-wrapper::after {
  content: "";

  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 4;

  width: 44px;
  height: 44px;

  background: var(--paper);
  border: 4px solid var(--line);
  border-radius: 50%;

  transform: translate(-50%, -50%);

  box-shadow: 0 3px 0 var(--line);
}

.wheel-pointer {
  position: absolute;
  top: -14px;
  left: 50%;
  z-index: 5;

  width: 0;
  height: 0;

  border-left: 17px solid transparent;
  border-right: 17px solid transparent;
  border-top: 32px solid var(--purple);

  transform: translateX(-50%);

  filter: drop-shadow(0 3px 0 var(--line));
}

.wheel-label {
  position: absolute;
  z-index: 3;

  padding: 5px 10px;

  background: rgba(255, 253, 244, 0.88);
  color: var(--text);

  border: 2px solid var(--line);
  border-radius: 999px;

  box-shadow: 0 2px 0 rgba(48, 51, 47, 0.25);

  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;

  transform: translate(-50%, -50%);

  transition: transform 3.2s cubic-bezier(0.15, 0.7, 0.1, 1);
}

.wheel-label-what {
  top: 22%;
  left: 50%;
}

.wheel-label-does {
  top: 50%;
  left: 78%;
}

.wheel-label-if {
  top: 78%;
  left: 50%;
}

.wheel-label-how {
  top: 50%;
  left: 22%;
}

.wheel-result {
  min-height: 48px;
  margin: 18px 0 0;
  padding: 10px 13px;

  background: var(--soft-purple);
  border: 2px solid var(--line);
  border-radius: 12px;

  color: var(--text);

  text-align: center;
  font-weight: 600;
}

.selected-question-template {
  display: grid;
  gap: 16px;

  min-height: 170px;
  padding: 18px;

  background: var(--soft-green);
  border: 2px dashed var(--green);
  border-radius: 16px;
}

.template-placeholder {
  margin: 0;

  color: var(--muted);
  line-height: 1.5;
}

.wheel-question-card {
  padding: 16px;

  background: var(--paper);
  border: 2px solid var(--line);
  border-radius: 16px;

  box-shadow: 0 3px 0 rgba(48, 51, 47, 0.2);
}

.wheel-question-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  margin-bottom: 14px;
}

.wheel-question-number {
  color: var(--purple);

  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.question-template-sentence {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  margin: 0;

  color: var(--text);

  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.8;
}

.question-template-input {
  width: min(190px, 100%);

  margin: 0;
  padding: 8px 10px;

  background: white;
  border: 2px solid var(--line);
  border-radius: 10px;

  color: var(--text);

  font-family: inherit;
  font-size: 0.98rem;
}

.question-template-input:focus {
  outline: 3px solid rgba(78, 50, 232, 0.18);
  border-color: var(--purple);
}

.sentence-starter {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 6px 11px;

  border: 2px solid var(--line);
  border-radius: 10px;

  color: var(--text);
  font-weight: 700;

  box-shadow: 0 2px 0 var(--line);
}

.starter-what {
  background: var(--yellow);
}

.starter-how {
  background: var(--mint);
}

.starter-does {
  background: var(--lavender);
}

.starter-if {
  background: var(--soft-orange);
}

.submitted-variable {
  display: inline-block;

  margin: 2px 3px;
  padding: 4px 8px;

  background: var(--soft-blue);
  border: 2px solid var(--line);
  border-radius: 9px;

  color: var(--text);
  font-weight: 700;
}

.submitted-question-part {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  vertical-align: middle;
}

.submitted-question-part-text {
  line-height: 1.3;
}

.submitted-part-delete {
  width: 22px;
  height: 22px;
  padding: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 0.85rem;
  line-height: 1;
}

.wheel-save-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 0 var(--charcoal);
}

.wheel-question-checklist {
  margin-top: 18px;
  padding-top: 16px;

  border-top: 2px dashed rgba(48, 51, 47, 0.35);
}

.wheel-question-checklist h5 {
  margin: 0 0 12px;

  color: var(--purple);

  font-size: 0.95rem;
}

.wheel-save-button {
  margin-top: 14px;
}

.wheel-question-message {
  display: none;

  margin: 12px 0 0;

  color: var(--orange);

  font-size: 0.9rem;
  font-weight: 700;
}

.wheel-question-message.success {
  color: var(--green);
}

/* ---------- Mobile ---------- */
@media (max-width: 1024px) {
  .question-wheel-wrapper {
    width: 25vw;
  }

}

@media (max-width: 800px) {
  .question-wheel-wrapper {
    width: 40vw;
  }

  .question-wheel-layout {
    grid-template-columns: 1fr;
  }

  .question-template-input {
    width: 100%;
    margin: 4px 0;
  }

  .question-template-sentence {
    align-items: stretch;
  }

  .question-template-sentence > span:not(.sentence-starter) {
    align-self: center;
  }

}

/* One card is created after every spin */

.wheel-question-card.saved {
  background: white;
  border-color: var(--green);
}

/* Save button and validation message */

.wheel-question-message.visible {
  display: block;
}

.spin-wheel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.check-item {
  display: grid;
  grid-template-columns: 34px 1fr;
  align-items: start;
  gap: 12px;

  margin-bottom: 12px;
  padding: 14px 16px;

  background: var(--paper);
  border: 2px solid var(--line);
  border-radius: 14px;

  cursor: pointer;

  box-shadow: 0 3px 0 rgba(48, 51, 47, 0.18);
}

.check-item:last-child {
  margin-bottom: 0;
}

.check-item input {
  width: 23px;
  height: 23px;
  margin-top: 1px;

  accent-color: var(--green);
}

.check-item strong {
  display: block;
  margin-bottom: 4px;

  color: var(--text);
}

.check-item small {
  color: var(--muted);

  font-size: 0.9rem;
}
</style>
