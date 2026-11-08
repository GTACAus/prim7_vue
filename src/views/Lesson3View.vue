<template>
    <!-- ==================================================
       VOCABULARY MODAL
       Placeholder definitions can be refined later.
       ================================================== -->
    <Modal label="Lesson 3: Tables" :glossary="glossary" note="Jumping between activities changes navigation only. Reset student view clears every answer on this page." />

    <!-- ==================================================
       HIDDEN TEACHER MENU
       Opened by clicking the lesson title five times.
       ================================================== -->

    <main class="page lesson3-page">
      <LessonIntro label="Lesson 3 &middot; Part A" title="Using a Table to Record Data for a Fair Test - Part A" intro-class="lesson3-intro" worksheet="../worksheets/l3-worksheet.pdf">
    Scientists organise results in <strong>data tables</strong> so that measurements are clear, consistent and easy to compare.
  </LessonIntro>
      <div class="intro-grid">
        <section class="intro-card objectives-card">
          <p class="intro-eyebrow">Learning objective</p>

          <p class="learning-objective-text">We are learning how to collect and organise <strong>data</strong> into a <strong>table</strong>.</p>

          <p class="success-heading">Success criteria</p>

          <ol class="objective-list">
            <li>I can label a <strong>table</strong> with variables and <strong>units</strong> in the correct format.</li>
            <li>I can collect <strong>data</strong> and enter it into a <strong>table</strong> with the correct <strong>units</strong>.</li>
            <li>I can summarise the results of an experiment using averages.</li>
          </ol>
        </section>

        <section class="intro-card observation-card">
          <p class="intro-eyebrow">Think like a scientist</p>
          <h2>Recording Data in Scientific Tables</h2>

          <p>
            When scientists carry out fair tests, they use <strong>tables</strong> to record <strong>data</strong>. This helps them to see patterns, trends, and relationships in the <strong>data</strong>. 
          </p>

          <div class="formula-card">
            <div class="formula-step">
              <div id="formula-step-independent" class="formula-step-number">1</div>
              <div>
                <strong>The independent variable and how you will change it</strong>
                <span>
                  This goes in the left-hand column of the <strong>table</strong>
                </span>
              </div>
            </div>

            <div class="formula-step">
              <div id="formula-step-dependent" class="formula-step-number">2</div>
              <div>
                <strong>The dependent variable and the measurements you make</strong>
                <span>
                  Put in the column to the right
                </span>
              </div>
            </div>

            <div class="formula-step">
              <div id="formula-step-units" class="formula-step-number">3</div>
              <div>
                <strong>Repeat each test three times</strong>
                <span>
                  Record each repeat as test 1, test 2, and test 3. This helps you
                  to spot errors should they occur
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Section id="yeast-image-investigation" title="Is Yeast Alive?" next-id="yeast-variables">
        <div class="diagram-box diagram-activity">
          Hover over each image to learn more about the activity of yeast and how it helps produce sourdough bread.
        </div>
        <div class="diagram-box diagram-activity yeast-image-activity">
          <div id="dryYeastCard" class="yeast-card">
            <span class="yeast-number">1</span>
            <img src="../images/lesson3/Yeast.jpg" alt="Dry yeast">
            <div class="yeast-overlay">
                <p>
                  Dry yeast is sold in packets.
                  Yeast is a tiny living organism that you can only see under a microscope!
                  Even though it is tiny, yeast is alive, and just like other living things, it needs food to survive.
                  The yeast in these packets is dormant.
                  To wake it up you need to give it water, sugar and the right temperature to make it active.
                </p>
            </div>
          </div>

          <div class="yeast-card">
              <span class="yeast-number">2</span>

              <img src="../images/lesson3/Sugar Blocks.jpg" alt="Sugar">
              <div class="yeast-overlay">
                  <p>
                    Sugar is used by yeast as food to get energy so it can grow and reproduce.
                  </p>
              </div>
          </div>

          <div class="yeast-card">
              <span class="yeast-number">3</span>

              <img src="../images/lesson3/Sourdough Starter.jpg" alt="Sourdough starter">
              <div class="yeast-overlay">
                  <p>
                    When you mix dry yeast and sugar in water it will start to become active.
                    Active yeast produces and releases carbon dioxide gas.
                    This gas can be seen as bubbles in the mixture.
                    The gas bubbles rise to the surface and pop, so the gas escapes the mixture and enters the air around it.
                  </p>
              </div>
          </div>

          <div class="yeast-card">
              <span class="yeast-number">4</span>

              <img src="../images/lesson3/Sourdough Bread 2.jpg" alt="Sourdough bread">
              <div class="yeast-overlay">
                  <p>
                    Active yeast produces and releases carbon dioxide gas.
                    When added to bread dough, this makes the dough rise.
                    As bread is baked the bubbles of gas get trapped, making holes in the bread so it is light and soft to eat.
                  </p>
              </div>
          </div>

      </div>
      </Section>
      <!-- Full-screen mobile overlay -->
      <div class="yeast-mobile-modal" id="yeastModal">
        <div class="yeast-mobile-modal-box">
          <button class="yeast-modal-close" type="button" aria-label="Close">
              &times;
          </button>

          <div class="yeast-modal-content">
              <p id="yeastModalText"></p>
          </div>
        </div>
      </div>

<!-- ==================================================
     YEAST FAIR TEST - IDENTIFY VARIABLES
     ================================================== -->

