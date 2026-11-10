/*
  Legacy activity helpers for activities that haven't been converted to the
  Vue pattern yet (InputResponse, InvestigationQuestion, ItemMatch,
  VariableSort). They build a prototype "class" on ActivityBase:

    function MyActivity(root, options) {
      ActivityBase.call(this, root, options);
      ...
      this.setComplete(...);
    }
    MyActivity.prototype = Object.create(ActivityBase.prototype);

  Delete this file once those activities pass :complete / :state to
  <Activity> like Flashcards does.
*/

/* Shared with the plain page scripts, which look activities up by id. */
const registry = window.__activityRegistry || (window.__activityRegistry = {});
window.getActivity = (id) => registry[id] || null;

export function ActivityBase(root, options) {
  if (!root) throw new Error("Activity: root element is required.");

  this.root = root;
  this.options = options || {};
  this.id = root.id || null;
  this._complete = false;

  if (this.id) registry[this.id] = this;
}

ActivityBase.prototype.setComplete = function (isComplete) {
  this._complete = Boolean(isComplete);
  this.root.dataset.activityComplete = this._complete ? "true" : "false";

  const detail = { id: this.id, complete: this._complete };
  this.root.dispatchEvent(
    new CustomEvent("activity:change", { bubbles: true, detail }),
  );
  document.dispatchEvent(new CustomEvent("activity:change", { detail }));
};

ActivityBase.prototype.isComplete = function () {
  return this._complete;
};

ActivityBase.prototype.isAvailable = function () {
  return true;
};

/* Default reset: clear every [data-reset] element inside the root. */
ActivityBase.prototype.reset = function () {
  ActivityBase.resetFieldsIn(this.root);
  this.setComplete(false);
};

ActivityBase.all = function () {
  return Object.values(registry);
};

ActivityBase.resetFieldsIn = function (scope) {
  scope.querySelectorAll("[data-reset]").forEach(ActivityBase.resetField);
};

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
  Activities use helpers from common_functions.js, a plain script the page
  loads after mounting. It sets window.__commonFunctionsLoaded and fires
  "common-functions-ready" when done.
*/
export function whenCommonFunctionsReady(callback) {
  if (window.__commonFunctionsLoaded) {
    callback();
    return;
  }
  document.addEventListener("common-functions-ready", callback, { once: true });
}
