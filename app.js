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

const dataRequests = (() => {
  const getPokemon = async () => {
    let res = await fetch('https://pokeapi.co/api/v2/generation/generation-i')
    let pokemon = await res.json()
    let species = await pokemon.pokemon_species

    allPokemon = await species
    //get images
    await dataRequests.getPokemonImage(allPokemon)
    dom.addPokemon(allPokemon)
  }
  const getPokemonImage = async (allPokemon) => {
    for (const pokemon of allPokemon) {
      let res = await fetch(
        `https://pokeapi.co/api/v2/pokemon-form/${pokemon.name}`
      )
      let poke = await res.json()
      let image = await poke.sprites.front_default
      let image2 = await poke.sprites.back_default
      let image3 = await poke.sprites.front_shiny
      let image4 = await poke.sprites.back_shiny
      pokemon.image = []
      pokemon.image[0] = await image
      pokemon.image[1] = await image2
      pokemon.image[2] = await image3
      pokemon.image[3] = await image4
    }
  }

  const getPokemonStats = async (name) => {
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    let pokemon = await res.json()
    let abilities = await pokemon.abilities
    let types = await pokemon.types
    let weight = await pokemon.weight
    let height = await pokemon.height
    let stats = await pokemon.stats
    let moves = await pokemon.moves
    let updatedPokemon = utilities.updatePokemon(
      name,
      abilities,
      types,
      weight,
      height,
      stats,
      moves
    )
    dom.showIndividualPokemon(updatedPokemon)
  }

  return {
    getPokemon,
    getPokemonImage,
    getPokemonStats,
  }
})()

dataRequests.getPokemon()

const dom = (() => {
  const addIndividualPokemonCard = (pokemon) => {
    app.classList.add('individual-pokemon')
    let div = dom.createDiv('individual-poke-card')
    let imageWrapper = dom.createDiv('poke-image-wrapper')
    let leftSide = dom.createDiv(
      'individual-left-side',
      pokemon.name,
      'poke-header'
    )
    let rightSide = dom.createDiv('individual-right-side')

    let imageDiv = dom.createImage(pokemon.image[0], pokemon.name)
    let abilitiesList = dom.createList(
      'Abilities:',
      pokemon.abilities,
      'ability',
      pokemon.abilities.length
    )
    let typesList = dom.createList(
      'Types:',
      pokemon.types,
      'type',
      pokemon.types.length
    )
    let movesList = dom.createList('Moves', pokemon.moves, 'move', 5)
    let heightDiv = dom.createDiv('poke-height', 'Height', 'smallHeader')
    let height = dom.createStat(pokemon.height, 'foot')
    let weightDiv = dom.createDiv('poke-weight', 'Weight', 'smallHeader')
    let weight = dom.createStat(pokemon.weight, 'kgs')

    heightDiv.appendChild(height)
    weightDiv.appendChild(weight)
    imageWrapper.appendChild(imageDiv)
    leftSide.appendChild(imageWrapper)
    rightSide.append(abilitiesList, typesList, movesList, heightDiv, weightDiv)
    div.append(leftSide, rightSide)
    app.appendChild(div)
  }

  const addCard = (pokemon) => {
    let div = dom.createDiv('poke-card', pokemon.name, 'poke-header')
    let imageWrapper = dom.createDiv('poke-image-wrapper')
    let imageDiv = dom.createImage(pokemon.image[0], pokemon.name)
    imageWrapper.appendChild(imageDiv)
    div.appendChild(imageWrapper)

    return div
  }

  const addStartScreen = () => {
    app.textContent = ''
    let div = dom.createDiv(
      'start-wrapper',
      'Customise Gameboy',
      'start-header'
    )
    let yellow = dom.createImage('./assets/circle.svg', 'option-0')
    let blue = dom.createImage('./assets/circle.svg', 'option-1')
    let green = dom.createImage('./assets/circle.svg', 'option-2')
    let purple = dom.createImage('./assets/circle.svg', 'option-3')
    let black = dom.createImage('./assets/circle.svg', 'option-4')
    let pattern = dom.createImage('./assets/circle.svg', 'option-5')
    div.append(yellow, blue, green, purple, black, pattern)
    app.appendChild(div)
    utilities.updateStartScreenSelector(optionIndex)
    listeners.removeHomeListener()
    listeners.removePokemonListener()
    listeners.addStartScreenListener()
  }

  const addPokemon = (pokemons) => {
    app.textContent = ''
    let header = dom.createDiv(
      'poke-header',
      'Pick your Pokemon',
      'initial-header'
    )
    let grid = dom.createDiv('poke-grid')
    app.appendChild(header)
    pokemons.forEach((pokemon) => {
      let gridItem = dom.addCard(pokemon)
      grid.appendChild(gridItem)
      app.appendChild(grid)
    })
    listeners.addHomeListener()
    listeners.addStartListener()
  }

  const createImage = (src, id) => {
    let imageDiv = document.createElement('img')
    imageDiv.src = src
    imageDiv.id = id
    return imageDiv
  }

  const createDiv = (classList, header, headerClassName) => {
    let div = document.createElement('div')
    div.classList = classList

    if (header) {
      let title = dom.createHeader(header, headerClassName)
      div.appendChild(title)
    }

    return div
  }

  const createList = (header, listContent, type, length) => {
    let listWrapper = document.createElement('div')
    let list = document.createElement('ul')
    let listHeader = document.createElement('h3')
    listHeader.textContent = `${header}`
    for (let i = 0; i < length; i++) {
      let listItem = document.createElement('li')
      listItem.textContent = utilities.capitaliseString(
        listContent[i][type].name
      )
      list.appendChild(listItem)
    }
    listWrapper.appendChild(listHeader)
    listWrapper.appendChild(list)
    return listWrapper
  }

  const createHeader = (string, className) => {
    let header = document.createElement('h2')
    let capString = utilities.capitaliseString(string)
    header.textContent = capString
    header.classList.add(className)
    return header
  }

  const createStat = (string, stat) => {
    let comboString = document.createElement('p')
    comboString.textContent = `${string} ${stat}`
    return comboString
  }

  const showIndividualPokemon = (pokemon) => {
    app.textContent = ''
    dom.addIndividualPokemonCard(pokemon)
    listeners.removeHomeListener()
    listeners.addPokemonListener(pokemon)
  }
  // Should maybe not be in here
  const goBack = () => {
    dom.addPokemon(allPokemon)
    app.classList.remove('individual-pokemon')
    utilities.resetBox(pokemonIndex)
    listeners.removePokemonListener()
    listeners.removeStartScreenListener()
    listeners.addHomeListener()
  }

  return {
    addIndividualPokemonCard,
    addStartScreen,
    addPokemon,
    addCard,
    createImage,
    createDiv,
    createList,
    createHeader,
    createStat,
    showIndividualPokemon,
    goBack,
  }
})()

