<script>
import { reactive, nextTick } from "vue";

// Module-level state keeps the existing named openModal/closeModal API usable.
const state = reactive({
  type: "",
  open: false,
  video: { src: "", title: "" },
  pdf: { src: "", title: "", isImage: false },
  image: { src: "", title: "", alt: "" },
});

export function openModal(type, options = {}) {
  state.type = type;
  if (type === "video")
    state.video = {
      src: options.src || "",
      title: options.title || "Video guide",
    };
  if (type === "pdf") {
    const src = options.src || "";
    state.pdf = {
      src,
      title: options.title || "Reference sheet",
      isImage: /\.(png|jpe?g|gif|webp|svg)(?:[?#].*)?$/i.test(src),
    };
  }
  if (type === "image") {
    const title = options.title || "Reference image";
    state.image = { src: options.src || "", title, alt: options.alt || title };
  }
  state.open = true;
}

export function closeModal() {
  state.open = false;
}
</script>

<script setup>
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
  nextTick,
} from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  title: { type: String, default: "Glossary Terms" },
  glossary: { type: Object, default: null },
  pdfLabel: { type: String, default: "" },
  backLink: { type: Object, default: null },
  note: {
    type: String,
    default:
      "Teacher mode changes navigation only. Student answers are not deleted.",
  },
});
const page = inject("lessonPage", null);
const teacherSections = computed(() => page?.sections.value ?? []);
const teacherBack = computed(
  () => props.backLink ?? page?.backLink.value ?? null,
);
const overlay = ref(null);
const panel = ref(null);
const lastTrigger = ref(null);
let previousOverflow = "";

function show(type, options = {}, trigger = null) {
  lastTrigger.value = trigger;
  openModal(type, options);
}
function close() {
  closeModal();
}

function grow() {
  const box = panel.value;
  if (!box) return;
  const trigger = lastTrigger.value;
  const origin = trigger?.isConnected ? trigger.getBoundingClientRect() : null;
  const rect = box.getBoundingClientRect();
  if (origin?.width && rect.width) {
    box.style.setProperty(
      "--origin-x",
      `${origin.left + origin.width / 2 - rect.left}px`,
    );
    box.style.setProperty(
      "--origin-y",
      `${origin.top + origin.height / 2 - rect.top}px`,
    );
    box.style.setProperty(
      "--start-scale",
      Math.max(0.08, Math.min(origin.width / rect.width, 0.9)),
    );
  } else {
    box.style.removeProperty("--origin-x");
    box.style.removeProperty("--origin-y");
    box.style.removeProperty("--start-scale");
  }
  box.classList.remove("modal-grow-in");
  void box.offsetWidth; // restart CSS animation; measurement only, not state
  box.classList.add("modal-grow-in");
}

watch(
  () => [state.open, state.type],
  async () => {
    if (state.open && state.type !== "glossary" && state.type !== "teacher") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }
    if (state.open) {
      await nextTick();
      grow();
    }
  },
  { flush: "post" },
);

