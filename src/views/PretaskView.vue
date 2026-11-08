<template>
  
  
  <Modal label="Lesson 1: Structure &amp; Function of a Plant" :glossary="glossary" />


  <main class="page">

    <LessonIntro
      label="Pre-Task"
      title="What do plants need to survive?"
      worksheet="../worksheets/pretask-worksheet.pdf"
      :objective="objective"
      :criteria="criteria"
    >
    Plants are living organisms found growing all around the world. Animals rely on plants for food, nutrients and the oxygen they produce.

    <template #mission>
      <div class="botanist-mission">
        <div class="mission-icon">
          <img
            src="../images/pretask/botanist.jpg"
            alt="A botanist studying plants">
        </div>
        <div>
          <p class="intro-eyebrow">Your mission</p>

          <h2>Become a botanist</h2>

      <p>
        In this lesson, you will be a plant detective. You will investigate
        why plants become unhealthy and work out how to make them healthy again.
      </p>
    </div>
  </div>
    </template>

    <template #observation>

      <h2>See, Think, Wonder</h2>

      <p>
        <strong>Botanists</strong> observe how plants grow and behave. They use a thinking
        routine called <strong><i>See, Think, Wonder</i></strong> to make scientific
        <strong>observations</strong>.
      </p>

      <div class="stw-explanation">
        <div>
          <strong>See</strong>
          <span>What do you notice?</span>
        </div>

        <div>
          <strong>Think</strong>
          <span>What do you think is happening?</span>
        </div>

        <div>
          <strong>Wonder</strong>
          <span>What questions do you have?</span>
        </div>
      </div>
    </template>
  </LessonIntro>

<!-- Part B: Making observations of plants -->

    <Section id="watch" title="Making observations of plants" next-id="build" next-button-id="watchNextButton" hide-next>

      <div class="diagram-box diagram-activity">
        <p class="activity-instruction">
          Watch the video of a seed germinating, add your observations, and then
        select <strong>Next</strong> to continue.
        </p>
      </div>

      <div class="video-row">
        <div class="video-box">
  <iframe
    width="100%"
    height="100%"
    src="https://www.youtube-nocookie.com/embed/w77zPAtVTuI"
    title="Plant video"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>

        <ThinkBox id="watchStwActivity" :groups="stwGroups" />
      </div>
    </Section>

