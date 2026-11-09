<script setup>
import { provide, onMounted, watchEffect } from "vue";
import Button from "./Button.vue";
import Modal, { initialiseTeacherMenu } from "./Modal.vue";

/*
  One lesson page: the shared modal (glossary + hidden teacher menu), the
  lesson intro and the sections.

    <Page title="Lesson 1 - ..." :sections="sections" :glossary="glossary">

  Provides the sections list to the <Section name="..."> elements inside it.
  Each Section looks up its id, title, next-id, locked etc. by key, and
  tracks its own activities / Next button. The same list (id + label) feeds
  the teacher menu.

  Once mounted it loads common_functions.js (activities wait for it), sets
  up the teacher menu and replays DOMContentLoaded for the plain scripts.
*/
const props = defineProps({
  title: { type: String, required: true },
  sections: { type: Array, required: true },
  // { word: description } terms for the vocabulary modal
  glossary: { type: Object, default: null },
});
provide("pageSections", props.sections);

// browser tab title
watchEffect(() => {
  document.title = props.title;
});

// plain scripts declare globals, so never load one twice (e.g. on hot reload)
function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = el.onerror = resolve;
    document.body.appendChild(el);
  });
}

onMounted(async () => {
  await loadScript("../scripts/common_functions.js");
  initialiseTeacherMenu(props.sections);
  // the original scripts wait for DOMContentLoaded, which has already fired
  document.dispatchEvent(new Event("DOMContentLoaded"));
  window.dispatchEvent(new Event("DOMContentLoaded"));
});
</script>

<template>
  <Modal :label="title || ''" :glossary="glossary" />

  <main class="page">
    <slot name="lesson-intro" />
    <div class="page-sections">
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
  --color: var(--text);
  --background: var(--paper);

  --background-hover: var(--soft-green);
}
</style>
