<script>
/*
  ==================================================
  ACTIVITY
  The wrapper every activity component renders as its root. It
    - renders the root element (data-activity, data-activity-complete),
    - registers with the enclosing <Section>, so the section can show its
      Next button once every activity in it is complete,
    - works out whether the activity is available (depends-on),
    - wires [data-reset-trigger] buttons inside it to reset().

  Vue activities (the way to go) keep their own state and pass completeness
  down; Activity asks them to reset with the "reset" event:

    const complete = computed(() => ...)
    function reset() { ...clear own state... }

    <Activity :complete="complete" @reset="reset">...</Activity>

  It is also reset when a [data-reset-trigger] inside it is clicked, when a
  section-wide reset button is, or when its depends-on activity is reset.
  With an id it is reachable from plain page scripts as getActivity(id)
  (isComplete / isAvailable / reset).

  Activities not converted yet leave :complete unset and use ActivityBase
  (below) instead.

  Availability: give the activity depends-on="otherActivityId" (or the
  attribute data-activity-depends-on, which falls through from the activity
  component). It stays unavailable (.activity-unavailable, [inert], hidden)
  until that activity is complete, and resets itself if that activity is
  reset. If the root contains elements marked data-activity-hidden, only
  those are hidden while unavailable and the rest stays visible.

  Legacy: activity logic in a prototype "class" built on ActivityBase.
  The component creates it on the wrapper's root element once mounted:

    activity = new DragDropActivity(root.value.$el, options)

  ActivityBase finds the <Activity> wrapper that owns that element, so
  setComplete() / isComplete() / reset() go through the wrapper's state.

  Plain page scripts reach every activity as getActivity(id).
  ==================================================
*/
import { ref } from "vue";

/* One registry for every activity on the page. It lives on window so the
   plain scripts that still import their own copy of the activity code
   (lesson_progress.js, the lesson 4 scripts) see the same activities. */
const registry = window.__activityRegistry || (window.__activityRegistry = {});

/* Look an activity up by its root element's id, e.g. getActivity("yeastActivity"). */
function getActivity(id) {
  return registry[id] || null;
}
window.getActivity = getActivity;

/* root element -> the <Activity> wrapper that rendered it */
const contexts = new WeakMap();

function getActivityContext(element) {
  return contexts.get(element) || null;
}

/* Bumped on every activity:change anywhere on the page (Vue activities and
   the plain-script ones), so computed values that ask an activity whether
   it is complete re-evaluate. */
const changeTick = ref(0);
document.addEventListener("activity:change", () => changeTick.value++);

/* ---------- ActivityBase: shared API of every activity prototype ---------- */

/*
  Subclasses call ActivityBase.call(this, root, options) first, finish their
  own setup, then call this.setComplete(...) once they can compute it, and
  again any time completeness changes.
*/
function ActivityBase(root, options) {
  if (!root) throw new Error("Activity: root element is required.");

  this.root = root;
  this.options = options || {};
  this.id = root.id || null;
  this._context = contexts.get(root) || null;

  if (!this._context) {
    console.warn(
      "Activity: root is not rendered by an <Activity> wrapper.",
      root,
    );
  }

  if (this.id) registry[this.id] = this;
  if (this._context) this._context.attach(this);
}

ActivityBase.prototype.setComplete = function (isComplete) {
  if (this._context) this._context.setComplete(isComplete);
};

ActivityBase.prototype.isComplete = function () {
  return this._context ? this._context.complete.value : false;
};

ActivityBase.prototype.isAvailable = function () {
  return this._context ? this._context.available.value : true;
};

/* Default reset: clear every [data-reset] element inside the root (see
   resetField below), then mark the activity incomplete. Prototypes whose
   own API already has a natural "put everything back" operation (e.g.
   DragDropActivity returning items to the tray) override this instead. */
ActivityBase.prototype.reset = function () {
  ActivityBase.resetFieldsIn(this.root);
  this.setComplete(false);
};

/* Every registered activity (those with a root id), e.g. for saving progress. */
ActivityBase.all = function () {
  return Object.keys(registry).map((id) => registry[id]);
};

ActivityBase.resetFieldsIn = function (scope) {
  scope.querySelectorAll("[data-reset]").forEach(ActivityBase.resetField);
};

/* How a single data-reset element is cleared, based on what kind of
   element it is. Add data-reset-list to a container whose entire content
   an activity builds up (an answer list) to have it emptied outright. */
ActivityBase.resetField = function (element) {
  if (element.matches("input, textarea")) {
    element.value = "";
    element.hidden = false;
    element.disabled = false;
    element.style.display = "";
    return;
  }

  if (element.hasAttribute("data-reset-list")) {
    element.innerHTML = "";
    return;
  }

  element.classList.remove(
    "filled",
    "placed",
    "visible",
    "selected",
    "correct",
    "incorrect",
  );
};

