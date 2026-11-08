/* ==================================================
   COMMON FUNCTIONS

   Shared by every lesson page. Anything used by only
   one page belongs in that page's own script:
     scripts/pretask_scripts/
     scripts/lesson1_scripts/
     scripts/lesson2_scripts/

   Contents:
     (section unlocking lives in components/Section.vue)
     (the classroom language filter lives in src/composables/useClassroomLanguageFilter.js)
     - Number input controls
     - Stop and check
     (glossary, video, pdf, image and teacher modals live in components/Modal.vue)
     - Save lesson as PDF
     - Student answer helpers
   ================================================== */

function setGeneratedText(element, text, placeholder) {
  if (text === "") {
    element.textContent = placeholder;
    element.classList.add("placeholder");
    return;
  }
  element.textContent = text;
  element.classList.remove("placeholder");
}

/* ==================================================
   NUMBER INPUT CONTROLS
   Prevent scroll changes and negative values.
   ================================================== */

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".table-number-input").forEach(function(input) {
    input.min = "0";

    input.addEventListener("wheel", function() {
      input.blur();
    });

    input.addEventListener("keydown", function(event) {
      if (
        event.key === "-" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
      }
    });

    input.addEventListener("input", function() {
      if (input.value !== "" && Number(input.value) < 0) {
        input.value = 0;
      }
    });
  });
});

/* ==================================================
STOP AND CHECK FUNCTIONS
   ================================================== */

function showStopAndCheckAnswer(button, additionalFunction = function() {}) {
  const stopAndCheck = button.closest(".stop-and-check");
  const answer = stopAndCheck.querySelector(".stop-and-check-answer");
  const section = button.closest(".section");
  const nextButton = section.querySelector(".next-button");

  answer.hidden = false;
  button.hidden = true;
  // nextButton.hidden = false;
  additionalFunction();
}

function resetStopAndCheck(stopAndCheck, additionalFunction = function() {}) {
  stopAndCheck.querySelector(".stop-and-check-answer").hidden = true;
  const button = stopAndCheck.querySelector(".stop-and-check-button");
  button.hidden = false;
  button.onclick = function() { showStopAndCheckAnswer(button, additionalFunction); }

  button.innerHTML = "";
  const content = document.createElement("p");
  content.innerHTML = "Check Your Answer";
  const bounceSymbol = document.createElement("p");
  bounceSymbol.innerHTML = "✅";

  bounceSymbol.classList.add("bounce-symbol");
  button.appendChild(content);
  button.appendChild(bounceSymbol);
  
  stopAndCheck.hidden = true;
}

/* ==================================================
   SHARED SAVE-AS-PDF FUNCTION
   ================================================== */

    /* ---------- Download completed lesson as PDF ---------- */

let sectionsLockedBeforePrint = [];

/*
  Put back any sections that were opened up just for
  printing.

  Safe to call at any time: it does nothing unless a
  print actually unlocked something.
*/
function restoreSectionsAfterPrint() {
  if (sectionsLockedBeforePrint.length === 0) {
    document.body.classList.remove('printing-lesson');
    return;
  }

  sectionsLockedBeforePrint.forEach(section => {
    section.classList.add('locked');
  });

  sectionsLockedBeforePrint = [];

  document.body.classList.remove('printing-lesson');
}


function downloadLessonPDF() {
  /*
    If a previous print never told us it had finished,
    tidy up before starting another one.
  */
  restoreSectionsAfterPrint();

  /*
    Make sure the most recent student answers are saved
    before opening the print window.
  */
  if (typeof saveCurrentPageData === "function") {
    saveCurrentPageData();
  }

  /*
    Remember which sections were still locked so that
    they can be restored after printing.
  */
  sectionsLockedBeforePrint = Array.from(
    document.querySelectorAll('.section.locked')
  );

  /*
    Temporarily show the entire lesson in the PDF.
  */
  sectionsLockedBeforePrint.forEach(section => {
    section.classList.remove('locked');
  });

  document.body.classList.add('printing-lesson');

  /*
    Give the browser a moment to redraw the newly
    revealed sections before opening Print.
  */
  setTimeout(function() {
    window.print();
  }, 300);
}

/*
  Restore the page to exactly how it looked before the
  student downloaded it.

  Two signals are used because "afterprint" does not
  arrive in every browser when the print dialog is
  cancelled - and a missed signal would leave the whole
  lesson unlocked.
*/
window.addEventListener('afterprint', restoreSectionsAfterPrint);

const lessonPrintMedia =
  typeof window.matchMedia === "function"
    ? window.matchMedia('print')
    : null;

if (lessonPrintMedia) {
  const handlePrintMediaChange = function (event) {
    if (!event.matches) {
      restoreSectionsAfterPrint();
    }
  };

  if (typeof lessonPrintMedia.addEventListener === "function") {
    lessonPrintMedia.addEventListener('change', handlePrintMediaChange);
  } else if (typeof lessonPrintMedia.addListener === "function") {
    /* Older browsers. */
    lessonPrintMedia.addListener(handlePrintMediaChange);
  }
}

function connectEnterAndBlurSave(input, saveFunction) {
  let isSubmitting = false;

  function saveInput() {
    if (
      isSubmitting ||
      !input.isConnected ||
      input.value.trim() === ""
    ) {
      return;
    }

    isSubmitting = true;
    saveFunction();

    if (input.isConnected) {
      isSubmitting = false;
    }
  }

  input.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    saveInput();
  });

  input.addEventListener("blur", saveInput);
}

/* ==================================================
   SHARED STUDENT-ANSWER HELPERS
   ================================================== */

/*
  Read and validate a student's text input.

  Returns:
  - the cleaned text when valid;
  - null when empty or blocked.
*/


/*
  Read the visible text from an answer that may also
  contain a delete button (see createDeleteAnswerButton).
*/
function getAnswerText(element) {
  if (!element) {
    return '';
  }

  const clone = element.cloneNode(true);

  clone.querySelectorAll('button').forEach(button => {
    button.remove();
  });

  return clone.textContent.trim();
}

/*
  Create the standard orange × button used beside
  submitted student answers.
*/
function createDeleteAnswerButton(
  ariaLabel,
  deleteFunction
) {
  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";
  deleteButton.className = "delete-answer";
  deleteButton.textContent = "×";

  deleteButton.setAttribute(
    "aria-label",
    ariaLabel
  );

  deleteButton.addEventListener(
    "click",
    deleteFunction
  );

  return deleteButton;
}

/*
  Apply a standard success or try-again message
  to an activity feedback box.
*/
function setActivityFeedback(
  feedbackElement,
  feedbackType,
  title,
  message
) {
  if (!feedbackElement) {
    return;
  }

  feedbackElement.className =
    "variable-feedback";

  if (feedbackType === "success") {
    feedbackElement.classList.add(
      "feedback-success"
    );
  }

  if (feedbackType === "try-again") {
    feedbackElement.classList.add(
      "feedback-try-again"
    );
  }

  feedbackElement.innerHTML = "";

  const titleElement =
    document.createElement("strong");

  titleElement.className =
    "ball-pair-feedback-title";

  titleElement.textContent = title;

  const messageElement =
    document.createElement("span");

  messageElement.className =
    "ball-pair-feedback-text";

  messageElement.innerHTML = message;

  feedbackElement.appendChild(
    titleElement
  );

  feedbackElement.appendChild(
    messageElement
  );
}


/* Tell the activity components (components/activities) that the helpers above exist. */
window.__commonFunctionsLoaded = true;
document.dispatchEvent(new Event("common-functions-ready"));
