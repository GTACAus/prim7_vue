<script setup>
import {
  computed,
  inject,
  onUnmounted,
  provide,
  reactive,
  ref,
  watch,
} from "vue";
import Button from "./Button.vue";

const props = defineProps({
  name: { type: String, default: "" },
  id: { type: String, default: "" },
  title: { type: String, default: "" },
  last: { type: Boolean, default: false },
});
const emit = defineEmits(["complete", "unlock"]);
const page = inject("lessonPage", null);
const legacySections = inject("pageSections", []);
const index = computed(() =>
  legacySections.findIndex(
    (s) => (s.key || s.name || s.id) === props.name || s.id === props.id,
  ),
);
const config = computed(() => legacySections[index.value] || {});
const sectionId = computed(() => props.id || config.value.id || props.name);
const sectionTitle = computed(() => props.title || config.value.title || "");
const sectionLast = computed(
  () =>
    props.last || config.value.last || page?.isLast(sectionId.value) || false,
);
const locked = computed(() =>
  page ? page.isLocked(sectionId.value) : props.locked,
);
const completed = computed(() =>
  page ? page.isCompleted(sectionId.value) : false,
);
const activities = reactive(new Set());
const element = ref(null);

// Supports the current Activity.vue registration contract (context objects).
provide("section", {
  register(activity) {
    activities.add(activity);
  },
  unregister(activity) {
    activities.delete(activity);
  },
});

const complete = computed(() => {
  if (activities.size === 0) return true;

  return [...activities].every((activity) => activity.isComplete());
});

const showNext = computed(
  () =>
    !sectionLast.value && !locked.value && !completed.value && complete.value,
);

function reset() {
  for (const a of activities) a.reset();
}
function next() {
  if (!showNext.value) return;
  page?.completeSection(sectionId.value);
}
function scrollTo() {
  element.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}
page?.registerSection(sectionId.value, { reset, scrollTo });
onUnmounted(() => page?.unregisterSection(sectionId.value));
watch(complete, (value) => {
  if (value) emit("complete");
});
watch(locked, (value, previous) => {
  if (previous && !value) emit("unlock");
});
defineExpose({ locked, completed, complete, reset, next, scrollTo });
</script>

<template>
  <section
    ref="element"
    class="section"
    :id="sectionId"
    :class="{ locked, completed }"
  >
    <h2 class="section-title">
      <slot name="title">{{ sectionTitle }}</slot>
    </h2>
    <slot />
    <template v-if="!sectionLast">
      <Button v-if="showNext" class="next-button" @click="next">Next</Button>

      <p v-if="completed" class="completed-note">
        Completed — next activity unlocked.
      </p>
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
