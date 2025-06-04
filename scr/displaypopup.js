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

                    console.log("sending request to ratemyprofessors...");

                    let port = browser.runtime.connect({ name: 'professor-rating' });
                    port.postMessage({ professorName });   

                    port.onMessage.addListener((professor) => {

                        if(professor.length != 0){

                            // insert the professor's stats
                            const rmpLink = `<a target="_blank" rel="noopener noreferrer" href='https://www.ratemyprofessors.com/professor?tid=${professor.legacyId}'>${professor.numRatings} ratings</a>`;
                            professorLink.insertAdjacentHTML('afterend', `<div class="rating">${rmpLink}</div>`);
                            professorLink.insertAdjacentHTML('afterend', `<div class="rating"><b>Rating:</b> ${professor.avgRating} / 5 </div>`);
                            professorLink.insertAdjacentHTML('afterend', `<div class="rating"><b>Difficulty:</b> ${professor.avgDifficulty} / 5 </div>`);
                            if (professor.wouldTakeAgainPercent != -1){
                                professorLink.insertAdjacentHTML('afterend', `<div class="rating"><b>${Math.round(Number(professor.wouldTakeAgainPercent))}%</b> would take again.</div>`);
                            }   

                        } else {
                            professorLink.insertAdjacentHTML('afterend', `<div class="rating"><b>No ratings found.</b></div>`);
                        } 
                        
                        console.log("professor information retrieved!");

                    });
                });

            hoverElements[i].addEventListener('mouseleave',
                () => {

                    // wait 0.1 seconds, then delete all added html
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