<!-- Part C: The structure of a flowering plant -->   
    <Section id="build" title="The structure of a flowering plant" next-id="brainstorm" next-button-id="buildNextButton" locked hide-next>
      <div class="diagram-box diagram-activity">
        <p class="activity-instruction">
          Watching time lapse videos of plants helps us to <strong>observe</strong> the behaviour of plants. As a <strong>botanist</strong> you want to be sure you use the correct terms when talking about plants. To remind yourself of the major parts of a flowering plant complete this drag and drop activity.
        </p>
      </div>
      <div class="plant-game">
        <div class="plant-canvas">
          <div class="plant-game-container">
            <div class="tab-button-container">
              <button class="tab option-button active" id="tab-parts" onclick="switchGame('parts')">Build a Plant</button>
              <button class="tab option-button" id="tab-labels" onclick="switchGame('labels')">Label the Plant</button>
            </div>
            <main id="game-parts">
                <DragDrop id="plantPartsActivity" class="plant-activity" :options="plantPartsActivityOptions">
                  <div class="plant-area">
                    <div class="plant-image-container">
                      <img class="plant-image" src="../images/pretask/sunflower.png" alt="Sunflower">
                    </div>
                    <div class="slot slot-flower" data-dd-slot="flower" data-dd-answer="flower"></div>
                    <div class="slot slot-left-leaf" data-dd-slot="left-leaf" data-dd-answer="left-leaf"></div>
                    <div class="slot slot-stem" data-dd-slot="stem" data-dd-answer="stem"></div>
                    <div class="slot slot-roots" data-dd-slot="roots" data-dd-answer="roots"></div>
                  </div>

                  <div id="success-1" hidden>
                    <p class="success-text">Beautiful! Your plant is complete!</p>
                    <span class="success-icon">🌻</span>
                  </div>

                  <div data-dd-tray class="parts-tray">
                    <div class="part" data-dd-item="flower">
                      <img class="flower-image" src="../images/pretask/flower.png" alt="Flower">
                    </div>
                    <div class="part" data-dd-item="left-leaf">
                      <img class="left-leaf-image" src="../images/pretask/left_leaf.png" alt="Left Leaf">
                    </div>
                    <div class="part" data-dd-item="stem">
                      <img class="stem-image" src="../images/pretask/stem.png" alt="Stem">
                    </div>
                    <div class="part" data-dd-item="roots">
                      <img class="roots-image" src="../images/pretask/roots.png" alt="Roots">
                    </div>
                  </div>

                  <div class="option-button-container">
                    <div class="option-button">
                      <button class="general-button" data-reset-trigger>Start Over</button>
                    </div>
                    <div id="continue-button" class="option-button" hidden>
                      <button class="general-button" onclick="switchGame('labels')">Continue -></button>
                    </div>
                  </div>
                </DragDrop>
            </main>
            <main id="game-labels" hidden>
              <DragDrop id="plantLabelsActivity" class="plant-activity" data-activity-depends-on="plantPartsActivity" :options="plantLabelsActivityOptions">
                <div class="plant-area">
                  <div class="plant-image-container">
                    <img class="plant-image" src="../images/pretask/sunflower.png" alt="Sunflower">
                  </div>

                  <div class="label-slot label-flower-slot" data-dd-slot="flower" data-dd-answer="flower"></div>
                  <div class="label-slot label-leaf-slot" data-dd-slot="leaf" data-dd-answer="leaf"></div>
                  <div class="label-slot label-stem-slot" data-dd-slot="stem" data-dd-answer="stem"></div>
                  <div class="label-slot label-roots-slot" data-dd-slot="roots" data-dd-answer="roots"></div>
                </div>

                <div id="success-2" class="success-message" hidden>
                  <p class="success-text">Well done! All labels are correct! 🎉</p><span class="success-icon">🌻</span>
                </div>

                <div data-dd-tray class="parts-tray">
                  <div class="part" data-dd-item="flower">Flower</div>
                  <div class="part" data-dd-item="leaf">Leaf</div>
                  <div class="part" data-dd-item="stem">Stem</div>
                  <div class="part" data-dd-item="roots">Roots</div>
                </div>

                <div class="option-button">
                  <button class="general-button" data-reset-trigger>Start Over</button>
                </div>
              </DragDrop>
            </main>
          </div>
        </div>
      </div>
    </Section>

    <Section id="brainstorm" title="Think like a scientist - Brainstorm to share ideas" next-id="diagram" next-button-id="brainstormNextButton" locked hide-next>

  <div class="diagram-box diagram-activity">
        <p class="activity-instruction">
          <strong>Botanists</strong> like to collaborate and share ideas with one another when they are investigating plants. One way to do this is to <strong><i>brainstorm</i></strong> to think of new ideas.  
In this activity you can work on your own or in a team to <strong><i>brainstorm</i></strong> ideas to explore the question, what are the <strong>physical conditions</strong> that plants require to grow and survive.  Come up with as many ideas as you can. You can use the picture to help you think of ideas and write them on the sticky notes activity below.

        </p>
      </div>

      <div class="image-box">
    <img
        src="../images/pretask/plantneeds-unmarked.png"
        alt="Plants need water, sunlight and nutrients">