const utilities = (() => {
  const updateTheme = () => {
    body.removeAttribute('class')
    shade.removeAttribute('class')
    body.classList.add('body')
    body.classList.add(`theme-${optionIndex}-body`)
    shade.classList.add('shade')
    shade.classList.add(`theme-${optionIndex}-shade`)
  }

  const changeTheme = (direction) => {
    utilities.removeSelector(optionIndex)

    if (direction == 'direction-right' || direction == 'direction-bottom') {
      optionIndex++
      if (optionIndex == 6) {
        optionIndex = 0
      }
      utilities.updateStartScreenSelector(optionIndex)
    }
    if (direction == 'direction-left' || direction == 'direction-top') {
      optionIndex--
      if (optionIndex == -1) {
        optionIndex = 5
      }
      utilities.updateStartScreenSelector(optionIndex)
    }
  }

  const updatePokemonImage = (direction) => {
    let pokemon = allPokemon[pokemonIndex]

    if (direction == 'direction-right') {
      imageIndex++
      if (imageIndex == 4) {
        imageIndex = 0
      }
      utilities.updateImage(pokemon, imageIndex)
    }
    if (direction == 'direction-left') {
      imageIndex--
      if (imageIndex == -1) {
        imageIndex = 3
      }
      utilities.updateImage(pokemon, imageIndex)
    }
  }
  const updateImage = (pokemon, index) => {
    document.getElementById(pokemon.name).src = pokemon.image[index]
  }

  const removeSelector = (index) => {
    let id = document.getElementById(`option-${index}`)
    id.classList.remove('selected')
  }

  const updateStartScreenSelector = (index) => {
    let id = document.getElementById(`option-${index}`)
    id.classList.add('selected')
  }

  const updatePokemonIndex = (symbol) => {
    if (symbol == 'inc') {
      pokemonIndex++
    }
    if (symbol == 'dec') {
      pokemonIndex--
    }
    if (pokemonIndex == -1) {
      pokemonIndex = 150
      utilities.resetBox(pokemonIndex)
    }
    if (pokemonIndex == 151) {
      pokemonIndex = 0
      utilities.resetBox(pokemonIndex)
    }
  }

  const moveBox = (direction) => {
    if (direction === 'direction-left') {
      let grid = document.querySelector('.poke-grid')
      grid.scrollLeft -= 232
      utilities.updatePokemonIndex('dec')
    }

    if (direction === 'direction-right') {
      let grid = document.querySelector('.poke-grid')
      grid.scrollLeft += 232
      utilities.updatePokemonIndex('inc')
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

  const resetBox = (index) => {
    let grid = document.querySelector('.poke-grid')
    let scrollAmount = index * 232
    grid.scrollLeft = scrollAmount
    imageIndex = 0
  }

  const getValueAndCallPokemon = () => {
    let name = allPokemon[pokemonIndex].name
    dataRequests.getPokemonStats(name)
  }

  const updatePokemon = (
    name,
    abilities,
    types,
    weight,
    height,
    stats,
    moves
  ) => {
    let index = allPokemon.findIndex((pokemon) => pokemon.name == name)
    allPokemon[index].abilities = abilities
    allPokemon[index].types = types
    allPokemon[index].weight = weight
    allPokemon[index].height = height
    allPokemon[index].stats = stats
    allPokemon[index].moves = moves

    return allPokemon[index]
  }

  const capitaliseString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return {
    updateTheme,
    changeTheme,
    updatePokemonImage,
    updateImage,
    removeSelector,
    updateStartScreenSelector,
    updatePokemonIndex,
    moveBox,
    resetBox,
    getValueAndCallPokemon,
    updatePokemon,
    capitaliseString,
  }
})()

const listeners = (() => {
  const addStartListener = () => {
    startButton.addEventListener('click', dom.addStartScreen)
  }

  const addHomeListener = () => {
    document
      .getElementById('direction-right')
      .addEventListener('click', (e) => utilities.moveBox('direction-right'))
    document
      .getElementById('direction-left')
      .addEventListener('click', (e) => utilities.moveBox('direction-left'))
    aSelect.addEventListener('click', utilities.getValueAndCallPokemon)
    bSelect.addEventListener('click', dom.goBack)
  }

  const removeHomeListener = () => {
    let el = document.getElementById('direction-right')
    elClone = el.cloneNode(true)
    el.parentNode.replaceChild(elClone, el)

    let left = document.getElementById('direction-left')
    leftClone = left.cloneNode(true)
    left.parentNode.replaceChild(leftClone, left)

    aSelect.removeEventListener('click', utilities.getValueAndCallPokemon)
  }

  const addPokemonListener = () => {
    document
      .getElementById('direction-bottom')
      .addEventListener('click', function () {
        utilities.moveBox('direction-bottom')
      })
    document
      .getElementById('direction-top')
      .addEventListener('click', function () {
        utilities.moveBox('direction-top')
      })
    document
      .getElementById('direction-right')
      .addEventListener('click', function () {
        utilities.updatePokemonImage('direction-right')
      })
    document
      .getElementById('direction-left')
      .addEventListener('click', function () {
        utilities.updatePokemonImage('direction-left')
      })
  }

  const removePokemonListener = () => {
    let right = document.getElementById('direction-right')
    rightClone = right.cloneNode(true)
    right.parentNode.replaceChild(elClone, right)

    let left = document.getElementById('direction-left')
    leftClone = left.cloneNode(true)
    left.parentNode.replaceChild(leftClone, left)
  }

  const addStartScreenListener = () => {
    document
      .getElementById('direction-right')
      .addEventListener('click', function change() {
        utilities.changeTheme('direction-right')
      })
    document
      .getElementById('direction-left')
      .addEventListener('click', function change() {
        utilities.changeTheme('direction-left')
      })
    document
      .getElementById('direction-top')
      .addEventListener('click', function change() {
        utilities.changeTheme('direction-top')
      })
    document
      .getElementById('direction-bottom')
      .addEventListener('click', function change() {
        utilities.changeTheme('direction-bottom')
      })
    aSelect.addEventListener('click', utilities.updateTheme)
  }

  const removeStartScreenListener = () => {
    let right = document.getElementById('direction-right')
    rightClone = right.cloneNode(true)
    right.parentNode.replaceChild(rightClone, right)

    let left = document.getElementById('direction-left')
    leftClone = left.cloneNode(true)
    left.parentNode.replaceChild(leftClone, left)

    let top = document.getElementById('direction-top')
    topClone = top.cloneNode(true)
    top.parentNode.replaceChild(topClone, top)

    let bottom = document.getElementById('direction-bottom')
    botClone = bottom.cloneNode(true)
    bottom.parentNode.replaceChild(botClone, bottom)

    aSelect.removeEventListener('click', utilities.updateTheme)
  }

  return {
    addStartListener,
    addHomeListener,
    removeHomeListener,
    addPokemonListener,
    removePokemonListener,
    addStartListener,
    addStartScreenListener,
    removeStartScreenListener,
  }
})()

// ****CURRENTLY NOT USED BUT WORKING. FUNCTION SEARCHS POKEMON BY NAME****** //

// function filterByName(searchTerm) {
//   let searchFiltered = allPokemon.filter((pokemon) =>
//     pokemon.name.includes(searchTerm)
//   )
//   dom.addPokemon(searchFiltered)
// }

// function updateSearch(value) {
//   searchTerm = value
//   filterByName(searchTerm)
// }
