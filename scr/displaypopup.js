// content script that displays the popup when the mouse is hovered over a professor name 

let profInterval;
// if displayStats() is currently running
let running = false;

// start the timer and call refresh display
profInterval = setInterval(() => {
    console.log(running);
    refreshDisplay();
}, 1000);

// method that decides when to call displayStats()
async function refreshDisplay(){
    const searchResults = document.querySelector('[id="search-again"]');
    if(searchResults.style.length == 1 && !running){
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

                    });
                });

            hoverElements[i].addEventListener('mouseleave',
                () => {

                    // delete all adjacent html when mouse moves off the node
                    let professorStats = document.querySelectorAll('[class="rating"]');
                    for(let j = 0; j < professorStats.length; j++){
                        professorStats[j].remove();
                    }

                });
        }
    }
}