<Section id="yeast-variables" title="Identify Variables in the Yeast Fair Test Experiment" next-id="data-table-template" next-button-id="yeastVariablesNext" locked hide-next class="sort-variables-section">

  <div class="diagram-activity diagram-box">
    <p class="activity-instruction">
      A student set up a fair test as seen in the image below. They wrote a testable question.
    </p>
    <div class="variable-question floating-title">
      How does changing temperature affect the amount of gas made by yeast?
    </div>
    <p class="activity-instruction">
      Then the student wrote a reasoned prediction:
    </p>
    <div class="diagram-activity diagram-box reasoned-prediction-box floating-title">
      As temperature increases, the amount of gas made by yeast increases.
      This is because living things need to be warm to survive. 
    </div>
    
  </div>
  
  <div class="yeast-balloon-image-box">
    <img src="../images/lesson3/balloon-experiment.png" alt="Yeast Activity vs. Temperature Experiment">
  </div>

<div class="diagram-box diagram-activity">
  <p class="activity-instruction">
    Identify the variables in this yeast fair test.
  </p>

  <div class="formula-card">
    <div class="formula-step">
      <div class="formula-step-number">1</div>
      <div>
        <strong>Select the independent variable button.</strong>
        <span>Then choose the thing that is being changed.</span>
      </div>
    </div>

    <div class="formula-step">
      <div class="formula-step-number">2</div>
      <div>
        <strong>Select the dependent variable button.</strong>
        <span>Then choose what is being measured.</span>
      </div>
    </div>

    <div class="formula-step">
      <div class="formula-step-number">3</div>
      <div>
        <strong>Select the controlled variable button.</strong>
        <span>Then choose all things you must keep the same.</span>
      </div>
    </div>
  </div>
</div>

  <VariableSort class="variable-activity" id="sortVariablesOneActivity" :options="sortVariablesOneActivityOptions">

    <p class="variable-question floating-title">
      How does changing temperature affect the amount of gas made by yeast?
    </p>

    <div
      class="variable-selection-toolbar"
      aria-label="Choose a variable type"
    >
      <button
        type="button"
        class="variable-mode-button independent-mode-button"
        data-sort-mode="independent"
        aria-pressed="false"
      >
        <span class="variable-mode-title">
          Independent Variable
        </span>

        <span class="variable-mode-subtitle">
          Change
        </span>
      </button>

      <button
        type="button"
        class="variable-mode-button dependent-mode-button"
        data-sort-mode="dependent"
        aria-pressed="false"
      >
        <span class="variable-mode-title">
          Dependent Variable
        </span>

        <span class="variable-mode-subtitle">
          Measure
        </span>
      </button>

      <button
        type="button"
        class="variable-mode-button controlled-mode-button"
        data-sort-mode="controlled"
        aria-pressed="false"
      >
        <span class="variable-mode-title">
          Controlled Variable
        </span>

        <span class="variable-mode-subtitle">
          Keep the same
        </span>
      </button>
    </div>

<div class="variable-tile-grid">

  <button
    type="button"
    class="variable-tile"
    data-sort-tile="amount-yeast"
  >
    <span class="variable-tile-label">
      Amount of yeast
    </span>
  </button>

  <button
    type="button"
    class="variable-tile"
    data-sort-tile="amount-sugar"
  >
    <span class="variable-tile-label">
      Amount of sugar
    </span>
  </button>

  <button
    type="button"
    class="variable-tile"
    data-sort-tile="amount-water"
  >
    <span class="variable-tile-label">
      Amount of water
    </span>
  </button>

  <button
    type="button"
    class="variable-tile"
    data-sort-tile="temperature"
  >
    <span class="variable-tile-label">
      Temperature
    </span>
  </button>

  <button
    type="button"
    class="variable-tile"
    data-sort-tile="flask-size"
  >
    <span class="variable-tile-label">
      Size of flask
    </span>
  </button>

  <button
    type="button"
    class="variable-tile"
    data-sort-tile="gas-produced"
  >
    <span class="variable-tile-label">
      Amount of gas produced
    </span>
  </button>

  <button
    type="button"
    class="variable-tile"
    data-sort-tile="balloon-type"
  >
    <span class="variable-tile-label">
      Type of balloon
    </span>
  </button>

</div>
    <div
      id="yeastVariablesFeedback"
      data-sort-feedback
      class="variable-feedback"
      role="status"
      aria-live="polite"
    >
      Choose a variable type, then select the matching variable.
    </div>

    <div class="reset-button-container">
      <button
        type="button"
        id="yeast-variables-reset"
        class="general-button reset-btn"
        data-reset-trigger
      >
        Reset
      </button>
    </div>

  </VariableSort>

  <div class="stop-and-check" data-activity data-activity-depends-on="sortVariablesOneActivity">
    <div class="stop-and-check-content">
      <p>
        Look at the image for the fair test experiment.
        It is Identify Variables in the Yeast Fair Test Experiment. 
        As yeast activity increases, the amount of gas it produces increases.
      </p>

      <p>
        How will they measure the amount of gas produced?
      </p>
    </div>

    <div class="stop-and-check-answer" data-button-reveal hidden>
      The student mixed the same amount of yeast, sugar and water in each flask.
      Then they stretched a balloon over the top of the flask. This was done to trap the gas produced by the yeast. 
      Yeast that is more active will produce more gas and this will make the balloon bigger.
      By comparing the size of each balloon we can see which temperature makes the yeast work best.
    </div>

    <button class="stop-and-check-button general-button" data-button-trigger>
      <p>Check Your Answer</p>
      <p class="bounce-symbol">✅</p>
    </button>
  </div>