function keydown(event) {
  if (event.key === "Escape" && state.open) close();
}
onMounted(() => {
  previousOverflow = document.body.style.overflow;
  window.addEventListener("keydown", keydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", keydown);
  document.body.style.overflow = previousOverflow;
  close();
});

function jump(id) {
  page?.teacherJump(id);
  close();
}
function showAll() {
  page?.teacherShowAll();
  close();
}
function resetView() {
  page?.teacherResetView();
  close();
}
function goBack(href) {
  if (href) window.location.assign(href);
}

defineExpose({ open: show, close });
</script>

<template>
  <div
    v-if="state.open && state.type === 'teacher'"
    ref="overlay"
    class="teacher-modal open"
    @click.self="close"
  >
    <div
      ref="panel"
      class="teacher-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Teacher tools"
    >
      <div class="teacher-panel-header">
        <div>
          <p class="teacher-label">Teacher tools</p>
          <h2>Jump to an activity</h2>
        </div>
        <button
          type="button"
          class="teacher-close"
          aria-label="Close teacher menu"
          @click="close"
        >
          ×
        </button>
      </div>
      <div class="teacher-section-list">
        <button
          v-for="(section, index) in teacherSections"
          :key="section.id"
          type="button"
          @click="jump(section.id)"
        >
          {{ index + 1 }}. {{ section.label }}
        </button>
        <button
          v-if="teacherBack?.href"
          type="button"
          @click="goBack(teacherBack.href)"
        >
          {{ teacherBack.label || "← Back" }}
        </button>
      </div>
      <div class="teacher-actions">
        <button type="button" class="teacher-secondary-button" @click="showAll">
          Show all sections
        </button>
        <button
          type="button"
          class="teacher-secondary-button"
          @click="resetView"
        >
          Reset student view
        </button>
      </div>
      <p class="teacher-note">{{ note }}</p>
    </div>
  </div>

  <div
    v-else-if="state.open"
    ref="overlay"
    class="modal"
    :class="{
      'video-modal': state.type === 'video',
      'pdf-modal': state.type === 'pdf',
      'image-zoom-modal': state.type === 'image',
    }"
    role="dialog"
    aria-modal="true"
    @click.self="close"
  >
    <div
      ref="panel"
      :class="[
        'modal-content',
        {
          'video-modal-content': state.type === 'video',
          'pdf-modal-content': state.type === 'pdf',
          'image-zoom-modal-content': state.type === 'image',
        },
      ]"
    >
      <template v-if="state.type === 'glossary'">
        <div class="modal-header">
          <div>
            <p v-if="label" class="teacher-label">{{ label }}</p>
            <h2>{{ title }}</h2>
          </div>
          <button
            type="button"
            class="close-button"
            aria-label="Close glossary"
            @click="close"
          >
            ×
          </button>
        </div>
        <div class="vocab-list">
          <div
            v-for="(description, word) in glossary"
            :key="word"
            class="vocab-card"
          >
            <h3>{{ word }}</h3>
            <p v-html="description"></p>
          </div>
        </div>
      </template>
      <template v-else-if="state.type === 'video'">
        <div class="modal-header">
          <h2>{{ state.video.title }}</h2>
          <button
            type="button"
            class="close-button"
            aria-label="Close video"
            @click="close"
          >
            ×
          </button>
        </div>
        <video
          class="video-modal-player"
          :src="state.video.src"
          controls
          preload="metadata"
        >
          Your browser does not support video playback.
        </video>
      </template>
      <template v-else-if="state.type === 'pdf'">
        <div class="modal-header">
          <div>
            <p v-if="pdfLabel" class="teacher-label">{{ pdfLabel }}</p>
            <h2>{{ state.pdf.title }}</h2>
          </div>
          <button
            type="button"
            class="close-button"
            aria-label="Close PDF"
            @click="close"
          >
            ×
          </button>
        </div>
        <img
          v-if="state.pdf.isImage"
          class="pdf-modal-image"
          :src="state.pdf.src"
          :alt="state.pdf.title"
        />
        <iframe
          v-else
          class="pdf-modal-frame"
          title="Document preview"
          :src="
            state.pdf.src + '#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit'
          "
        ></iframe>
        <div class="pdf-modal-actions">
          <a class="general-button" :href="state.pdf.src" download
            >Download PDF</a
          >
        </div>
      </template>
      <template v-else-if="state.type === 'image'">
        <div class="modal-header">
          <h2>{{ state.image.title }}</h2>
          <button
            type="button"
            class="close-button"
            aria-label="Close image"
            @click="close"
          >
            ×
          </button>
        </div>
        <img
          class="image-zoom-modal-image"
          :src="state.image.src"
          :alt="state.image.alt"
        />
      </template>
    </div>
  </div>
</template>

<style>
/* ==================================================

   MODAL OPENING ANIMATION



   Any modal can grow out of whatever the student

   clicked to open it. growModalFromTrigger() in

   common_functions.js measures the trigger and sets

   three custom properties on the modal's box:



     --origin-x / --origin-y  the trigger's centre,

                              measured from the box's

                              own top-left corner

     --start-scale            the trigger's width as a

                              fraction of the box's



   Scaling from that origin starts the box sitting over

   the trigger and expands it into place. The fallbacks

   below are a plain grow-from-the-middle, used when

   there is no trigger to grow from.

   ================================================== */

.modal-grow-in {
  transform-origin: var(--origin-x, 50%) var(--origin-y, 50%);

  animation: modal-grow 0.32s cubic-bezier(0.2, 0.8, 0.3, 1);
}

