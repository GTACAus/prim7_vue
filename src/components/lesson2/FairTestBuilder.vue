<script setup>
/*
  Lesson 2 "build your fair test plan": pick what to change, measure and keep
  the same, and watch two experiments (A and B) update as a diagram and a
  blueprint. Styled by styles/lesson2_styles/bigkahuna4.css.

    <FairTestBuilder />
*/
import { computed, reactive, ref } from 'vue'

const variableConfig = {
  size: {
    label: 'Ball size',
    changeOptions: [
      { value: 'small-large', label: 'Small ball vs large ball', pair: ['small', 'large'] },
      { value: 'large-small', label: 'Large ball vs small ball', pair: ['large', 'small'] },
    ],
    controlOptions: [{ value: 'large', label: 'Large ball' }, { value: 'small', label: 'Small ball' }],
  },
  material: {
    label: 'Ball material',
    changeOptions: [
      { value: 'basketball-pingpong', label: 'Rubber vs plastic', pair: ['basketball', 'pingpong'] },
      { value: 'basketball-tennis', label: 'Rubber vs furry', pair: ['basketball', 'tennis'] },
      { value: 'tennis-pingpong', label: 'Furry vs plastic', pair: ['tennis', 'pingpong'] },
    ],
    controlOptions: [
      { value: 'basketball', label: 'Rubber' },
      { value: 'pingpong', label: 'Plastic' },
      { value: 'tennis', label: 'Furry' },
    ],
  },
  height: {
    label: 'Drop height',
    changeOptions: [
      { value: '1-1.5', label: '1 m vs 1.5 m', pair: ['1', '1.5'] },
      { value: '1.5-1', label: '1.5 m vs 1 m', pair: ['1.5', '1'] },
    ],
    controlOptions: [{ value: '1', label: '1 m' }, { value: '1.5', label: '1.5 m' }],
  },
  firmness: {
    label: 'Squashiness',
    changeOptions: [
      { value: 'firm-soft', label: 'Firm ball vs soft ball', pair: ['firm', 'soft'] },
      { value: 'soft-firm', label: 'Soft ball vs firm ball', pair: ['soft', 'firm'] },
    ],
    controlOptions: [{ value: 'firm', label: 'Firm ball' }, { value: 'soft', label: 'Soft ball' }],
  },
  surface: {
    label: 'Bounce surface',
    changeOptions: [
      { value: 'hard-soft', label: 'Hard surface vs soft surface', pair: ['hard-surface', 'soft-surface'] },
      { value: 'soft-hard', label: 'Soft surface vs hard surface', pair: ['soft-surface', 'hard-surface'] },
    ],
    controlOptions: [
      { value: 'hard-surface', label: 'Hard surface' },
      { value: 'soft-surface', label: 'Soft surface' },
    ],
  },
}

const measureOutcomes = [
  { value: 'bounceHeight', label: 'Bounce height' },
  { value: 'bounceCount', label: 'Number of bounces' },
  { value: 'bounceTime', label: 'Time spent bouncing' },
]
const measureTools = [
  { value: 'measuringTape', label: 'Use measuring tape' },
  { value: 'ruler', label: 'Use ruler' },
  { value: 'stopwatch', label: 'Use stopwatch' },
  { value: 'count', label: 'Count the bounces' },
  { value: 'video', label: 'Record a video' },
  { value: 'estimate', label: 'Estimate by eye' },
]

const stages = [
  { id: 'change', label: '1. Change' },
  { id: 'measure', label: '2. Measure' },
  { id: 'control', label: '3. Control' },
]

const variables = Object.entries(variableConfig).map(([value, config]) => ({ value, label: config.label }))

function initialControls() {
  return { size: 'large', material: 'basketball', height: '1.5', firmness: 'firm', surface: 'hard-surface' }
}

const state = reactive({
  stage: 'change',
  changeVariable: null,
  changeSelections: {},
  measureOutcome: null,
  measureTool: null,
  selectedControlVariable: null,
  controls: initialControls(),
})
const missing = ref(null) // null = "check" not pressed yet, [] = complete

const getOptionLabel = (options, value) => options.find((option) => option.value === value)?.label || 'Not selected'

/* ---------- controls ---------- */

const changeConfig = computed(() => (state.changeVariable ? variableConfig[state.changeVariable] : null))
const changeSelected = computed(() =>
  changeConfig.value
    ? state.changeSelections[state.changeVariable] || changeConfig.value.changeOptions[0].value
    : null
)
const outcomeLabel = computed(() => getOptionLabel(measureOutcomes, state.measureOutcome))
const toolLabel = computed(() => getOptionLabel(measureTools, state.measureTool))
const controlConfig = computed(() =>
  state.selectedControlVariable && state.selectedControlVariable !== state.changeVariable
    ? variableConfig[state.selectedControlVariable]
    : null
)

