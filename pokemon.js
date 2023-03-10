const pokedex = document.getElementById('pokedex');
const test = document.getElementById('test');

let pokemon;
let search = "";


const selectElement = document.querySelector('#search');

selectElement.addEventListener('change', (event) => {
  console.log(event.target.value)
  search= event.target.value
  displayPokemon(pokemon)
});

selectElement.addEventListener('input', (event) => {
    selectElement.dispatchEvent(new Event('change'));
  });

const fetchPokemon = (pokemon_species) => {
    const promises = [];
    for (let i = 0; i < pokemon_species.length; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_species[i].pokemon_species.url.split("species/")[1]}`).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        console.log(results)
         pokemon = results.map((result) => ({
            name: result.name,
            image: result.sprites['front_default'],
            type: result.types.map((type) => type.type.name).join(', '),
            id: result.id
        }));
        displayPokemon(pokemon);
    });
};

const displayPokemon = (pokemon) => {
    
    const Pokfilter = pokemon.filter((pokemon) => {
        return (
            pokemon.name?.toLowerCase().includes(search?.toLowerCase()))
    })
    
    
    console.log(pokemon);
    const pokemonHTMLString = Pokfilter.map(
            (pokeman) => `
        <li class="card" onClick="debutShasse(${pokeman.id})">
            <img class="card-image" src="${pokeman.image}"/>
            <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
            <p class="card-subtitle">Type: ${pokeman.type}</p>
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;
};

function debutShasse(id) {
    window.location = `index.html?pokemon=${id}`
}


const fetchPokemonGen = async (genId) => {
    console.log(genId);

    const url = `https://pokeapi.co/api/v2/pokedex/${genId}`;
    const data = await fetch(url)
    const jsonData = await data.json()
    console.log(jsonData)

    fetchPokemon(jsonData.pokemon_entries)

};

fetchPokemonGen(window.location.search.split('gen=')[1])