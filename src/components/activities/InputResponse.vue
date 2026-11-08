<script setup>
/*
  A set of answer groups ("type an answer, press Add / Enter, see it appear as a
  removable answer") that together make one activity: See / Think / Wonder
  columns, a sticky-note brainstorm, short written answers, numeric table cells.

    <InputResponse id="myActivity" data-tr-min-total="4" @change="...">
      <ResponseBox group-key="see" :min="1" ... />
      <ResponseBox group-key="think" :min="1" ... />
    </InputResponse>

  The groups are <ResponseBox>es (any depth inside the root); each one is a
  <StudentEntry>, which does the typing, the language filter and the delete
  buttons.

  Completeness (data-activity-complete, which a section's Next button watches):
    - data-tr-min-total="N" on the root: N answers across every group, or
    - each group needs its own min answers; if no group sets one the activity
      is always complete.
    - a group with a right answer must also hold a correct answer.

  Page scripts reach it as getActivity(id), same as every activity:
    getAnswers() -> { groupKey: [answers...] }     getAnswer(key) -> first answer or null
    restore(map)  reset()  isCorrect()
    options.onChange(answers) and the "ir:change" event fire whenever answers change.
*/
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, useAttrs, watch } from 'vue'
import { Activity } from './activity-base.js'

const props = defineProps({
  tag: { type: String, default: 'div' },
  options: { type: Object, default: () => ({}) },
})

const attrs = useAttrs()
const root = ref(null)
const groups = reactive([])
let activity = null
let ready = false

provide('inputResponse', {
  register: (group) => groups.push(group),
  unregister: (group) => {
    const i = groups.indexOf(group)
    if (i >= 0) groups.splice(i, 1)
  },
})

function matches(group, answer) {
  if (!group.answer) return false

  const isNumber = group.type === 'number'

  return group.answer.split('|').some((accepted) => {
    accepted = accepted.trim()
    if (isNumber) return answer.trim() !== '' && Number(answer) === Number(accepted)
    return answer.trim().toLowerCase() === accepted.toLowerCase()
  })
}

const allCorrect = computed(() =>
  groups.every((group) => !group.answer || (group.answers.length > 0 && matches(group, group.answers[0])))
)

const complete = computed(() => {
  const minTotal = parseInt(attrs['data-tr-min-total'] || '0', 10)
  let enough

  if (minTotal > 0) {
    enough = groups.reduce((sum, group) => sum + group.answers.length, 0) >= minTotal
  } else {
    const anyMinSet = groups.some((group) => group.min > 0)
    enough = !anyMinSet || groups.every((group) => group.min === 0 || group.answers.length >= group.min)
  }

  return enough && allCorrect.value
})

function getAnswers() {
  const result = {}
  groups.forEach((group) => {
    if (group.key) result[group.key] = [...group.answers]
  })
  return result
}

function restore(saved) {
  saved = saved || {}
  groups.forEach((group) => {
    group.answers = [...((group.key && saved[group.key]) || [])]
  })
}

function reset() {
  groups.forEach((group) => group.clear())
}

watch(complete, (isComplete) => activity?.setComplete(isComplete))

// answers changed (typed, deleted, restored or reset)
watch(
  () => groups.map((group) => group.answers.join('\u0001')).join('\u0002'),
  () => {
    if (!ready) return

    const answers = getAnswers()
    if (typeof activity.options.onChange === 'function') activity.options.onChange(answers)
    root.value.dispatchEvent(new CustomEvent('ir:change', { detail: { answers }, bubbles: true }))
  }
)

onMounted(() => {
  activity = new Activity(root.value, { ...props.options })

  Object.assign(activity, {
    getAnswers,
    getAnswer: (key) => getAnswers()[key]?.[0] ?? null,
    restore,
    reset,
    isCorrect: () => allCorrect.value,
  })

  activity.setComplete(complete.value)
  ready = true
})

onBeforeUnmount(() => {
  activity = null
})

defineExpose({ getActivity: () => activity })
</script>

<template>
  <component :is="tag" ref="root" data-activity>
    <slot />
  </component>
</template>
