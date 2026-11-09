<script>
import { changeTick, getActivityContext } from "./activities/Activity.vue";

/* section element -> the <Section> that rendered it */
const controllers = new WeakMap();

/*
  Unlock the section after the current one.

  currentSectionId may be a section id or the section element itself.
  nextSectionId is optional: pass null/undefined to unlock whichever
  .section follows the current one in the page.

  A <Section> updates its own state; plain .section markup (pages not
  converted yet) gets its classes toggled directly. Put on window because
  the lesson scripts and some page markup call it directly.
*/
function unlockSection(nextSectionId, currentSectionId) {
  const currentSection =
    typeof currentSectionId === "string"
      ? document.getElementById(currentSectionId)
      : currentSectionId;

  let nextSection;
  if (nextSectionId) {
    nextSection = document.getElementById(nextSectionId);
  } else if (currentSection) {
    const sections = Array.from(document.querySelectorAll(".section"));
    nextSection = sections[sections.indexOf(currentSection) + 1];
  }

  if (currentSection) {
    const current = controllers.get(currentSection);
    if (current) current.markCompleted();
    else currentSection.classList.add("completed");
  }

  if (!nextSection) return;

  const next = controllers.get(nextSection);
  if (next) next.unlock();
  else nextSection.classList.remove("locked");

  setTimeout(() => {
    nextSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

window.unlockSection = unlockSection;

export { unlockSection };
</script>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowReactive,
  watch,
} from "vue";
import Button from "./Button.vue";
/*
  One lesson section: heading, content and a Next button.

    <Section id="flashcards" title="Flashcards" next-id="testable-questions" locked hide-next>
      ...activity content...
    </Section>

  Inside a <Page :sections="..."> use <Section name="flashcards"> instead: id,
  title, next-id, locked etc. are then read from the matching entry (by key) in
  the page's sections list, with next-id/locked/last defaulting from its order.
  Props passed directly on <Section> override the list.

  Activities (every activity component renders an <Activity> wrapper) register
  with the section they are in. If a section has any, its Next button stays
  hidden until all of them are complete, and "complete" is emitted. Plain
  [data-activity] markup inside the section (pages not converted yet) counts
  too, by its data-activity-complete attribute. A section without activities
  shows its Next button unless hide-next is set.

  A [data-reset-trigger] button in the section that is not inside an activity
  resets every activity in the section (or in the element its attribute value
  selects, e.g. data-reset-trigger="#partB").

  Locked / completed are this component's state, reflected as the .locked /
  .completed classes. Plain scripts that still toggle those classes directly
  (teacher menu, saved-progress restore) are picked up too.
  Any other attribute (class, data-*, aria-*) falls through to the <section>.
*/
const props = defineProps({
  // key of this section in the parent <Page>'s sections list
  name: { type: String, default: "" },
  id: { type: String, default: "" },
  // plain-text title; use the #title slot if it needs markup
  title: { type: String, default: "" },
  // section to unlock on Next; omit to unlock whichever section follows
  nextId: { type: String, default: "" },
  // id for the Next button, for scripts that reveal it (e.g. flashcardsNextButton)
  nextButtonId: { type: String, default: "" },
  // hidden until the section before it is finished
  locked: { type: Boolean, default: false },
  // hide the Next button in a section without activities (a script reveals it)
  hideNext: { type: Boolean, default: false },
  // last section of a lesson: no Next button or completion note
  last: { type: Boolean, default: false },
});

const emit = defineEmits(["complete", "unlock"]);

const pageSections = inject("pageSections", []);
const index = computed(() =>
  pageSections.findIndex((s) => s.key === props.name),
);
const cfg = computed(() => pageSections[index.value] ?? {});

// explicit props win; then the Page's config; then defaults from order
const sectionId = computed(() => props.id || cfg.value.id);
const sectionTitle = computed(() => props.title || cfg.value.title || "");
const sectionNextId = computed(
  () =>
    props.nextId || cfg.value.nextId || pageSections[index.value + 1]?.id || "",
);
const sectionNextButtonId = computed(
  () => props.nextButtonId || cfg.value.nextButtonId || "",
);
const sectionLocked = computed(
  () => props.locked || (cfg.value.locked ?? index.value > 0),
);
const sectionHideNext = computed(() => props.hideNext || !!cfg.value.hideNext);
const sectionLast = computed(
  () =>
    props.last ||
    (cfg.value.last ??
      (index.value === pageSections.length - 1 && index.value >= 0)),
);

const el = ref(null);
const mounted = ref(false);

/* ---------- locked / completed ---------- */

const isLocked = ref(sectionLocked.value);
const isCompleted = ref(false);

/* The classes are rendered once and then toggled directly, so a re-render
   never undoes a class a plain script put on the section. */
const initialClass = { locked: isLocked.value };

watch(isLocked, (locked) => {
  el.value?.classList.toggle("locked", locked);
  if (!locked) emit("unlock");
});
watch(isCompleted, (completed) =>
  el.value?.classList.toggle("completed", completed),
);

const controller = {
  unlock: () => (isLocked.value = false),
  markCompleted: () => (isCompleted.value = true),
};

function next() {
  unlockSection(sectionNextId.value || null, el.value);
}

// classes changed by plain scripts -> state
let classObserver = null;
function syncFromClasses() {
  isLocked.value = el.value.classList.contains("locked");
  isCompleted.value = el.value.classList.contains("completed");
}

/* ---------- activities ---------- */

// <Activity> contexts in this section
const activities = shallowReactive(new Set());

provide("section", {
  register: (activity) => activities.add(activity),
  unregister: (activity) => activities.delete(activity),
});

// [data-activity] elements in the section not rendered by an <Activity>
const plainActivities = computed(() => {
  changeTick.value; // re-read on every activity:change
  if (!mounted.value) return [];

  const roots = Array.from(el.value.querySelectorAll("[data-activity]"));
  if (el.value.matches("[data-activity]")) roots.push(el.value);
  return roots.filter((root) => !getActivityContext(root));
});

const hasActivities = computed(
  () => activities.size > 0 || plainActivities.value.length > 0,
);

const complete = computed(
  () =>
    hasActivities.value &&
    [...activities].every((activity) => activity.complete.value) &&
    plainActivities.value.every(
      (root) => root.dataset.activityComplete === "true",
    ),
);

watch(complete, (isComplete) => {
  if (isComplete) emit("complete");
});

const nextHidden = computed(() =>
  hasActivities.value ? !complete.value : sectionHideNext.value,
);

/* ---------- section-wide reset buttons ---------- */

function onClick(event) {
  const button = event.target.closest("[data-reset-trigger]");
  if (!button || button.closest("[data-activity]")) return; // an activity's own button
  if (button.closest(".section") !== el.value) return;

  const scope =
    (button.dataset.resetTrigger &&
      document.querySelector(button.dataset.resetTrigger)) ||
    el.value;

  // plain-script activities are reset by their own (legacy) activity-base.js
  scope.querySelectorAll("[data-activity]").forEach((root) => {
    getActivityContext(root)?.reset();
  });
}

/* ---------- lifecycle ---------- */

onMounted(() => {
  controllers.set(el.value, controller);
  classObserver = new MutationObserver(syncFromClasses);
  classObserver.observe(el.value, {
    attributes: true,
    attributeFilter: ["class"],
  });
  mounted.value = true;
});

onBeforeUnmount(() => classObserver?.disconnect());

defineExpose({
  locked: isLocked,
  completed: isCompleted,
  complete,
  unlock: controller.unlock,
  next,
});
</script>

<template>
  <section
    ref="el"
    class="section"
    :class="initialClass"
    :id="sectionId"
    @click="onClick"
  >
    <h2 class="section-title">
      <slot name="title">{{ sectionTitle }}</slot>
    </h2>

    <slot />

    <template v-if="!sectionLast">
      <Button
        class="next-button"
        :id="sectionNextButtonId || null"
        :hidden="nextHidden"
        @click="next"
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
