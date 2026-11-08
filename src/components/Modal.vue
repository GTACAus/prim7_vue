<script>
/* ==================================================
   SHARED MODAL

   One <Modal> per page. Its content is swapped depending
   on what is opened:

     glossary   openModal("glossary")
     teacher    openModal("teacher")   (hidden menu, 5 clicks on #teacherTrigger)
     video      openModal("video", { src, title })
     pdf        openModal("pdf", { src, title })   (images are previewed too)
     image      openModal("image", { src, title, alt })

   closeModal() closes whichever is open.

   Page-specific data is passed as props, e.g.

     <Modal label="Lesson 2" :glossary="{ Variable: 'An aspect that can change.' }" />

   The functions live here (moved from common_functions.js and
   lesson5.js) and are put on window because page markup and the
   lesson scripts still call them from onclick="..." and
   DOMContentLoaded handlers, e.g. initialiseTeacherMenu().
   ================================================== */
import { reactive, nextTick } from "vue";

const modal = reactive({
  type: "", // '' | glossary | teacher | video | pdf | image
  open: false,
  options: {
    video: { src: "", title: "" },
    pdf: { src: "", title: "", isImage: false },
    image: { src: "", title: "", alt: "" },
    teacher: { sections: [], back: null },
  },
});

/*
  Remember the last thing the student clicked so that a
  modal can grow out of it.

  This listens in the capture phase, so it always runs
  before the onclick handler that opens the modal. That
  means open functions need no extra argument and no
  markup has to change.
*/
let lastModalTrigger = null;

/*
  Grow a modal out of the element that opened it.

  Call this straight after the modal has been made
  visible; the box has to be laid out before it can be
  measured. Pass a trigger to override the remembered
  one, or nothing to use the last click.

  Falls back to a plain grow from the centre when there
  is no usable trigger.
*/
function growModalFromTrigger(modalEl, trigger) {
  if (!modalEl) {
    return;
  }

  const box = modalEl.firstElementChild;

  if (!box) {
    return;
  }

  /*
    Clear the animation first. The class carries the
    transform, so the box has to be untransformed for
    the measurements below to be its true resting size.
  */
  box.classList.remove("modal-grow-in");

  const restingBox = box.getBoundingClientRect();

  /* The modal is not actually on screen. */
  if (!restingBox.width) {
    return;
  }

  const source = trigger || lastModalTrigger;
  const sourceBox =
    source && source.isConnected ? source.getBoundingClientRect() : null;

  if (sourceBox && sourceBox.width) {
    box.style.setProperty(
      "--origin-x",
      sourceBox.left + sourceBox.width / 2 - restingBox.left + "px",
    );

    box.style.setProperty(
      "--origin-y",
      sourceBox.top + sourceBox.height / 2 - restingBox.top + "px",
    );

    /*
      Keep the starting size within a sensible band. Some
      triggers are tiny and some, like the hidden teacher
      strip, are wider than the panel they open; without
      this the animation is either a jarring jump from a
      speck or no visible growth at all.
    */
    const startScale = Math.max(
      0.08,
      Math.min(sourceBox.width / restingBox.width, 0.9),
    );

    box.style.setProperty("--start-scale", startScale);
  } else {
    box.style.removeProperty("--origin-x");
    box.style.removeProperty("--origin-y");
    box.style.removeProperty("--start-scale");
  }

  /* Force a reflow so the animation replays on reopen. */
  void box.offsetWidth;

  box.classList.add("modal-grow-in");
}

/* ---------- Open / close ---------- */

/*
  The one function that opens the shared modal.

    openModal("glossary")
    openModal("teacher")
    openModal("video", { src, title })
    openModal("pdf", { src, title })      (images are previewed too)
    openModal("image", { src, title, alt })
*/
function openModal(type, options = {}) {
  if (type === "video") {
    Object.assign(modal.options.video, {
      src: options.src,
      title: options.title || "Video guide",
    });
  } else if (type === "pdf") {
    const src = options.src || "";
    Object.assign(modal.options.pdf, {
      src,
      title: options.title || "Reference sheet",
      // Images preview in an <img>; PDFs preview in the browser's own viewer.
      isImage: /\.(png|jpe?g|gif|webp|svg)$/i.test(src),
    });
  } else if (type === "image") {
    const title = options.title || "Reference image";
    Object.assign(modal.options.image, {
      src: options.src,
      title,
      alt: options.alt || title,
    });
  }

  modal.type = type;
  modal.open = true;

  // glossary and the teacher menu leave the page scrollable
  if (type !== "glossary" && type !== "teacher") {
    document.body.style.overflow = "hidden";
  }

  // wait for the new content to be on screen before measuring it
  nextTick(function () {
    growModalFromTrigger(document.querySelector("[data-shared-modal]"));
  });
}

