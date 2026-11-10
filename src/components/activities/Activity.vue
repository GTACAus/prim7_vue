<script setup>
import { inject, onUnmounted } from "vue";
import { saveActivity } from "../../composables/useLessonProgress.js";

const props = defineProps({
  name: { type: String, default: "" },
  complete: { type: Boolean, default: false },
  state: { type: Object, default: null },
  tag: { type: String, default: "div" },
});

const emit = defineEmits(["reset"]);
const section = inject("section", null);

const activity = {
  isComplete: () => props.complete,
  reset: () => emit("reset"),
};

section?.register(activity);

const stopSaving =
  props.name && props.state ? saveActivity(props.name, props.state) : null;

onUnmounted(() => {
  section?.unregister(activity);
  stopSaving?.();
});
</script>

<template>
  <component :is="tag" class="activity">
    <slot />
  </component>
</template>
