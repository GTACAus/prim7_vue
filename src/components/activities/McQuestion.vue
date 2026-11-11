<script setup>
/*
  One question inside a <MultipleChoice>: holds the right answer for the
  <McChoice> buttons inside it (any depth).

    <McQuestion answer="increases" v-slot="{ answered, correct }">
      <p>As the temperature increases, the amount of gas:</p>
      <McChoice value="increases">Increases</McChoice>
      <McChoice value="decreases">Decreases</McChoice>
      <p v-if="answered">{{ correct ? "Yes!" : "Look again." }}</p>
    </McQuestion>

  name: the key its pick is saved under (defaults to its order).
*/
import { computed, inject, onBeforeUnmount, provide, reactive } from "vue";

const props = defineProps({
  answer: { type: String, required: true },
  name: { type: String, default: "" },
  tag: { type: String, default: "div" },
});

const mc = inject("multipleChoice");

const question = reactive({ name: props.name, answer: props.answer, key: "" });
mc.register(question);
onBeforeUnmount(() => mc.unregister(question));

const picked = computed(() => mc.picked.value[question.key]);
const answered = computed(() => picked.value !== undefined);
const correct = computed(() => picked.value === question.answer);

provide("mcQuestion", question);
</script>

<template>
  <component :is="tag" v-show="mc.isVisible(question)">
    <slot :picked="picked" :answered="answered" :correct="correct" />
  </component>
</template>
