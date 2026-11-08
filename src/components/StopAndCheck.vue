<script setup>
import ButtonReveal from './activities/ButtonReveal.vue';
</script>

<template>
  <ButtonReveal class="stop-and-check">
    <div class="stop-and-check-content">
      <slot name="content" />
      <p>Click the button below to check your answer.</p>
    </div>

    <div  class="stop-and-check-answer" data-button-reveal hidden>
      <slot name="answer" />
    </div>
    <button class="stop-and-check-button general-button" data-button-trigger>
      <p>Check Your Answer</p>
      <p class="bounce-symbol">✅</p>
    </button>

  </ButtonReveal>
</template>

<style scoped>
.stop-and-check::before {
  content: "STOP AND THINK";

  position: absolute;
  top: -16px;
  left: 18px;

  padding: 4px 12px;

  background: var(--orange);
  border: 2px solid var(--line);
  border-radius: 999px;

  color: var(--paper);

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.stop-and-check-answer {
  position: relative;
  margin-top: 15px;
  background-color: var(--soft-green);
  border-radius: 16px;
  padding: 10px 15px;
  padding-top: 15px;
  margin-top: 20px;
  border: 2px solid var(--charcoal);
  border-top: 4px solid var(--green);
  animation: pop-fade-in 0.5s ease-out;
}

.stop-and-check-answer::before {
  content: "ANSWER";
  text-transform: uppercase;

  position: absolute;
  top: -16px;
  left: 18px;

  padding: 4px 12px;

  background: var(--green);
  border: 2px solid var(--line);
  border-radius: 999px;

  color: var(--paper);

  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.stop-and-check-button {
  width: fit-content;
  margin: 0 auto;
  margin-top: 20px;
  background: var(--yellow) !important;
  color: var(--text) !important;
}

.stop-and-check-button[hidden] {
  display: none;
}

.stop-and-check {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 30px 0 24px;
  padding: 16px 18px;
  border: 3px solid var(--charcoal);
  border-top: 6px solid var(--orange);
  background: var(--soft-orange);
  box-shadow: 0 4px 0 var(--charcoal);
  border-radius: 16px;
  font-weight: 500;
  color: var(--text);
  animation: pop-fade-in 0.5s ease-out;
}

.stop-and-check[hidden] {
  display: none;
}
</style>