</div>

  <PostitBrainstorm id="brainstormActivity" />
    </Section>

    <Section id="diagram" title="Why do plants need the right physical conditions to survive?" next-id="detective" next-button-id="diagramNextButton" locked hide-next>

      <div class="diagram-box diagram-activity">
        <p class="activity-instruction">
          Some of the <strong>physical conditions</strong> that plants need to grow include sunlight, soil, water, carbon dioxide, oxygen, <strong>nutrients</strong>, and temperature.
          Use the diagram and interactive video to investigate why they need these <strong>physical conditions</strong>. You will also explore the <strong>function</strong> of different
          parts of the plant. 
        </p>
      </div>

      <div class="learning-row">

        <div class="diagram-box diagram-activity">

          <div class="image-box">
    <img
        src="../images/pretask/plantneeds-marked.png"
        alt="Diagram showing the parts of a flowering plant">
</div>

          <DragDrop id="wordSentencesActivity" class="word-sentences-activity dd-activity" :options="wordSentencesActivityOptions">
            <header class="wd-header">
              <h3 class="wd-title">Plant Science</h3>
              <p class="wd-subtitle">Drag the correct words into the blanks to complete each sentence.</p>
            </header>

            <div class="">
              <div class="sentence-card">
                Plants make sugar to get energy to grow. This occurs in the leaves using
                <span class="drop-zone" data-dd-slot="s0-a" data-dd-answer="sunlight carbon-dioxide water"></span>,
                <span class="drop-zone" data-dd-slot="s0-b" data-dd-answer="sunlight carbon-dioxide water"></span>, and
                <span class="drop-zone" data-dd-slot="s0-c" data-dd-answer="sunlight carbon-dioxide water"></span>.
              </div>
              <div class="sentence-card">
                Roots grow through <span class="drop-zone" data-dd-slot="s1-a" data-dd-answer="soil"></span> and this helps to keep the plant anchored.
              </div>
              <div class="sentence-card">
                <span class="drop-zone" data-dd-slot="s2-a" data-dd-answer="water"></span> moves from soil to roots, travels up the stem, and evaporates from the leaves. This helps the plant stay upright.
              </div>
              <div class="sentence-card">
                <span class="drop-zone" data-dd-slot="s3-a" data-dd-answer="nutrients"></span> in the soil are dissolved in water and enter the roots to travel around the plant.
              </div>
              <div class="sentence-card">
                <span class="drop-zone" data-dd-slot="s4-a" data-dd-answer="oxygen"></span> is found in pores in the soil and is needed to keep roots healthy. If plants are over-watered, they don't get enough oxygen.
              </div>
            </div>

            <div class="wd-word-bank">
              <p class="wd-word-bank-label">Word Bank</p>
              <div data-dd-tray class="word-tray">
                <span class="word-chip" data-dd-item="sunlight" data-dd-reusable>sunlight</span>
                <span class="word-chip" data-dd-item="carbon-dioxide" data-dd-reusable>carbon dioxide</span>
                <span class="word-chip" data-dd-item="water" data-dd-reusable>water</span>
                <span class="word-chip" data-dd-item="soil" data-dd-reusable>soil</span>
                <span class="word-chip" data-dd-item="nutrients" data-dd-reusable>nutrients</span>
                <span class="word-chip" data-dd-item="oxygen" data-dd-reusable>oxygen</span>
              </div>
            </div>

            <div class="wd-actions">
              <button type="button" class="general-button reset-btn" data-reset-trigger>Reset</button>
            </div>

            <div id="wordSentencesCelebration" hidden>Well done!</div>
          </DragDrop>

        </div>

        <div class="writing-box thinglink-box">
          <div class="thinglink-responsive-wrapper">
            <iframe
              width="960"
              height="1440"
              data-original-width="1080"
              data-original-height="1620"
              src="https://www.thinglink.com/view/scene/2126199449112805862"
              type="text/html"
              style="border: none;"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
              scrolling="no">
            </iframe>
          </div>
          
        </div>

      </div>
    </Section>

    <Section id="detective" title="Can you solve the mystery of the unhealthy plants?" next-id="final-brainstorm" locked>

  <div class="diagram-box diagram-activity">
        <p class="activity-instruction">
          <strong>Botanists</strong>, farmers, nursery workers and gardeners often need to be plant detectives to solve the mystery of unhealthy plants. They think about the <strong>physical conditions</strong> that plants need to be healthy and how too much or too little of each <strong>physical condition</strong> can cause a plant to become unhealthy.
