// content script that displays the popup when the mouse is hovered over a professor name

// start the timer and call refresh display
const profInterval = setInterval(() => {
    refreshDisplay();
}, 1500);

// method that decides when to call displayStats()
async function refreshDisplay() {
  const searchResults = document.querySelector('.results-out-of');

  if (searchResults != null && searchResults.textContent.includes("Class")) {
    displayStats();
  }
}

// get and show ratemyprof stats for each page
async function displayStats() {
    // get all the instructor nodes
    const hoverElements = document.querySelectorAll('[data-property="instructor"]');

    if (hoverElements.length > 1) {

        // listeners to display popup
        for(let i = 1; i < hoverElements.length; i++){

            hoverElements[i].addEventListener('mouseenter',
                () => {

                    let hover = document.querySelectorAll( ":hover" );
                    let professorLink = hover[hover.length - 1];

                    // get all emails
                    //  professorLink.querySelector("[class=email]");

                    if(professorLink.childNodes.length > 1){
                        professorLink = hover[hover.length - 1].firstChild;
                    }

                    let professorName = professorLink.innerText;

                    // event listening
                  if (professorName != "" && professorName != null) {

                        let port = browser.runtime.connect({ name: 'professor-rating' });
                        port.postMessage({ professorName });
                      port.onMessage.addListener((professor) => {

                        if (professor.length != 0) {

                              // insert the professor's stats, create new elements
                              if (document.querySelector("[id=rmp-link]") == null) {
                                let rmpLink = document.createElement("a");
                                rmpLink.id = "rmp-link";
                                rmpLink.className = 'rating'
                                rmpLink.target = "_blank";
                                rmpLink.rel = "noopener noreferrer";
                                rmpLink.href = `https://www.ratemyprofessors.com/professor?tid=${professor.legacyId}`;
                                rmpLink.innerText = `${professor.numRatings} ratings`;
                                professorLink.insertAdjacentElement('afterend', rmpLink);
                              }

                              if (document.querySelector("[id=avg-rating]") == null) {
                                let avgRating = document.createElement("div");
                                avgRating.id = "avg-rating";
                                avgRating.className = 'rating';
                                avgRating.innerText = ` ${professor.avgRating} / 5`;
                                professorLink.insertAdjacentElement('afterend', avgRating);

                                let ratingText = document.createElement("b");
                                ratingText.innerText = `Rating:`;
                                avgRating.insertAdjacentElement('afterbegin', ratingText);
                              }

                              if (document.querySelector("[id=avg-difficulty]") == null) {
                                let avgDifficulty = document.createElement("div");
                                avgDifficulty.className = 'rating'
                                avgDifficulty.id = "avg-difficulty";
                                avgDifficulty.innerText = ` ${professor.avgDifficulty} / 5`;
                                professorLink.insertAdjacentElement('afterend', avgDifficulty);

                                let difficultyText = document.createElement("b");
                                difficultyText.innerText = `Difficulty:`;
                                avgDifficulty.insertAdjacentElement('afterbegin', difficultyText);
                              }

                              if (professor.wouldTakeAgainPercent != -1 && document.querySelector("[id=would-take-again]") == null){
                                let wouldTakeAgainPercent = document.createElement("div");
                                wouldTakeAgainPercent.id = "would-take-again";
                                wouldTakeAgainPercent.className = 'rating';
                                wouldTakeAgainPercent.innerText = ` would take again.`;
                                professorLink.insertAdjacentElement('afterend', wouldTakeAgainPercent);

                                let takeAgainText = document.createElement("b");
                                takeAgainText.innerText = `${Math.round(Number(professor.wouldTakeAgainPercent))}%`;
                                wouldTakeAgainPercent.insertAdjacentElement('afterbegin', takeAgainText);
                              }

                            } else {
                                if (document.querySelector("[id=no-ratings]") == null) {
                                  let noRatings = document.createElement("div");
                                  noRatings.id = "no-ratings";
                                  noRatings.className = 'rating';
                                  professorLink.insertAdjacentElement('afterend', noRatings);

                                  let ratingText = document.createElement("b");
                                  ratingText.innerText = `No ratings found.`;
                                  noRatings.insertAdjacentElement('afterbegin', ratingText);
                                }
                            }
                        });
                    }

                });

            hoverElements[i].addEventListener('mouseleave',
                () => {

                    // wait, then delete all added html
                    sleep(100).then(() => {
                        let professorStats = document.querySelectorAll('[class="rating"]');
                        for(let j = 0; j < professorStats.length; j++){
                            professorStats[j].remove();
                        }
                    });

                });
        }
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
