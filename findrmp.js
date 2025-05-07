// Finds and displays the RateMyProf score of professors when their names are hovered over on the UManitoba website.
// Created by Edith Hohner, version 0.2.

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
            professors = professors.concat(attributes[instructorPos].innerText.replace(" (Primary)\n", "")); 
        }
        console.log(professors);
        // if(professors != null){
        //     await displayPopup(professors);
        // }
    }
}

  // display the appropriate popup with the professor's score if mouse is hovered on the professor's name
  async function displayPopup(professors) {
    for(let i = 0; i < professors.length; i++){
        let score = await findScore(professors[i]);
        let popup = document.createElement("div");
        popup.className = "popup";
        popup.innerHTML = `Professor: ${professor}<br>Score: ${score}`;
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
}

// find the score on RMP given a professor name
async function findScore(professorName) {

    // FIXME: need require.js
    const puppeteer = require("puppeteer");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `https://www.ratemyprofessors.com/search/professors/1438?q=${encodeURIComponent(professorName)}`;
    await page.goto(url);

        // extract relevant data from the page
        const score = await page.evaluate(() => {
            const professorCard = document.querySelector("CardNumRating__CardNumRatingNumber-sc-17t4b9u-2 ERCLc").innerHTML;
            return professorCard ? professorCard.textContent : "No results found";
        });

        await browser.close();
        return score;
    }
 
