<script setup>
/*
  One stage of an expedition mission: the terminal-window frame around it,
  the "Mission 02 · Stage 3 of 8" row and the stage's feedback box (filled
  by CHECK).

    <MissionStage id="m2-symbol-match" bar="mission 2: scientific symbols"
                  label="Mission 02" chip="Stage 3 of 8" :feedback="feedback">
      ...stage content...
    </MissionStage>

  feedback: { variant: "success" | "try-again", title, text } or null.
  Only the current stage is shown (.active, set by <Expedition>).
*/
defineProps({
  id: { type: String, required: true },
  bar: { type: String, required: true },
  label: { type: String, default: "" },
  chip: { type: String, default: "" },
  dots: { type: Boolean, default: true },
  active: { type: Boolean, default: false },
  feedback: { type: Object, default: null },
});
</script>

<template>
  <div class="mission-stage" :class="{ active }" :data-stage-id="id">
    <div class="mission-window">
      <div class="mission-window-bar">
        <strong>Deep field terminal // {{ bar }}</strong>
        <div v-if="dots" class="window-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div class="mission-window-body">
        <div v-if="label || chip" class="stage-progress-row">
          <p class="mission-label">{{ label }}</p>
          <span class="stage-progress-chip">{{ chip }}</span>
        </div>

        <slot />

        <div
          class="variable-feedback stage-feedback"
          :class="feedback ? 'feedback-' + feedback.variant : null"
          role="status"
          aria-live="polite"
        >
          <template v-if="feedback">
            <strong class="ball-pair-feedback-title">{{ feedback.title }}</strong>
            <span class="ball-pair-feedback-text">{{ feedback.text }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
