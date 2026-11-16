<script setup>
import { ref } from "vue";
import Page from "../components/Page.vue";
import Section from "../components/Section.vue";
import LessonIntro from "../components/LessonIntro.vue";
import Button from "../components/Button.vue";
import StopAndCheck from "../components/StopAndCheck.vue";
import SpotlightSurvey from "../components/lesson5/SpotlightSurvey.vue";
import SiteOneBarGraph from "../components/lesson5/SiteOneBarGraph.vue";
import SiteTwoBarGraph from "../components/lesson5/SiteTwoBarGraph.vue";
import CompareSites from "../components/lesson5/CompareSites.vue";
import { openPDF } from "../composables/useModal.js";
import ContentBox from "../components/ContentBox.vue";

// Learning objective and success criteria shown in the lesson intro
const objective =
  "We are learning how to represent <strong>fair test data</strong> in a <strong>bar graph</strong>.";
const criteria = [
  "I am learning how to <strong>collect and visualise data</strong>.",
  "I can <strong>label axes</strong> and <strong>plot data points</strong> as bars on a bar graph.",
  "I can use a bar graph to <strong>analyse the results of a fair test</strong>.",
];

// The four steps in the intro's "Constructing a bar graph" card
const graphSteps = [
  {
    title: "On the horizontal x-axis:",
    points: ["The categories or groups you are changing or comparing."],
  },
  {
    title: "On the vertical y-axis:",
    points: [
      "The dependent variable - the thing you measure.",
      "If the test is repeated, use the average value.",
    ],
  },
  {
    title: "Draw a bar for each category",
    points: [
      "The height of the bar shows the y-axis value for each group or category.",
      "Keep every bar the same width.",
    ],
  },
  {
    title: "Give your graph a title",
    points: ["The title explains what your fair test is investigating."],
  },
];

// Terms shown in the vocabulary modal: { word: description }
const glossary = {
  Graph:
    "A visual way of showing data so patterns, comparisons and relationships are easier to see.",
  "X-axis":
    "The horizontal axis. In a fair test line graph, this often shows the independent variable — what was changed.",
  "Y-axis":
    "The vertical axis. In a fair test graph, this often shows the dependent variable — what was measured.",
  "Line graph":
    "A graph that uses points and lines to show how a measured value changes across ordered or continuous values.",
  "Bar graph":
    "A graph that uses separate bars to compare amounts across different categories.",
};

// Sections of the page. Order defines the unlock chain.
const sections = [
  { id: "bar-data-preamble", title: "Visualising Fair Test Data" },
  {
    id: "bar-practice",
    title: "Part A: A Fair Test to Compare Two Forest Sites",
  },
  {
    id: "bar-construction",
    title: "Part B: Record Data for Site 1 in a Bar Graph",
  },
  {
    id: "bar-follow-up",
    title: "Part C : Record Data for Site 2 in a Bar Graph",
  },
  {
    id: "bar-compare",
    title: "Part D : Compare Site 1 and Site 2 on One Graph",
  },
];

// What to look for in the example graphs (a prompt, not checked)
const graphChecklist = [
  {
    title: "A clear title",
    text: "Explains what the fair test is investigating.",
  },
  {
    title: "An x-axis label and units",
    text: "Shows the categories or groups being compared.",
  },
  {
    title: "A y-axis label and units",
    text: "Shows what was measured or counted.",
  },
];

const IMG = "../images/lesson4/";
const animals = [
  { name: "Leadbeater's Possum", image: "leadbeaters_possum_1.png" },
  { name: "Yellow-bellied Glider", image: "YBGlider_2.png" },
  { name: "Ringtail Possum", image: "ringtail_1.png" },
  { name: "Powerful Owl", image: "powerful_owl_1.png" },
  { name: "Feral deer", image: "male_deer_1.png" },
];

// Each part's reset button clears everything in its section; Parts B-D also
// put state classes on their section (lesson4.css lays them out from those).
const practiceSection = ref(null);
const constructionSection = ref(null);
const followUpSection = ref(null);
const compareSection = ref(null);
const survey = ref(null);
const partB = ref(null);
const partC = ref(null);
const partD = ref(null);
</script>

