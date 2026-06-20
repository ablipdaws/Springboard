

const categoryNumber = 6
const questionsNumber = 5
const api_url =  "https://rithm-jeopardy.herokuapp.com/api";


const categories = [];

async function getCategoryIds() {
  const res = await axios.get(
    "https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
  );

  const allIds = res.data.map(cat => cat.id);
  // Shuffle and take first categoryNumber
  return allIds
    .sort(() => Math.random() - 0.5)
    .slice(0, categoryNumber);
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
    let res = await axios.get(`${api_url}/category?id=${catId}`);
    console.log(res.data)
    return res.data;
}

//getCategory(10)

//  // Take only first questionsNumber clues
//   const clues = cat.clues.slice(0, questionsNumber).map(c => ({
//     question: c.question,
//     answer: c.answer,
//     showing: null
//   }));

//   return {
//     title: cat.title,
//     clues
//   };
// /** Fill the HTML table#jeopardy with the categories & cells for questions.
 
//  * - The <thead> should be filled w/a <tr>, and a <td> for each category
//  * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
//  *   each with a question for each category in a <td>
//  *   (initally, just show a "?" where the question/answer would go.)
//  */
async function fillTable() {
  const $thead = $("#jeopardy thead");
  const $tbody = $("#jeopardy tbody");

  $thead.empty();
  $tbody.empty();

    // Header row
  let $tr = $("<tr>");
  for (let cat of categories) {
    $tr.append($("<th>").text(cat.title));
  }
  $thead.append($tr);

  // Body rows
  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    let $row = $("<tr>");
    for (let j = 0; j < NUM_CATEGORIES; j++) {
      $row.append(
        $("<td>")
          .attr("id", `${j}-${i}`)
          .text("?")
      );
    }
    $tbody.append($row);
  }
}

// /** Handle clicking on a clue: show the question or answer.
//  *
//  * Uses .showing property on clue to determine what to show:
//  * - if currently null, show question & set .showing to "question"
//  * - if currently "question", show answer & set .showing to "answer"
//  * - if currently "answer", ignore click
//  * */
// function handleClick(evt) {
//   const id = evt.target.id;
//   if (!id) return;

//   const [catIdx, clueIdx] = id.split("-").map(Number);
//   const clue = categories[catIdx].clues[clueIdx];

//   if (clue.showing === null) {
//     // Show question
//     $(`#${id}`).text(clue.question);
//     clue.showing = "question";
//   } else if (clue.showing === "question") {
//     // Show answer
//     $(`#${id}`).text(clue.answer);
//     clue.showing = "answer";
//   } else {
//     // Already answered — ignore
//     return;
//   }
// }


// /** Wipe the current Jeopardy board, show the loading spinner,
//  * and update the button used to fetch data.
//  */

function showLoadingView() {
  $("#jeopardy").hide();
  $("#spinner").show();
  $("#start").text("Loading...");
}

// /** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  $("#spinner").hide();
  $("#jeopardy").show();
  $("#start").text("Restart");
}
// /** Start game:
//  *
//  * - get random category Ids
//  * - get data for each category
//  * - create HTML table
//  * */

async function setupAndStart() {
  showLoadingView();

  const catIds = await getCategoryIds();

  for (let id of catIds) {
    categories.push(await getCategory(id));
  }

  await fillTable();
  hideLoadingView();
}
// /** On click of start / restart button, set up game. */

// $("#start").on("click", setupAndStart);

function App()
{
  //create the button first
  $("#start").on("click", setupAndStart);
}

App();

// /** On page load, add event handler for clicking clues */

// $("#jeopardy").on("click", "td", handleClick);
// }