function closeModal() {
  modal.open = false;
  document.body.style.overflow = "";
}

/* ---------- Hidden teacher navigation ---------- */

let teacherNavigationSectionIds = [];
let teacherNavigationFirstSectionId = "";

let teacherClickCount = 0;
let teacherClickTimer = null;

/*
  Set up the hidden teacher menu for the current page.

  Each lesson supplies:
  1. The section IDs used on that page.
  2. The section that should remain open when the
     student view is reset.
  3. Optionally a { label, href } link to another page.
*/
function initialiseTeacherMenu(sections, backLink) {
  const teacherTrigger = document.getElementById("teacherTrigger");

  if (!teacherTrigger) {
    return;
  }

  // Accept either the old flat array of id strings or the
  // new array of { id, label } objects, so existing pages
  // that haven't been updated yet don't break.
  const normalisedSections = (Array.isArray(sections) ? sections : []).map(
    function (section) {
      if (typeof section === "string") {
        return { id: section, label: section };
      }
      return section;
    },
  );

  teacherNavigationSectionIds = normalisedSections.map(function (section) {
    return section.id;
  });

  teacherNavigationFirstSectionId = teacherNavigationSectionIds[0] || "";

  modal.options.teacher.sections = normalisedSections;
  modal.options.teacher.back = backLink && backLink.href ? backLink : null;

  teacherTrigger.addEventListener("click", function () {
    teacherClickCount += 1;

    clearTimeout(teacherClickTimer);

    teacherClickTimer = window.setTimeout(function () {
      teacherClickCount = 0;
    }, 1800);

    if (teacherClickCount >= 5) {
      teacherClickCount = 0;

      clearTimeout(teacherClickTimer);

      openModal("teacher");
    }
  });
}