</Section>

      <!-- ==================================================
         SECTION 1: PARENT / REFERENCE TABLE
         ================================================== -->
      <Section id="data-table-template" title="How to make a scientific table" next-id="yeast-labels" locked class="data-table-section">
        
        <div class="diagram-box diagram-activity">
          <p class="activity-instruction">
            Scientists have a format they use to make a scientific <strong>table</strong> to record <strong>data</strong>. 
            Watch the video to learn how they do this.
          </p>
          <p class="activity-instruction">
            Use this template as a guide when you build your own <strong>data tables</strong> during the lesson.
          </p>
        </div>
        <div class="data-table-card reference-table-card">
          <div class="table-key-grid" aria-label="Parts of a data table">
            <div class="table-key-card key-independent">

              <h3>Independent variable</h3>
              <p>What you change.</p>
              <button
                type="button"
                class="general-button watch-video-button"
                onclick="openModal('video', { src: '../videos/lesson3/independentvar.mp4', title: 'Independent Variable Guide' })">
                  <p class="bounce-symbol">▶</p>
                  <p>Watch Video</p>
              </button>
            </div>
            
            <div class="table-key-card key-dependent">
              <h3>Dependent variable</h3>
              <p>What you measure or observe.</p>
              <button
                type="button"
                class="general-button watch-video-button"
                onclick="openModal('video', { src: '../videos/lesson3/dependentvar-2.mp4', title: 'Dependent Variable Guide' })">
                  <p class="bounce-symbol">▶</p>
                  <p>Watch Video</p>
              </button>
            </div>

            <div class="table-key-card key-units">
              <h3>Units</h3>
              <p>The <strong>unit</strong> belongs in the heading, not in each cell.</p>
              <button
                type="button"
                class="general-button watch-video-button"
                onclick="openModal('video', { src: '../videos/lesson3/units-2.mp4', title: 'Units Guide' })">
                  <p class="bounce-symbol">▶</p>
                  <p>Watch Video</p>
              </button>

              <button
                type="button"
                class="general-button watch-video-button"
                onclick="openModal('pdf', { src: '../downloads/lesson3/units.pdf', title: 'Examples of Units' })">
                  <p>Examples of Units</p>
              </button>

            </div>
            <!-- Shared video modal -->

            <!-- Shared PDF modal -->
          </div>

          <div class="reference-callout-row" aria-hidden="true">
            <div class="data-table-callout reference-callout-independent">
              <span class="callout-number">1</span>
              <p>
                Put the <strong>independent variable and its units</strong>
                at the top of the first column. List each condition that you change in the cells below this.
              </p>
            </div>

            <div class="data-table-callout reference-callout-dependent">
              <span class="callout-number">2</span>
              <p>
                Put the <strong>dependent variable and its units</strong>
                across the top of the <strong>table</strong>. Put test 1, test 2, and test 3 below this.
              </p>
            </div>
          </div>

          <div class="experiment-table-scroll">
            <table
              class="experiment-table reference-table conventional-table"
              aria-label="Example scientific data table"
            >
              <thead>
                <tr>
                  <th class="independent-heading" rowspan="2" scope="col">
                    <strong>Independent variable</strong>
                    <span class="table-units">(<strong>units</strong>)</span>
                  </th>

                  <th class="dependent-heading" colspan="3" scope="colgroup">
                    <strong>Dependent variable</strong>
                    <span class="table-units">(<strong>units</strong>)</span>
                  </th>
                </tr>

<tr>
  <th class="test-heading" scope="col">Test 1</th>
  <th class="test-heading" scope="col">Test 2</th>
  <th class="test-heading" scope="col">Test 3</th>
</tr>

              </thead>

              <tbody>
                <tr>
                  <th class="independent-value" scope="row">Condition 1</th>

                  <td><strong>Data</strong></td>
                  <td><strong>Data</strong></td>
                  <td><strong>Data</strong></td>
                </tr>

                <tr>
                  <th class="independent-value" scope="row">Condition 2</th>

                  <td><strong>Data</strong></td>
                  <td><strong>Data</strong></td>
                  <td><strong>Data</strong></td>
                </tr>

                <tr>
                  <th class="independent-value" scope="row">Condition 3</th>

                  <td><strong>Data</strong></td>
                  <td><strong>Data</strong></td>
                  <td><strong>Data</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <!-- ==================================================
         SECTION 2: YEAST EXPERIMENT - DRAG AND DROP LABELS
         ================================================== -->
      <section class="section data-table-section locked" id="yeast-labels">
        <h2 class="section-title">Build and Complete the Yeast Data Table</h2>

<div class="yeast-results-step yeast-results-step--initial">
  <div class="yeast-results-step-heading">
    <span>STEP 1</span>

    <div>
      <p class="yeast-results-eyebrow">Make a scientific <strong>table</strong> for the yeast fair test.</p>
      <h3>Drag and drop the labels into the correct cells on the table.</h3>
    </div>

  </div>
</div>

