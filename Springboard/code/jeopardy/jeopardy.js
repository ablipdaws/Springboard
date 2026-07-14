console.log("JS loaded");

const categoryNumber = 6;
const questionsNumber = 5;
const api_url = "https://rithm-jeopardy.herokuapp.com/api";

let categories = [];

// Get random category IDs
async function getCategoryIds() {
  const res = await axios.get(
    "https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
  );

  const allIds = res.data.map(cat => cat.id);
  return allIds.sort(() => Math.random() - 0.5).slice(0, categoryNumber);
}

// Get category data
async function getCategory(catId) {
  let res = await axios.get(`${api_url}/category?id=${catId}`);
  return res.data;
}

// Build the table
async function fillTable() {
  const $thead = $("#board thead");
  const $tbody = $("#board tbody");

  $thead.empty();
  $tbody.empty();

  // Header row
  let $tr = $("<tr>");
  for (let cat of categories) {
    $tr.append($("<th>").text(cat.title));
  }
  $thead.append($tr);

  // Body rows
  for (let i = 0; i < questionsNumber; i++) {
    let $row = $("<tr>");
    for (let j = 0; j < categoryNumber; j++) {
      $row.append(
        $("<td>")
          .attr("id", `${j}-${i}`)
          .text("?")
      );
    }
    $tbody.append($row);
  }
}

// Handle clicking a clue
function handleClick(evt) {
  console.log("CLICKED:", evt.target.id);

  let id = evt.target.id;
  let [catIdx, clueIdx] = id.split("-");
  let clue = categories[catIdx].clues[clueIdx];

  console.log(clue);

  let $cell = $(`#${id}`);

  if (clue.showing === null) {
    clue.showing = "question";
    $cell.text(clue.question);
    $cell.removeClass().addClass("showing-question");
  } else if (clue.showing === "question") {
    clue.showing = "answer";
    $cell.text(clue.answer);
    $cell.removeClass().addClass("showing-answer");
  }
}

// Start game
async function setupAndStart(e) {
  e.preventDefault();

  const catIds = await getCategoryIds();
  categories = [];

  for (let id of catIds) {
    categories.push(await getCategory(id));
  }

  await fillTable();

  $("#board").on("click", "td", handleClick);
}

// Initialize
function App() {
  console.log("calling app");
  $("#start").on("click", setupAndStart);
}

App();