Use your detective skills to make <strong>observations</strong> and come up with an idea for what each plant might need to become healthy again. Test your idea and see if you can solve the mystery for each unhealthy plant.
        </p>
      </div>

  <div class="detective-embed-box">
    <iframe
      src="/plant-detective"
      title="Plant Detective Game"
      class="detective-iframe">
    </iframe>
  </div>
    </Section>

<Section id="final-brainstorm" title="Check your understanding" locked last>

  <FinalBrainstorm id="finalBrainstormActivity" :prompt="finalPrompt" :branches="finalBranches" />
</Section>
<div class="return-to-top">
  <a class="return-to-top-button general-button" href="#">
    <p class="bounce-symbol">↑</p>
    <p>Return to Top</p>
  </a>
</div>

  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import Modal from '../components/Modal.vue'
import Section from '../components/Section.vue'
import DragDrop from '../components/activities/DragDrop.vue'
import ThinkBox from '../components/pretask/ThinkBox.vue'
import PostitBrainstorm from '../components/pretask/PostitBrainstorm.vue'
import FinalBrainstorm from '../components/pretask/FinalBrainstorm.vue'

// See, Think, Wonder columns
const stwGroups = [
  {
    "key": "see",
    "title": "See",
    "prompt": "What do you notice?",
    "placeholder": "Type something you see"
  },
  {
    "key": "think",
    "title": "Think",
    "prompt": "What do you think is happening?",
    "placeholder": "Type what you think"
  },
  {
    "key": "wonder",
    "title": "Wonder",
    "prompt": "What questions do you have?",
    "placeholder": "Type what you wonder"
  }
]

// Closing brainstorm
const finalPrompt = "Why do plants need these physical conditions?"
const finalBranches = [
  {
    "key": "water",
    "title": "Water",
    "placeholder": "Why do plants need water?"
  },
  {
    "key": "sunlight",
    "title": "Sunlight",
    "placeholder": "Why do plants need sunlight?"
  },
  {
    "key": "nutrients",
    "title": "Nutrients",
    "placeholder": "Why do plants need nutrients?"
  },
  {
    "key": "soil",
    "title": "Soil",
    "placeholder": "Why does soil matter?"
  },
  {
    "key": "co2",
    "title": "Carbon Dioxide",
    "placeholder": "Why might plants need carbon dioxide?"
  },
  {
    "key": "oxygen",
    "title": "Oxygen",
    "placeholder": "Why might plants need oxygen?"
  }
]

// Options passed to the activity components
const plantPartsActivityOptions = { strictSlots: true }

const plantLabelsActivityOptions = { strictSlots: true }

const wordSentencesActivityOptions = { strictSlots: true }
import LessonIntro from '../components/LessonIntro.vue'

// Learning objective and success criteria shown in the lesson intro
const objective = "Identify the physical conditions that affect a plant’s ability to grow and survive."
const criteria = [
  "I can identify the <strong>physical conditions</strong> that a plant needs to grow and survive.",
  "I can compare healthy and unhealthy plants to explain why plants need the correct <strong>physical conditions</strong> to be healthy",
]

// Terms shown in the vocabulary modal: { word: description }
const glossary = {
  "Botanist": "A scientist who studies plants.",
  "Diagnose": "To identify what is wrong with a living thing by carefully examining it and looking for clues about what physical condition may be missing or out of balance.",
  "Function": "The job or role that a part of a plant performs to help it survive.",
  "Germinate": "When a seed begins to sprout and grow into a new plant after absorbing water and being exposed to the right temperature and conditions.",
  "Investigate": "To carefully examine and gather information about something in order to find an answer or understand it better.",
  "Nutrients": "Substances found in soil and water that plants absorb through their roots to grow and stay healthy.",
  "Observe / Observation": "Information gathered by using your senses—sight, hearing, touch, smell, or taste—to carefully notice and describe something in the world around you.",
  "Structure": "A physical part of a plant, such as the roots, stem, leaves, flower, or fruit, that has a specific job.",
}