<div class="yeast-results-step pop-in">
  <div class="yeast-results-step-heading">
    <span>STEP 2</span>

    <div>
      <p class="yeast-results-eyebrow">Record the results</p>
      <h3>Watch each repeat test</h3>
    </div>
  </div>

  <p class="yeast-results-instruction">
    Watch each video and enter the balloon circumference measurements
    into the correct column of your <strong>table</strong>.
  </p>

  <div class="yeast-results-video-grid">

<button
  type="button"
  class="general-button watch-video-button yeast-test-video-button"
  data-test-number="1"
  onclick="openYeastRecordVideo(
    this,
    '../videos/lesson3/Yeast Timelapse.mp4',
    'Yeast Experiment - Test 1',
    1
  )"
>
      <p class="bounce-symbol">▶</p>
      <p>Test 1</p>
    </button>

<button
  type="button"
  class="general-button watch-video-button yeast-test-video-button"
  data-test-number="2"
  onclick="openYeastRecordVideo(
    this,
    '../videos/lesson3/Yeast Timelapse 2.mp4',
    'Yeast Experiment - Test 2',
    2
  )"
>
      <p class="bounce-symbol">▶</p>
      <p>Test 2</p>
    </button>

<button
  type="button"
  class="general-button watch-video-button yeast-test-video-button"
  data-test-number="3"
  onclick="openYeastRecordVideo(
    this,
    '../videos/lesson3/Yeast Timelapse 3.mp4',
    'Yeast Experiment - Test 3',
    3
  )"
>
      <p class="bounce-symbol">▶</p>
      <p>Test 3</p>
    </button>

  </div>
</div>
          <div id="labelsCompleteAfterContainer">
            <div class="stop-and-check" id="yeastLabelsStopAndCheck" data-activity data-activity-depends-on="yeastResultsActivity" data-reveals="#repeat-tests-average-intro, #yeast-labels .average-button">
              <div class="stop-and-check-content">
                <p>
                  Look at the <strong>data</strong> in the <strong>table</strong> below.
                </p>
                <p>
                  <strong>
                    Are there any strange or unusual results when you compare
                    Test 1, Test 2 and Test 3?
                  </strong>
                </p>
                <p>
                  Think about why repeated results might sometimes be different.
                </p>
              </div>
              <div class="stop-and-check-answer" data-button-reveal hidden>
                Some of the repeated results are different.

                At <strong>37°C</strong>, Test 2 is lower than Tests 1 and 3.
                At <strong>80°C</strong>, the results are very different.

                This could be from a setup mistake or a measuring mistake.
              </div>

              <button class="stop-and-check-button general-button" data-button-trigger>
                <p>Check Your Answer</p>
                <p class="bounce-symbol">✅</p>
              </button>
            </div>
          
            <div id="repeat-tests-average-intro" class="pop-in" data-button-reveal hidden>
              <div class="yeast-results-step-heading">
                <span>3</span>

                <div>
                  <p class="yeast-results-eyebrow">Calculate the average results</p>
                  <h3>
                    Calculate the average results for the three tests of each temperature in the yeast fair test experiment.
              </h3>
                </div>
              </div>

              <p>
                You can try working out the averages yourself or use the <strong>calculate</strong> button in the <strong>table</strong> above.
              </p>

              <div class="average-worked-example">

                <p class="average-example-label">
                  Worked example — 22°C
                </p>

                <p>
                  Calculating the average size of the balloon circumference at 22°C:
                </p>

            <div class="average-example-steps">

              <div class="average-equation">
                <span class="average-equation-left">
                  <strong>Average</strong> =
                </span>

                <span class="math-fraction">
                  <span class="math-numerator">
                    Test 1 + Test 2 + Test 3
                  </span>

                  <span class="math-denominator">
                    number of tests
                  </span>
                </span>
              </div>

              <div class="average-equation">
                <span class="average-equation-left">=</span>

                <span class="math-fraction">
                  <span class="math-numerator">
                    15 cm + 16 cm + 17 cm
                  </span>

                  <span class="math-denominator">
                    3
                  </span>
                </span>
              </div>

              <div class="average-equation">
                <span class="average-equation-left">=</span>

                <span class="math-fraction">
                  <span class="math-numerator">
                    48 cm
                  </span>

                  <span class="math-denominator">
                    3
                  </span>
                </span>
              </div>

              <div class="average-equation average-equation-result">
                <span class="average-equation-left">=</span>

                <strong>16 cm</strong>
              </div>

            </div>

              </div>

            </div>
          </div>
        <DragDrop id="yeastActivity" class="diagram-activity" :options="yeastActivityOptions">
          
          <div
          class="label-bank table-label-bank"
          id="yeastLabelBank"
          data-dd-tray
          data-dd-tray-heading="Label Bank"
          aria-label="Labels to place in the yeast experiment table"
          >
            <button class="general-button drag-label" data-dd-item="yeast-dv">
              Circumference of balloon (cm)
            </button>
            <button class="general-button drag-label" data-dd-item="yeast-iv">
              Temperature (°C)
            </button>
            <button class="general-button drag-label" data-dd-item="yeast-test-1">Test 1</button>
            <button class="general-button drag-label" data-dd-item="yeast-test-2">Test 2</button>
            <button class="general-button drag-label" data-dd-item="yeast-test-3">Test 3</button>
            <button class="general-button drag-label" data-dd-item="yeast-temp-2">2</button>
            <button class="general-button drag-label" data-dd-item="yeast-temp-22">22</button>
            <button class="general-button drag-label" data-dd-item="yeast-temp-37">37</button>
            <button class="general-button drag-label" data-dd-item="yeast-temp-80">80</button>
          </div>
          <div class="data-table-card yeast-table-card">
            <div class="experiment-table-scroll">
              <table class="experiment-table yeast-table" aria-label="Yeast experiment drag and drop data table">
                <thead>
                  <tr>
                    <th class="independent-heading" rowspan="2">
                      <span class="label-drop-zone" data-dd-slot="yeast-iv" data-dd-answer="yeast-iv">
                        Drop label
                      </span>
                    </th>
                    <th class="dependent-heading drop-heading" colspan="4">
                      <span class="label-drop-zone" data-dd-slot="yeast-dv" data-dd-answer="yeast-dv">
                        Drop label
                      </span>
                    </th>
                  </tr>

                  <tr>
                    <th class="test-heading">
                      <span class="label-drop-zone" data-dd-slot="yeast-test-1" data-dd-answer="yeast-test-1">Drop label</span>
                    </th>

                    <th class="test-heading">
                      <span class="label-drop-zone" data-dd-slot="yeast-test-2" data-dd-answer="yeast-test-2">Drop label</span>
                    </th>

                    <th class="test-heading">
                      <span class="label-drop-zone" data-dd-slot="yeast-test-3" data-dd-answer="yeast-test-3">Drop label</span>
                    </th>

                    <th class="average-heading">
                      Average
                    </th>
                  </tr>
                </thead>

                <InputResponse tag="tbody" id="yeastResultsActivity" data-activity-depends-on="yeastActivity">
                  <tr data-input-average-row>
                    <th class="independent-value">
                      <span class="label-drop-zone" data-dd-slot="yeast-temp-2" data-dd-answer="yeast-temp-2">
                        Drop label
                      </span>
                    </th>
                    <ResponseBox tag="td" group-key="yeast-result-1" :min="1" :max="1" answer="0" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 1" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-2" :min="1" :max="1" answer="0" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 2" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-3" :min="1" :max="1" answer="0" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 3" list-class="table-result-list" />
                    <td class="average-cell">
                      <button class="average-button general-button" type="button" onclick="calculateInputAverage(this)" hidden>
                        Calculate
                      </button>
                    </td>
                  </tr>

                  <tr data-input-average-row>
                    <th class="independent-value">
                      <span class="label-drop-zone" data-dd-slot="yeast-temp-22" data-dd-answer="yeast-temp-22">
  Drop label
