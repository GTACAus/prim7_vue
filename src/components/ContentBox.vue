<script setup>
defineProps({
  tag: { type: String, default: "div" },
});
</script>

<template>
  <component :is="tag" class="content-box">
    <slot />
  </component>
</template>

<style scoped>
:where(.content-box) {
  border-radius: var(--radius-large);
  color: var(--muted);
  display: block;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  border: var(--border-medium);
  box-shadow: var(--shadow-medium);
}
</style>
