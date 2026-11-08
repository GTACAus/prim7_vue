<script setup>
/*
  Pre-task "See, Think, Wonder" box: one column per group, each with a prompt,
  an input and the list of answers.

    <ThinkBox id="watchStwActivity" :groups="[{ key, title, prompt, placeholder }]" />

  Built on <InputResponse>; every group needs at least one answer.
*/
import InputResponse from '../activities/InputResponse.vue'
import ResponseBox from '../activities/ResponseBox.vue'

defineProps({
  groups: { type: Array, required: true },
})
</script>

<template>
  <InputResponse class="think-box">
    <ResponseBox
      v-for="group in groups"
      :key="group.key"
      class="stw-column"
      :group-key="group.key"
      :min="1"
      :input-id="group.key + 'Input'"
      :placeholder="group.placeholder"
      row-class="stw-input-row"
      add-label="Add"
      list-tag="ul"
      list-class="stw-list"
      :list-id="group.key + 'List'"
    >
      <h3>{{ group.title }}</h3>
      <p>{{ group.prompt }}</p>
    </ResponseBox>
  </InputResponse>
</template>
