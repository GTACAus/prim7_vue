/* ==================================================
   SECTION NEXT-BUTTON WATCHER
   Pair with activity-base.js.

   A section's .next-button stays hidden until every
   [data-activity] element inside that section reports
   data-activity-complete="true" - the section itself
   counts too if it carries data-activity (an activity
   whose root IS the section, not a child of it). A
   section with no [data-activity] anywhere is left alone
   entirely - its next button's visibility stays whatever
   the page's own markup/script already set, so sections
   with their own bespoke gating (or no gating at all) are
   unaffected.

   Call initSectionActivitiesIn() once, after every
   Activity on the page has been constructed (so their
   data-activity-complete attributes already exist).
   ================================================== */

function collectActivities(section) {
  const activities = Array.prototype.slice.call(
    section.querySelectorAll("[data-activity]"),
  );
  if (section.matches("[data-activity]")) activities.push(section);
  return activities;
}

function initSectionActivities(section) {
  const nextButton = section.querySelector(".next-button, .next-page-button");
  if (!nextButton) return;

  if (!collectActivities(section).length) return;

  function refresh() {
    const allComplete = collectActivities(section).every(function (activity) {
      return activity.dataset.activityComplete === "true";
    });
    nextButton.hidden = !allComplete;
  }

  section.addEventListener("activity:change", refresh);
  refresh();
}

function initSectionActivitiesIn(root) {
  Array.prototype.forEach.call(
    (root || document).querySelectorAll(".section"),
    initSectionActivities,
  );
}

export { initSectionActivities, initSectionActivitiesIn };
