<script setup>
/*
  DRAG AND DROP
  Items are dragged from a tray into drop slots. The layout around them is
  entirely up to the page: <DropSlot>s and <DragItem>s can sit anywhere inside.

    <DragDrop id="myActivity" strict v-slot="{ done, trayEmpty }" @change="...">
      <p>The <DropSlot name="a" answer="beaker" /> holds the water.</p>
      <DropSlot name="b" answer="flask jug">Drop label</DropSlot>   <!-- content shows while empty -->

      <div data-dd-tray v-show="!trayEmpty">
        <DragItem name="beaker">...any content...</DragItem>
        <DragItem name="flask" tag="span">flask</DragItem>
        <DragItem name="water" reusable>water</DragItem>
      </div>

      <p v-if="done">Well done!</p>
      <button data-reset-trigger>Start over</button>
    </DragDrop>

  State lives here: which item is in which slot (placements). A <DragItem>
  renders where it is written (the tray) until it is placed, then teleports
  into its slot; nothing moves DOM nodes by hand.

  Slots and answers (<DropSlot answer="...">):
    - answer is a space-separated list (or array) of item names, any one of
      which the slot accepts. No answer = accepts anything.
    - Slots with the exact same multi-value answer form a group: the same item
      can't correctly fill two of them ("sunlight water oxygen" on three slots
      means each word once, in any order).
  Items:
    - reusable: never used up; placing it puts a copy in the slot and leaves it
      in the tray. Dragging a copy out of its slot discards it.
  strict: dropping an item on a slot whose answer doesn't accept it sends it
    back (the slot gets .dd-rejected briefly) and emits "incorrect".

  Complete (for the section's Next button) once every slot is filled and every
  answer is correct.

  Slot props: { done, filled, correct, trayEmpty, placements, reset }.
  Events: change(placements), incorrect({ item, slot }). A "dd:change" DOM event
  also fires on the root for the plain save scripts (lesson_progress.js).
  getActivity(id) adds getPlacements() / setPlacements(map) / isCorrect().

  Interaction: drag with mouse/touch/pen, or click/tap an item then a slot, or
  keyboard (Enter/Space to pick up and drop, Delete/Backspace sends a placed
  item back, Escape cancels). Dropping on an occupied slot swaps; dropping
  anywhere else returns the item to the tray.
*/
import { computed, nextTick, provide, reactive, ref } from 'vue'
import Activity from './Activity.vue'

const props = defineProps({
  tag: { type: String, default: 'div' },
  // send items dropped on the wrong slot straight back
  strict: { type: Boolean, default: false },
})

const emit = defineEmits(['change', 'incorrect'])

const DRAG_THRESHOLD = 5 // px of movement before a press becomes a drag

/* ---------- state ---------- */

const placements = reactive({}) // slot name -> item name
const slots = reactive(new Map()) // slot name -> { answers, el }
const items = reactive(new Map()) // item name -> { reusable }

/* A "piece" is one rendered item: { item, from } where from is the slot it
   sits in, or null for the tray. A reusable item has one piece in the tray
   plus one copy per slot holding it. */
const selected = ref(null)
const dragging = ref(null)
const hoverSlot = ref(null)
const rejectedSlot = ref(null)

const activity = ref(null)

/* ---------- derived ---------- */

function isReusable(item) {
  return Boolean(items.get(item)?.reusable)
}

function slotOf(item) {
  return Object.keys(placements).find((slot) => placements[slot] === item) ?? null
}

function slotsHolding(item) {
  return Object.keys(placements).filter((slot) => placements[slot] === item)
}

function accepts(slot, item) {
  const answers = slots.get(slot)?.answers ?? []
  return answers.length === 0 || answers.includes(item)
}

// another slot with the same multi-value answer already holds this item
// (ignoring `leaving`, the slot the item is being moved out of)
function isDuplicateInGroup(slot, item, leaving = null) {
  const group = slots.get(slot)?.answers.join(' ')
  return [...slots.keys()].some(
    (other) =>
      other !== slot &&
      other !== leaving &&
      slots.get(other).answers.join(' ') === group &&
      placements[other] === item
  )
}

