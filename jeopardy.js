let categories = [];
const cash = [200,400,600,800,1000]
let startGameCounter = 0;
let start = $('#start')
let countClicksJeopardy = 0;

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

//  * Returns array of category ids
async function getCategoryIds() {
    let response = await axios.get('https://jservice.io/api/categories', {params: {count: 100}});
    
    let categoryIds = response.data.map(function(object) {
        return object.id
    })
    let idArray = shuffle(categoryIds);
    return idArray.slice(0,6);
}

// Returns object with data about a category:
async function getCategory(catId) {
    // console.log(getCategoryIds());
    let response = await axios.get('https://jservice.io/api/category', {params: {id: catId}})
    let categoryData = response.data;
    let categoryObj = ({
        title: categoryData.title,
        clues: categoryData.clues.map(function(val){
            return {question: val.question, answer: val.answer, showing: null}
        })
    })
    return categoryObj;
}

// returns array with object containing 6 categories and associated questions & answers
async function makeArray() {
    let idsArray = await getCategoryIds();
    let createArray = await idsArray.map(async function(id){
        let categoryObj = await getCategory(id)
        return categoryObj
    });
    return await Promise.all(createArray)
}
makeArray()

// pushes the array from makearray() to the 'categories' array
async function pushArray() {
    let pushToCategoriesArray = await makeArray()
    categories.push(pushToCategoriesArray)
}

// creates and appends categories

async function appendCategories() {
    await pushArray()
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

// creates the board and loops through the "cash" array to assign cells with a cash value. Creates and appends the Jeopardy board. 

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
        hideSpinner();
    } 
}

// When called, triggers the spinner when the game is loading. ***See index.html for code reference for the spinner

function showSpinner() { 
    $('#loader').removeClass('hidden');
    console.log('spinner')
}

// triggers the spinner when the game is loading. ***

function hideSpinner() { 
    $('#loader').addClass('hidden')
}

// listens for click on start button and calls appendBoard(). also calls showSpinner()
$('#start').on('click', function(evt) {
    showSpinner();
    if(startGameCounter === 0) {
        appendBoard();
        $('.restart').css('display', 'block')
        $('#start').css('display', 'none')
        }
        startGameCounter++
    })

    // listens for click on restart button. Click triggers a 'confirm message'. If users clicks 'ok' ---> it calls showSpinner() & appendBoard(). If user clicks 'cancel', the game resumes.
    $('.restart').on('click', function(evt) {
        const confirmRestart = confirm('Click "OK" to end current game. Click "Cancel" to resume game')
        if (confirmRestart === true) {
            showSpinner();
            console.log("it's working")
            $('#jeopardy').empty();
            categories = []
            appendBoard()}
        });

 // Game Logic: 
//  1- Assigns the question/answers from the categories array to the appropriate td.
// 2- applies logic based on where user clicks. 

$('#jeopardy').on('click', function(evt) {
    let classNumber = evt.target.classList.value
    let numToString = classNumber.toString()
    let question = categories[0][numToString.charAt(0)].clues[numToString.charAt(2)].question
    let answer = categories[0][numToString.charAt(0)].clues[numToString.charAt(2)].answer
    let qAndAObject = categories[0][numToString.charAt(0)].clues[numToString.charAt(2)]
    console.log(qAndAObject)
    if(qAndAObject.showing === 'answer') {
        console.log('i equal answer')
        evt.target.innerText = answer
        countClicksJeopardy = 0
        return;
    }
    if(countClicksJeopardy === 0) {
        evt.target.innerText = question
        countClicksJeopardy++
        qAndAObject.showing = 'question';
    }
    else if(countClicksJeopardy === 1) {
        if(qAndAObject.showing === 'question') {
        evt.target.innerText = answer
        countClicksJeopardy = 0
        qAndAObject.showing = 'answer'
        }
    }
})