/*
  Activities use helpers from common_functions.js (answer buttons, language
  filter, ...). That file is a plain script a page loads after its components
  have mounted, so activities wait for it. common_functions.js sets
  window.__commonFunctionsLoaded and fires "common-functions-ready" when done.
*/
function whenCommonFunctionsReady(callback) {
  if (window.__commonFunctionsLoaded) {
    callback();
    return;
  }
  document.addEventListener("common-functions-ready", callback, { once: true });
}

/* Is the activity with this id complete? Reactive: re-evaluated on every
   activity:change. Works for Vue and plain-script activities alike. */
function isActivityComplete(id) {
  changeTick.value; // dependency
  const activity = registry[id];
  return Boolean(activity && activity.isComplete());
}

export {
  ActivityBase,
  getActivity,
  getActivityContext,
  whenCommonFunctionsReady,
  isActivityComplete,
  changeTick,
};
</script>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  useAttrs,
  watch,
} from "vue";

const props = defineProps({
  tag: { type: String, default: "div" },
  // id of the activity that must be complete before this one is available
  dependsOn: { type: String, default: "" },
  // Vue activities: whether the activity is complete. Left unset (null) by
  // legacy activities, which call setComplete() through ActivityBase.
  complete: { type: Boolean, default: null },
  // Vue activities: extra methods plain page scripts can call through
  // getActivity(id), e.g. { getPlacements, setPlacements } for saving
  api: { type: Object, default: null },
});

const emit = defineEmits(["reset"]);

const attrs = useAttrs();
const section = inject("section", null);

const root = ref(null);
const complete = ref(false);
const isVueActivity = props.complete !== null;
let instance = null; // legacy: the prototype object (DragDropActivity, ...), once created
let registered = null; // what getActivity(id) returns for this activity

// Vue activities: completeness comes from the prop
watch(
  () => props.complete,
  (isComplete) => setComplete(isComplete),
);

const dependsOnId = computed(
  () => props.dependsOn || attrs["data-activity-depends-on"] || "",
);
const available = computed(
  () => !dependsOnId.value || isActivityComplete(dependsOnId.value),
);

function setComplete(isComplete) {
  isComplete = Boolean(isComplete);
  complete.value = isComplete;

  const el = root.value;
  if (!el) return;

  // stamped straight away: plain scripts read it inside the change event
  el.dataset.activityComplete = isComplete ? "true" : "false";

  const detail = { id: el.id || null, complete: isComplete };
  el.dispatchEvent(
    new CustomEvent("activity:change", { bubbles: true, detail }),
  );
  document.dispatchEvent(new CustomEvent("activity:change", { detail }));
}

function reset() {
  if (isVueActivity) {
    emit("reset"); // the activity clears its state; :complete follows
  } else if (instance) {
    instance.reset();
  } else if (root.value) {
    ActivityBase.resetFieldsIn(root.value);
    setComplete(false);
  }
}

const context = {
  complete,
  available,
  setComplete,
  reset,
  attach(activity) {
    instance = activity;
    registered = activity; // ActivityBase put it in the registry
  },
  get el() {
    return root.value;
  },
};

/* ---------- availability ---------- */

function applyAvailability(isAvailable) {
  const el = root.value;
  if (!el) return;

  const hideTargets = el.querySelectorAll("[data-activity-hidden]");
  const dependent = Boolean(dependsOnId.value);

  /* With [data-activity-hidden] elements, only those are hidden: the root
     itself is left alone, so the rest of it stays visible and usable. */
  if (hideTargets.length) {
    if (dependent)
      hideTargets.forEach((element) => (element.hidden = !isAvailable));
    return;
  }

  el.classList.toggle("activity-unavailable", !isAvailable);
  el.toggleAttribute("inert", !isAvailable);
  if (dependent) el.hidden = !isAvailable;
}

watch(available, (isAvailable) => {
  applyAvailability(isAvailable);

  // reset the dependent activity when its prerequisite is reset
  const done = instance ? instance.isComplete() : complete.value;
  if (!isAvailable && done) reset();
});

/* ---------- reset buttons ---------- */

// [data-reset-trigger] buttons inside this activity (not inside a nested one)
function onClick(event) {
  const button = event.target.closest("[data-reset-trigger]");
  if (button && button.closest("[data-activity]") === root.value) reset();
}

/* ---------- registration ---------- */

section?.register(context);

onMounted(() => {
  contexts.set(root.value, context);
  applyAvailability(available.value);

  if (isVueActivity) {
    setComplete(props.complete);

    // for plain page scripts: getActivity(id)
    const id = root.value.id;
    if (id) {
      registered = {
        id,
        root: root.value,
        options: {},
        isComplete: () => complete.value,
        isAvailable: () => available.value,
        reset,
        ...props.api,
      };
      registry[id] = registered;
    }
  }
});

onBeforeUnmount(() => {
  section?.unregister(context);
  const id = registered?.id;
  if (id && registry[id] === registered) delete registry[id];
  instance = null;
  registered = null;
});

defineExpose({ complete, available, setComplete, reset });
</script>

<template>
  <component
    :is="tag"
    ref="root"
    data-activity
    data-activity-complete="false"
    @click="onClick"
  >
    <slot />
  </component>
</template>
