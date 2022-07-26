let allPokemon = {}
let app = document.getElementById('app')
let searchTerm = ''

async function getPokemon() {
  let res = await fetch('https://pokeapi.co/api/v2/generation/generation-i')
  let pokemon = await res.json()
  let species = await pokemon.pokemon_species
  console.log(species)
  allPokemon = await species

  //get images
  await getPokemonImage(allPokemon)
  addPokemon(allPokemon)
}
getPokemon()

function addPokemon(pokemons) {
  app.textContent = ''
  let header = createDiv('poke-header', 'Select your Pokemon')
  let grid = createDiv('poke-grid')
  app.appendChild(header)
  pokemons.forEach((pokemon) => {
    let gridItem = addCard(pokemon)
    grid.appendChild(gridItem)
    app.appendChild(grid)
  })
}

function capitaliseString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function addCard(pokemon) {
  let div = createDiv('poke-card', pokemon.name)
  let imageWrapper = createDiv('poke-image-wrapper')
  let imageDiv = createImage(pokemon.image, pokemon.name)

  imageDiv.addEventListener('click', getValueAndCall, false)

  imageWrapper.appendChild(imageDiv)
  div.appendChild(imageWrapper)

  return div
}

async function getPokemonImage(allPokemon) {
  for (const pokemon of allPokemon) {
    let res = await fetch(
      `https://pokeapi.co/api/v2/pokemon-form/${pokemon.name}`
    )
    let poke = await res.json()
    let image = await poke.sprites.front_default
    pokemon.image = await image
  }
}

function filterByName(searchTerm) {
  let searchFiltered = allPokemon.filter((pokemon) =>
    pokemon.name.includes(searchTerm)
  )
  addPokemon(searchFiltered)
}

function updateSearch(value) {
  searchTerm = value
  filterByName(searchTerm)
}

function getValueAndCall(e) {
  getPokemonStats(e.target.id)
}

async function getPokemonStats(name) {
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  let pokemon = await res.json()
  console.log(pokemon)
  let abilities = await pokemon.abilities
  let types = await pokemon.types
  let weight = await pokemon.weight
  let height = await pokemon.height
  let stats = await pokemon.stats
  let moves = await pokemon.moves
  let sprites = await pokemon.sprites
  let updatedPokemon = updatePokemon(
    name,
    abilities,
    types,
    weight,
    height,
    stats,
    moves,
    sprites
  )
  console.log(updatedPokemon)
  showIndividualPokemon(updatedPokemon)
}

function updatePokemon(
  name,
  abilities,
  types,
  weight,
  height,
  stats,
  moves,
  sprites
) {
  let pokemonIndex = allPokemon.findIndex((pokemon) => pokemon.name == name)
  allPokemon[pokemonIndex].abilities = abilities
  allPokemon[pokemonIndex].types = types
  allPokemon[pokemonIndex].weight = weight
  allPokemon[pokemonIndex].height = height
  allPokemon[pokemonIndex].stats = stats
  allPokemon[pokemonIndex].moves = moves
  allPokemon[pokemonIndex].sprites = sprites
  return allPokemon[pokemonIndex]
}

function showIndividualPokemon(pokemon) {
  app.textContent = ''
  addIndividualPokemonCard(pokemon)
}

function addIndividualPokemonCard(pokemon) {
  app.classList.add('individual-pokemon')
  let div = createDiv('individual-poke-card')
  let imageWrapper = createDiv('poke-image-wrapper')
  let leftSide = createDiv('individual-left-side', pokemon.name)
  let rightSide = createDiv('individual-right-side')
  let bottom = createDiv('individual-bottom', 'Back')
  let imageDiv = createImage(pokemon.image, pokemon.name)
  let abilitiesList = createList(
    'Abilities:',
    pokemon.abilities,
    'ability',
    pokemon.abilities.length
  )
  let typesList = createList(
    'Types:',
    pokemon.types,
    'type',
    pokemon.types.length
  )
  let movesList = createList('Moves', pokemon.moves, 'move', 5)
  let heightDiv = createDiv('poke-height', 'Height')
  let height = createStat(pokemon.height, 'foot')
  let weightDiv = createDiv('poke-weight', 'Weight')
  let weight = createStat(pokemon.weight, 'kgs')

  heightDiv.appendChild(height)
  weightDiv.appendChild(weight)
  imageWrapper.appendChild(imageDiv)
  leftSide.appendChild(imageWrapper)
  rightSide.append(abilitiesList, typesList, movesList, heightDiv, weightDiv)
  div.append(leftSide, rightSide, bottom)
  app.appendChild(div)
  addBackListener()
}

function addBackListener() {
  let back = document.getElementsByClassName('individual-bottom')
  back[0].addEventListener('click', function () {
    addPokemon(allPokemon)
    app.classList.remove('individual-pokemon')
  })
}

function createImage(src, id) {
  let imageDiv = document.createElement('img')
  imageDiv.src = src
  imageDiv.id = id
  return imageDiv
}

function createDiv(classList, header, child) {
  let div = document.createElement('div')
  div.classList = classList

  if (header) {
    let title = createHeader(header)
    div.appendChild(title)
  }

  return div
}

function createList(header, listContent, type, length) {
  let listWrapper = document.createElement('div')
  let list = document.createElement('ul')
  let listHeader = document.createElement('h3')
  listHeader.textContent = `${header}`
  for (let i = 0; i < length; i++) {
    let listItem = document.createElement('li')
    listItem.textContent = capitaliseString(listContent[i][type].name)
    list.appendChild(listItem)
  }
  listWrapper.appendChild(listHeader)
  listWrapper.appendChild(list)
  return listWrapper
}

function createHeader(string, className) {
  let header = document.createElement('h2')
  let capString = capitaliseString(string)
  header.textContent = capString
  return header
}

function createStat(string, stat) {
  let comboString = document.createElement('p')
  comboString.textContent = `${string} ${stat}`
  return comboString
}

function movebox() {
  console.log('working')
  let grid = document.querySelector('.poke-grid')
  console.log(grid)
  grid.scrollLeft += 50
}
