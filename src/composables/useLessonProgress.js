import { watch } from "vue";

export function saveActivity(name, state) {
  const key = `prim7:${location.pathname}:${name}`;

  // Restore saved state
  try {
    const saved = JSON.parse(localStorage.getItem(key));

    if (saved) Object.assign(state, saved);
  } catch (error) {
    console.warn("Could not restore activity:", error);
  }

  // Save whenever state changes
  return watch(
    state,
    () => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.warn("Could not save activity:", error);
      }
    },
    { deep: true },
  );
}