function chooseChange(value) {
  state.changeVariable = value
  state.selectedControlVariable = null
  if (!state.changeSelections[value]) state.changeSelections[value] = variableConfig[value].changeOptions[0].value
}

function chooseMeasure(value) {
  state.measureOutcome = value
  if (!state.measureTool) state.measureTool = measureTools[0].value
}

/* ---------- diagram ---------- */

const experiments = computed(() => {
  const a = { ...state.controls }
  const b = { ...state.controls }
  if (state.changeVariable) {
    const pair = changeConfig.value.changeOptions.find((option) => option.value === changeSelected.value).pair
    a[state.changeVariable] = pair[0]
    b[state.changeVariable] = pair[1]
  }
  return { a, b }
})

function ballProps(values) {
  return {
    class: [values.material, { soft: values.firmness === 'soft' }],
    style: { '--size': values.size === 'small' ? '82px' : '120px', top: values.height === '1' ? '39%' : '21%' },
  }
}

const surfaceLabel = (type) => getOptionLabel(variableConfig.surface.controlOptions, type)

/* ---------- copy and blueprint ---------- */

const stageCopy = computed(() => {
  if (state.stage === 'change') {
    return {
      prompt: 'Choose the one variable that will be different.',
      status: 'After choosing a variable, its comparison menu appears underneath.',
    }
  }
  if (state.stage === 'measure') {
    return {
      prompt: 'Choose one outcome to measure.',
      status: 'The same measurement-method menu is available for each outcome.',
    }
  }
  return {
    prompt: 'Choose the settings that both experiments will share.',
    status: state.changeVariable
      ? `${changeConfig.value.label} cannot be controlled because it is being changed.`
      : 'Choose a Change variable first to disable it here.',
  }
})

const blueprintChange = computed(() =>
  state.changeVariable
    ? `${changeConfig.value.label}: ${getOptionLabel(changeConfig.value.changeOptions, changeSelected.value)}`
    : 'Not selected yet'
)
const blueprintMeasure = computed(() =>
  state.measureOutcome ? `${outcomeLabel.value}: ${toolLabel.value}` : 'Not selected yet'
)
const blueprintControl = computed(() =>
  Object.keys(variableConfig)
    .filter((key) => key !== state.changeVariable)
    .map((key) => `${variableConfig[key].label}: ${getOptionLabel(variableConfig[key].controlOptions, state.controls[key])}`)
    .join('; ')
)
const measurementNote = computed(() =>
  state.measureOutcome ? `${outcomeLabel.value}\n${toolLabel.value}` : 'Choose what you will measure.'
)

/* ---------- check and reset ---------- */

function check() {
  const found = []
  if (!state.changeVariable) found.push('a Change variable')
  if (!state.measureOutcome) found.push('a Measure outcome')
  if (!state.measureTool) found.push('a Measurement tool')
  if (!state.selectedControlVariable) found.push('a Control variable')
  missing.value = found
}

const warningClass = computed(() => (missing.value?.length === 0 ? 'blueprint-success' : 'blueprint-warning'))
const warningStyle = computed(() =>
  missing.value?.length === 0
    ? { background: 'var(--soft-green)', borderTop: '4px solid var(--green)' }
    : { background: 'var(--soft-orange)', borderTop: '4px solid var(--orange)' }
)

function reset() {
  state.stage = 'change'
  state.changeVariable = null
  state.changeSelections = {}
  state.measureOutcome = null
  state.measureTool = null
  state.selectedControlVariable = null
  state.controls = initialControls()
  missing.value = null
}
</script>

