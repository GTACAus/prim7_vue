<script setup>
/*
  Pre-task post-it brainstorm: a board of single-answer notes. The activity
  is complete once min-total notes have been filled in.

    <PostitBrainstorm id="brainstormActivity" :count="8" :min-total="4" />
*/
import InputResponse from '../activities/InputResponse.vue'
import ResponseBox from '../activities/ResponseBox.vue'

defineProps({
  count: { type: Number, default: 8 },
  minTotal: { type: Number, default: 4 },
  placeholder: { type: String, default: "Add an idea" },
})
</script>

<template>
  <InputResponse class="postit-brainstorm" :data-tr-min-total="minTotal">
    <ResponseBox
      v-for="n in count"
      :key="n"
      class="postit-answer"
      :class="'postit-' + n"
      :group-key="String(n)"
      :max="1"
      :input-id="'brainstormInput' + n"
      :placeholder="placeholder"
      list-class="brainstorm-answer"
      :list-id="'brainstormAnswer' + n"
    />
  </InputResponse>
</template>
