<script setup>
import {
  computed,
  provide,
  reactive,
  ref,
  nextTick,
  watchEffect,
  onMounted,
  onUnmounted,
} from "vue";
import { saveActivity } from "../composables/useLessonProgress.js";
import Button from "./Button.vue";
import Modal from "./Modal.vue";

const props = defineProps({
  lessonId: { type: String, required: true },
  title: { type: String, required: true },
  sections: { type: Array, required: true },
  glossary: { type: Object, default: null },
  backLink: { type: Object, default: null },
});

// Support both { key, id, title } and { name, label } configurations.
const sections = computed(() =>
  props.sections.map((s, index) => {
    const section = typeof s === "string" ? { id: s } : s;
    return {
      ...section,
      id: section.id || section.name || section.key || String(index),
      name: section.key || section.name || section.id || String(index),
      label:
        section.label ||
        section.title ||
        section.id ||
        section.name ||
        section.key ||
        String(index),
    };
  }),
);

// Save page progress
const progress = reactive({
  unlockedIndex: 0,
  showEverything: false,
  completed: [],
});

const stopSaving = saveActivity("page", progress);

onUnmounted(() => stopSaving());

const mountedSections = new Map();
const backLink = computed(() => props.backLink);
const modalRef = ref(null);
let teacherClicks = 0;
let teacherTimer = null;

function indexOfSection(name) {
  return sections.value.findIndex((s) => s.id === name || s.name === name);
}

function isLocked(name) {
  const i = indexOfSection(name);
  return i < 0 || (!progress.showEverything && i > progress.unlockedIndex);
}

function isCompleted(name) {
  const i = indexOfSection(name);
  return i >= 0 && progress.completed.includes(sections.value[i].id);
}

function isLast(name) {
  return indexOfSection(name) === sections.value.length - 1;
}
function registerSection(name, controller) {
  mountedSections.set(name, controller);
}
function unregisterSection(name) {
  mountedSections.delete(name);
}
function getController(name) {
  const s = sections.value[indexOfSection(name)];
  return s && (mountedSections.get(s.id) || mountedSections.get(s.name));
}

function completeSection(name) {
  const i = indexOfSection(name);
  if (i < 0 || isLocked(name)) return;

  const id = sections.value[i].id;

  if (!progress.completed.includes(id)) {
    progress.completed.push(id);
  }

  progress.unlockedIndex = Math.max(
    progress.unlockedIndex,
    Math.min(i + 1, sections.value.length - 1),
  );

  scrollToSection(sections.value[i + 1]?.id);
}

async function scrollToSection(name) {
  if (!name) return;
  await nextTick();
  getController(name)?.scrollTo();
}

function teacherJump(name) {
  const i = indexOfSection(name);
  if (i < 0) return;

  progress.unlockedIndex = Math.max(progress.unlockedIndex, i);

  scrollToSection(name);
}

function teacherShowAll() {
  progress.showEverything = true;
}

async function teacherResetView() {
  // Clear saved progress for this lesson
  const prefix = `prim7:${location.pathname}:`;

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }

  progress.completed = [];
  progress.showEverything = false;
  progress.unlockedIndex = 0;

  for (const controller of mountedSections.values()) {
    controller.reset();
  }

  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleTeacherClick(event) {
  // Works with the existing id="teacherTrigger" without querying the DOM.
  // Alternatively bind @click="..." directly to a teacher trigger in a lesson view.
  if (!event.composedPath().some((node) => node?.id === "teacherTrigger"))
    return;
  teacherClicks++;
  clearTimeout(teacherTimer);
  if (teacherClicks >= 5) {
    teacherClicks = 0;
    modalRef.value?.open("teacher", {}, event.target);
  } else {
    teacherTimer = setTimeout(() => {
      teacherClicks = 0;
    }, 1800);
  }
}
function openTeacherMenu(trigger) {
  modalRef.value?.open("teacher", {}, trigger);
}
provide("lessonPage", {
  sections,
  backLink,
  isLocked,
  isCompleted,
  isLast,
  registerSection,
  unregisterSection,
  completeSection,
  teacherJump,
  teacherShowAll,
  teacherResetView,
});
// Leave this small config provider for existing sections during the migration.
provide("pageSections", props.sections);
watchEffect(() => {
  if (typeof document !== "undefined") document.title = props.title;
});
onMounted(() => document.addEventListener("click", handleTeacherClick, true));
onUnmounted(() => {
  clearTimeout(teacherTimer);
  document.removeEventListener("click", handleTeacherClick, true);
});
defineExpose({
  teacherJump,
  teacherShowAll,
  teacherResetView,
  openTeacherMenu,
});
</script>

<template>
  <Modal
    ref="modalRef"
    :label="title"
    :glossary="glossary"
    :back-link="backLink"
  />
  <main class="page">
    <slot name="lesson-intro" />
    <div class="page-sections"><slot name="sections" /></div>
    <div class="return-to-top">
      <Button class="return-to-top-button" href="#" symbol="↑"
        >Return to Top</Button
      >
    </div>
  </main>
</template>

<style scoped>
.page-sections {
  display: contents;
}
.page {
  width: min(1180px, 94%);
  margin: 0 auto;
  padding: 38px 0 60px;
}
.return-to-top {
  display: grid;
  place-items: center;
}
.return-to-top-button {
  display: inline-block;
  width: 15rem;
  text-decoration: none;
  text-align: center;
  --color: var(--text);
  --background: var(--paper);
  --background-hover: var(--soft-green);
}
</style>
