<script setup>
import { inject, onUnmounted } from "vue";

const props = defineProps({
  complete: { type: Boolean, default: false },
  tag: { type: String, default: "div" },
});

const emit = defineEmits(["reset"]);

const section = inject("section", null);

const activity = {
  isComplete: () => props.complete,
  reset: () => emit("reset"),
};

section?.register(activity);

onUnmounted(() => {
  section?.unregister(activity);
});
</script>

<template>
  <component :is="tag" class="activity">
    <slot />
  </component>
</template>
