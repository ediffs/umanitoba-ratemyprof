// content script that displays the popup when the mouse is hovered over a professor name 

// call displayStats() when registration is loaded
displayStats();

// call the function when the URL hash changes (THIS DON'T WORK)
window.addEventListener('hashchange', displayStats, false);

// get and show ratemyprof stats for each page
async function displayStats() {

    const profInterval = setInterval(() => {
        
        // get all the instructor nodes
        const hoverElements = document.querySelectorAll('[data-property="instructor"]');

        if(hoverElements.length > 1){

            // reset the interval
            clearInterval(profInterval);

            // listeners to display popup
            for(let i = 0; i < hoverElements.length; i++){

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
                                professorLink.insertAdjacentHTML('afterend', `<div class="rating"><b>Rating:</b> ${professor.avgRating} / 5 </div>`);
                                professorLink.insertAdjacentHTML('afterend', `<div class="rating"><b>Difficulty:</b> ${professor.avgDifficulty} / 5 </div>`);
                                if (professor.wouldTakeAgainPercent != -1){
                                    professorLink.insertAdjacentHTML('afterend', `<div class="rating"><b>${Math.round(Number(professor.wouldTakeAgainPercent))}%</b> would take again.</div>`);
                                } 
                                // PROF LINK DON'T WORK  
                                const profLink = `<a target="_blank" rel="noopener noreferrer" href='https://www.ratemyprofessors.com/professor?tid=${1438}'>${professor.numRatings} ratings</a>`;
                                professorLink.insertAdjacentHTML('afterend', `<div class="rating">${profLink}</div>`);

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
    }, 2000);
}
