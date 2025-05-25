// content script that displays the popup when the mouse is hovered over a professor name 

// display the appropriate popup with the professor's score if mouse is hovered on the professor's name
function displayPopup(professors) {
    // sample code below (from https://www.geeksforgeeks.org/how-to-open-a-popup-on-hover-using-javascript/)
    const elementToHover = document.getElementById('elementToHover');
    
    const elementToPopup = document.getElementById('elementToPopup');

    elementToHover.addEventListener('mouseenter',
        () => {
            elementToPopup.style.display = 'block';
        });

    elementToHover.addEventListener('mouseleave',
        () => {
            elementToPopup.style.display = 'none';
        });
}

// get the stats for each page (test function)
async function locateProfessor() {
    // the container of courses
    let courseContainer = document.querySelector(".grid tbody");

    if(courseContainer != null){

    let courses = courseContainer.querySelectorAll("tr"); 

    if(courses != null){

        // get professor names for each course on the page
        let professors = [];

        for(let i = 0; i < courses.length; i++){

            let td = courses[i].querySelectorAll("td");
            let instructorPos = 7; // position where instructor info is stored in attributes
            // initialize list of all professors
            let professorName = td[instructorPos].innerText.replace(" (Primary)\n", "", );
            let professorStats = getProfessorStats(professorName);
            if (professorStats.length != 0) {
            professors = professors.concat({name: professorName, score: professorStats.avgRating});
            } else {
                professors = professors.concat({name: professorName, score: "No score found"})
            }
          }
          console.log(professors);
        }
    }
}

// main code
locateProfessor();