@keyframes modal-grow {
  from {
    transform: scale(var(--start-scale, 0.2));

    opacity: 0;
  }

  to {
    transform: scale(1);

    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-grow-in {
    animation: none;
  }
}

.modal {
  display: none;

  position: fixed;

  inset: 0;

  background: rgba(39, 42, 36, 0.35);

  z-index: 2000;

  padding: 24px;
}

.modal-content {
  background: #fffdf5;

  width: min(720px, 100%);

  margin: 50px auto;

  padding: 28px;

  border-radius: 28px;

  border: 1px solid var(--line);

  box-shadow: 0 12px 32px rgba(63, 70, 63, 0.18);

  max-height: 80vh;

  overflow-y: auto;
}

.modal-header {
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 16px;

  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;

  font-size: 1.6rem;

  font-weight: 600;

  color: #4f5c57;
}

.close-button {
  border: none;

  background: var(--soft-orange);

  color: var(--text);

  width: 40px;

  height: 40px;

  border-radius: 50%;

  font-size: 1.4rem;

  cursor: pointer;
}

.vocab-list {
  display: grid;

  gap: 14px;
}

.vocab-card {
  background: #ffffff;

  border: 1px solid var(--line);

  border-radius: 18px;

  padding: 16px;
}

.vocab-card h3 {
  margin: 0 0 6px;

  font-size: 1.05rem;

  color: #3f463f;
}

.vocab-card p {
  margin: 0;

  color: var(--muted);

  line-height: 1.5;
}

.teacher-modal {
  display: none;

  position: fixed;

  inset: 0;

  z-index: 3000;

  padding: 24px;

  background: rgba(39, 42, 36, 0.42);

  align-items: center;

  justify-content: center;
}

.teacher-modal.open {
  display: flex;
}

.teacher-panel {
  width: min(560px, 100%);

  max-height: 88vh;

  overflow-y: auto;

  background: #fffdf5;

  border: 1px solid var(--line);

  border-radius: 28px;

  padding: 26px;

  box-shadow: 0 20px 55px rgba(39, 42, 36, 0.24);
}

.teacher-panel-header {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 20px;
}

.teacher-label {
  margin: 0 0 5px;

  color: var(--button-hover);

  font-size: 0.8rem;

  font-weight: 700;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.teacher-panel-header h2 {
  margin: 0;

  color: var(--text);

  font-size: 1.55rem;
}

.teacher-close {
  flex: 0 0 auto;

  width: 40px;

  height: 40px;

  border: none;

  border-radius: 50%;

  background: var(--soft-orange);

  color: var(--text);

  font-size: 1.4rem;

  cursor: pointer;
}

.teacher-section-list {
  display: grid;

  gap: 10px;
}

.teacher-section-list button {
  width: 100%;

  border: 1px solid var(--line);

  border-radius: 16px;

  padding: 13px 16px;

  background: #ffffff;

  color: var(--text);

  text-align: left;

  font-size: 0.98rem;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.teacher-section-list button:hover {
  background: var(--soft-green);

  transform: translateX(3px);
}

.teacher-actions {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-top: 18px;
}

.teacher-secondary-button {
  border: 1px solid var(--line);

  border-radius: 999px;

  padding: 11px 14px;

  background: var(--soft-blue);

  color: var(--text);

  font-weight: 600;

  cursor: pointer;
}

.teacher-secondary-button:hover {
  background: var(--soft-green);
}

.teacher-note {
  margin: 16px 0 0;

  color: var(--muted);

  font-size: 0.85rem;

  line-height: 1.5;
}

@media (max-width: 600px) {
  .teacher-actions {
    grid-template-columns: 1fr;
  }
}

/* ---------- Modals ---------- */

.modal-content,
.teacher-panel {
  background: var(--card);

  border: 3px solid var(--line);

  border-radius: 24px;

  box-shadow: 0 8px 0 var(--line);
}

.vocab-card,
.teacher-section-list button {
  border: 2px solid var(--line);

  border-radius: 14px;

  box-shadow: 0 3px 0 rgba(48, 51, 47, 0.2);
}

.vocab-card:nth-child(4n + 1) {
  border-left: 10px solid var(--yellow);
}

.vocab-card:nth-child(4n + 2) {
  border-left: 10px solid var(--orange);
}

.vocab-card:nth-child(4n + 3) {
  border-left: 10px solid var(--green);
}

.vocab-card:nth-child(4n + 4) {
  border-left: 10px solid var(--purple);
}

.teacher-section-list button:hover {
  background: var(--soft-yellow);
}

.teacher-secondary-button {
  border: 2px solid var(--line);

  border-radius: 12px;

  background: var(--soft-purple);

  box-shadow: 0 3px 0 var(--line);
}

/* ==================================================

   SHARED VIDEO MODAL

   ================================================== */

.video-modal {
  overflow-y: auto;
}

.video-modal-content {
  width: min(900px, 100%);
}

.video-modal-player {
  display: block;

  width: 100%;

  max-height: 70vh;

  background: #101110;

  border: 3px solid var(--line);

  border-radius: 16px;
}

@media (max-width: 600px) {
  .video-modal-content {
    margin: 20px auto;

    padding: 18px;
  }
}

/* ==================================================

   SHARED PDF MODAL

   ================================================== */

.pdf-modal {
  overflow-y: auto;
}

.pdf-modal-content {
  width: min(900px, 100%);
}

.pdf-modal-frame {
  display: block;

  /* Match the A3-portrait page shape so the fitted page fills the frame. */

  width: min(100%, 50vh);

  aspect-ratio: 1190 / 1684;

  margin: 0 auto;

  background: #ffffff;

  border: 3px solid var(--line);

  border-radius: 16px;
}

.pdf-modal-actions {
  display: flex;

  justify-content: center;

  margin-top: 16px;
}

@media (max-width: 600px) {
  .pdf-modal-content {
    margin: 20px auto;

    padding: 18px;
  }

  .pdf-modal-frame {
    width: 100%;
  }
}

.pdf-modal-image {
  display: block;

  width: 100%;

  max-height: 70vh;

  object-fit: contain;

  background: #ffffff;

  border: 3px solid var(--line);

  border-radius: 16px;
}

/* ==================================================

   SHARED IMAGE ZOOM MODAL

   ================================================== */

.image-zoom-modal-content {
  width: min(760px, 100%);
}

.image-zoom-modal-image {
  display: block;

  width: 100%;

  max-height: 75vh;

  object-fit: contain;

  background: #ffffff;

  border: 3px solid var(--line);

  border-radius: 16px;
}

/* These overlays are conditionally rendered (no DOM class toggling necessary). */
.modal {
  display: block;
}
</style>
