let allPokemon = {}
let searchTerm = ''
let pokemonIndex = 0
let imageIndex = 0
let optionIndex = 0
let app = document.getElementById('app')
let body = document.getElementById('body')
let shade = document.getElementById('shade')
let aSelect = document.getElementById('aSelect')
let bSelect = document.getElementById('bSelect')
let bottomArrow = document.getElementById('direction-bottom')
let topArrow = document.getElementById('direction-top')
let rightArrow = document.getElementById('direction-right')
let leftArrow = document.getElementById('direction-left')
let startButton = document.getElementById('start')

async function getPokemon() {
  let res = await fetch('https://pokeapi.co/api/v2/generation/generation-i')
  let pokemon = await res.json()
  let species = await pokemon.pokemon_species

  allPokemon = await species
  //get images
  await getPokemonImage(allPokemon)
  addPokemon(allPokemon)
}
getPokemon()

function addPokemon(pokemons) {
  app.textContent = ''
  let header = createDiv('poke-header', 'Pick your Pokemon', 'initial-header')
  let grid = createDiv('poke-grid')
  app.appendChild(header)
  pokemons.forEach((pokemon) => {
    let gridItem = addCard(pokemon)
    grid.appendChild(gridItem)
    app.appendChild(grid)
  })
  addHomeListener()
  addStartListener()
}

function capitaliseString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function addStartListener() {
  startButton.addEventListener('click', addStartScreen)
}

function addHomeListener() {
  rightArrow.addEventListener('click', moveBox)

  leftArrow.addEventListener('click', moveBox)

  aSelect.addEventListener('click', getValueAndCallPokemon)

  bSelect.addEventListener('click', goBack)
}

function removeHomeListener() {
  rightArrow.removeEventListener('click', moveBox)

  leftArrow.removeEventListener('click', moveBox)

  aSelect.removeEventListener('click', getValueAndCallPokemon)

  console.log('removing')
}

function addPokemonListener() {
  bottomArrow.addEventListener('click', moveBox)

  topArrow.addEventListener('click', moveBox)

  rightArrow.addEventListener('click', updatePokemonImage)

  leftArrow.addEventListener('click', updatePokemonImage)
}

function removePokemonListener() {
  rightArrow.removeEventListener('click', updatePokemonImage)

  leftArrow.removeEventListener('click', updatePokemonImage)
}

function addStartScreenListener() {
  rightArrow.addEventListener('click', changeTheme)
  leftArrow.addEventListener('click', changeTheme)
  aSelect.addEventListener('click', updateTheme)
}

function updateTheme() {
  body.removeAttribute('class')
  shade.removeAttribute('class')
  body.classList.add('body')
  body.classList.add(`theme-${optionIndex}-body`)
  shade.classList.add('shade')
  shade.classList.add(`theme-${optionIndex}-shade`)
}

function removeStartScreenListener() {
  rightArrow.removeEventListener('click', changeTheme)
  leftArrow.removeEventListener('click', changeTheme)
  aSelect.removeEventListener('click', updateTheme)
}

function changeTheme() {
  removeSelector(optionIndex)
  let id = this.id
  if (id == 'direction-right') {
    optionIndex++
    if (optionIndex == 6) {
      optionIndex = 0
    }
    updateStartScreenSelector(optionIndex)
  }
  if (id == 'direction-left') {
    optionIndex--
    if (optionIndex == -1) {
      optionIndex = 5
    }
    updateStartScreenSelector(optionIndex)
  }
}

function updatePokemonImage() {
  console.log(this.id)
  let direction = this.id
  let pokemon = allPokemon[pokemonIndex]
  if (direction == 'direction-right') {
    imageIndex++
    if (imageIndex == 4) {
      imageIndex = 0
    }
    updateImage(pokemon, imageIndex)
  }
  if (direction == 'direction-left') {
    imageIndex--
    if (imageIndex == -1) {
      imageIndex = 3
    }
    updateImage(pokemon, imageIndex)
  }
}

function updateImage(pokemon, index) {
  document.getElementById(pokemon.name).src = pokemon.image[index]
}

