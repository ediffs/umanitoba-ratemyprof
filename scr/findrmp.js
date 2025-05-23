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
            professors = professors.concat({name: profName, score: findScore(profName).value}); 
        }
        console.log(professors);
    }
}

// find the score on RMP given a professor name
async function findScore(professorName) {

    try{
            // get the webpage
            const url = encodeURI(`https://www.ratemyprofessors.com/search/professors/1438?q=${(professorName)}`, );

            console.log(url);
            const response = await fetch(url);

            // parse the html
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // extract relevant data from the page
            const professorCard = doc.querySelector("CardNumRating__CardNumRatingNumber-sc-17t4b9u-2 ERCLc").innerHTML;
            const rating = professorCard.textContent;
            console.log(rating);

            return rating;
    }
    catch(error){
        console.error(error);
    }

}

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

// example:
// async function scrapeData() {
//     try {
//         const response = await fetch("http://books.toscrape.com/");
//         const html = await response.text();
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, "text/html");
//         const bookTitles = doc.querySelectorAll('h3 a');
//         bookTitles.forEach(function(title) {
//             const bookTitle = title.textContent;
//             console.log(bookTitle);
//             storeData(bookTitle);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

// function storeData(data) {
//     // code to store data in database or update UI
// }

// scrapeData();