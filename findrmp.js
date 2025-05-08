// the container of courses
let courseContainer = document.querySelector(".grid tbody");
console.log(courseContainer);
if(courseContainer != null){
// all the courses in the container
    let courses = courseContainer.querySelectorAll("tr"); 
    
    console.log(courses);
    if(courses != null){
        // get professor names for each course
        let professors = [];
        for(let i = 0; i < courses.length; i++){
            let attributes = courses[i].querySelectorAll("td");
            let instructorPos = 7; // position where instructor info is stored in attributes
            // initialize list of all professors
            let profName = attributes[instructorPos].innerText.replace(" (Primary)\n", "", );
            professors = professors.concat({name: profName, score: findScore(profName)}); 
        }
        console.log(professors);
    }
}

// find the score on RMP given a professor name
async function findScore(professorName) {
    try{
        const response = await fetch(`https://www.ratemyprofessors.com/search/professors/1438?q=${encodeURIComponent(professorName)}`);

        // extract relevant data from the page
        const page = await response.json();
        const professorCard = page.querySelector("CardNumRating__CardNumRatingNumber-sc-17t4b9u-2 ERCLc").innerHTML;
        console.log(professorCard.textContent);
        return professorCard ? professorCard.textContent : "No score found.";
    }
    catch(error){
        console.error(error);
    }
}

  // display the appropriate popup with the professor's score if mouse is hovered on the professor's name
  async function displayPopup(professors) {
        let popup = document.createElement("div");
        popup.className = "popup";
        let professor = search();
        popup.innerHTML = `Professor: ${professor.name}<br>Score: ${professor.score}`;
        popup.style.position = "absolute";
        popup.style.backgroundColor = "white";
        popup.style.border = "1px solid black";
        popup.style.padding = "10px";
        popup.style.zIndex = 1000;
        document.body.appendChild(popup);

        professors.addEventListener("mouseover", (event) => {
            popup.style.display = "block";
            popup.style.left = `${event.pageX}px`;
            popup.style.top = `${event.pageY}px`;
        });

        professors.addEventListener("mouseout", () => {
            popup.style.display = "none";
        });
}



