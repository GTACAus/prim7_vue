<script setup>
import Button from './Button.vue';
/*
  Lesson introduction: label, title, summary, worksheet download and an
  optional objectives / "think like a scientist" grid.

    <LessonIntro label="Lesson 1" title="Questioning and Predicting"
                 worksheet="../worksheets/l1-worksheet.pdf"
                 :objective="objective" :criteria="criteria">
      Summary text (may contain <strong>HTML</strong>).

      <template #observation> ...contents of the right-hand card... </template>
    </LessonIntro>

  Slots: default = summary, title = rich title (when plain text isn't enough),
  actions = extra buttons beside the worksheet button, mission = block between
  the heading and the grid, observation = right-hand grid card.
*/
defineProps({
  label: { type: String, default: '' },
  title: { type: String, default: '' },
  // URL of the worksheet PDF; omit for no download button
  worksheet: { type: String, default: '' },
  // extra class on the header, e.g. lesson3-intro
  introClass: { type: String, default: '' },
  // learning objective (HTML) and success criteria (array of HTML strings)
  objective: { type: String, default: '' },
  criteria: { type: Array, default: () => [] },
})
</script>

<template>
  <header class="lesson-intro" :class="introClass">
    <div class="lesson-heading">
      <span class="lesson-label">{{ label }}</span>

      <!-- clicking the title five times opens the hidden teacher menu -->
      <h1 id="teacherTrigger" :title="title">
        <slot name="title">{{ title }}</slot>
      </h1>

      <p class="lesson-summary"><slot /></p>

      <div v-if="$slots.actions" class="intro-actions">
        <Button v-if="worksheet" class="worksheet-button" :href="worksheet" download symbol="📄">
          Download worksheet
        </Button>
        <slot name="actions" />
      </div>
      <Button v-else-if="worksheet" class="worksheet-button" :href="worksheet" download symbol="📄">
        Download worksheet
      </Button>
    </div>

    <slot name="mission" />

    <div v-if="objective || $slots.observation" class="intro-grid">
      <section v-if="objective" class="intro-card objectives-card">
        <p class="intro-eyebrow">Learning objective</p>
        <p class="learning-objective-text" v-html="objective"></p>

        <p class="success-heading">Success criteria</p>
        <ol class="objective-list">
          <li v-for="(item, i) in criteria" :key="i" v-html="item"></li>
        </ol>
      </section>

      <section v-if="$slots.observation" class="intro-card observation-card">
        <p class="intro-eyebrow">Think like a scientist</p>
        <slot name="observation" />
      </section>
    </div>
  </header>
</template>

<style>
.intro-actions {
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.intro-actions .general-button {
  width: 220px;
}

/* ---------- Lesson introduction ---------- */

.lesson-intro {
  position: relative;

  margin-bottom: 34px;
  padding-top: 40px;
}

.lesson-label {
  display: inline-block;

  margin-bottom: 12px;
  padding: 8px 16px;

  background: var(--purple);
  color: white;

  border: 2px solid var(--line);
  border-radius: 999px;

  box-shadow: 0 3px 0 var(--line);

  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.lesson-summary {
  max-width: 700px;
  margin: 0 auto;
  margin-bottom: 10px;

  color: var(--muted);

  font-size: 1.06rem;
  line-height: 1.7;
}

.intro-card h2 {
  margin: 0 0 9px;

  color: var(--text);

  font-size: 1.25rem;
  font-weight: 700;
}

.intro-eyebrow {
  margin: 0 0 7px !important;

  color: var(--purple) !important;

  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-bottom: 24px;
}

.intro-card {
  position: relative;
  padding: 26px;

  background: var(--paper);
  border: 3px solid var(--charcoal);
  border-radius: 24px;

  box-shadow: var(--shadow-small);
}

.intro-card::before {
  content: "";
  display: block;

  width: 54%;
  margin: 0 0 18px;

  border-top: 3px dashed var(--mint);
}

.intro-card p {
  color: var(--muted);
  line-height: 1.6;
}

.objectives-card {
  border-top: 10px solid var(--orange);
}

.observation-card {
  border-top: 10px solid var(--purple);
}

.objective-list {
  margin: 16px 0 0;
  padding: 0;

  list-style: none;

  counter-reset: objective;
}

.objective-list > li {
  position: relative;
  display: block;
  min-height: 42px;
  margin-bottom: 12px;
  padding: 30px 12px 30px 50px;

  background: white;
  border: 2px solid var(--line);
  border-radius: 14px;

  box-shadow: 0 3px 0 rgba(48, 51, 47, 0.16);

  color: var(--text);
  line-height: 1.45;

  counter-increment: objective;
}

.objective-list > li ul {
  list-style: none;
  padding-left: 10px;
}

.objective-list > li li {
  position: relative;
  padding-left: 1.4rem;
}

.objective-list > li li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.4rem;
  width: 0.5rem;
  height: 0.5rem;
  border: 2px solid var(--charcoal);
  border-radius: 50%;
  background: var(--yellow);
}

.objective-list > li li:nth-child(2n)::before {
  background: var(--soft-purple);
}

.objective-list > li li:nth-child(3n)::before {
  background: var(--mint);
}

.objective-list > li:last-child {
  margin-bottom: 0;
}

.objective-list > li::before {
  content: counter(objective);

  position: absolute;
  left: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  background: var(--yellow);
  border: 2px solid var(--line);
  border-radius: 50%;

  color: var(--text);
  font-weight: 700;
}

.learning-objective-text {
  margin: 12px 0 18px;
  padding: 14px 16px;

  background: var(--soft-yellow);
  border: 2px solid var(--line);
  border-radius: 14px;

  box-shadow: 0 3px 0 rgba(48, 51, 47, 0.18);

  color: var(--text) !important;
  font-weight: 600;
  line-height: 1.55;
}

.success-heading {
  margin: 0 0 10px !important;

  color: var(--text) !important;

  font-size: 1rem;
  font-weight: 700;
}

.stw-explanation {
  display: grid;
  gap: 9px;

  margin-top: 16px;
}

.stw-explanation div {
  display: grid;
  grid-template-columns: 76px 1fr;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;

  background: var(--soft-yellow);
  border: 2px solid var(--line);
  border-radius: 14px;
}

.stw-explanation strong {
  color: var(--text);
}

.stw-explanation span {
  color: var(--muted);
}

.stw-explanation div:nth-child(2) {
  background: var(--soft-green);
}

.stw-explanation div:nth-child(3) {
  background: var(--soft-purple);
}

.worksheet-button {
  display: inline-block;
  --background: var(--yellow);
  --color: var(--text);
  --padding: 8px;
  --background-hover: var(--mint);
  --color-hover: var(--text);

  z-index: inherit;
}
</style>
