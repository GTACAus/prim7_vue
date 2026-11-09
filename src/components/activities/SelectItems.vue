<script setup>
/*
  <SelectItems> wraps the markup of one activity (the data-* contract described
  above) and starts SelectItemsActivity on it once mounted.

    <SelectItems id="myActivity" :options="{ ... }">
      ...markup...
    </SelectItems>

  - id, class and any data-* attributes fall through to the root element
    (tag="section" etc. changes the element; default is div).
  - options is the options object of SelectItemsActivity. Callbacks (onChange, ...) are
    read when they fire, so a page script can attach one after mount:
      getActivity("myActivity").options.onChange = function () { ... }
  - the activity instance is also reachable from the page as getActivity(id).
*/
import Activity from "./Activity.vue";

const props = defineProps({
  tag: { type: String, default: "div" },
  // [{ id, label }] (or plain strings: id and label are the string)
  items: { type: Array, required: true },
  // how many must be selected; 'all' (default) = every item
  required: { type: [Number, String], default: "all" },
  // 'checkbox' = ticked checklist, 'button' = clickable toggle buttons
  type: { type: String, default: "checkbox" },
});

const selected = defineModel("selected", { type: Array, default: () => [] });

const list = computed(() =>
  props.items.map((item) =>
    typeof item === "string" ? { id: item, label: item } : item,
  ),
);

const requiredCount = computed(() => {
  const n = Number(props.required);
  return props.required === "all" || !(n > 0)
    ? list.value.length
    : Math.min(n, list.value.length);
});

const complete = computed(
  () => list.value.length > 0 && selected.value.length >= requiredCount.value,
);

function toggle(id) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((s) => s !== id)
    : [...selected.value, id];
}

function reset() {
  selected.value = [];
}

const emit = defineEmits(["change"]);

watch(selected, (ids) =>
  emit("change", {
    selected: ids,
    count: ids.length,
    required: requiredCount.value,
    complete: complete.value,
  }),
);
</script>

<template>
  <Activity :tag="tag" :complete="complete" @reset="reset">
    <slot />
    <!-- question / intro text -->

    <template v-for="item in list" :key="item.id">
      <label v-if="type === 'checkbox'" class="select-item">
        <input
          type="checkbox"
          :checked="selected.includes(item.id)"
          @change="toggle(item.id)"
        />
        <slot name="item" :item="item" :selected="selected.includes(item.id)">
          <span>{{ item.label }}</span>
        </slot>
      </label>

      <button
        v-else
        type="button"
        class="select-item"
        :class="{ selected: selected.includes(item.id) }"
        :aria-pressed="selected.includes(item.id)"
        @click="toggle(item.id)"
      >
        <slot name="item" :item="item" :selected="selected.includes(item.id)">
          {{ item.label }}
        </slot>
      </button>
    </template>

    <slot v-if="complete" name="complete" />
  </Activity>
</template>
