// content script that displays the popup when the mouse is hovered over a professor name

// start the timer and call refresh display
const profInterval = setInterval(() => {
    refreshDisplay();
}, 1000);

// method that decides when to call displayStats()
async function refreshDisplay() {
  const searchResults = document.querySelector('.results-out-of');

  if (searchResults != null && searchResults.textContent.includes("Class")) {
    displayStats();
  }
}

// get and show ratemyprof stats for each page
async function displayStats() {
  // get card
  const select = document.querySelectorAll('[class="profileCard arrow default"]');
  if (select.length <= 0) return;
  const card = select[0];
  const info = card.querySelectorAll('[class="info"]')[0].firstChild;

  // remove professor stats if card is hidden
  let style = card.style.display;
  if (style == "none") {
    let professorStats = document.querySelectorAll('[class="rating"]');
    for (let j = 0; j < professorStats.length; j++) {
      professorStats[j].remove();
    }
    return;
  }

  let professorName = card.querySelectorAll('[class="facultyName"]')[0].textContent;
  if (professorName == "" || professorName == null) return;

  // event listening
  let port = browser.runtime.connect({ name: 'professor-rating' });
  port.postMessage({ professorName });
  port.onMessage.addListener((professor) => {
    if (professor.length != 0) {

      // insert the professor's stats, create new elements
      if (card.querySelector("[id=rmp-link]") == null) {
        let itemOne = document.createElement("li");
        let rmpLink = document.createElement("a");
        rmpLink.id = "rmp-link";
        rmpLink.className = 'rating';
        rmpLink.target = "_blank";
        rmpLink.rel = "noopener noreferrer";
        rmpLink.href = `https://www.ratemyprofessors.com/professor?tid=${professor.legacyId}`;
        rmpLink.innerText = `${professor.numRatings} ratings`;
        itemOne.appendChild(rmpLink);
        info.appendChild(itemOne);
      }

      // insert the professor's stats, create new elements
      if (card.querySelector("[id=avg-rating]") == null) {
        let avgRating = document.createElement("li");
        avgRating.id = "avg-rating";
        avgRating.className = 'rating';
        avgRating.innerText = ` ${professor.avgRating} / 5`;
        info.appendChild(avgRating);

        let ratingText = document.createElement("b");
        ratingText.innerText = `Rating:`;
        avgRating.insertAdjacentElement('afterbegin', ratingText);
      }

      // insert the professor's stats, create new elements
      if (card.querySelector("[id=avg-difficulty]") == null) {
        let avgDifficulty = document.createElement("li");
        avgDifficulty.className = 'rating'
        avgDifficulty.id = "avg-difficulty";
        avgDifficulty.innerText = ` ${professor.avgDifficulty} / 5`;
        info.appendChild(avgDifficulty);

        let difficultyText = document.createElement("b");
        difficultyText.innerText = `Difficulty:`;
        avgDifficulty.insertAdjacentElement('afterbegin', difficultyText);
      }

      // insert the professor's stats, create new elements
      if (card.querySelector("[id=would-take-again]") == null) {
        let wouldTakeAgainPercent = document.createElement("li");
        wouldTakeAgainPercent.id = "would-take-again";
        wouldTakeAgainPercent.className = 'rating';
        wouldTakeAgainPercent.innerText = ` would take again.`;
        info.appendChild(wouldTakeAgainPercent);

        let takeAgainText = document.createElement("b");
        takeAgainText.innerText = `${Math.round(Number(professor.wouldTakeAgainPercent))}%`;
        wouldTakeAgainPercent.insertAdjacentElement('afterbegin', takeAgainText);
      }
    } else {
      if (card.querySelector("[id=no-ratings]") == null) {
        let noRatings = document.createElement("li");
        noRatings.id = "no-ratings";
        noRatings.className = 'rating';
        info.appendChild(noRatings);

        let ratingText = document.createElement("b");
        ratingText.innerText = `No ratings found.`;
        noRatings.insertAdjacentElement('afterbegin', ratingText);
      }
    }
  });
}
