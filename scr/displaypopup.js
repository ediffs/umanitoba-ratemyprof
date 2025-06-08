// content script that displays the popup when the mouse is hovered over a professor name 

// tracks if displayStats() is currently running
let running = false;

// start the timer and call refresh display
const profInterval = setInterval(() => {
    refreshDisplay();
}, 1500);

// method that decides when to call displayStats()
async function refreshDisplay(){
    const searchResults = document.querySelector('[id="search-again"]');
    if(searchResults.style.length == 1 && !running) {
        displayStats();
        running = true;
    }
    // let the method run again
    if(searchResults.style.length == 0){
        running = false;
    }
}

// get and show ratemyprof stats for each page
async function displayStats() {

    // get all the instructor nodes
    const hoverElements = document.querySelectorAll('[data-property="instructor"]');

    if(hoverElements.length > 1){

        // listeners to display popup
        for(let i = 1; i < hoverElements.length; i++){

            hoverElements[i].addEventListener('mouseenter',
                () => {
  
                    let hover = document.querySelectorAll( ":hover" );

                    let professorLink = hover[hover.length - 1];
                        
                    // make sure we grabbed the email
                    if(professorLink.childNodes.length > 1){
                        professorLink = hover[hover.length - 1].firstChild;
                    }

                    let professorName = professorLink.innerText;

                    // event listening

                    if(professorName != "" && professorName != null) { 

                        let port = browser.runtime.connect({ name: 'professor-rating' });
                        port.postMessage({ professorName });   

                        port.onMessage.addListener((professor) => {

                            if(professor.length != 0){
                                
                                // insert the professor's stats, create new elements

                                let rmpLink = document.createElement("a");
                                rmpLink.className = 'rating'
                                rmpLink.target = "_blank";
                                rmpLink.rel = "noopener noreferrer";
                                rmpLink.href = `https://www.ratemyprofessors.com/professor?tid=${professor.legacyId}`;
                                rmpLink.innerText = `${professor.numRatings} ratings`;
                                professorLink.insertAdjacentElement('afterend', rmpLink);

                                
                                let avgRating = document.createElement("div");
                                avgRating.className = 'rating';
                                avgRating.innerText = ` ${professor.avgRating} / 5`;
                                professorLink.insertAdjacentElement('afterend', avgRating);
                                let ratingText = document.createElement("b");
                                ratingText.innerText = `Rating:`;
                                avgRating.insertAdjacentElement('afterbegin', ratingText);

                                let avgDifficulty = document.createElement("div");
                                avgDifficulty.className = 'rating'
                                avgDifficulty.innerText = ` ${professor.avgDifficulty} / 5`;
                                professorLink.insertAdjacentElement('afterend', avgDifficulty);
                                let difficultyText = document.createElement("b");
                                difficultyText.innerText = `Difficulty:`;
                                avgDifficulty.insertAdjacentElement('afterbegin', difficultyText);

                                if (professor.wouldTakeAgainPercent != -1){
                                    let wouldTakeAgainPercent = document.createElement("div");
                                    wouldTakeAgainPercent.className = 'rating';
                                    wouldTakeAgainPercent.innerText = ` would take again.`;
                                    professorLink.insertAdjacentElement('afterend', wouldTakeAgainPercent);
                                    let takeAgainText = document.createElement("b");
                                    takeAgainText.innerText = `${Math.round(Number(professor.wouldTakeAgainPercent))}%`;
                                    wouldTakeAgainPercent.insertAdjacentElement('afterbegin', takeAgainText);
                                }   

                            } else {
                                let noRatings = document.createElement("div");
                                noRatings.className = 'rating';
                                professorLink.insertAdjacentElement('afterend', noRatings);
                                let ratingText = document.createElement("b");
                                ratingText.innerText = `No ratings found.`;
                                noRatings.insertAdjacentElement('afterbegin', ratingText);
                            } 
                            
                        });
                    }

                });

            hoverElements[i].addEventListener('mouseleave',
                () => {

                    // wait, then delete all added html
                    sleep(200).then(() => {
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
