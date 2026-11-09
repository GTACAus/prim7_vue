<script setup>
import { computed, ref } from "vue";
import Activity from "../activities/Activity.vue";

const props = defineProps({
  questions: { type: Array, required: true },
  completionMode: {
    type: String,
    default: "sticky",
  },
});

const answers = ref({});
const correctAnswers = ref({});

const isComplete = computed(() => {
  return props.questions.every((question) => {
    if (props.completionMode === "sticky") {
      return correctAnswers.value[question.id] === true;
    }

    return answers.value[question.id] === question.answer;
  });
});

function selectAnswer(question, choice) {
  answers.value[question.id] = choice.value;

  if (choice.value === question.answer) {
    correctAnswers.value[question.id] = true;
  }
}

function reset() {
  answers.value = {};
  correctAnswers.value = {};
}
</script>

<template>
  <Activity :complete="isComplete" @reset="reset">
    <div v-for="question in questions" :key="question.id" class="mc-question">
      <p>{{ question.text }}</p>

      <div class="mc-choices">
        <button
          v-for="choice in question.choices"
          :key="choice.value"
          type="button"
          class="mc-choice"
          :class="{
            'selected-answer': answers[question.id] === choice.value,
            'correct-answer':
              answers[question.id] === choice.value &&
              choice.value === question.answer,
            'incorrect-answer':
              answers[question.id] === choice.value &&
              choice.value !== question.answer,
          }"
          :aria-pressed="answers[question.id] === choice.value"
          @click="selectAnswer(question, choice)"
        >
          {{ choice.label }}
        </button>
      </div>

      <p v-if="answers[question.id] !== undefined">
        {{
          answers[question.id] === question.answer ? "Correct!" : "Try again."
        }}
      </p>
    </div>

    <button type="button" @click="reset">Reset</button>
  </Activity>
</template>
