<script>
/*
  Unlock the section after the current one.

  currentSectionId may be a section id or the section element itself.
  nextSectionId is optional: pass null/undefined to unlock whichever
  .section follows the current one in the page.

  Put on window because the activity scripts (activity-sections.js,
  lesson_progress.js, lesson scripts) and some page markup call it directly.
*/
function unlockSection(nextSectionId, currentSectionId) {
  const currentSection = typeof currentSectionId === 'string'
    ? document.getElementById(currentSectionId)
    : currentSectionId

  let nextSection
  if (nextSectionId) {
    nextSection = document.getElementById(nextSectionId)
  } else if (currentSection) {
    const sections = Array.from(document.querySelectorAll('.section'))
    nextSection = sections[sections.indexOf(currentSection) + 1]
  }

  if (currentSection) currentSection.classList.add('completed')
  if (!nextSection) return

  nextSection.classList.remove('locked')

  setTimeout(() => {
    nextSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, 100)
}

window.unlockSection = unlockSection
</script>

<script setup>
import { computed, inject } from 'vue';
import Button from './Button.vue';
/*
  One lesson section: heading, content and a Next button.

    <Section id="flashcards" title="Flashcards" next-id="testable-questions" locked hide-next>
      ...activity content...
    </Section>

  Inside a <Page :sections="..."> use <Section name="flashcards"> instead: id,
  title, next-id, locked etc. are then read from the matching entry (by key) in
  the page's sections list, with next-id/locked/last defaulting from its order.
  Props passed directly on <Section> override the list.

  Unlocking / completing is driven by the DOM classes .locked and .completed
  (the activity scripts toggle them too), so those are not reactive state.
  Any other attribute (class, data-*, aria-*) falls through to the <section>.
*/
const props = defineProps({
  // key of this section in the parent <Page>'s sections list
  name: { type: String, default: '' },
  id: { type: String, default: '' },
  // plain-text title; use the #title slot if it needs markup
  title: { type: String, default: '' },
  // section to unlock on Next; omit to unlock whichever section follows
  nextId: { type: String, default: '' },
  // id for the Next button, for scripts that reveal it (e.g. flashcardsNextButton)
  nextButtonId: { type: String, default: '' },
  // hidden until the activity inside is finished
  locked: { type: Boolean, default: false },
  hideNext: { type: Boolean, default: false },
  // last section of a lesson: no Next button or completion note
  last: { type: Boolean, default: false },
})

const pageSections = inject('pageSections', [])
const index = computed(() => pageSections.findIndex((s) => s.key === props.name))
const cfg = computed(() => pageSections[index.value] ?? {})

// explicit props win; then the Page's config; then defaults from order
const sectionId = computed(() => props.id || cfg.value.id)
const sectionTitle = computed(() => props.title || cfg.value.title || '')
const sectionNextId = computed(
  () => props.nextId || cfg.value.nextId || pageSections[index.value + 1]?.id || ''
)
const sectionNextButtonId = computed(() => props.nextButtonId || cfg.value.nextButtonId || '')
const sectionLocked = computed(
  () => props.locked || (cfg.value.locked ?? (index.value > 0))
)
const sectionHideNext = computed(() => props.hideNext || !!cfg.value.hideNext)
const sectionLast = computed(
  () => props.last || (cfg.value.last ?? (index.value === pageSections.length - 1 && index.value >= 0))
)
</script>

<template>
  <section class="section" :class="{ locked: sectionLocked }" :id="sectionId">
    <h2 class="section-title"><slot name="title">{{ sectionTitle }}</slot></h2>

    <slot />

    <template v-if="!sectionLast">
      <Button
        class="next-button"
        :id="sectionNextButtonId || null"
        :hidden="sectionHideNext"
        @click="unlockSection(sectionNextId || null, sectionId)"
      >
        Next
      </Button>

      <p class="completed-note">Completed — next activity unlocked.</p>
    </template>
  </section>
</template>

<style>
.section {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 22px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(63, 70, 63, 0.07);
  animation: pop-fade-in 0.5s ease;
}

.completed-note {
  margin-top: 16px;
  color: var(--muted);
  font-size: 0.95rem;
  display: none;
  animation: pop-fade-in 0.5s ease;
}

.section.completed .completed-note {
  display: block;
}

.section.completed .next-button {
  display: none !important;
}

/* ---------- Main lesson sections ---------- */

.section {
  position: relative;

  margin-bottom: 38px;
  padding: 28px;

  background: var(--paper);
  border: 3px solid var(--charcoal);
  border-radius: 26px;

  box-shadow: var(--shadow-medium);
}

.section-title {
  display: inline-block;
  align-items: center;

  margin: -8px 0 22px;
  padding: 9px 18px;

  background: var(--yellow);
  color: var(--charcoal);

  border: 2px solid var(--charcoal);
  border-radius: 12px;

  box-shadow: 0 3px 0 var(--charcoal);

  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.035em;
  text-transform: uppercase;
}

.next-button {
  --padding: 12px 22px;
	--background: var(--orange);

	--background-hover: var(--purple);

	--background-active: var(--purple);

  margin-top: 20px;
  width: fit-content;
  font-size: 0.95rem;
}

.next-button::after {
  content: "  →";
  display: inline-block;
  transition: transform 0.2s ease;
}

.next-button:hover::after {
  transform: translateX(4px);
}

/* ---------- Completion message ---------- */

.completed-note {
  display: none;

  width: fit-content;
  padding: 9px 13px;

  background: var(--soft-green);
  border: 2px solid var(--line);
  border-radius: 12px;

  color: var(--text);
  font-size: 0.85rem;
  font-weight: 700;
}

.section.completed .completed-note {
  display: block;
}
</style>
