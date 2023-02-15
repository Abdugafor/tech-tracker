const themeOne = document.querySelector('.theme-one'),
      themeTwo = document.querySelector('.theme-two'),
      themeFour = document.querySelector('.theme-three'),
      themeThree = document.querySelector('.theme-four'),
      body = document.querySelector('body'),
      card = document.querySelectorAll('.card'),
      white = document.querySelectorAll('.white')


if (localStorage.getItem('bg') != '') {
    body.style.background = localStorage.getItem('bg')
    white.forEach(item => item.style.color = localStorage.getItem('color'))   
}
      
// Modal

const modal = document.querySelector('#modal'),
      content = document.querySelector('#content'),
      backdrop = document.querySelector('#backdrop'),
      progress = document.querySelector('#progress'),
      form = document.querySelector('#form'),
      globalTrash = document.querySelector('#globalTrash')



content.addEventListener('click', openCard)
backdrop.addEventListener('click', closeModal)
modal.addEventListener('change', toggleTech)
form.addEventListener('submit', createTech)


const APP_TITLE = document.title
const LS_KEY = 'MY_TECHS'

let technologies = getState()  

globalTrash.addEventListener('click', () => {
   technologies = []
    reRenderCard()
})


function openCard(event) {
    const data = event.target.dataset
    const tech = technologies.find(t => t.type === data.type)
    if (!tech) return

    openModal(toModal(tech), tech.title)
}

function openModal(html, title = APP_TITLE) {
    document.title = `${title} | ${APP_TITLE}`
    modal.innerHTML = html
    modal.classList.add('open')

    deleteBtn(title)
}

function deleteBtn(tech) {
    const trash = document.querySelector('#trash')
    const techType = tech.toLowerCase()

    trash.addEventListener('click', () => {
        const num = technologies.findIndex((num) => num.type === techType)
        
        technologies.splice(num, 1)
        reRenderCard()
    })
}



function closeModal() {
    document.title = APP_TITLE
    modal.classList.remove('open')
}

function toggleTech(event) {
    const type = event.target.dataset.type
    const tech = technologies.find(t => t.type === type)
    tech.done = event.target.checked
    getState()
    saveState()
   init()

}
function toModal(tech) {
    const checked = tech.done ? 'checked' : ''

    return ` 
    <h2>${tech.title}</h2>
    <p>
      ${tech.description}
    </p>
    <hr />
    <div class="modal-bottom">
        <div>
            <input type="checkbox" id="done" ${checked} data-type="${tech.type}"/>
            <label for="done">Выучил</label>
        </div>
      
        <div class="trash">
        <i class="fa-solid fa-trash" id="trash"></i>
        </div>
    </div>
    `
}

function init() {
    renderCards()
    renderProgress()
}

function renderCards() {
    if (technologies.length === 0) {
        content.innerHTML = '<p class="empty">Техналогий пока нет! Добавьте техналогию</p>'
    }else {
        content.innerHTML = technologies.map(toCard).join('')
    }
}

function renderProgress() {
    const percent = computeProgresPercent()
    let background
    if (percent <= 30) {
        background = "var(--red)"
    }else if (percent > 30 && percent < 70) {
        background = "var(--orange)"
    }else {
        background = "var(--green)"
    }

    progress.style.background = background
    progress.style.width = percent + '%'
    progress.textContent = percent ? percent + '%' : ''
}

function computeProgresPercent() {
    let doneCount = 0
    for (let i = 0; i < technologies.length; i++) {
        if (technologies[i].done) doneCount++
    }

    if (technologies.length === 0) {
        return 0
    } else {
        return Math.round((100 * doneCount) / technologies.length)
    }
    
}
function toCard(tech) {
    const doneClass = tech.done ? 'done' : ''
    return `
        <div class="card ${doneClass}" data-type="${tech.type}">
            <h3 data-type="${tech.type}">${tech.title}</h3>
        </div>
    `
}

function isInvalid(title, description) {
    return !title.value || !description.value
}

function createTech(event) {
    event.preventDefault()

    const {title, description} = event.target

    if (isInvalid(title, description)) {
        if (!title.value) title.classList.add('invalid')
        if (!description.value) description.classList.add('invalid')
        setTimeout(() => {
            title.classList.remove('invalid')
            description.classList.remove('invalid')
        }, 2000)
        return
    }

    const newTech = {
        title: title.value,
        description: description.value,
        done: false,
        type: title.value.toLowerCase()
    }

    technologies.push(newTech)
    title.value = ''
    description.value = ''
    saveState()
    init()
}

function saveState() {
    localStorage.setItem(LS_KEY, JSON.stringify(technologies))
}

function getState() {
    const row = localStorage.getItem(LS_KEY)
    return row ? JSON.parse(row) : []
   
}

function reRenderCard() {
    renderCards()
    closeModal()
    renderProgress()
    saveState()
}

themeOne.addEventListener('click', () => {
    paragraphColor()
    body.style.background = '#406bdf'
    white.forEach(item => item.style.color = 'white')
    if (localStorage.getItem('bg') != 'rgb(64, 107, 223)') {
        localStorage.setItem('bg', body.style.background)
        localStorage.setItem('color', 'white')
    }
})

themeTwo.addEventListener('click', () => {
    paragraphColor()
    body.style.background = '#df743a'
    white.forEach(item => item.style.color = 'white')
    if (localStorage.getItem('bg') != 'rgb(223, 116, 58)') {
        localStorage.setItem('bg', body.style.background)
        localStorage.setItem('color', 'white')
    }
    
})



themeThree.addEventListener('click', theme)

function theme() {
    const cards = document.querySelectorAll('.card')
    body.style.background = '#222'
    white.forEach(item => item.style.color = 'white')
    cards.forEach(item => item.classList.add('hover'))
    if (localStorage.getItem('bg') != 'rgb(34, 34, 34)') {
        localStorage.setItem('bg', body.style.background)
        localStorage.setItem('color', 'white')
    }
}

themeFour.addEventListener('click', () => {
    globalTrash.style.color = 'black'
    body.style.background = '#fbfbfb'
    white.forEach(item => item.style.color = 'black')
    if (localStorage.getItem('bg') != 'rgb(251, 251, 251)') {
        localStorage.setItem('bg', body.style.background)
        localStorage.setItem('color', 'black')
    }

    
})

function paragraphColor() {
    if (technologies.length === 0) {
        const p = document.querySelector('.empty')
        p.style.color = 'white'
        globalTrash.style.color = 'white'
    }else {
        return
    }
    
}
init()
