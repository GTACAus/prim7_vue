<script setup>
import { onMounted } from "vue";
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import DragDrop from "../components/activities/DragDrop.vue";
import DropSlot from "../components/activities/DropSlot.vue";
import DragItem from "../components/activities/DragItem.vue";
import ThinkBox from "../components/pretask/ThinkBox.vue";
import PostitBrainstorm from "../components/pretask/PostitBrainstorm.vue";
import FinalBrainstorm from "../components/pretask/FinalBrainstorm.vue";

// Sections of the page. Order defines the unlock chain (next-id) and which
// sections start locked; override per section where needed.
const sections = [
  {
    id: "watch",
    title: "Making observations of plants",
  },
  {
    id: "build",
    title: "The structure of a flowering plant",
  },
  {
    id: "brainstorm",
    title: "Think like a scientist - Brainstorm to share ideas",
  },
  {
    id: "diagram",
    title: "Why do plants need the right physical conditions to survive?",
  },
  {
    id: "detective",
    title: "Can you solve the mystery of the unhealthy plants?",
  },
  {
    id: "final-brainstorm",
    title: "Check your understanding",
  },
];

// See, Think, Wonder columns
const stwGroups = [
  {
    key: "see",
    title: "See",
    prompt: "What do you notice?",
    placeholder: "Type something you see",
  },
  {
    key: "think",
    title: "Think",
    prompt: "What do you think is happening?",
    placeholder: "Type what you think",
  },
  {
    key: "wonder",
    title: "Wonder",
    prompt: "What questions do you have?",
    placeholder: "Type what you wonder",
  },
];

// Closing brainstorm
const finalPrompt = "Why do plants need these physical conditions?";
const finalBranches = [
  {
    key: "water",
    title: "Water",
    placeholder: "Why do plants need water?",
  },
  {
    key: "sunlight",
    title: "Sunlight",
    placeholder: "Why do plants need sunlight?",
  },
  {
    key: "nutrients",
    title: "Nutrients",
    placeholder: "Why do plants need nutrients?",
  },
  {
    key: "soil",
    title: "Soil",
    placeholder: "Why does soil matter?",
  },
  {
    key: "co2",
    title: "Carbon Dioxide",
    placeholder: "Why might plants need carbon dioxide?",
  },
  {
    key: "oxygen",
    title: "Oxygen",
    placeholder: "Why might plants need oxygen?",
  },
];

import LessonIntro from "../components/LessonIntro.vue";

// Learning objective and success criteria shown in the lesson intro
const objective =
  "Identify the physical conditions that affect a plant’s ability to grow and survive.";
const criteria = [
  "I can identify the <strong>physical conditions</strong> that a plant needs to grow and survive.",
  "I can compare healthy and unhealthy plants to explain why plants need the correct <strong>physical conditions</strong> to be healthy",
];

// Terms shown in the vocabulary modal: { word: description }
const glossary = {
  Botanist: "A scientist who studies plants.",
  Diagnose:
    "To identify what is wrong with a living thing by carefully examining it and looking for clues about what physical condition may be missing or out of balance.",
  Function:
    "The job or role that a part of a plant performs to help it survive.",
  Germinate:
    "When a seed begins to sprout and grow into a new plant after absorbing water and being exposed to the right temperature and conditions.",
  Investigate:
    "To carefully examine and gather information about something in order to find an answer or understand it better.",
  Nutrients:
    "Substances found in soil and water that plants absorb through their roots to grow and stay healthy.",
  "Observe / Observation":
    "Information gathered by using your senses—sight, hearing, touch, smell, or taste—to carefully notice and describe something in the world around you.",
  Structure:
    "A physical part of a plant, such as the roots, stem, leaves, flower, or fruit, that has a specific job.",
};
</script>