const filled = computed(() => slots.size > 0 && [...slots.keys()].every((slot) => placements[slot]))

const correct = computed(() =>
  [...slots.keys()].every((slot) => {
    if (!slots.get(slot).answers.length) return true
    const item = placements[slot]
    return Boolean(item) && accepts(slot, item) && !isDuplicateInGroup(slot, item)
  })
)

const done = computed(() => filled.value && correct.value)

const trayEmpty = computed(() =>
  [...items.keys()].every((item) => !isReusable(item) && slotOf(item))
)

/* ---------- placing ---------- */

function changed() {
  const snapshot = { ...placements }
  emit('change', snapshot)

  // after the re-render, so plain scripts reading getActivity(id).isComplete() see the new state
  nextTick(() =>
    activity.value?.$el.dispatchEvent(
      new CustomEvent('dd:change', { detail: { placements: snapshot }, bubbles: true })
    )
  )
}

function rejects(slot, item, from) {
  if (!props.strict || !slots.get(slot)?.answers.length) return false
  return !accepts(slot, item) || isDuplicateInGroup(slot, item, from)
}

let rejectTimer = null
function reject(item, slot) {
  // off for a frame, so a repeated wrong drop restarts the animation
  rejectedSlot.value = null
  clearTimeout(rejectTimer)
  requestAnimationFrame(() => {
    rejectedSlot.value = slot
    rejectTimer = setTimeout(() => (rejectedSlot.value = null), 500)
  })
  emit('incorrect', { item, slot })
}

// move a piece to a slot (null = back to the tray)
function place({ item, from }, target) {
  if (target && rejects(target, item, from)) {
    reject(item, target)
    return
  }
  if (target === from) return

  if (isReusable(item)) {
    if (from) delete placements[from] // a copy leaves its slot (or is discarded)
    if (target) placements[target] = item // the tray source stays; a copy goes in
  } else {
    // an occupant swaps into the slot this item came from, or goes to the tray
    const occupant = target ? placements[target] : null
    if (from) {
      if (occupant) placements[from] = occupant
      else delete placements[from]
    }
    if (target) placements[target] = item
  }

  changed()
}

/* ---------- click / keyboard ---------- */

function isSelected(piece) {
  return selected.value?.item === piece.item && selected.value?.from === piece.from
}

function toggleSelect(piece) {
  selected.value = isSelected(piece) ? null : piece
}

function slotActivate(event, slot) {
  if (!selected.value) return
  if (event.target.closest('[data-dd-item]')) return // a click on an item inside is its own
  const piece = selected.value
  selected.value = null
  place(piece, slot)
}

function itemKey(event, piece) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggleSelect(piece)
  } else if ((event.key === 'Delete' || event.key === 'Backspace') && piece.from) {
    event.preventDefault()
    selected.value = null
    place(piece, null)
  } else if (event.key === 'Escape') {
    selected.value = null
  }
}

/* ---------- pointer dragging ---------- */

let drag = null

function pointerDown(event, piece) {
  if (event.button !== undefined && event.button !== 0) return
  if (drag) return

  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  drag = {
    piece,
    el,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    width: rect.width,
    height: rect.height,
    moved: false,
    ghost: null,
  }

  document.addEventListener('pointermove', pointerMove)
  document.addEventListener('pointerup', pointerUp)
  document.addEventListener('pointercancel', pointerUp)
}

function pointerMove(event) {
  if (!drag || event.pointerId !== drag.pointerId) return

  if (!drag.moved) {
    if (Math.abs(event.clientX - drag.startX) + Math.abs(event.clientY - drag.startY) < DRAG_THRESHOLD) return
    drag.moved = true
    selected.value = null
    dragging.value = drag.piece
    startGhost()
  }

  event.preventDefault()
  drag.ghost.style.left = event.clientX - drag.offsetX + 'px'
  drag.ghost.style.top = event.clientY - drag.offsetY + 'px'
  hoverSlot.value = slotAt(event.clientX, event.clientY)
  drag.ghost.classList.toggle('dd-ghost-hover', Boolean(hoverSlot.value))
}

