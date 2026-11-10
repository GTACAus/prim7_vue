import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
// classroom language filter: loads the word list and puts window.getValidStudentInput() etc.
// in place for the plain scripts that still need them
import "./composables/useClassroomLanguageFilter.js";

// Each page is a view. Links between pages are plain absolute paths (e.g. /lesson4-2)
// and do a full page load, so a page's global styles and scripts never leak into the next.
// meta drives the page header in App.vue: header:false hides it, save shows
// "Save my work" instead of Home, backHref adds the back-to-Part-A button.
const routes = [
  {
    path: "/",
    meta: {
      header: false,
      stylesheets: ["/styles/build_style.css"],
    },
    component: () => import("./views/HomeView.vue"),
  },
  {
    path: "/pretask",
    meta: {
      save: true,
      stylesheets: [
        "/styles/pretask_styles/word_drag_and_drop.css",
        "/styles/drag_and_drop_base.css",
        "/styles/pretask_styles/pretask.css",
      ],
    },
    component: () => import("./views/PretaskView.vue"),
  },
  {
    path: "/plant-detective",
    meta: {
      header: false,
      stylesheets: ["/styles/pretask_styles/plant_detective.css"],
    },
    component: () => import("./views/PlantDetectiveView.vue"),
  },
  {
    path: "/lesson1",
    meta: {
      stylesheets: ["/styles/overrides.css"],
    },
    component: () => import("./views/Lesson1View.vue"),
  },
  {
    path: "/lesson2",
    meta: {
      stylesheets: [
        "/styles/lesson2_styles/lesson2.css",
        "/styles/variable-activity.css",
        "/styles/lesson2_styles/bigkahuna4.css",
      ],
    },
    component: () => import("./views/Lesson2View.vue"),
  },
  {
    path: "/lesson3",
    meta: {
      stylesheets: [
        "/styles/drag_and_drop_base.css",
        "/styles/lesson3_styles/lesson3.css",
        "/styles/variable-activity.css",
      ],
    },
    component: () => import("./views/Lesson3View.vue"),
  },
  {
    path: "/lesson4",
    meta: {
      backHref: "/lesson3",
      stylesheets: ["/styles/lesson3_styles/lesson3.css"],
    },
    component: () => import("./views/Lesson3_2View.vue"),
  },
  {
    path: "/lesson5",
    meta: {
      stylesheets: [
        "/styles/drag_and_drop_base.css",
        "/styles/lesson4_styles/lesson4.css",
        "/styles/lesson4_styles/spotlight-game.css",
      ],
    },
    component: () => import("./views/Lesson4View.vue"),
  },
  {
    path: "/lesson6",
    meta: {
      backHref: "/lesson5",
      stylesheets: [
        "/styles/drag_and_drop_base.css",
        "/styles/lesson4_styles/lesson4.css",
        "/styles/lesson4_styles/number-line-activity.css",
      ],
    },
    component: () => import("./views/Lesson4_2View.vue"),
  },
  {
    path: "/lesson7",
    meta: {
      stylesheets: [
        "/styles/lesson5_styles/drag_and_drop.css",
        "/styles/lesson5_styles/lesson5.css",
        "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Oxanium:wght@400;500;600;700;800&family=Share+Tech+Mono&display=swap",
      ],
    },
    component: () => import("./views/Lesson5View.vue"),
  },
];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
const stylesheetLoads = new Map();

function loadStylesheet(href) {
  const existingLoad = stylesheetLoads.get(href);
  if (existingLoad) return existingLoad;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;

  const load = new Promise((resolve, reject) => {
    link.addEventListener("load", resolve, { once: true });
    link.addEventListener(
      "error",
      () => {
        stylesheetLoads.delete(href);
        link.remove();
        reject(new Error(`Failed to load stylesheet: ${href}`));
      },
      { once: true },
    );
    document.head.appendChild(link);
  });

  stylesheetLoads.set(href, load);
  return load;
}

router.beforeEach(async (to) => {
  await Promise.all((to.meta.stylesheets ?? []).map(loadStylesheet));
});

createApp(App).use(router).mount("#app");
