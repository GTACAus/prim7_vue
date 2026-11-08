<script setup>
/*
  Pre-task closing brainstorm: a centre question with a branch for each
  physical condition, each collecting answers.

    <FinalBrainstorm id="finalBrainstormActivity" prompt="..." :branches="[{ key, title, placeholder }]" />
*/
import InputResponse from '../activities/InputResponse.vue'
import ResponseBox from '../activities/ResponseBox.vue'

defineProps({
  prompt: { type: String, required: true },
  branches: { type: Array, required: true },
})
</script>

<template>
  <InputResponse class="final-brainstorm-box">
    <div class="final-brainstorm-centre">{{ prompt }}</div>

    <ResponseBox
      v-for="branch in branches"
      :key="branch.key"
      class="final-branch"
      :group-key="branch.key"
      :input-id="'final-' + branch.key + '-input'"
      :placeholder="branch.placeholder"
      row-class="final-input-row"
      add-label="Add"
      list-tag="ul"
      list-class="final-answer-list"
      :list-id="'final-' + branch.key + '-list'"
    >
      <h3>{{ branch.title }}</h3>
    </ResponseBox>
  </InputResponse>
</template>
