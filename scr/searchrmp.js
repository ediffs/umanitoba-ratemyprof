// background script to scrape the ratemprof website and return appropriate data

console.log('run searchrmp');

const AUTH_TOKEN = `dGVzdDp0ZXN0`;
const URL = `https://www.ratemyprofessors.com/graphql`;
const ID = `U2Nob29sLTE0Mzg=`;
const LEGACY_ID = `1438`;

// EVENT LISTENING
browser.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener((request) => {
		getProfessorStats(request.professorName)
			.then((professor) => {
				port.postMessage(professor);
			})
			.catch((error) => {
				console.error('Error:', error);
				port.postMessage({ error });
			});
	});
});
// EVENT LISTENING

// find and return the stats from ratemyprof given a professor name
async function getProfessorStats(professorName) {
    let professorStats = [];
    try{
            // pull up ratemyprof
            const response = await fetch(URL, {
			method: 'POST',
            headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${AUTH_TOKEN}`,
			},
              // stringify query
              body: JSON.stringify({ 
                // query starts
	            query: "query TeacherSearchResultsPageQuery(\n  $query: TeacherSearchQuery!\n  $schoolID: ID\n  $includeSchoolFilter: Boolean!\n) {\n  search: newSearch {\n    ...TeacherSearchPagination_search_1ZLmLD\n  }\n  school: node(id: $schoolID) @include(if: $includeSchoolFilter) {\n    __typename\n    ... on School {\n      name\n      ...StickyHeaderContent_school\n    }\n    id\n  }\n}\n\nfragment CardFeedback_teacher on Teacher {\n  wouldTakeAgainPercent\n  avgDifficulty\n}\n\nfragment CardName_teacher on Teacher {\n  firstName\n  lastName\n}\n\nfragment CardSchool_teacher on Teacher {\n  department\n  school {\n    name\n    id\n  }\n}\n\nfragment CompareSchoolLink_school on School {\n  legacyId\n}\n\nfragment HeaderDescription_school on School {\n  name\n  city\n  state\n  legacyId\n  ...RateSchoolLink_school\n  ...CompareSchoolLink_school\n}\n\nfragment HeaderRateButton_school on School {\n  ...RateSchoolLink_school\n  ...CompareSchoolLink_school\n}\n\nfragment RateSchoolLink_school on School {\n  legacyId\n}\n\nfragment StickyHeaderContent_school on School {\n  name\n  ...HeaderDescription_school\n  ...HeaderRateButton_school\n}\n\nfragment TeacherBookmark_teacher on Teacher {\n  id\n  isSaved\n}\n\nfragment TeacherCard_teacher on Teacher {\n  id\n  legacyId\n  avgRating\n  numRatings\n  ...CardFeedback_teacher\n  ...CardSchool_teacher\n  ...CardName_teacher\n  ...TeacherBookmark_teacher\n}\n\nfragment TeacherSearchPagination_search_1ZLmLD on newSearch {\n  teachers(query: $query, first: 8, after: \"\") {\n    didFallback\n    edges {\n      cursor\n      node {\n        ...TeacherCard_teacher\n        id\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    resultCount\n    filters {\n      field\n      options {\n        value\n        id\n      }\n    }\n  }\n}\n",
	            variables: {
		            "includeSchoolFilter": true,
		            "query": {
			            "fallback": true,
			            "schoolID": ID,
			            "text": professorName
		            },
		            "schoolID": ID
                }
                // query ends
              })
            });

            // parse the text to json
            const text = await response.text();
            let json = JSON.parse(text);

            // if there are search results
            if (json.data.search.teachers !== null) {
                // find the search results in the json
			    let searchResults = json.data.search.teachers.edges.map((edge) => edge.node);

                // loop to find search result in which name matches roughly, may have edge cases
                let i = 0;
                let nameMatches = false;
                while(i < searchResults.length && !nameMatches) {
                    nameMatches = ((searchResults[i].firstName.includes(professorName.substring(0, professorName.indexOf(" ")))) && (searchResults[i].lastName.includes(professorName.substring(professorName.lastIndexOf(" ") + 1))));
                    // console.log("\"" + searchResults[i].firstName + "\" contains \"" + professorName.substring(0, professorName.indexOf(" ")) + "\" and \"" + searchResults[i].lastName + "\" contains \"" + professorName.substring(professorName.lastIndexOf(" ") + 1) + "\": " + nameMatches);
                    if(nameMatches) { professorStats = searchResults[i]; }
                    i++;
                }
		    }

    }
    catch(error){
        console.error(error);
    }

    console.log(professorName, professorStats);
    return professorStats;
}