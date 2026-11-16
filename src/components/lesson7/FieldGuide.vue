<script setup>
/*
  The Deep-Sea Field Guide: every animal of the expedition, grouped by
  depth. Clicking one opens its species file below its group, with the
  description split into one fact per sentence.

    <FieldGuide v-model:selected="openFish" />   (a species id, or null)
*/
import { computed } from "vue";
import { guideGroups, staticSrc } from "./expedition.js";

const props = defineProps({
  selected: { type: String, default: null },
});
const emit = defineEmits(["update:selected"]);

const fish = computed(() =>
  guideGroups.flatMap((g) => g.species).find((f) => f.id === props.selected),
);

const facts = computed(() => {
  const text = fish.value?.guideText || fish.value?.note || "Information coming soon.";
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
});

const inGroup = (group) => group.species.some((f) => f.id === props.selected);
</script>

<template>
  <div id="creatureGrid">
    <template v-for="group in guideGroups" :key="group.title">
      <section class="creature-zone">
        <h4>{{ group.title }}</h4>
        <div class="creature-zone-grid">
          <button
            v-for="item in group.species"
            :key="item.id"
            type="button"
            @click="emit('update:selected', item.id)"
          >
            <img :src="staticSrc(item)" alt="" />
            <span>{{ item.name }}</span>
          </button>
        </div>
      </section>

      <!-- one information panel, under the group of the chosen animal -->
      <div v-if="fish && inGroup(group)" id="creaturePanel">
        <img :src="staticSrc(fish)" :alt="fish.name" />
        <div class="creature-info">
          <span class="creature-info-kicker">Species file // Field notes</span>
          <h4>{{ fish.name }}</h4>
          <ul class="creature-facts">
            <li v-for="fact in facts" :key="fact">{{ fact }}</li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
