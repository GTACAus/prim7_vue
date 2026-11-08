<script setup>
/*
  Lesson 1 "test reasoned predictions" activity: a list of experiment cards,
  each asking whether the results support a reasoned prediction.

    <PredictionTests :tests="tests" />

  tests: [{ title, question, prediction, image, answer: 'true' | 'false',
            correct, incorrect }]   (question / prediction may contain HTML)

  Built on <MultipleChoice>. The "Well done" message appears once every card has
  been answered correctly.
*/
import { nextTick, ref } from 'vue'
import MultipleChoice from '../activities/MultipleChoice.vue'

const props = defineProps({
  id: { type: String, default: 'testingPredictionsActivity' },
  tests: { type: Array, required: true },
})

const allCorrect = ref(false)
const completion = ref(null)

function onAnswer() {
  allCorrect.value = getActivity(props.id).isComplete()

  if (allCorrect.value) {
    nextTick(() => completion.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
  }
}
</script>

<template>
  <MultipleChoice class="prediction-test-list" :id="id" @answer="onAnswer">
    <article
      v-for="(test, i) in tests"
      :key="i"
      class="prediction-test-card"
      :id="'predictionTest' + (i + 1)"
      data-mc-question
      :data-mc-answer="test.answer"
    >
      <div class="prediction-test-heading">
        <span class="prediction-test-number">Example {{ i + 1 }}</span>
        <h3>{{ test.title }}</h3>
      </div>

      <div class="prediction-statement-grid">
        <div class="prediction-statement">
          <span class="prediction-statement-label">Testable question</span>
          <p v-html="test.question"></p>
        </div>

        <div class="prediction-statement">
          <span class="prediction-statement-label">Reasoned prediction</span>
          <p v-html="test.prediction"></p>
        </div>
      </div>

      <h4 class="prediction-results-heading">Experiment results</h4>

      <div class="prediction-result-image">
        <img :src="test.image" alt="Experiment results" />
      </div>

      <div class="prediction-choice-area">
        <p class="prediction-choice-question">Do the results support the reasoned prediction?</p>

        <div class="prediction-choice-buttons" data-mc-choices>
          <button type="button" class="general-button prediction-choice-button" data-mc-choice="true">
            Supported
          </button>

          <button type="button" class="general-button prediction-choice-button" data-mc-choice="false">
            Not supported
          </button>
        </div>

        <div
          class="prediction-feedback"
          data-mc-feedback
          :data-correct-text="test.correct"
          :data-incorrect-text="test.incorrect"
          role="status"
          aria-live="polite"
          hidden
        ></div>
      </div>
    </article>
  </MultipleChoice>

  <div ref="completion" class="prediction-test-completion" id="predictionTestCompletion" :hidden="!allCorrect">
    <strong>Well done! You practiced:</strong>
    <ol>
      <li>Writing a testable question</li>
      <li>Making a prediction and giving a reason for your choice</li>
    </ol>
  </div>
</template>

<style>
#testing-predictions .section-title {
  background: var(--lavender);
}

.prediction-test-list {
  display: grid;
  gap: 28px;
}

.prediction-test-card {
  overflow: hidden;

  background: var(--paper);
  border: 3px solid var(--line);
  border-radius: 22px;

  box-shadow: 0 5px 0 var(--line);

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.prediction-test-card.prediction-completed {
  border-color: var(--green);
  box-shadow: 0 5px 0 var(--green);
}

.prediction-test-heading {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 18px 20px;

  background: var(--soft-blue);
  border-bottom: 3px solid var(--line);
}

.prediction-test-heading h3 {
  margin: 0;

  color: var(--text);

  font-size: 1.25rem;
}

.prediction-test-number {
  flex: 0 0 auto;

  padding: 7px 11px;

  background: var(--purple);
  color: white;

  border: 2px solid var(--line);
  border-radius: 10px;

  box-shadow: 0 2px 0 var(--line);

  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.prediction-statement-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  padding: 20px;
}

.prediction-statement {
  padding: 17px;

  background: white;
  border: 2px solid var(--line);
  border-radius: 16px;

  box-shadow: 0 3px 0 rgba(48, 51, 47, 0.18);
}

.prediction-statement:first-child {
  background: var(--soft-yellow);
}

.prediction-statement:last-child {
  background: var(--soft-purple);
}

.prediction-statement-label {
  display: block;

  margin-bottom: 8px;

  color: var(--purple);

  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.prediction-statement p {
  margin: 0;

  color: var(--text);

  line-height: 1.6;
}

.prediction-results-heading {
  margin: 22px 20px 10px;

  color: var(--purple);

  font-size: 1rem;
  font-weight: 700;
}

.prediction-result-image {
  width: 100%;
  margin-bottom: 20px;
  padding: 18px;

  background: var(--soft-green);

  border: 2px dashed var(--green);
  border-radius: 18px;
}

.prediction-result-image img {
  display: block;

  width: 100%;
  max-width: 850px;
  height: auto;

  margin: 0 auto;

  background: white;

  border: 2px solid var(--line);
  border-radius: 14px;
}

.prediction-safety-note {
  margin: 16px 20px 0;
  padding: 11px 14px;

  background: var(--soft-orange);
  border: 2px solid var(--line);
  border-radius: 13px;

  color: var(--text);

  font-size: 0.92rem;
  font-weight: 600;
}

.prediction-choice-area {
  margin: 20px;
  padding: 18px;

  background: white;
  border: 2px solid var(--line);
  border-radius: 18px;
}

.prediction-choice-question {
  margin: 0 0 14px;

  color: var(--text);

  font-size: 1.05rem;
  font-weight: 700;
  text-align: center;
}

.prediction-choice-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.prediction-choice-button {
  min-width: 150px;

  border: 2px solid var(--line);
}

.prediction-choice-button.selected-answer {
  transform: translateY(2px);
  box-shadow: 0 1px 0 var(--line);
}

.prediction-choice-button.correct-answer {
  background: var(--green);
}

.prediction-choice-button.incorrect-answer {
  background: var(--orange);
}

.prediction-feedback {
  margin-top: 16px;
  padding: 14px 16px;

  border: 2px solid var(--line);
  border-radius: 14px;

  color: var(--text);

  font-weight: 600;
  line-height: 1.55;
}

.prediction-feedback[hidden] {
  display: none;
}

.prediction-test-completion {
  margin-top: 28px;
  padding: 20px;

  background: var(--soft-green);
  border: 3px solid var(--green);
  border-radius: 18px;

  box-shadow: 0 4px 0 var(--green);

  color: var(--text);

  text-align: center;
}

.prediction-test-completion[hidden] {
  display: none;
}

.prediction-test-completion strong {
  display: block;

  margin-bottom: 7px;

  color: var(--purple);

  font-size: 1.2rem;
}

.prediction-test-completion ol {
  justify-self: center;
}

.prediction-test-completion li {
  text-align: left;
  margin: 0;

  line-height: 1.55;
}

@media (max-width: 800px) {
  .prediction-statement-grid {
    grid-template-columns: 1fr;
  }

  .prediction-test-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .prediction-choice-buttons {
    display: grid;
    grid-template-columns: 1fr;
  }

  .prediction-choice-button {
    width: 100%;
  }

}

.feedback-correct {
  background: var(--soft-green);
}

.feedback-correct::before {
  content: "✓ ";
  font-weight: 700;
}

.feedback-incorrect {
  background: var(--soft-orange);
}

.feedback-incorrect::before {
  content: "↻ ";
  font-weight: 700;
}
</style>
