// content script that displays the popup when the mouse is hovered over a professor name 

// call displayStats() when registration is loaded
displayStats();

// call the function when the URL hash changes
window.addEventListener('hashchange', displayStats, false);

// get and show ratemyprof stats for each page
async function displayStats() {

    const profInterval = setInterval(() => {

        // get all the emails
        const hoverElements = document.querySelectorAll('[class="email"]');

        // // create the popup
        const popup = document.createElement("popup");
        let popupContent = document.createTextNode("Instructor: PROF_NAME\nScore: PROF_SCORE / 5.0\nRatings: PROF_RATINGS\nDifficulty: PROF_DIFFICULTY\nWould Take Again: PROF_WTA%\n");                
        popup.appendChild(popupContent);

        let currProfessor = null;

        if(hoverElements != null){
            // listeners to display popup
            for(let i = 0; i < hoverElements.length; i++){
                hoverElements[i].addEventListener('mouseenter',
                    () => {
                        let hover = document.querySelectorAll( ":hover" );
                        currProfessor = hover[hover.length - 1];
                        popup.style.display = 'block';
                    });

                hoverElements[i].addEventListener('mouseleave',
                    () => {
                        currProfessor = null;
                        popup.style.display = 'none';
                    });
            }
        }

        // the NodeList of courses
        let courses = document.querySelector(".grid tbody").childNodes;

        if(courses != null){

            // reset the interval
            clearInterval(profInterval);

            // initialize list of all professors
            let professors = [];

            // this loop should IDEALLY run whenever page is changed / refreshed
            for (let i = 0; i < courses.length; i++){

                let professorName = courses[i].childNodes[7].innerText.replace(" (Primary)\n", "", );

                // TODO: APPEND POPUP

                // event listening
                let port = browser.runtime.connect({ name: 'professor-rating' });
                port.postMessage({ professorName });
                port.onMessage.addListener((professor) => {

                    // add to the professors array
                    if (professor.length != 0) {
                        professors = professors.concat({name: professorName, score: professor.avgRating, ratings: professor.numRatings, difficulty: professor.avgDifficulty, takeAgain: professor.wouldTakeAgainPercent, id: professor.professor});
                    } else {
                        professors = professors.concat({name: professorName, score: "n/a", ratings: "n/a", difficulty: "n/a", takeAgain: "n/a", id: "could not find professor"});
                    }

                    console.log(professors);
                });
            }
        }

    }, 2000);
}