</span>
                    </th>
                    <ResponseBox tag="td" group-key="yeast-result-4" :min="1" :max="1" answer="15" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 4" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-5" :min="1" :max="1" answer="16" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 5" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-6" :min="1" :max="1" answer="17" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 6" list-class="table-result-list" />
                    <td class="average-cell">
                      <button class="average-button general-button" type="button" onclick="calculateInputAverage(this)" hidden>
                        Calculate
                      </button>
                    </td>
                  </tr>

                  <tr data-input-average-row>
                    <th class="independent-value">
                      <span class="label-drop-zone" data-dd-slot="yeast-temp-37" data-dd-answer="yeast-temp-37">
  Drop label
</span>
                    </th>
                    <ResponseBox tag="td" group-key="yeast-result-7" :min="1" :max="1" answer="19" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 7" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-8" :min="1" :max="1" answer="17" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 8" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-9" :min="1" :max="1" answer="19" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 9" list-class="table-result-list" />
                    <td class="average-cell">
                      <button class="average-button general-button" type="button" onclick="calculateInputAverage(this)" hidden>
                        Calculate
                      </button>
                    </td>
                  </tr>

                  <tr data-input-average-row>
                    <th class="independent-value">
                      <span class="label-drop-zone" data-dd-slot="yeast-temp-80" data-dd-answer="yeast-temp-80">
  Drop label
