<script setup>
defineProps({
  href: { type: String, required: true },
  img: { type: String, required: true },
  stage: { type: Number, required: true },
  accent: { type: String, default: "var(--purple)" },
});
</script>

<template>
  <a
    class="lesson-card"
    :href="href"
    :style="{ '--accent': accent }"
    :data-stage="stage"
  >
    <img v-if="img" :src="img" alt="" />
    <span class="lesson-number"><slot name="number" /></span>
    <span class="lesson-subtitle"><slot name="subtitle" /></span>
  </a>
</template>

<style scoped>
.lesson-card {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  box-sizing: border-box;
  width: clamp(220px, 60vw, 550px);
  min-height: clamp(260px, 44vh, 430px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  overflow: hidden;
  padding: clamp(20px, 4vw, 48px);
  border: 2px solid var(--line);
  border-top: 8px solid var(--accent);
  border-radius: 28px;
  background: white;
  box-shadow:
    0 16px 36px rgb(0 0 0 / 40%),
    var(--tilt-shadow, 0 0 0 transparent);

  color: var(--text);
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transform: translate(-50%, -50%) scale(1);

  rotate: var(--tilt-angle, 0deg);
  scale: var(--tilt-scale, 1);

  transition:
    left 0.45s ease,
    opacity 0.45s ease,
    transform 0.45s ease,
    box-shadow 0.2s ease,
    background 0.45s ease,
    width 0.45s ease;
  will-change: left, transform, width;
}
.lesson-card img {
  position: absolute;
  inset: 10% 12%;
  width: 76%;
  height: 80%;
  margin: auto;
  object-fit: contain;
  opacity: 0.2;
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.lesson-card span {
  position: relative;
}
.lesson-number {
  color: var(--purple);
  font-size: clamp(1.3rem, 2.4vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  transition: transform 0.45s ease;
}
.lesson-subtitle {
  max-width: 17ch;
  font-size: clamp(0.9rem, 1.5vw, 1.2rem);
  font-weight: 700;
  line-height: 1.35;
  transition: transform 0.45s ease;
}
.lesson-card.is-current {
  z-index: 2;
  opacity: 1;
  box-shadow:
    0 24px 54px rgb(0 0 0 / 40%),
    var(--tilt-shadow, 0 0 0 transparent);
  transform: translate(-50%, -50%) scale(1);
}
.lesson-card.is-current:not(.unavailable):hover {
  background: color-mix(in srgb, var(--accent) 20%, white 80%);
}
.lesson-card.is-current:not(.unavailable):hover .lesson-subtitle {
  transform: scale(1.5);
}

.lesson-card.is-current img {
  opacity: 0.28;
}
.lesson-card.is-previous,
.lesson-card.is-next {
  --scale-amount: 0.82;
  z-index: 1;
  cursor: pointer;
  opacity: 0.62;

  transform: translate(-50%, -50%) scale(var(--scale-amount))
    rotateY(var(--rotate-amount));
  transition:
    left 0.45s ease,
    opacity 0.45s ease,
    box-shadow 0.2s ease,
    transform 0.45s ease,
    width 0.45s ease;
}
.lesson-card.is-previous {
  --rotate-amount: calc(-1 * 30deg);
  left: max(0px, calc(50% - min(40vw, 460px)));
}
.lesson-card.is-next {
  --rotate-amount: 30deg;
  left: min(100%, calc(50% + min(40vw, 460px)));
}
.lesson-card.is-previous:hover,
.lesson-card.is-next:hover {
  --scale-amount: 0.88;
  opacity: 0.88;
}
.lesson-card.is-hidden {
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(1);
}
.lesson-card.unavailable {
  filter: grayscale(0.5);
}
.lesson-card.is-current.unavailable {
  opacity: 0.55;
}

.lesson-card:focus-visible {
  outline: 4px solid var(--purple);
  outline-offset: 5px;
}
@media (max-width: 600px) {
  .lesson-card {
    width: min(68vw, 310px);
    min-height: clamp(250px, 40vh, 360px);
  }
  .lesson-card.is-previous,
  .lesson-card.is-next {
    width: min(54vw, 250px);
  }
  .lesson-card.is-previous {
    left: 20%;
  }
  .lesson-card.is-next {
    left: 80%;
  }
}
</style>
