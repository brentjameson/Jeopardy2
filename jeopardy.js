// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const gameBoardWidth = 6;
const gameBoardHeight = 5;

let categories = [];

function shuffle(array) {
    let counter = array.length;
  
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);
  
      // Decrease counter by 1
      counter--;
  
      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    let response = await axios.get('http://jservice.io/api/categories', {params: {count: 100}});
    
    let categoryIds = response.data.map(function(object) {
        return object.id
    })
    let idArray = shuffle(categoryIds);
    return idArray.slice(0,6);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    // console.log(getCategoryIds());
    let response = await axios.get('http://jservice.io/api/category', {params: {id: catId}})
    let categoryData = response.data;
    let categoryObj = ({
        title: categoryData.title,
        clues: categoryData.clues.map(function(val){
            return {question: val.question, answer: val.answer, showing: null}
        })
    })
    // console.log(categoryObj)
    return categoryObj;
}

async function makeObj() {
    let idsArray = await getCategoryIds();
    // console.log(idsArray);
    let dumbVar = await idsArray.map(async function(id){
        let categoryObj = await getCategory(id)
        return categoryObj
    });
    return await Promise.all(dumbVar)
}
makeObj()

async function newFunc() {
    let dumbVar = await makeObj()
    categories.push(dumbVar)
}

async function appendCategories() {
    await newFunc()
    const newTr = document.createElement('tr')
    categories.map(async function(val) {
        for (let i = 0; i < val.length; i++) {  
        const newTh = document.createElement('th')
        newTh.innerText = val[i].title
        $('#jeopardy').append(newTr) 
        $(newTr).append(newTh)
        }
    });
}

const cash = [200,400,600,800,1000]

async function appendBoard() {
    await appendCategories()
    let counter = 0
    for (let i = 0; i < 5; i++) {
        const newTr = document.createElement('tr')
        let cashText = cash[i]
        $('#jeopardy').append(newTr)
        for (let i = 0; i < 6; i++) {
            const newTd = document.createElement('td')
            newTd.classList.add(`${i}-${counter}`)
            $(newTr).append(newTd)
            newTd.innerText = cashText
        }
        counter++
    } 
}






/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

// function handleClick(evt) {
    let counter = 0;
    $('#start').on('click', function(evt) {
        if(counter === 0) {
            appendBoard();
        }
        counter++
    })
// }

let countClicksJeopardy = 0;
$('#jeopardy').on('click', function(evt) {
    let classNumber = evt.target.classList.value
    let numToString = classNumber.toString()
    console.log(numToString);
    let question = categories[0][numToString.charAt(0)].clues[numToString.charAt(2)].question
    let answer = categories[0][numToString.charAt(0)].clues[numToString.charAt(2)].answer
    if(countClicksJeopardy === 0) {
        evt.target.innerText = question
        countClicksJeopardy++
    }
    else if(countClicksJeopardy === 1) {
        evt.target.innerText = answer
        countClicksJeopardy = 0
    }
    else {
        return
    }
    console.log(countClicksJeopardy)
})

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