<template>
  <!-- Page renders the vocabulary modal and the hidden teacher menu
       (opened by clicking the lesson title five times). -->
  <Page
    lessonId="lesson5"
    title="Lesson 5 - Using Bar Graphs to Visualise Data"
    :sections="sections"
    :glossary="glossary"
  >
    <!-- ==================================================
         LESSON INTRODUCTION
         ================================================== -->
    <template #lesson-intro>
      <LessonIntro
        label="Lesson 5"
        title="Using Bar Graphs to Visualise Data"
        worksheet="../worksheets/l4-worksheet.pdf"
        :objective="objective"
        :criteria="criteria"
      >
        Bar graphs help scientists turn fair-test data into a visual comparison,
        making <strong>patterns</strong> and
        <strong>differences between categories</strong> easier to see.

        <template #actions>
          <Button
            class="project-resource-button bar-data-resource-button"
            symbol="📄"
            @click="openPDF(IMG + 'types-of-graphs.png', 'Types of Data')"
          >
            Types of Data
          </Button>
        </template>

        <template #observation>
          <h2>Constructing a bar graph</h2>
          <div class="formula-card">
            <div
              v-for="(step, i) in graphSteps"
              :key="step.title"
              class="formula-step"
            >
              <div class="formula-step-number">{{ i + 1 }}</div>
              <div>
                <strong>{{ step.title }}</strong>
                <ul>
                  <li v-for="point in step.points" :key="point">{{ point }}</li>
                </ul>
              </div>
            </div>
          </div>
        </template>
      </LessonIntro>
    </template>

    <template #sections>
      <!-- ==================================================
           VISUALISING FAIR TEST DATA
           ================================================== -->
      <Section name="bar-data-preamble">
        <ContentBox>
          <p>
            Scientists use a <strong>bar graph</strong> when they want to
            visualise <strong>discrete data</strong> or
            <strong>categorical data</strong>.
          </p>
        </ContentBox>

        <div class="graph-checklist-container">
          <div
            class="bar-example-checklist"
            aria-label="What to look for in the example bar graphs"
          >
            <h5>Look at the following 3 bar graphs</h5>
            <p>
              Each shows the results of a fair test. As you look, check that
              each graph has:
            </p>
            <label
              v-for="item in graphChecklist"
              :key="item.title"
              class="check-item"
            >
              <input type="checkbox" :aria-label="'Check for ' + item.title" />
              <span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.text }}</small>
              </span>
            </label>
          </div>
          <div class="intro-card bar-example-image-card">
            <div class="image-box">
              <img
                :src="IMG + 'blank_bar_graph.png'"
                alt="Blank bar graph template showing the parts of a bar graph"
              />
            </div>
          </div>
        </div>

        <div class="intro-card bar-example-image-card">
          <div v-for="n in 2" :key="n" class="image-box">
            <img
              :src="`${IMG}bar_graph_example_${n}.png`"
              alt="Example of a completed bar graph"
            />
          </div>
        </div>
      </Section>

      <!-- ==================================================
           PART A - PROJECT POSSUM AND THE SITE 1 SURVEY
           ================================================== -->
      <Section
        ref="practiceSection"
        name="bar-practice"
        class="student-challenge"
      >
        <div class="project-possum-flow">
          <article class="project-step-card">
            <div class="project-step-heading">
              <span class="project-step-number">1</span>
              <div>
                <h3>Project Possum</h3>
              </div>
            </div>

            <p class="diagram-activity project-mission-copy">
              Your mission: You work for Parks Victoria as a ranger in the
              Toolangi State Forest. You are working with an environmental group
              called <i>Friends of the Leadbeater's Possum</i>.
              <strong
                >You will set up a fair test to carry out a survey of 5 animals
                living in two forest areas: Site 1 and Site 2</strong
              >. A survey the year before recorded a family of Leadbeater's
              Possums living at each site.
            </p>

            <div class="project-species-layout">
              <div class="project-species-copy">
                <p class="project-species-lead">
                  Leadbeater's Possums live in forests in Victoria, Australia.
                  They are listed as <strong>critically endangered</strong>.
                  Conservation groups are trying to help them to survive. To do
                  this they investigate where and how they live.
                </p>

                <div class="project-learn-block">
                  <h4>Learn more about Leadbeater's Possum</h4>
                  <p>
                    Open the Leadbeater's possum flyer to find out more about
                    where they live and how they behave.
                  </p>
                  <Button
                    class="project-resource-button"
                    symbol="📄"
                    @click="
                      openPDF(
                        '../downloads/lesson4/leadbeaters-possum-flyer.pdf',
                        'Meet the Leadbeater\'s Possum',
                      )
                    "
                  >
                    Open Leadbeater's Flyer
                  </Button>
                </div>
              </div>

              <aside
                class="project-species-portrait"
                aria-label="Leadbeater's Possum"
              >
                <span class="project-status-chip">Critically endangered</span>
                <img
                  :src="IMG + 'leadbeaters_possum_1.png'"
                  alt="Leadbeater's Possum"
                />
                <strong>Leadbeater's Possum</strong>
                <small>Species that Project Possum wants to protect</small>
              </aside>
            </div>
          </article>

          <article class="project-step-card">
            <div class="project-step-heading">
              <span class="project-step-number">2</span>
              <div>
                <h3>Compare Site 1 with Site 2</h3>
                <p>List any differences you can see</p>
              </div>
            </div>

            <!-- Site 1 is designed to contain more Leadbeater's Possums than
                 Site 2. Do not reveal that result before students collect
                 the evidence. -->
            <div
              class="project-site-rail"
              aria-label="Two-site Project Possum investigation"
            >
              <div class="project-site-card current">
                <div class="project-site-copy">
                  <h4>Site 1</h4>
                </div>
                <div class="project-site-image">
                  <img :src="IMG + 'site_1_day.png'" alt="Site 1" />
                </div>
              </div>

              <div class="project-site-arrow" aria-hidden="true">→</div>

              <div class="project-site-card future">
                <div class="project-site-copy">
                  <h4>Site 2</h4>
                </div>
                <div class="project-site-image">
                  <img :src="IMG + 'site_2_day.png'" alt="Site 2" />
                </div>
              </div>
            </div>

            <div class="project-question-grid">
              <div class="project-question-card">
                <h4>Testable question</h4>
                <p>
                  <strong
                    >Does a change in the understory affect the number of
                    Leadbeater’s possums in the forest?</strong
                  >
                </p>
              </div>

              <div class="project-question-card">
                <h4>Reasoned prediction</h4>
                <p>
                  <strong
                    >When there is more understory the number of Leadbeaters
                    possums will increase.</strong
                  >
                </p>
              </div>
            </div>
          </article>

          <article class="project-step-card">
            <div class="project-step-heading">
              <span class="project-step-number">3</span>
              <div>
                <h3>Plan Your Fair Test</h3>
              </div>
            </div>

            <div
              class="variable-type-grid"
              aria-label="Variables in the Site 1 and Site 2 fair test"
            >
              <article class="variable-type-card independent">
                <p class="intro-eyebrow">Change</p>
                <h3>Independent variable</h3>
                <p>
                  Compare numbers of 5 different animals at Site 1 and Site 2.
                </p>
              </article>

              <article class="variable-type-card dependent">
                <p class="intro-eyebrow">Measure</p>
                <h3>Dependent variable</h3>
                <p>Measure the number of each animal.</p>
              </article>

              <article class="variable-type-card controlled">
                <p class="intro-eyebrow">Keep the same</p>
                <h3>Controlled variables</h3>
                <ul>
                  <li>
                    Controlled size: Each site is the size of the Melbourne
                    Cricket Ground. This is the size of the territory of a
                    family of Leadbeater's possums.
                  </li>
                  <li>
                    Controlled time: You will count animals between 7pm and 9pm
                    at night.
                  </li>
                  <li>
                    Controlled equipment: You will use the same equipment to
                    count the animals.
                  </li>
                  <li>
                    Controlled people: You will have the same team carry out the
                    count at each site.
                  </li>
                </ul>
              </article>
            </div>

            <div class="diagram-activity lesson4-spaced-block">
              <p>
                You start by training your team to recognise these 5 animals at
                night:
              </p>
            </div>

            <div
              class="project-animal-grid"
              aria-label="Animals to count at Site 1"
            >
              <div
                v-for="animal in animals"
                :key="animal.name"
                class="project-animal-card"
              >
                <div class="project-animal-picture">
                  <img :src="IMG + animal.image" alt="" />
                </div>
                <strong>{{ animal.name }}</strong>
              </div>
            </div>

            <div class="project-survey-tip">
              <strong>Remember:</strong> Zero is still data. If you do not
              observe one of the target animals, record <strong>0</strong>.
            </div>
          </article>
        </div>

        <div>
          <div class="project-spotlight-intro">
            <span class="project-step-number">4</span>
            <div>
              <h3>Spotlighting activity - Survey Site 1</h3>
              <p>
                Wait until night, then use the spotlight to find animals. Click
                on animals as you see them. Use the "Check my count" button to
                see if you have counted all the animals. If not, keep searching.
              </p>
            </div>
            <span class="project-site-one-badge">Site 1</span>
          </div>

          <SpotlightSurvey ref="survey" name="spotlight-survey" />
        </div>

        <StopAndCheck v-if="survey?.countsCorrect" name="visualising-check">
          <template #content>
            <p>
              Which one most clearly shows the difference between numbers of
              each animal?
            </p>
          </template>
          <template #answer>
            You can easily see differences between the numbers of each animal
            when the counters are laid out in a flat line. This looks like a
            <strong>bar graph</strong>. It is useful for comparing categories or
            groups.
          </template>
        </StopAndCheck>

        <div class="reset-button-container">
          <Button :is-reset="true" @click="practiceSection?.reset()" />
        </div>
      </Section>

      <!-- ==================================================
           PART B - CONSTRUCT THE SITE 1 BAR GRAPH
           ================================================== -->
      <Section
        ref="constructionSection"
        name="bar-construction"
        :class="{ 'partb-build-active': partB?.buildActive }"
      >
        <SiteOneBarGraph ref="partB" @reset="constructionSection?.reset()" />
      </Section>

      <!-- ==================================================
           PART C - SITE 2 BAR GRAPH PRACTICE
           ================================================== -->
      <Section
        ref="followUpSection"
        name="bar-follow-up"
        class="student-challenge partc-site2-workbench"
        :class="{ 'partc-bars-active': partC?.barsActive }"
      >
        <div class="partc-story-card partc-site2-story">
          <div class="partc-site2-story-copy">
            <h3>Now investigate the second forest site</h3>
            <p>
              Your ranger team has surveyed <strong>Site 2</strong> over three
              nights. You do not need to repeat the spotlighting activity here —
              the survey results have already been collected for you. Use the
              data below to build a bar graph for Site 2.
            </p>
          </div>
        </div>

        <div class="partc-site-image-stage">
          <div class="partc-site-image">
            <img
              :src="IMG + 'site_2_night.png'"
              alt="Nighttime forest at Site 2"
            />
          </div>
        </div>

        <SiteTwoBarGraph ref="partC" @reset="followUpSection?.reset()" />
      </Section>

      <!-- ==================================================
           PART D - BOTH SITES ON ONE GRAPH
           ================================================== -->
      <Section
        ref="compareSection"
        name="bar-compare"
        class="student-challenge partd-site-compare-workbench"
        :class="partD?.sectionClass"
      >
        <div class="partd-intro-card">
          <div>
            <h3>Put Both Sites on One Graph</h3>
            <p>
              In a fair test, it is best to put all of your data onto one
              <strong>graph</strong>. This is so you can easily see if the
              change you made caused any differences in results.
            </p>
            <div class="partd-compare-callout">
              Place the data for site 1 and for site 2 on the same
              <strong>bar graph</strong>. Each animal will have a pair of bars
              side by side that you can compare easily.
            </div>
          </div>
        </div>

        <CompareSites ref="partD" @reset="compareSection?.reset()" />
      </Section>
    </template>
  </Page>
</template>
