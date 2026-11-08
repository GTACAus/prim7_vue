<script setup>
import { provide, onMounted, ref, watchEffect } from "vue";
import { initSectionActivitiesIn } from "./activities/activity-sections.js";
import { whenCommonFunctionsReady } from "./activities/activity-base.js";
import Button from "./Button.vue";

/*
  Provides the sections list to the <Section name="..."> elements inside it.
  Each Section looks up its id, title, next-id, locked etc. by key.
*/
const props = defineProps({
  title: { type: String, required: true },
  sections: { type: Array, required: true },
});
provide("pageSections", props.sections);

// browser tab title
watchEffect(() => {
  document.title = props.title;
});

// wrapper around <slot name="sections">, so init is scoped to this page's sections
const sectionsEl = ref(null);

onMounted(() => {
  // Activities build themselves once common_functions.js is ready; the sections
  // must be initialised after that so data-activity-complete already exists.
  whenCommonFunctionsReady(() => initSectionActivitiesIn(sectionsEl.value));
});

onMounted(async () => {
  await loadScript("../scripts/common_functions.js");
  initialiseTeacherMenu(props.sections);
  // the original scripts wait for DOMContentLoaded, which has already fired
  document.dispatchEvent(new Event("DOMContentLoaded"));
  window.dispatchEvent(new Event("DOMContentLoaded"));
});
</script>

<template>
  <Modal :label="title" :glossary="glossary" />
  <!-- // glossary: small eyebrow line, title and { word: description } terms.
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
  }, -->

  <main class="page">
    <slot name="lesson-intro" />
    <div ref="sectionsEl" class="page-sections">
      <slot name="sections" />
    </div>

    <div class="return-to-top">
      <Button class="return-to-top-button" href="#" symbol="↑">
        Return to Top
      </Button>
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
  color: var(--text) !important;
  background: var(--paper) !important;
}

.return-to-top-button:hover {
  background: var(--soft-green) !important;
}
</style>