function addCard(pokemon) {
  let div = createDiv('poke-card', pokemon.name, 'poke-header')
  let imageWrapper = createDiv('poke-image-wrapper')
  let imageDiv = createImage(pokemon.image[0], pokemon.name)
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
    pokemon.image = []
    pokemon.image[0] = await image
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

function getValueAndCallPokemon() {
  let name = allPokemon[pokemonIndex].name
  getPokemonStats(name)
}

async function getPokemonStats(name) {
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  let pokemon = await res.json()
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
  let index = allPokemon.findIndex((pokemon) => pokemon.name == name)
  allPokemon[index].abilities = abilities
  allPokemon[index].types = types
  allPokemon[index].weight = weight
  allPokemon[index].height = height
  allPokemon[index].stats = stats
  allPokemon[index].moves = moves
  allPokemon[index].image[1] = sprites.back_default
  allPokemon[index].image[2] = sprites.front_shiny
  allPokemon[index].image[3] = sprites.back_shiny
  console.log(allPokemon[index])
  return allPokemon[index]
}

function showIndividualPokemon(pokemon) {
  app.textContent = ''
  addIndividualPokemonCard(pokemon)
  removeHomeListener()
  addPokemonListener(pokemon)
}

function addIndividualPokemonCard(pokemon) {
  app.classList.add('individual-pokemon')
  let div = createDiv('individual-poke-card')
  let imageWrapper = createDiv('poke-image-wrapper')
  let leftSide = createDiv('individual-left-side', pokemon.name, 'poke-header')
  let rightSide = createDiv('individual-right-side')

  let imageDiv = createImage(pokemon.image[0], pokemon.name)
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
  let heightDiv = createDiv('poke-height', 'Height', 'smallHeader')
  let height = createStat(pokemon.height, 'foot')
  let weightDiv = createDiv('poke-weight', 'Weight', 'smallHeader')
  let weight = createStat(pokemon.weight, 'kgs')

  heightDiv.appendChild(height)
  weightDiv.appendChild(weight)
  imageWrapper.appendChild(imageDiv)
  leftSide.appendChild(imageWrapper)
  rightSide.append(abilitiesList, typesList, movesList, heightDiv, weightDiv)
  div.append(leftSide, rightSide)
  app.appendChild(div)
}

function goBack() {
  addPokemon(allPokemon)
  app.classList.remove('individual-pokemon')
  resetBox(pokemonIndex)
  removePokemonListener()
  removeStartScreenListener()
  addHomeListener()
}

function addStartScreen() {
  app.textContent = ''
  let div = createDiv('start-wrapper', 'Customise Gameboy', 'start-header')
  let yellow = createImage('./assets/circle.svg', 'option-0')
  let blue = createImage('./assets/circle.svg', 'option-1')
  let green = createImage('./assets/circle.svg', 'option-2')
  let purple = createImage('./assets/circle.svg', 'option-3')
  let black = createImage('./assets/circle.svg', 'option-4')
  let pattern = createImage('./assets/circle.svg', 'option-5')
  div.append(yellow, blue, green, purple, black, pattern)
  app.appendChild(div)
  updateStartScreenSelector(optionIndex)
  removeHomeListener()
  removePokemonListener()
  addStartScreenListener()
}

function removeSelector(index) {
  let id = document.getElementById(`option-${index}`)
  id.classList.remove('selected')
}

function updateStartScreenSelector(index) {
  let id = document.getElementById(`option-${index}`)
  console.log(id)
  id.classList.add('selected')
}

function createImage(src, id) {
  let imageDiv = document.createElement('img')
  imageDiv.src = src
  imageDiv.id = id
  return imageDiv
}

function createDiv(classList, header, headerClassName) {
  let div = document.createElement('div')
  div.classList = classList

  if (header) {
    let title = createHeader(header, headerClassName)
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
  header.classList.add(className)
  return header
}

function createStat(string, stat) {
  let comboString = document.createElement('p')
  comboString.textContent = `${string} ${stat}`
  return comboString
}

function moveBox() {
  let direction = this.id
  if (direction === 'direction-left') {
    let grid = document.querySelector('.poke-grid')
    grid.scrollLeft -= 232
    updatePokemonIndex('dec')
  }

  if (direction === 'direction-right') {
    let grid = document.querySelector('.poke-grid')
    grid.scrollLeft += 232
    updatePokemonIndex('inc')
  }

  if (direction == 'direction-top') {
    let grid = document.getElementById('app')
    grid.scrollTop -= 50
  }

  if (direction == 'direction-bottom') {
    let grid = document.getElementById('app')
    grid.scrollTop += 50
  }
}

function resetBox(index) {
  let grid = document.querySelector('.poke-grid')
  let scrollAmount = index * 232
  grid.scrollLeft = scrollAmount
  imageIndex = 0
}

function updatePokemonIndex(symbol) {
  if (symbol == 'inc') {
    pokemonIndex++
  }
  if (symbol == 'dec') {
    pokemonIndex--
  }
  if (pokemonIndex == -1) {
    pokemonIndex = 150
    resetBox(pokemonIndex)
  }
  if (pokemonIndex == 151) {
    pokemonIndex = 0
    resetBox(pokemonIndex)
  }
}