</span>
                    </th>
                    <ResponseBox tag="td" group-key="yeast-result-10" :min="1" :max="1" answer="3" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 10" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-11" :min="1" :max="1" answer="0" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 11" list-class="table-result-list" />
                    <ResponseBox tag="td" group-key="yeast-result-12" :min="1" :max="1" answer="17" type="number" input-class="table-number-input" :input-props="numberInputProps" aria-label="Drop Temperature test 12" list-class="table-result-list" />
                    <td class="average-cell">
                      <button class="average-button general-button" type="button" onclick="calculateInputAverage(this)" hidden>
                        Calculate
                      </button>
                    </td>
                  </tr>
                </InputResponse>
              </table>
            </div>
            <div class="activity-feedback table-activity-feedback" id="yeastLabelFeedback" hidden></div>

          </div>

        </DragDrop>

            <MultipleChoice class="prediction-check yeast-results-interpretation" id="yeastPredictionCheck" hidden :options="yeastPredictionCheckOptions">

              <p class="prediction-label">
                Interpret the results
              </p>

              <div class="yeast-prediction-reminder">
                <h3 class="yeast-prediction-reminder-label">
                  Reasoned prediction
                </h3>

                <p>
                  As the temperature increases, the amount of gas made by yeast increases.
                  This is because living things need to be warm to survive.
                </p>
              </div>

              <div>
                <h3>Use the data to describe the results</h3>

                <div class="yeast-result-question" data-mc-question data-mc-answer="increases">
                  <p>
                    As the temperature increases from
                    <strong>2°C to 37°C</strong>, the amount of gas made by yeast:
                  </p>

                  <div class="prediction-buttons">
                    <button type="button" class="general-button prediction-button" data-mc-choice="increases">Increases</button>
                    <button type="button" class="general-button prediction-button" data-mc-choice="decreases">Decreases</button>
                    <button type="button" class="general-button prediction-button" data-mc-choice="same">Does not change</button>
                  </div>
                </div>
              </div>

              <div class="yeast-result-question" data-mc-question data-mc-answer="decreases">
                <p>
                  At <strong>80°C</strong>, the amount of gas made compared with
                  <strong>37°C</strong>:
                </p>

                <div class="prediction-buttons">
                  <button type="button" class="general-button prediction-button" data-mc-choice="increases">Increases</button>
                  <button type="button" class="general-button prediction-button" data-mc-choice="decreases">Decreases</button>
                  <button type="button" class="general-button prediction-button" data-mc-choice="same">Does not change</button>
                </div>
              </div>

              <div class="yeast-prediction-final" data-mc-question data-mc-answer="partly-supported" hidden>
                <h3>
                  Do the results support the reasoned prediction?
                </h3>

                <div class="prediction-buttons">
                  <button type="button" class="general-button prediction-button" data-mc-choice="supported">Supported</button>
                  <button type="button" class="general-button prediction-button" data-mc-choice="partly-supported">Partly Supported</button>
                  <button type="button" class="general-button prediction-button" data-mc-choice="not-supported">Not supported</button>
                </div>
              </div>

            </MultipleChoice>

            <div class="stop-and-check" id="yeastHotStopAndThink" data-activity data-activity-depends-on="yeastPredictionCheck" data-reveals="#yeastAverageNext, #yeastSaveWork">

  <div class="stop-and-check-content">
    <p>
      From <strong>2°C to 37°C</strong>, yeast activity increased
      and the balloons became bigger.
    </p>
    <p>
      <strong>
        Why do you think yeast activity was so low in the test at 80°C?
      </strong>
    </p>
  </div>

  <div class="stop-and-check-answer" data-button-reveal hidden>
    Yeast is a living thing. At <strong>80°C</strong>, the temperature
    is too hot for the yeast to survive, so yeast activity slows down
    and stops.
  </div>

  <button class="stop-and-check-button general-button" data-button-trigger>
    <p>Check Your Answer</p>
    <p class="bounce-symbol">✅</p>
  </button>

</div>


          <div class="reset-button-container lesson3-reset-container">
            <button type="button" class="general-button reset-btn" data-reset-trigger>
              Reset
            </button>
          </div>

      <button
        id="yeastAverageNext"
        class="next-page-button general-button"
        onclick="window.location.href='/lesson3-2'"
        hidden
      >
        Next: Part B
      </button>


      <button
        type="button"
        id="yeastSaveWork"
        class="save-work-button general-button"
        onclick="downloadLessonPDF()"
        hidden
      >
        <p class="bounce-symbol">💾</p>
        <p>Save my work</p>
      </button>

        <p class="completed-note">Completed — next activity unlocked.</p>
      </section>



      <div class="return-to-top">
        <a class="return-to-top-button general-button" href="#">
          <p class="bounce-symbol">↑</p>
          <p>Return to Top</p>
        </a>
      </div>
    </main>

    <!-- Shared functions include section unlocking, PDF printing and the cypher-based classroom language filter. -->
</template>

<script setup>
import { onMounted } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import Modal from '../components/Modal.vue'
import Section from '../components/Section.vue'
import DragDrop from '../components/activities/DragDrop.vue'
import InputResponse from '../components/activities/InputResponse.vue'
import ResponseBox from '../components/activities/ResponseBox.vue'
import MultipleChoice from '../components/activities/MultipleChoice.vue'
import VariableSort from '../components/activities/VariableSort.vue'

// Extra attributes for the numeric result cells
const numberInputProps = { step: 'any', inputmode: 'decimal', autocomplete: 'off', 'data-activity-hidden': '' }

// Options passed to the activity components
const sortVariablesOneActivityOptions = { answers: {
            independent: "temperature",
            dependent: "gas-produced",
            controlled: [
              "amount-yeast",
              "amount-sugar",
              "amount-water",
              "flask-size",
              "balloon-type"
            ]
          } }

const yeastActivityOptions = { strictSlots: true }

const yeastPredictionCheckOptions = { classes: { selected: "mc-picked" } }
import LessonIntro from '../components/LessonIntro.vue'

// Terms shown in the vocabulary modal: { word: description }
const glossary = {
  "Data": "The observations or measurements you collect during an investigation. Data can be numbers (e.g. temperature, height) or descriptions (e.g. colour, texture).",
  "Dependent variable": "The result that is observed or measured during a fair test experiment.",
  "Independent variable": "The one variable changed during a fair test experiment.",
  "Repeat tests": "The same test carried out two or more times under exactly the same conditions, to check that your results are consistent.",
  "Table": "An organised arrangement of columns and rows used to display data.",
  "Units": "The standard amount or portion of something that is measured, e.g. cm for length, kg for weight, minutes for time.",
}

