const pokemonContainer = document.querySelector("#pokemon-container");
const spinner = document.querySelector("#spinner");
const anterior = document.querySelector("#previous");
const siguiente = document.querySelector("#next");
const input = document.querySelector("input");
const btn = document.querySelector("#buscar");
const divMsj = document.querySelector("#errorMsj");
const buscarPokemonContainer = document.querySelector("#buscarPokemon");
const paginacion = document.querySelector("#pagination");
//``

//variables para determinar la cantidad de Pokemons a traer por paginacion
let offset = 1;
let limit = 8;

/*Funcion para limpiar cuando no haya texto en input */
function validar() {
  if (input.value.length == 0) {
    removeChildNodes(divMsj);
    removeChildNodes(buscarPokemonContainer);
    fetchPokemons(offset, limit);
  }
}

//eventro change del input para buscar un pokemon por nombre
input.addEventListener("change", validar);


/* BUSCAR POQUEMON POR NOMBRE */
btn.addEventListener("click", () => {
  removeChildNodes(divMsj);
  removeChildNodes(buscarPokemonContainer);
  spinner.style.display = "block";
  buscarPokemonContainer.classList.remove("d-none");
  traerPokemon(input.value.toLowerCase());
});

/*funcion para traer los datos del pokemons por Nombre de la POKEAPI */
function traerPokemon(pokemon) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`)
    .then((res) => res.json())
    .then((data) => {
      removeChildNodes(pokemonContainer);

      pokemonContainer.classList.add("align-content-center");
      crearPokemonBuscar(data);
      spinner.style.display = "none";
      
    })
    .catch(function (error) {
      removeChildNodes(divMsj);

      divMsj.appendChild(errorMsj(pokemon));
    });
}

//funcion para remover el mensaje de error por pantalla
function del() {
  removeChildNodes(divMsj);
  input.value = "";
  fetchPokemons(offset,limit);
}

/*Funcion para mostrar mensaje en la busqueda de POkemon */
function errorMsj(pokemonName) {
    spinner.style.display = "none";
  const msj = document.createElement("div");

  msj.innerHTML = `<button class="del btn btn-danger btn-sm w-0 h-auto me-2" onClick="del()">x</button>No existe el pokemon en rango establecido <b>(1-270)</b> o esta mal escrito <b>'${pokemonName}'</b>`;
  msj.classList.add("alert", "alert-danger", "mt-4");
  msj.setAttribute("role", "alert");

  return msj;
}

/* Funciones de paginacion de pokemons*/

anterior.addEventListener("click", () => {
  if (offset != 1) {
    offset -= 9;
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
  }
});

siguiente.addEventListener("click", () => {
  console.log(offset);
  if (offset < 251) {
    offset += 9;
    removeChildNodes(pokemonContainer);
    fetchPokemons(offset, limit);
  }
});

/*Funcion para traer la lista de datos desde la PokeAPI porID */
function fetchPokemon(id) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      crearPokemon(data);
      spinner.style.display = "none";
    });
}

/*Funcion para iterar la cantidad de pokemons a traer*/
function fetchPokemons(offset, limit) {
  spinner.style.display = "block";
  for (let i = offset; i <= offset + limit; i++) {
    fetchPokemon(i);
  }
}

/*Funcion para crear la lista de pokemons*/
function crearPokemon(pokemon) {
  paginacion.classList.remove("d-none");
  const divResp = document.createElement("div");
  divResp.classList.add("col-md-6", "col-lg-4");
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");
  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const numeroPoke = document.createElement("p");
  numeroPoke.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const nombrePoke = document.createElement("p");
  nombrePoke.classList.add("name");
  nombrePoke.textContent = pokemon.name;

  const tipo = document.createElement("p");
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name);

  tipo.classList.add("bold");
  tipo.textContent = `Tipo: ${types.join(" | ")}`;
  card.classList.add(`${types[0]}`);
  card.appendChild(spriteContainer);
  card.appendChild(numeroPoke);
  card.appendChild(tipo);
  card.appendChild(nombrePoke);

  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");

  cardBack.appendChild(estadisticas(pokemon.stats));

 
  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  divResp.appendChild(flipCard);
  pokemonContainer.appendChild(divResp);
}

/*Funcion para agregar clases de iconos de estadisticas */
function iconoEstadistica(estadistica) {
  const icon = document.createElement("i");
  if (estadistica === "hp") {
    icon.classList.add("fas", "fa-heartbeat");

  } else if (estadistica === "attack") {
    icon.classList.add("fas", "fa-hand-rock");

  } else if (estadistica === "defense") {
    icon.classList.add("fas", "fa-shield-alt");
  }

  return icon;
}

/*Funcion para crear los estilos de las estadisticas de un pokemon */
function estadisticas(stats) {
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");

  for (let i = 0; i < 3; i++) {
    const stat = stats[i];

    const statContainer = document.createElement("div");
    statContainer.classList.add("col", `${stat.stat.name}`);

    const statName = document.createElement("p");
    statName.textContent = stat.stat.name;
    const statsPoke = document.createElement("div");

    const valorStat = document.createElement("div");

    valorStat.textContent = stat.base_stat;

    statsPoke.appendChild(valorStat);
    statContainer.appendChild(statsPoke);
    statContainer.appendChild(statName);
    statContainer.appendChild(iconoEstadistica(stat.stat.name));
    statsContainer.appendChild(statContainer);
  }

  return statsContainer;
}

/*Funcion para crear un pokemon por buscar */
function crearPokemonBuscar(pokemon) {
  paginacion.classList.add("d-none");
  const divResp = document.createElement("div");
  divResp.classList.add("col-md-6", "col-lg-4");
  const flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");

  flipCard.appendChild(cardContainer);

  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");
  const sprite = document.createElement("img");
  sprite.src = pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const numeroPoke = document.createElement("p");
  numeroPoke.textContent = `#${pokemon.id.toString().padStart(3, 0)}`;

  const nombrePoke = document.createElement("p");
  nombrePoke.classList.add("name");
  nombrePoke.textContent = pokemon.name;

  const tipo = document.createElement("p");
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name);
  tipo.classList.add("bold");
  tipo.textContent = `Tipo: ${types.join(" | ")}`;

  const limpiarBtn = document.createElement("button");
  limpiarBtn.classList.add("btn", "btn-danger", "mt-5", "limpiar-btn");
  limpiarBtn.textContent = "Recargar Lista";
  //Propiedad onclick del limpiarBtn para recargar la lista de Pokemons 
  limpiarBtn.onclick = () => {
    input.value='';
    removeChildNodes(buscarPokemonContainer);
    fetchPokemons(offset, limit);
    paginacion.classList.remove("d-none");

  };

  card.appendChild(spriteContainer);
  card.appendChild(numeroPoke);
  card.appendChild(tipo);
  card.appendChild(nombrePoke);

  const cardBack = document.createElement("div");
  cardBack.classList.add("pokemon-block-back");
  cardBack.appendChild(estadisticas(pokemon.stats));

  card.classList.add(`${types[0]}`);
  cardContainer.appendChild(card);
  cardContainer.appendChild(cardBack);
  divResp.appendChild(flipCard);
  divResp.appendChild(limpiarBtn);
  buscarPokemonContainer.appendChild(divResp);
}

//funcion para eliminar los div hijos de un div padre
function removeChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//funcion  que inicializa la carga de los pokemons por pantalla
fetchPokemons(offset, limit);