// Original <head>/<body> resources of pretask/pretask.html, loaded in document order.
const scripts = [
  { src: "https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js", type: "text/javascript" },
  { src: "//cdn.thinglink.me/jse/responsive.js" },
  { src: "../scripts/common_functions.js" },
  { type: "module", code: String.raw`    import { initSectionActivitiesIn } from "../scripts/activities/activity-sections.js";

  /* ---------- Plant-building drag and drop ---------- */

  let plantPartsActivity = null;
  let plantLabelsActivity = null;

  function syncPlantGameVisuals(activity, successId, continueId) {
    if (!activity) return;

    const done = activity.isComplete() && activity.isCorrect();

    const success = document.getElementById(successId);
    if (success) success.hidden = !done;

    activity.tray.hidden = activity.getTrayItemCount() === 0;

    if (continueId) {
      const continueButton = document.getElementById(continueId);
      if (continueButton) continueButton.hidden = !done;
    }
  }

  function switchGame(game) {
    if (game === 'labels' && (!plantPartsActivity || !plantPartsActivity.isAvailable())) {
      return;
    }

    document.getElementById('game-parts').hidden = game !== 'parts';
    document.getElementById('game-labels').hidden = game !== 'labels';
    document.getElementById('tab-parts').classList.toggle('active', game === 'parts');
    document.getElementById('tab-labels').classList.toggle('active', game === 'labels');
  }

  function initPlantGames() {
    const partsRoot = document.getElementById('plantPartsActivity');
    const labelsRoot = document.getElementById('plantLabelsActivity');

    if (partsRoot) {
      plantPartsActivity = getActivity("plantPartsActivity");
Object.assign(plantPartsActivity.options, {
        onChange: function() {
          syncPlantGameVisuals(plantPartsActivity, 'success-1', 'continue-button');
          schedulePretaskSave();
        }
});
    }

    if (labelsRoot) {
      plantLabelsActivity = getActivity("plantLabelsActivity");
Object.assign(plantLabelsActivity.options, {
        onChange: function() {
          syncPlantGameVisuals(plantLabelsActivity, 'success-2');
          schedulePretaskSave();
        }
});
    }
  }

  /* ---------- Plant-science word sentences drag and drop ---------- */

  let wordSentencesActivity = null;

  function syncWordSentencesVisuals() {
    if (!wordSentencesActivity) return;
    const done = wordSentencesActivity.isComplete() && wordSentencesActivity.isCorrect();
    document.getElementById('wordSentencesCelebration').hidden = !done;
  }

  function initWordSentencesActivity() {
    const root = document.getElementById('wordSentencesActivity');
    if (!root) return;

    wordSentencesActivity = getActivity("wordSentencesActivity");
Object.assign(wordSentencesActivity.options, {
      onChange: function() {
        syncWordSentencesVisuals();
        schedulePretaskSave();
      }
});
  }

  /* ---------- Text-response activities: STW, brainstorm, final brainstorm ---------- */

  let watchStwActivity = null;
  let brainstormActivity = null;
  let finalBrainstormActivity = null;

  function initTextResponseActivities() {
    const watchRoot = document.getElementById('watchStwActivity');
    if (watchRoot) {
      watchStwActivity = getActivity("watchStwActivity");
Object.assign(watchStwActivity.options, {
        onChange: function() { schedulePretaskSave(); }
});
    }

    const brainstormRoot = document.getElementById('brainstormActivity');
    if (brainstormRoot) {
      brainstormActivity = getActivity("brainstormActivity");
    }

    const finalBrainstormRoot = document.getElementById('finalBrainstormActivity');
    if (finalBrainstormRoot) {
      finalBrainstormActivity = getActivity("finalBrainstormActivity");
    }
  }

  /* ---------- Save and restore Lesson 1 answers ---------- */

  const PRETASK_SAVE_KEY = 'plantExplorerPretaskSave';

  /*
    Used by the teacher menu's "Reset student view" to
    clear this page's saved progress before it reloads.
  */
  function clearPageSavedData() {
    try {
      localStorage.removeItem(PRETASK_SAVE_KEY);
    } catch (error) {
      /* A blocked store just means there was nothing to clear. */
    }
  }

  let pretaskIsRestoring = false;
  let pretaskSaveTimer = null;

  const PRETASK_SECTION_IDS = [
    'watch', 'build', 'brainstorm', 'diagram', 'detective', 'final-brainstorm'
  ];

  /*
    Collect the student's current answers and opened sections.
  */
  function collectPretaskData() {
    return {
      stw: watchStwActivity ? watchStwActivity.getAnswers() : {},

      plantBuilding: {
        partsPlacements: plantPartsActivity ? plantPartsActivity.getPlacements() : {},
        labelsPlacements: plantLabelsActivity ? plantLabelsActivity.getPlacements() : {}
      },

      wordSentences: wordSentencesActivity ? wordSentencesActivity.getPlacements() : {},

      brainstorm: brainstormActivity ? brainstormActivity.getAnswers() : {},
      finalBrainstorm: finalBrainstormActivity ? finalBrainstormActivity.getAnswers() : {},

      unlockedSections: PRETASK_SECTION_IDS.filter(sectionId => {
        const section = document.getElementById(sectionId);
        return section && !section.classList.contains('locked');
      }),

      completedSections: PRETASK_SECTION_IDS.filter(sectionId => {
        const section = document.getElementById(sectionId);
        return section && section.classList.contains('completed');
      })
    };
  }

  /*
    Save everything to this browser.
  */
  function saveCurrentPageData() {
    if (pretaskIsRestoring) {
      return;
    }

    /*
      Printing opens every section for the PDF. That is a
      temporary view, not the student's progress, so
      nothing is saved while it is on screen - otherwise
      the whole lesson would reopen next time.
    */
    if (document.body.classList.contains('printing-lesson')) {
      return;
    }

    localStorage.setItem(PRETASK_SAVE_KEY, JSON.stringify(collectPretaskData()));
  }

  /*
    Avoid saving many times during one quick action.
  */
  function schedulePretaskSave() {
    if (pretaskIsRestoring) {
      return;
    }

    clearTimeout(pretaskSaveTimer);
    pretaskSaveTimer = setTimeout(saveCurrentPageData, 150);
  }

  /*
    Restore all saved progress when the page opens.
  */
  function restorePretaskData() {
    const savedText = localStorage.getItem(PRETASK_SAVE_KEY);

    if (!savedText) {
      return;
    }

    let savedData;

    try {
      savedData = JSON.parse(savedText);
    } catch (error) {
      console.error('Could not read saved Lesson 1 progress:', error);
      return;
    }

    pretaskIsRestoring = true;

    /*
      Restore opened sections first so their elements
      are visible before rebuilding the answers.
    */
    const unlockedSections = savedData.unlockedSections || ['watch'];

    unlockedSections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) section.classList.remove('locked');
    });

    let completedSections = savedData.completedSections || [];

    /*
      This also fixes older saved progress created before
      completedSections existed.
    */
    if (completedSections.length === 0) {
      const progression = [
        { unlocked: 'build', completed: 'watch' },
        { unlocked: 'brainstorm', completed: 'build' },
        { unlocked: 'diagram', completed: 'brainstorm' },
        { unlocked: 'detective', completed: 'diagram' },
        { unlocked: 'final-brainstorm', completed: 'detective' }
      ];

      progression.forEach(step => {
        if (unlockedSections.includes(step.unlocked)) {
          completedSections.push(step.completed);
        }
      });
    }

    completedSections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) section.classList.add('completed');
    });

    if (watchStwActivity) watchStwActivity.restore(savedData.stw || {});

    const plantBuilding = savedData.plantBuilding || {};

    if (plantPartsActivity) {
      plantPartsActivity.setPlacements(plantBuilding.partsPlacements || {});
      syncPlantGameVisuals(plantPartsActivity, 'success-1', 'continue-button');
    }

    if (plantLabelsActivity) {
      plantLabelsActivity.setPlacements(plantBuilding.labelsPlacements || {});
      syncPlantGameVisuals(plantLabelsActivity, 'success-2');
    }

    if (wordSentencesActivity) {
      wordSentencesActivity.setPlacements(savedData.wordSentences || {});
      syncWordSentencesVisuals();
    }

    if (brainstormActivity) brainstormActivity.restore(savedData.brainstorm || {});
    if (finalBrainstormActivity) finalBrainstormActivity.restore(savedData.finalBrainstorm || {});

    pretaskIsRestoring = false;

  }

  /*
    Watch answer areas for additions or deletions.
  */
  const pretaskObserver = new MutationObserver(() => {
    schedulePretaskSave();
  });

  /*
    Begin watching after the HTML has loaded.
  */
  document.addEventListener('DOMContentLoaded', function() {
    initPlantGames();
    initWordSentencesActivity();
    initTextResponseActivities();

    const areasToWatch = [
      document.getElementById('watchStwActivity'),
      document.getElementById('brainstormActivity'),
      document.getElementById('finalBrainstormActivity')
    ];

    areasToWatch.forEach(area => {
      if (area) {
        pretaskObserver.observe(area, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true
        });
      }
    });

    restorePretaskData();
    initSectionActivitiesIn(document);
  });

  /*
    Save when a Next button opens another section.
  */
  document.addEventListener('click', function(event) {
    const nextButton = event.target.closest('.next-button');

    if (!nextButton) {
      return;
    }

    const currentSection = nextButton.closest('.section');

    if (currentSection) {
      currentSection.classList.add('completed');
    }

    setTimeout(saveCurrentPageData, 250);
  });

const pretaskSectionIds = [
  { id: "watch", label: "Making observations of plants" },
  { id: "build", label: "The structure of a flowering plant" },
  { id: "brainstorm", label: "Think like a scientist - Brainstorm to share ideas" },
  { id: "diagram", label: "Why do plants need the right physical conditions to survive?" },
  { id: "detective", label: "Can you solve the mystery of the unhealthy plants?" },
  { id: "final-brainstorm", label: "Check your understanding" },
];

document.addEventListener("DOMContentLoaded", function() {
  if (typeof initialiseTeacherMenu === "function") {
    initialiseTeacherMenu(pretaskSectionIds);
  }
});

    /* Called from inline handlers / shared scripts, which cannot see module scope. */
    Object.assign(window, { switchGame, clearPageSavedData, saveCurrentPageData });` },
]

function loadScript(def) {
  return new Promise((resolve) => {
    const el = document.createElement('script')
    if (def.type) el.type = def.type
    if (def.src) {
      el.src = def.src
      el.onload = el.onerror = resolve
      document.body.appendChild(el)
    } else {
      if (def.type === 'module') {
        // inline module scripts run async: wait until this one has finished
        window.__inlineScriptDone = resolve
        el.onerror = resolve
        el.textContent = def.code + '\n;window.__inlineScriptDone()'
        document.body.appendChild(el)
      } else {
        el.textContent = def.code
        document.body.appendChild(el)
        resolve()
      }
    }
  })
}

onMounted(async () => {
  document.title = "Plant Learning Website"
  for (const def of scripts) await loadScript(def)
  // the original scripts wait for DOMContentLoaded, which has already fired
  document.dispatchEvent(new Event('DOMContentLoaded'))
  window.dispatchEvent(new Event('DOMContentLoaded'))
})
</script>