<template>
  <div class="bk-area">
    <div class="bk3-page">
      <nav class="bk3-progress" aria-label="Investigation sections">
        <button
          v-for="stage in stages"
          :key="stage.id"
          type="button"
          class="bk3-progress-step"
          :class="{ active: state.stage === stage.id }"
          @click="state.stage = stage.id"
        >{{ stage.label }}</button>
      </nav>

      <section class="bk3-top-controls" aria-label="Experiment choices">
        <div id="controlsRoot">
          <template v-if="state.stage === 'change'">
            <p class="control-instruction">What will you change?</p>
            <div class="choice-buttons">
              <button
                v-for="item in variables"
                :key="item.value"
                type="button"
                class="choice-button"
                :class="{ selected: state.changeVariable === item.value }"
                @click="chooseChange(item.value)"
              >{{ item.label }}</button>
            </div>
            <div v-if="changeConfig" class="revealed-menu">
              <div class="revealed-copy">
                <strong>{{ changeConfig.label }}</strong>
                <span>Choose how Experiment A and Experiment B will differ.</span>
              </div>
              <div class="bk3-control">
                <label for="changePairSelect">Comparison</label>
                <select
                  id="changePairSelect"
                  :value="changeSelected"
                  @change="state.changeSelections[state.changeVariable] = $event.target.value"
                >
                  <option v-for="option in changeConfig.changeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
            </div>
          </template>

          <template v-else-if="state.stage === 'measure'">
            <p class="control-instruction">What will you measure?</p>
            <div class="choice-buttons">
              <button
                v-for="item in measureOutcomes"
                :key="item.value"
                type="button"
                class="choice-button"
                :class="{ selected: state.measureOutcome === item.value }"
                @click="chooseMeasure(item.value)"
              >{{ item.label }}</button>
            </div>
            <div v-if="state.measureOutcome" class="revealed-menu">
              <div class="revealed-copy">
                <strong>{{ outcomeLabel }}</strong>
                <span>Choose how students will measure it.</span>
              </div>
              <div class="bk3-control">
                <label for="measureToolSelect">Measurement method</label>
                <select id="measureToolSelect" :value="state.measureTool" @change="state.measureTool = $event.target.value">
                  <option v-for="option in measureTools" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
            </div>
          </template>

          <template v-else>
            <p class="control-instruction">What will you keep the same?</p>
            <div class="choice-buttons">
              <button
                v-for="item in variables"
                :key="item.value"
                type="button"
                class="choice-button"
                :class="{ selected: state.selectedControlVariable === item.value }"
                :disabled="state.changeVariable === item.value"
                @click="state.selectedControlVariable = item.value"
              >{{ item.label }}</button>
            </div>
            <p v-if="state.changeVariable" style="margin-top:9px;color:var(--muted);font-size:.9rem;">
              {{ changeConfig.label }} is unavailable here because it is the variable being changed.
            </p>
            <div v-if="controlConfig" class="revealed-menu control-editor">
              <div class="revealed-copy">
                <strong>{{ controlConfig.label }}</strong>
                <span>This setting will apply to both Experiment A and Experiment B.</span>
              </div>
              <div class="bk3-control">
                <label for="controlValueSelect">Shared value</label>
                <select
                  id="controlValueSelect"
                  :value="state.controls[state.selectedControlVariable]"
                  @change="state.controls[state.selectedControlVariable] = $event.target.value"
                >
                  <option v-for="option in controlConfig.controlOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
            </div>
            <div v-else class="control-editor control-editor-empty">
              Select a controlled variable to choose the value that both experiments will share.
            </div>
          </template>
        </div>
      </section>

      <section class="bk3-main-card">
        <div class="bk3-heading-row">
          <div>
            <h1>Your Experiment</h1>
            <p id="stagePrompt">{{ stageCopy.prompt }}</p>
          </div>
          <p class="bk3-status" id="diagramStatus">{{ stageCopy.status }}</p>
        </div>

        <div class="bk3-canvas" aria-label="Visual experiment builder">
          <div class="ruler" aria-hidden="true"></div>
          <div class="lane-label a">Experiment A</div>
          <div class="lane-label b">Experiment B</div>
          <div class="drop-line a"></div>
          <div class="drop-line b"></div>
          <div id="ballA" class="ball a" v-bind="ballProps(experiments.a)"></div>
          <div id="ballB" class="ball b" v-bind="ballProps(experiments.b)"></div>
          <div id="surfaceA" class="surface a" :class="experiments.a.surface"><span>{{ surfaceLabel(experiments.a.surface) }}</span></div>
          <div id="surfaceB" class="surface b" :class="experiments.b.surface"><span>{{ surfaceLabel(experiments.b.surface) }}</span></div>
          <div class="measurement-note" id="measurementNote">{{ measurementNote }}</div>
        </div>
      </section>

      <section class="bk3-blueprint">
        <h2>Fair test experiment design</h2>
        <div class="blueprint-grid">
          <article class="blueprint-card independent-card"><strong>Change</strong><span>{{ blueprintChange }}</span></article>
          <article class="blueprint-card dependent-card"><strong>Measure</strong><span>{{ blueprintMeasure }}</span></article>
          <article class="blueprint-card control-card"><strong>Control</strong><span>{{ blueprintControl }}</span></article>
        </div>
        <div
          v-if="missing"
          class="diagram-box diagram-activity"
          :class="warningClass"
          :style="warningStyle"
        >
          <p v-if="!missing.length" class="success-message">
            You have selected all required options. Your experiment blueprint is complete!
          </p>
          <ul v-else>
            <li v-for="item in missing" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="bk3-actions">
          <button type="button" @click="reset">Reset</button>
          <button type="button" class="primary" @click="check">Check fair test experiment design</button>
        </div>
      </section>
    </div>
  </div>
</template>
