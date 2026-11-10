<script setup>
/*
  Activity – wrapper every activity component renders as its root.

  Completion: pass :complete so the parent Section knows when to show "Next".

  Saving: pass :state – an object of the refs (or a reactive object) that
  describe this activity's progress, e.g. :state="{ deck, piles, started }".
  Whenever any of them change, Activity calls section.save(), which calls
  page.save(), which writes the whole lesson to localStorage.

  Restoring: when the page loads, saved values are written back into those
  refs and @restore is emitted with the saved data, so the activity can tidy
  up anything that isn't saved (animations, timers, etc).

  Give the activity a `name` if its position in the section might change
  (e.g. it's inside a v-if); otherwise its index in the section is used.
*/
import { inject, isRef, onUnmounted, watch } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  complete: { type: Boolean, default: false },
  state: { type: Object, default: null },
  tag: { type: String, default: "div" },
});

const emit = defineEmits(["reset", "restore"]);
const section = inject("section", null);

const activity = {
  isComplete: () => props.complete,
  reset: () => emit("reset"),
};

// Registering returns this activity's key and any saved data for it.
const { key, saved } = section?.register(activity, props.name) ?? {};

// Plain JSON copy of the state, with refs unwrapped.
function snapshot(state) {
  const data = {};
  for (const [field, value] of Object.entries(state)) {
    data[field] = isRef(value) ? value.value : value;
  }
  return JSON.stringify(data);
}

// Write saved data back into the state's refs / reactive fields.
function restore(state, data) {
  for (const [field, value] of Object.entries(data)) {
    if (!(field in state)) continue;
    if (isRef(state[field])) state[field].value = value;
    else state[field] = value;
  }
}

if (props.state && section) {
  if (saved) {
    restore(props.state, saved);
    emit("restore", saved);
  }

  // Comparing JSON means we only save when something actually changed.
  watch(
    () => snapshot(props.state),
    (json) => section.save(key, JSON.parse(json)),
  );
}

onUnmounted(() => section?.unregister(activity));
</script>

<template>
  <component :is="tag" class="activity">
    <slot />
  </component>
</template>
