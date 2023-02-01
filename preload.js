const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', async () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  const version = document.getElementById("version");

  const notification = document.getElementById("notification");
  const message = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  ipcRenderer.on("update_available", () => {
    ipcRenderer.removeAllListeners("update_available");
    message.innerText = "A new update is available. Downloading now...";
    notification.classList.remove("hidden");
  });

  ipcRenderer.on("update_downloaded", () => {
    ipcRenderer.removeAllListeners("update_downloaded");
    message.innerText =
      "Update Downloaded. It will be installed on restart. Restart now?";
    restartButton.classList.remove("hidden");
    notification.classList.remove("hidden");
  });

  ipcRenderer.send("app_version");
  ipcRenderer.on("app_version", (event, arg) => {
    ipcRenderer.removeAllListeners("app_version");
    version.innerText = "Version " + arg.version;
  });
  ipcRenderer.send("pokedex");
  ipcRenderer.on("pokedex", (event, arg) => {
    ipcRenderer.removeAllListeners("pokedex");
    console.log(arg);
    fetchPokemon(arg)
  });
})

const fetchPokemon = (pokemon_species) => {
  const promises = [];
  for (let i = 0; i < pokemon_species.length; i++) {
    // console.log(pokemon_species[i]);
    promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_species[i].PokemonId}`).then((res) => res.json()));
  }
  Promise.all(promises).then((results) => {
    console.log(results)
    const pokemon = results.map((result) => ({
      name: result.name,
      image: result.sprites['front_shiny'],
      type: result.types.map((type) => type.type.name).join(', '),
      id: result.id
    }));
    displayPokemon(pokemon);
  });
};

const displayPokemon = (pokemon) => {
  console.log(pokemon);
  const pokemonHTMLString = pokemon
    .map(
      (pokeman) => `
      <li class="card">
          <img class="card-image" src="${pokeman.image}"/>
          <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
          <p class="card-subtitle">Type: ${pokeman.type}</p>
      </li>
  `
    )
    .join('');
  pokedex.innerHTML = pokemonHTMLString;
};

contextBridge.exposeInMainWorld('api', {
  closeNotification: () => {
    notification.classList.add("hidden");
  },
  restartApp: () => {
    ipcRenderer.send("restart_app");
  },
  shasse: async () => {

    document.getElementById('test').innerText = 'Output: ';

  }
})


/*

    */