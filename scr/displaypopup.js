// content script that displays the popup when the mouse is hovered over a professor name 

console.log('run displaypopup');

// create the popup
const popup = document.createElement("popup");
popup.setAttribute("id", "instructor-attributes");
let popupContent = document.createTextNode("Instructor: " + INST_NAME + "\nScore: " + INST_SCORE + " / 5.0\n");
popup.appendChild(popupContent);

// listeners to display popup
hoverElement.addEventListener('mouseenter',
    () => {
        popup.style.display = 'block';
    });

hoverElement.addEventListener('mouseleave',
    () => {
        popup.style.display = 'none';
    });

// call displayStats() when registration is loaded
displayStats();

// call the function when the URL hash changes
window.addEventListener('hashchange', displayStats, false);

// get the stats for each page
async function displayStats() {

    	const profInterval = setInterval(() => {

            // the container of courses
            let courseContainer = document.querySelector(".grid tbody");

            if(courseContainer != null){

            let courses = courseContainer.querySelectorAll("tr"); 

            if(courses != null){

                    // reset the interval
                    clearInterval(profInterval);

                    // consider a different loop structure
                    for (let i = 0; i < courses.length; i++){

                        // initialize list of all professors
                        let professors = [];

                        let td = courses[i].querySelectorAll("td");

                        // TODO: APPEND POPUP

                        let professorName = td[7].innerText.replace(" (Primary)\n", "", );

                        // event listening
                        let port = browser.runtime.connect({ name: 'professor-rating' });
                        port.postMessage({ professorName });
                        port.onMessage.addListener((professor) => {

                            console.log('Received response for professor:', professor);

                            // add to the professors array
                            if (professor.length != 0) {
                                professors = professors.concat({name: professorName, score: professor.avgRating, ratings: professor.numRatings, difficulty: professor.avgDifficulty, takeAgain: professor.wouldTakeAgainPercent, id: professor.professor});
                            } else {
                                professors = professors.concat({name: professorName, score: "No score found"})
                            }
                        })
                    }
                console.log(professors);
            }
        }

    }, 2000);
}
