let numberEncounter = 0;
let currentSong = 0;

const music = ["furret walk around the world.mp3", "Pokémon XY - Emotion.mp3"];

function playMusic() {
    check()
  const song = document.getElementById("music");
  song.src = "./audio/" + music[currentSong];
}

function nextMusic() {
  currentSong++;
  playMusic();
}

function previousMusic() {
  currentSong--;
  playMusic();
}

function check() {
  if (currentSong == 0) {
    const button = document.getElementById("precedent");
    button.classList.add("hidden");

    const buttonS = document.getElementById("suivant");
    buttonS.classList.remove("hidden");
  }

  if (currentSong == music.length - 1) {
    const button = document.getElementById("suivant");
    button.classList.add("hidden");

    const buttonP = document.getElementById("precedent");
    buttonP.classList.remove("hidden");
  }
}

playMusic();

const fetchPokemon = (pokemon) => {
  const promises = [];
  for (let i = 0; i < pokemon.length; i++) {
    // console.log(pokemon_species[i]);
    promises.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon[i]}`).then((res) =>
        res.json()
      )
    );
  }
  Promise.all(promises).then((results) => {
    console.log(results);
    const pokemon = results.map((result) => ({
      image: result.sprites["front_default"],
      imageShiny: result.sprites["front_shiny"],
      type: result.types.map((type) => type.type.name).join(", "),
    }));
    displayPokemon(pokemon);
  });
};

const displayPokemon = (pokemon) => {
  console.log(pokemon);
  const pokemonHTMLString = pokemon
    .map(
      (pokeman) => `
        <li class="cardbetter">
            <img class="card-image" src="${pokeman.imageShiny}"/>
            <p class="card-subtitle">Type: Shiny</p>
        </li>

        <div class="Buttons">
            <button class="buttonIncremente" onclick="incremente()">+1</button>
            <button class="buttonShiny" onclick="shiny()">✨</button>
        </div>
        
        <li class="cardbetter">
            <img class="card-image" src="${pokeman.image}"/>
            <p class="card-subtitle">Type: Normal</p>
        </li>
    `
    )
    .join("");
    shasse.innerHTML = pokemonHTMLString;
};

function incremente() {
  numberEncounter++;
  updatedCompteur();
}

function updatedCompteur() {
  const element = document.getElementById("encounter");
  element.innerText = numberEncounter;
}

function displayEncounter(id) {
  let tab = [];
  tab.push(id);
  console.log(tab);
  fetchPokemon(tab);

  const div = document.getElementById("compteur");
  div.classList.remove("hidden");

  updatedCompteur();
}

function shiny() {
  const objet = {
    encounter: numberEncounter,
    pkmn: window.location.search.split("pokemon=")[1],
  };
  window.api.shiny(objet);

  numberEncounter = 0;
  const element = document.getElementById("encounter");

  element.innerText = numberEncounter;
}

if (window.location.search.split("pokemon=")[1]) {
  displayEncounter(window.location.search.split("pokemon=")[1]);
}