/*
  Open and move to one lesson section without marking
  earlier activities as completed.
*/
function teacherJump(sectionId) {
  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  section.classList.remove("locked");
  section.hidden = false;

  closeModal();

  window.setTimeout(function () {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
}

/*
  Reveal every section listed by the current lesson.
*/
function teacherShowAll() {
  teacherNavigationSectionIds.forEach(function (sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.classList.remove("locked");
      section.hidden = false;
    }
  });

  closeModal();
}

/*
  Put a lesson page back to how a student finds it for
  the first time.

  Reloading is deliberate: activities are spread across
  many small widgets, and clearing them one by one has
  repeatedly missed some. A fresh load cannot miss any.
*/
function resetLessonPage() {
  if (typeof window.clearLessonProgress === "function") {
    window.clearLessonProgress();
  }

  /*
    Some pages keep their own saved progress. Without
    clearing that too, the reload would simply put every
    answer straight back.
  */
  if (typeof window.clearPageSavedData === "function") {
    window.clearPageSavedData();
  }

  window.location.reload();
}

/*
  Return the page to its original student-navigation state,
  then clear every answer on the page.
*/
function teacherResetView() {
  teacherNavigationSectionIds.forEach(function (sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    section.classList.remove("completed");

    if (sectionId === teacherNavigationFirstSectionId) {
      section.classList.remove("locked");
    } else {
      section.classList.add("locked");
    }
  });

  closeModal();

  /* Clear every answer on the page, not just the navigation. */
  resetLessonPage();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* ---------- Install once ---------- */

if (!window.__modalBehaviourInstalled) {
  window.__modalBehaviourInstalled = true;

  Object.assign(window, {
    growModalFromTrigger,
    openModal,
    closeModal,
    initialiseTeacherMenu,
    teacherJump,
    teacherShowAll,
    teacherResetView,
    resetLessonPage,
  });

  document.addEventListener(
    "click",
    function (event) {
      lastModalTrigger =
        event.target.closest("button, a, [onclick], .yeast-card") ||
        event.target;
    },
    true,
  );

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
</script>

<script setup>
defineProps({
  // glossary: small eyebrow line, title and { word: description } terms.
  // Descriptions may contain HTML (<strong>).
  label: { type: String, default: "" },
  title: { type: String, default: "Glossary Terms" },
  glossary: { type: Object, default: null },
  // pdf: small eyebrow line above the title
  pdfLabel: { type: String, default: "" },
  // teacher menu: footnote under the buttons
  note: {
    type: String,
    default:
      "Teacher mode changes navigation only. Student answers are not deleted.",
  },
});

// These call through window so a page can override teacherJump / teacherShowAll
// (lesson5.js does), and so the functions stay usable from the page scripts.
function jump(id) {
  window.teacherJump(id);
}

function showAll() {
  window.teacherShowAll();
}

function resetView() {
  window.teacherResetView();
}

function goBack(href) {
  window.location.href = href;
}
</script>

<template>
  <!-- Hidden teacher menu, opened by clicking the lesson title five times -->
  <div
    v-if="modal.type === 'teacher'"
    id="teacherModal"
    class="teacher-modal"
    :class="{ open: modal.open }"
    data-shared-modal
    @click.self="closeModal"
  >
    <div class="teacher-panel">
      <div class="teacher-panel-header">
        <div>
          <p class="teacher-label">Teacher tools</p>
          <h2>Jump to an activity</h2>
        </div>

        <button
          type="button"
          class="teacher-close"
          aria-label="Close teacher menu"
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <div class="teacher-section-list">
        <button
          v-for="(section, index) in modal.options.teacher.sections"
          :key="section.id"
          type="button"
          @click="jump(section.id)"
          v-html="index + 1 + '. ' + section.label"
        ></button>

        <button
          v-if="modal.options.teacher.back"
          type="button"
          @click="goBack(modal.options.teacher.back.href)"
        >
          {{ modal.options.teacher.back.label || "← Back" }}
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

  <!-- Standard dialog: glossary, video, pdf, image zoom -->
  <div
    v-else
    class="modal"
    :id="
      (modal.type === 'image' ? 'imageZoom' : modal.type || 'glossary') +
      'Modal'
    "
    :class="{
      'video-modal': modal.type === 'video',
      'pdf-modal': modal.type === 'pdf',
      'image-zoom-modal': modal.type === 'image',
    }"
    :style="{ display: modal.open ? 'block' : 'none' }"
    role="dialog"
    aria-modal="true"
    data-shared-modal
    @click.self="closeModal"
  >
    <!-- glossary -->
    <div v-if="modal.type === 'glossary'" class="modal-content">
      <div class="modal-header">
        <div v-if="label">
          <p class="teacher-label">{{ label }}</p>
          <h2>{{ title }}</h2>
        </div>
        <h2 v-else>{{ title }}</h2>

        <button
          type="button"
          class="close-button"
          aria-label="Close glossary"
          @click="closeModal"
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
    </div>

    <!-- video -->
    <div
      v-else-if="modal.type === 'video' && modal.open"
      class="modal-content video-modal-content"
    >
      <div class="modal-header">
        <h2 id="videoModalTitle">{{ modal.options.video.title }}</h2>

        <button
          type="button"
          class="close-button"
          aria-label="Close video"
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <video
        id="videoModalPlayer"
        class="video-modal-player"
        :src="modal.options.video.src"
        controls
        preload="metadata"
      >
        Your browser does not support video playback.
      </video>
    </div>

    <!-- pdf / reference image -->
    <div
      v-else-if="modal.type === 'pdf' && modal.open"
      class="modal-content pdf-modal-content"
    >
      <div class="modal-header">
        <div v-if="pdfLabel">
          <p class="teacher-label">{{ pdfLabel }}</p>
          <h2 id="pdfModalTitle">{{ modal.options.pdf.title }}</h2>
        </div>
        <h2 v-else id="pdfModalTitle">{{ modal.options.pdf.title }}</h2>

        <button
          type="button"
          class="close-button"
          aria-label="Close PDF"
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <img
        v-if="modal.options.pdf.isImage"
        id="pdfModalImage"
        class="pdf-modal-image"
        :src="modal.options.pdf.src"
        :alt="modal.options.pdf.title"
      />
      <!-- hide the built-in viewer chrome so students see only page 1 of the sheet -->
      <iframe
        v-else
        id="pdfModalFrame"
        class="pdf-modal-frame"
        title="Document preview"
        :src="
          modal.options.pdf.src +
          '#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit'
        "
      ></iframe>

      <div class="pdf-modal-actions">
        <a
          id="pdfModalDownload"
          class="general-button"
          :href="modal.options.pdf.src"
          download
        >
          <p>Download PDF</p>
        </a>
      </div>
    </div>

    <!-- image zoom -->
    <div
      v-else-if="modal.type === 'image' && modal.open"
      class="modal-content image-zoom-modal-content"
    >
      <div class="modal-header">
        <h2 id="imageZoomModalTitle">{{ modal.options.image.title }}</h2>

        <button
          type="button"
          class="close-button"
          aria-label="Close image"
          @click="closeModal"
        >
          ×
        </button>
      </div>

      <img
        id="imageZoomModalImage"
        class="image-zoom-modal-image"
        :src="modal.options.image.src"
        :alt="modal.options.image.alt"
      />
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
</style>