const scripts = [
  { src: "../scripts/common_functions.js" },
  { src: "../scripts/lesson_progress.js", type: "module" },
  { code: String.raw`      const cards = document.querySelectorAll('.yeast-card');

      const modal = document.getElementById('yeastModal');
      const modalText = document.getElementById('yeastModalText');
      const closeButton = modal.querySelector('.yeast-modal-close');

      cards.forEach(card => {
          card.addEventListener('click', () => {

              // Only use full-screen behaviour on mobile
              if (window.matchMedia('(max-width: 1000px)').matches) {

                  const text = card.querySelector('.yeast-overlay p').textContent;

                  modalText.textContent = text;

                  modal.classList.add('is-open');

                  // Shared helper: grows the modal out of the tapped card.
                  growModalFromTrigger(modal, card);
              }
          });
      });

      modal.addEventListener('click', event => {
        if (event.target === modal) {
          modal.classList.remove('is-open');
        }
      });

      closeButton.addEventListener('click', () => {
          modal.classList.remove('is-open');
      });` },
  { type: "module", code: String.raw`      import { initSectionActivitiesIn } from "../scripts/activities/activity-sections.js";

      /* ==================================================
       YEAST TEST VIDEOS
       The video itself is shown by the shared openModal('video', ...) (common_functions.js).
       ================================================== */

      function openYeastRecordVideo(button, videoPath, videoTitle, testNumber) {
        document.getElementById("yeast-labels").classList.add("test-" + testNumber + "-ready");

        button.classList.add("video-watched");

        const label = button.querySelector("p:last-child");

        if (label) {
          label.textContent = "Test " + testNumber + " ✓";
        }

        openModal('video', { src: videoPath, title: videoTitle });
      }

      /* ==================================================
       YEAST VARIABLES - SORT ACTIVITY
       ================================================== */

      let sortVariablesOneActivity = null;

      function initialiseYeastVariables() {
        const root = document.getElementById("sortVariablesOneActivity");
        if (!root) return;

        sortVariablesOneActivity = getActivity("sortVariablesOneActivity");
      }

      /* ==================================================
       YEAST TABLE - DRAG AND DROP LABELS
       ================================================== */

      let yeastDragDropActivity = null;

      function initialiseDragAndDrop() {
        const root = document.getElementById("yeastActivity");
        if (!root) return;

        yeastDragDropActivity = getActivity("yeastActivity");
Object.assign(yeastDragDropActivity.options, {
          onChange: updateYeastActivityComplete
});
      }

      function yeastLabelsComplete() {
        return Boolean(yeastDragDropActivity) &&
          yeastDragDropActivity.isComplete() &&
          yeastDragDropActivity.isCorrect();
      }

      function updateYeastActivityComplete() {
        const section = document.getElementById("yeast-labels");

        if (yeastLabelsComplete()) {
          section.classList.add("labels-complete");

          section.querySelector(".yeast-results-step--initial").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        } else {
          section.classList.remove("labels-complete");
        }

        checkYeastActivityComplete();
      }

      /* ==================================================
       YEAST TABLE - NUMBER ENTRIES
       Each results cell is an InputResponseActivity group
       (type="number"); its data-answer holds the correct value.
       ================================================== */

      let yeastResultsActivity = null;

      function initialiseNumberEntries() {
        const root = document.getElementById("yeastResultsActivity");
        if (!root) return;

        yeastResultsActivity = getActivity("yeastResultsActivity");
Object.assign(yeastResultsActivity.options, {
          onChange: function () {
            resetStaleAverages(root);
            checkYeastActivityComplete();
          }
});
      }

      function checkYeastActivityComplete() {
        const feedback = document.getElementById("yeastLabelFeedback");

        if (!yeastResultsActivity) return;

        const numberAnswers = Object.values(yeastResultsActivity.getAnswers());

        const allNumbersComplete =
          numberAnswers.length > 0 &&
          numberAnswers.every(function (answers) {
            return answers.length > 0;
          });

        /* Not all measurements have been entered yet */
        if (!allNumbersComplete) {
          feedback.hidden = true;
          feedback.innerHTML = "";
          return;
        }

        /* All measurements entered, but one or more are wrong */
        if (!yeastResultsActivity.isCorrect()) {
          feedback.hidden = false;
          feedback.className = "activity-feedback table-activity-feedback feedback-try-again";
          feedback.innerHTML =
            "<strong>Check your measurements.</strong>" +
            "<span>Make sure all your answers are correct before moving on.</span>";
          return;
        }

        /* Everything is correct */
        if (yeastLabelsComplete()) {
          feedback.hidden = false;
          feedback.className = "activity-feedback table-activity-feedback feedback-success";
          feedback.innerHTML =
            "<strong>Results recorded!</strong>" +
            "<span>All of your measurements are correct.</span>";

          document.getElementById("labelsCompleteAfterContainer").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }
      }

      /* ==================================================
       YEAST TABLE - AVERAGES
       The Calculate buttons are revealed by #yeastLabelsStopAndCheck
       (data-reveals). The prediction panel is shown once none are left.
       ================================================== */

      function formatAverage(value) {
        return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
      }

      /* The numbers in one data row, in order; NaN where a cell is empty. */
      function getRowNumbers(row) {
        return Array.from(row.querySelectorAll("[data-tr-group]")).map(function (group) {
          const answer = group.querySelector("[data-tr-list]").firstElementChild;
          const text = answer ? getAnswerText(answer) : "";
          return text === "" ? NaN : Number(text);
        });
      }

      /* A fresh Calculate button; hidden until the averages have been revealed. */
      function createCalculateButton() {
        const button = document.createElement("button");

        button.type = "button";
        button.classList.add("average-button", "general-button");
        button.textContent = "Calculate";
        button.hidden = document.getElementById("repeat-tests-average-intro").hidden;
        button.addEventListener("click", function () {
          calculateInputAverage(button);
        });

        return button;
      }

      /* The prediction panel is only shown once every average has been calculated. */
      function syncYeastPrediction(scrollIntoView) {
        const predictionCheck = document.getElementById("yeastPredictionCheck");
        const allCalculated =
          document.querySelectorAll("#yeast-labels .average-button").length === 0;

        predictionCheck.hidden = !allCalculated;

        if (allCalculated && scrollIntoView) {
          predictionCheck.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }

      /* A calculated average goes back to a Calculate button once any of its row's numbers is cleared. */
      function resetStaleAverages(root) {
        root.querySelectorAll("[data-input-average-row]").forEach(function (row) {
          const cell = row.querySelector(".average-cell");

          if (!cell || !cell.classList.contains("average-result")) return;
          if (!getRowNumbers(row).some(Number.isNaN)) return;

          cell.classList.remove("average-result");
          cell.innerHTML = "";
          cell.appendChild(createCalculateButton());
        });

        syncYeastPrediction(false);
      }

      function showAverageValue(button, average) {
        const cell = button.closest(".average-cell");

        if (!cell) return;

        cell.innerHTML = "";
        cell.classList.add("average-result");

        const resultWrapper = document.createElement("div");
        resultWrapper.className = "average-result-wrapper";

        const resultText = document.createElement("span");
        resultText.className = "average-result-value";
        resultText.textContent = formatAverage(average);

        const clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.className = "average-clear-button";
        clearButton.textContent = "×";
        clearButton.setAttribute("aria-label", "Clear calculated average");

        clearButton.addEventListener("click", function () {
          cell.classList.remove("average-result");
          cell.innerHTML = "";
          cell.appendChild(createCalculateButton());
          syncYeastPrediction(false);
        });

        resultWrapper.appendChild(resultText);
        resultWrapper.appendChild(clearButton);

        cell.appendChild(resultWrapper);
      }

      function calculateInputAverage(button) {
        const row = button.closest("[data-input-average-row]");
        const feedback = row.closest(".section").querySelector(".table-activity-feedback");
        const values = getRowNumbers(row);

        if (values.some(Number.isNaN)) {
          feedback.hidden = false;
          feedback.className = "activity-feedback table-activity-feedback feedback-try-again";
          feedback.innerHTML =
            "<strong>Add all three results first.</strong><span>The average can be calculated once each test has a number.</span>";
          return;
        }

        if (feedback.classList.contains("feedback-try-again")) {
          feedback.hidden = true;
        }

        const average =
          values.reduce(function (total, value) {
            return total + value;
          }, 0) / values.length;

        showAverageValue(button, average);
        syncYeastPrediction(true);
      }

      /* ==================================================
       YEAST TABLE - INTERPRET THE RESULTS
       #yeastPredictionCheck is a MultipleChoiceActivity. The final
       question appears once the first two are right; the stop-and-think
       after it appears when the whole activity is complete
       (data-activity-depends-on).
       ================================================== */

      let yeastPredictionActivity = null;

      function initialiseYeastPrediction() {
        const root = document.getElementById("yeastPredictionCheck");
        if (!root) return;

        yeastPredictionActivity = getActivity("yeastPredictionCheck");

        const questions = Array.from(root.querySelectorAll("[data-mc-question]"));
        const finalQuestion = questions.pop();

        root.addEventListener("activity:change", function () {
          finalQuestion.hidden = !questions.every(function (question) {
            return question.dataset.mcCorrect === "true";
          });
        });
      }

      const dev = false;
      if (dev) window.addEventListener("DOMContentLoaded", teacherShowAll);

      const sectionIds = [
        { id: "yeast-image-investigation", label: "Is Yeast Alive?" },
        { id: "yeast-variables", label: "Yeast Variables: Select the variables" },
        { id: "data-table-template", label: "Data Table Template" },
        { id: "yeast-labels", label: "Yeast experiment: add the labels" }
      ];

      const teacherBackLink = {
        label: "← To Part B",
        href: "/lesson3-2"
      };


      document.addEventListener("DOMContentLoaded", function () {
        if (typeof initialiseTeacherMenu === "function") {
          initialiseTeacherMenu(sectionIds, teacherBackLink);
        }

        initialiseDragAndDrop();
        initialiseNumberEntries();
        initialiseYeastPrediction();
        initialiseYeastVariables();

        initSectionActivitiesIn(document);
      });

      /* Called from inline handlers / shared scripts, which cannot see module scope. */
      Object.assign(window, { calculateInputAverage, openYeastRecordVideo });` },
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
  document.title = "Lesson 3 Part A - Using a Table to Record Data for a Fair Test"
  for (const def of scripts) await loadScript(def)
  // the original scripts wait for DOMContentLoaded, which has already fired
  document.dispatchEvent(new Event('DOMContentLoaded'))
  window.dispatchEvent(new Event('DOMContentLoaded'))
})
</script>
