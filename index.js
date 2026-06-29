/*             Feel free to use this skeleton I have provided or delete everything and do your own thing!             */

//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api"
const COHORT = "/2803-PUPPIES"
const RESOURCE = "/players"
const API = BASE + COHORT + RESOURCE
/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/
let puppies = [];
let selectedPuppy;
////////////////////////////

/**
 * Fetches all players from the API.
 * This function should not be doing any rendering
 * Instead, this function should be keeping our state up to date
 */
const fetchAllPlayers = async () => {
  try{
    const response = await fetch(API);
    const data = await response.json();
    puppies = data.data.players;
  } catch (error){
    console.log(error)
  }

};

/**
 * Fetches a single player from the API.
 * This function should not be doing any rendering
 * Instead, this function should be keeping our state up to date
 * @param {number} playerId
 */
/**
 * Note: In order to call fetchSinglePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to fetch, we cannot call fetchSinglePlayer()
 */
const fetchSinglePlayer = async (playerId) => {
  try{
    const response = await fetch(`${API}/${playerId}`)
    const data = await response.json();
    console.log(data)
    selectedPuppy = data.data.player;
     render();
  } catch (error){
    console.log(error)
  }
};

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * What does that sound like we need?
 */
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */

const addNewPlayer = async (newPlayer) => {
    try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlayer),
    });
    await fetchAllPlayers();
    render()
  } catch (e) {
    console.error(e);
  }
};

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to remove, we cannot call removePlayer()
 */

const removePlayer = async (playerId) => {
  try{
    await fetch(`${API}/${playerId}`, {
      method: "DELETE",
    });
    selectedPuppy = undefined;
    await fetchAllPlayers();
    render()
  } catch (error) {
    console.log(error)
  }
};

const NewPuppyForm = () => {
  const $form = document.createElement("form");
  $form.className = "invite-form";
  $form.innerHTML = `
    <h3>Invite a puppy</h3>
    <label>
      Name
      <input name="name" required />
    </label>
    <label>
      Breed
      <input name="breed" required />
    </label>
    <label>
      Status
      <select name="status">
        <option value="bench">Bench</option>
        <option value="field">Field</option>
      </select>
    </label>
    <label>
      Image URL
      <input name="imageUrl" placeholder="https://example.com/dog.jpg" />
    </label>
    <button type="submit">Add Puppy</button>
  `;


  $form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData($form);
    const imageUrl = data.get("imageUrl");

    await addNewPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
      status: data.get("status"),
      imageUrl: imageUrl,
    });

    $form.reset(); // Clear the form
  });

  return $form;
};

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. The page should show
 *    specific details about the player clicked such as: name, id, breed, status, image, and team or unassigned if no team
 * - Remove from roster. When a button is clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
const playerCard = (puppyObject) => {
  const $li = document.createElement("li");
  $li.className = "playerCard";
  $li.dataset.id = puppyObject.id;
  $li.innerHTML = `
      <img src="${puppyObject.imageUrl}" alt="${puppyObject.name}"/>
      <h2>${puppyObject.name}</h2>
  `;
  $li.addEventListener("click", () => {
    fetchSinglePlayer(puppyObject.id);
  });
  return $li;
}

const allPlayerCards = (array) => {
  const $ul = document.createElement("ul");
  $ul.classList.add("allPlayers");

  const $cards =array.map(playerCard);

  $ul.replaceChildren(...$cards);
  return $ul;
}

const SelectedPuppy = () => {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.className = "placeholder";
    $p.textContent = " Select a puppy from the roster";
    return $p;
  }

  const teamName = selectedPuppy.teamId ? "Ruff" : "Unassigned";
  const image = selectedPuppy.imageUrl || "https://via.placeholder.com/150";

  const $section = document.createElement("section");
  $section.className = "selected-puppy";
  $section.innerHTML = `
    <h3>${selectedPuppy.name}</h3>
    <figure>
      <img src="${image}" alt="${selectedPuppy.name}" />
    </figure>
    <p><strong>ID:</strong> ${selectedPuppy.id}</p>
    <p><strong>Breed:</strong> ${selectedPuppy.breed}</p>
    <p><strong>Team:</strong> ${teamName}</p>
    <p><strong>Status:</strong> ${selectedPuppy.status}</p>
    <button class="remove-btn">Remove from roster</button>
  `;

  // Add event listener for remove button
  const $delete = $section.querySelector(".remove-btn");
  $delete.addEventListener("click", () => removePlayer(selectedPuppy.id));

  return $section;
};




const render = async () => {
  const $app = document.querySelector("#app"); 
  await fetchAllPlayers()
  $app.innerHTML = `
    <header>
      <h1> Puppy Bowl Roster</h1>
    </header>
    <main class="container">
      <section class="left-column">
        <h2>Roster</h2>
        <PuppyList></PuppyList>
        <NewPuppyForm></NewPuppyForm>
      </section>
      <section id="puppy-details">
        <h2>Puppy Details</h2>
        <SelectedPuppy></SelectedPuppy>
      </section>
    </main>
  `;
$app.querySelector("PuppyList").replaceWith(allPlayerCards(puppies))
  $app.querySelector("NewPuppyForm").replaceWith(NewPuppyForm());
$app.querySelector("SelectedPuppy").replaceWith(SelectedPuppy());
};



/**
 * Initializes the app by calling render
 * HOWEVER....
 */
const init = async () => {
  //Before we render, what do we always need?

  render();
};

init();
