<template>
  <div class="content-box">
    <slot />
  </div>
</template>

<style scoped>
:where(.content-box) {
  border-radius: var(--radius-large);
  color: var(--muted);
  display: block;
  padding: 20px;
  margin-bottom: 20px;
  background: var(#ffffff);
  border: var(--border-medium);
  box-shadow: var(--shadow-medium);
}
</style>