<template>
  <Page
    lessonId="pretask"
    title="Lesson 1 - Structure &amp; Function of a Plant"
    :sections="sections"
    :glossary="glossary"
  >
    <template #lesson-intro>
      <LessonIntro
        label="Pre-Task"
        title="What do plants need to survive?"
        worksheet="../worksheets/pretask-worksheet.pdf"
        :objective="objective"
        :criteria="criteria"
      >
        Plants are living organisms found growing all around the world. Animals
        rely on plants for food, nutrients and the oxygen they produce.

        <template #mission>
          <div class="botanist-mission">
            <div class="mission-icon">
              <img
                src="../images/pretask/botanist.jpg"
                alt="A botanist studying plants"
              />
            </div>
            <div>
              <p class="intro-eyebrow">Your mission</p>

              <h2>Become a botanist</h2>

              <p>
                In this lesson, you will be a plant detective. You will
                investigate why plants become unhealthy and work out how to make
                them healthy again.
              </p>
            </div>
          </div>
        </template>

        <template #observation>
          <h2>See, Think, Wonder</h2>

          <p>
            <strong>Botanists</strong> observe how plants grow and behave. They
            use a thinking routine called
            <strong><i>See, Think, Wonder</i></strong> to make scientific
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
    </template>

    <template #sections>
      <!-- Part B: Making observations of plants -->
      <Section name="watch">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Watch the video of a seed germinating, add your observations, and
            then select <strong>Next</strong> to continue.
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
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
                web-share;
              "
              allowfullscreen
            >
            </iframe>
          </div>

          <ThinkBox id="watchStwActivity" :groups="stwGroups" />
        </div>
      </Section>

      <!-- Part C: The structure of a flowering plant -->
      <Section name="build">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Watching time lapse videos of plants helps us to
            <strong>observe</strong> the behaviour of plants. As a
            <strong>botanist</strong> you want to be sure you use the correct
            terms when talking about plants. To remind yourself of the major
            parts of a flowering plant complete this drag and drop activity.
          </p>
        </div>
        <div class="plant-game">
          <div class="plant-canvas">
            <div class="plant-game-container">
              <div class="tab-button-container">
                <button
                  class="tab option-button active"
                  id="tab-parts"
                  onclick="switchGame('parts')"
                >
                  Build a Plant
                </button>
                <button
                  class="tab option-button"
                  id="tab-labels"
                  onclick="switchGame('labels')"
                >
                  Label the Plant
                </button>
              </div>
              <main id="game-parts">
                <DragDrop
                  id="plantPartsActivity"
                  class="plant-activity"
                  strict
                  v-slot="{ done, trayEmpty }"
                >
                  <div class="plant-area">
                    <div class="plant-image-container">
                      <img
                        class="plant-image"
                        src="../images/pretask/sunflower.png"
                        alt="Sunflower"
                      />
                    </div>
                    <DropSlot
                      class="slot slot-flower"
                      name="flower"
                      answer="flower"
                    />
                    <DropSlot
                      class="slot slot-left-leaf"
                      name="left-leaf"
                      answer="left-leaf"
                    />
                    <DropSlot
                      class="slot slot-stem"
                      name="stem"
                      answer="stem"
                    />
                    <DropSlot
                      class="slot slot-roots"
                      name="roots"
                      answer="roots"
                    />
                  </div>

                  <div id="success-1" v-if="done">
                    <p class="success-text">
                      Beautiful! Your plant is complete!
                    </p>
                    <span class="success-icon">🌻</span>
                  </div>

                  <div data-dd-tray class="parts-tray" v-show="!trayEmpty">
                    <DragItem class="part" name="flower">
                      <img
                        class="flower-image"
                        src="../images/pretask/flower.png"
                        alt="Flower"
                      />
                    </DragItem>
                    <DragItem class="part" name="left-leaf">
                      <img
                        class="left-leaf-image"
                        src="../images/pretask/left_leaf.png"
                        alt="Left Leaf"
                      />
                    </DragItem>
                    <DragItem class="part" name="stem">
                      <img
                        class="stem-image"
                        src="../images/pretask/stem.png"
                        alt="Stem"
                      />
                    </DragItem>
                    <DragItem class="part" name="roots">
                      <img
                        class="roots-image"
                        src="../images/pretask/roots.png"
                        alt="Roots"
                      />
                    </DragItem>
                  </div>

                  <div class="option-button-container">
                    <div class="option-button">
                      <button class="general-button" data-reset-trigger>
                        Start Over
                      </button>
                    </div>
                    <div id="continue-button" class="option-button" v-if="done">
                      <button
                        class="general-button"
                        onclick="switchGame('labels')"
                      >
                        Continue ->
                      </button>
                    </div>
                  </div>
                </DragDrop>
              </main>
              <main id="game-labels" hidden>
                <DragDrop
                  id="plantLabelsActivity"
                  class="plant-activity"
                  depends-on="plantPartsActivity"
                  strict
                  v-slot="{ done, trayEmpty }"
                >
                  <div class="plant-area">
                    <div class="plant-image-container">
                      <img
                        class="plant-image"
                        src="../images/pretask/sunflower.png"
                        alt="Sunflower"
                      />
                    </div>

                    <DropSlot
                      class="label-slot label-flower-slot"
                      name="flower"
                      answer="flower"
                    />
                    <DropSlot
                      class="label-slot label-leaf-slot"
                      name="leaf"
                      answer="leaf"
                    />
                    <DropSlot
                      class="label-slot label-stem-slot"
                      name="stem"
                      answer="stem"
                    />
                    <DropSlot
                      class="label-slot label-roots-slot"
                      name="roots"
                      answer="roots"
                    />
                  </div>

                  <div id="success-2" class="success-message" v-if="done">
                    <p class="success-text">
                      Well done! All labels are correct! 🎉
                    </p>
                    <span class="success-icon">🌻</span>
                  </div>

                  <div data-dd-tray class="parts-tray" v-show="!trayEmpty">
                    <DragItem class="part" name="flower">Flower</DragItem>
                    <DragItem class="part" name="leaf">Leaf</DragItem>
                    <DragItem class="part" name="stem">Stem</DragItem>
                    <DragItem class="part" name="roots">Roots</DragItem>
                  </div>

                  <div class="option-button">
                    <button class="general-button" data-reset-trigger>
                      Start Over
                    </button>
                  </div>
                </DragDrop>
              </main>
            </div>
          </div>
        </div>
      </Section>

      <Section name="brainstorm">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            <strong>Botanists</strong> like to collaborate and share ideas with
            one another when they are investigating plants. One way to do this
            is to <strong><i>brainstorm</i></strong> to think of new ideas. In
            this activity you can work on your own or in a team to
            <strong><i>brainstorm</i></strong> ideas to explore the question,
            what are the <strong>physical conditions</strong> that plants
            require to grow and survive. Come up with as many ideas as you can.
            You can use the picture to help you think of ideas and write them on
            the sticky notes activity below.
          </p>
        </div>

        <div class="image-box">
          <img
            src="../images/pretask/plantneeds-unmarked.png"
            alt="Plants need water, sunlight and nutrients"
          />
        </div>

        <PostitBrainstorm id="brainstormActivity" />
      </Section>

      <Section name="diagram">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Some of the <strong>physical conditions</strong> that plants need to
            grow include sunlight, soil, water, carbon dioxide, oxygen,
            <strong>nutrients</strong>, and temperature. Use the diagram and
            interactive video to investigate why they need these
            <strong>physical conditions</strong>. You will also explore the
            <strong>function</strong> of different parts of the plant.
          </p>
        </div>

        <div class="learning-row">
          <div class="diagram-box diagram-activity">
            <div class="image-box">
              <img
                src="../images/pretask/plantneeds-marked.png"
                alt="Diagram showing the parts of a flowering plant"
              />
            </div>

            <DragDrop
              id="wordSentencesActivity"
              class="word-sentences-activity dd-activity"
              strict
              v-slot="{ done }"
            >
              <header class="wd-header">
                <h3 class="wd-title">Plant Science</h3>
                <p class="wd-subtitle">
                  Drag the correct words into the blanks to complete each
                  sentence.
                </p>
              </header>

              <div class="">
                <div class="sentence-card">
                  Plants make sugar to get energy to grow. This occurs in the
                  leaves using
                  <DropSlot
                    tag="span"
                    class="drop-zone"
                    name="s0-a"
                    answer="sunlight carbon-dioxide water"
                  />,
                  <DropSlot
                    tag="span"
                    class="drop-zone"
                    name="s0-b"
                    answer="sunlight carbon-dioxide water"
                  />, and
                  <DropSlot
                    tag="span"
                    class="drop-zone"
                    name="s0-c"
                    answer="sunlight carbon-dioxide water"
                  />.
                </div>
                <div class="sentence-card">
                  Roots grow through
                  <DropSlot
                    tag="span"
                    class="drop-zone"
                    name="s1-a"
                    answer="soil"
                  />
                  and this helps to keep the plant anchored.
                </div>
                <div class="sentence-card">
                  <DropSlot
                    tag="span"
                    class="drop-zone"
                    name="s2-a"
                    answer="water"
                  />
                  moves from soil to roots, travels up the stem, and evaporates
                  from the leaves. This helps the plant stay upright.
                </div>
                <div class="sentence-card">
                  <DropSlot
                    tag="span"
                    class="drop-zone"
                    name="s3-a"
                    answer="nutrients"
                  />
                  in the soil are dissolved in water and enter the roots to
                  travel around the plant.
                </div>
                <div class="sentence-card">
                  <DropSlot
                    tag="span"
                    class="drop-zone"
                    name="s4-a"
                    answer="oxygen"
                  />
                  is found in pores in the soil and is needed to keep roots
                  healthy. If plants are over-watered, they don't get enough
                  oxygen.
                </div>
              </div>

              <div class="wd-word-bank">
                <p class="wd-word-bank-label">Word Bank</p>
                <div data-dd-tray class="word-tray">
                  <DragItem
                    tag="span"
                    class="word-chip"
                    name="sunlight"
                    reusable
                    >sunlight</DragItem
                  >
                  <DragItem
                    tag="span"
                    class="word-chip"
                    name="carbon-dioxide"
                    reusable
                    >carbon dioxide</DragItem
                  >
                  <DragItem tag="span" class="word-chip" name="water" reusable
                    >water</DragItem
                  >
                  <DragItem tag="span" class="word-chip" name="soil" reusable
                    >soil</DragItem
                  >
                  <DragItem
                    tag="span"
                    class="word-chip"
                    name="nutrients"
                    reusable
                    >nutrients</DragItem
                  >
                  <DragItem tag="span" class="word-chip" name="oxygen" reusable
                    >oxygen</DragItem
                  >
                </div>
              </div>

              <div class="wd-actions">
                <button
                  type="button"
                  class="general-button reset-btn"
                  data-reset-trigger
                >
                  Reset
                </button>
              </div>

              <div id="wordSentencesCelebration" v-if="done">Well done!</div>
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
                style="border: none"
                webkitallowfullscreen
                mozallowfullscreen
                allowfullscreen
                scrolling="no"
              >
              </iframe>
            </div>
          </div>
        </div>
      </Section>

      <Section name="detective">
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            <strong>Botanists</strong>, farmers, nursery workers and gardeners
            often need to be plant detectives to solve the mystery of unhealthy
            plants. They think about the
            <strong>physical conditions</strong> that plants need to be healthy
            and how too much or too little of each
            <strong>physical condition</strong> can cause a plant to become
            unhealthy. Use your detective skills to make
            <strong>observations</strong> and come up with an idea for what each
            plant might need to become healthy again. Test your idea and see if
            you can solve the mystery for each unhealthy plant.
          </p>
        </div>

        <div class="detective-embed-box">
          <iframe
            src="/plant-detective"
            title="Plant Detective Game"
            class="detective-iframe"
          >
          </iframe>
        </div>
      </Section>

      <Section name="final-brainstorm">
        <FinalBrainstorm
          id="finalBrainstormActivity"
          :prompt="finalPrompt"
          :branches="finalBranches"
        />
      </Section>
    </template>
  </Page>
</template>
