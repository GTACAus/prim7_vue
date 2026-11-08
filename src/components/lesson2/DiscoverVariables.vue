<script setup>
/*
  Lesson 2 "discover possible variables": type the variables you can spot on a
  mind-map image (a box laid over each spot), then list them again in a grid.

    <DiscoverVariables id="discoverVariablesActivity" image="../images/lesson2/l2-stw.png" image-alt="...">
      <template #intro> instructions above the image </template>
      <template #between> instructions between the image and the grid </template>
    </DiscoverVariables>

  Built on <InputResponse>: every box takes one answer.
*/
import InputResponse from '../activities/InputResponse.vue'
import ResponseBox from '../activities/ResponseBox.vue'

defineProps({
  image: { type: String, required: true },
  imageAlt: { type: String, default: '' },
  overlays: { type: Number, default: 9 },
  cards: { type: Number, default: 9 },
})
</script>

<template>
  <InputResponse data-tr-min-total="0">
    <slot name="intro" />

    <div class="hook-image-box variable-image-box">
      <div class="variable-image-stage">
        <img :src="image" :alt="imageAlt" class="hook-image variable-background-image" />

        <ResponseBox
          v-for="n in overlays"
          :key="n"
          class="variable-overlay-entry"
          :class="'variable-overlay-' + n"
          :group-key="'imageVariable' + n"
          :max="1"
          :input-id="'imageVariable' + n"
          :maxlength="24"
          placeholder="Type here"
          :aria-label="'Add image variable ' + n"
          row-class="variable-entry-input-row"
          list-class="variable-entry-answer"
          :list-id="'imageVariable' + n + 'Answer'"
        />
      </div>
    </div>

    <slot name="between" />

    <div class="variable-grid">
      <ResponseBox
        v-for="n in cards"
        :key="n"
        class="variable-entry-card"
        :group-key="'variable' + n"
        :max="1"
        :input-id="'variable' + n"
        placeholder="Type here"
        row-class="variable-entry-input-row"
        list-class="variable-entry-answer"
        :list-id="'variable' + n + 'Answer'"
      >
        <label :for="'variable' + n">Variable {{ n }}</label>
      </ResponseBox>
    </div>
  </InputResponse>
</template>