function pointerUp(event) {
  if (!drag || event.pointerId !== drag.pointerId) return

  document.removeEventListener('pointermove', pointerMove)
  document.removeEventListener('pointerup', pointerUp)
  document.removeEventListener('pointercancel', pointerUp)
  const finished = drag
  drag = null

  if (!finished.moved) {
    toggleSelect(finished.piece) // plain click / tap
    return
  }

  const target = event.type === 'pointercancel' ? null : slotAt(event.clientX, event.clientY)
  finished.ghost.remove()
  dragging.value = null
  hoverSlot.value = null
  place(finished.piece, target)
}

/* The ghost following the pointer is a throwaway copy of the item's element,
   outside the Vue tree (on <body>, or the fullscreen element, which is the only
   thing rendered in fullscreen). It keeps data-dd-item so item styles apply. */
function startGhost() {
  const ghost = drag.el.cloneNode(true)
  ghost.removeAttribute('tabindex')
  ghost.classList.remove('dd-selected', 'dd-placed', 'dd-dragging')
  ghost.classList.add('dd-ghost')

  // a placed item is sized to its slot: let the ghost take its natural size, held by its centre
  const wasPlaced = Boolean(drag.piece.from)
  if (!wasPlaced) {
    ghost.style.width = drag.width + 'px'
    ghost.style.height = drag.height + 'px'
  }
  ;(document.fullscreenElement || document.webkitFullscreenElement || document.body).appendChild(ghost)
  if (wasPlaced) {
    const rect = ghost.getBoundingClientRect()
    drag.offsetX = rect.width / 2
    drag.offsetY = rect.height / 2
  }

  drag.ghost = ghost
}

// slot under the pointer (the ghost has pointer-events: none)
function slotAt(x, y) {
  const slot = document.elementFromPoint(x, y)?.closest('[data-dd-slot]')
  return slot && activity.value?.$el.contains(slot) ? slot.dataset.ddSlot : null
}

/* ---------- reset / save ---------- */

function clear() {
  Object.keys(placements).forEach((slot) => delete placements[slot])
}

function reset() {
  clear()
  selected.value = null
  changed()
}

function getPlacements() {
  return { ...placements }
}

// restore a saved layout (no change event)
function setPlacements(saved) {
  clear()
  selected.value = null
  Object.entries(saved || {}).forEach(([slot, item]) => {
    if (!slots.has(slot) || !items.has(item)) return
    if (!isReusable(item)) {
      const previous = slotOf(item)
      if (previous) delete placements[previous]
    }
    placements[slot] = item
  })
}

/* ---------- for <DropSlot> / <DragItem> ---------- */

provide('dragDrop', {
  placements,
  registerSlot: (name, slot) => slots.set(name, slot),
  unregisterSlot: (name) => {
    slots.delete(name)
    delete placements[name]
  },
  registerItem: (name, item) => items.set(name, item),
  unregisterItem: (name) => items.delete(name),
  slotEl: (name) => slots.get(name)?.el ?? null,
  slotOf,
  slotsHolding,
  isSelected,
  isDragging: (piece) => dragging.value?.item === piece.item && dragging.value?.from === piece.from,
  isHover: (slot) => hoverSlot.value === slot,
  isRejected: (slot) => rejectedSlot.value === slot,
  pointerDown,
  itemKey,
  slotActivate,
})

const api = { getPlacements, setPlacements, isCorrect: () => correct.value }

defineExpose({ ...api, reset, done })
</script>

<template>
  <Activity
    ref="activity"
    :tag="tag"
    :complete="done"
    :api="api"
    :class="{ 'dd-has-selection': selected, 'dd-is-dragging': dragging }"
    @reset="reset"
  >
    <slot
      :done="done"
      :filled="filled"
      :correct="correct"
      :trayEmpty="trayEmpty"
      :placements="placements"
      :reset="reset"
    />
  </Activity>
</template>
