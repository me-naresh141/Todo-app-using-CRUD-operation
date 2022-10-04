let ul = document.querySelector('ul')
let input = document.querySelector('input')
let url = 'https://basic-todo-api.vercel.app/api/todo'

// handle Delete

function handleDelete(id) {
  fetch(url + `/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((response) => {
      fetchData()
    })
}

// createUi
function createUi(data) {
  ul.innerHTML = ''
  console.log(data)
  data.forEach((obj) => {
    let li = document.createElement('li')
    let input = document.createElement('input')
    input.type = 'checkbox'
    input.checked = obj.isCompleted
    input.setAttribute('data-id', obj._id)
    input.addEventListener('click', (e) => {
      handleToggel(obj._id, obj.isCompleted)
    })
    let p = document.createElement('p')
    p.innerText = obj.title
    p.addEventListener('dblclick', (e) => {
      updateTodo(e, obj._id)
    })
    let span = document.createElement('span')
    span.innerText = '✖️'
    span.setAttribute('data-id', obj._id)
    span.addEventListener('click', () => handleDelete(obj._id))
    li.append(input, p, span)
    ul.append(li)
  })
}

// fetch Data

function fetchData() {
  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      let allData = response.todos
      console.log(allData)
      createUi(allData)
    })
}

// addTodo
function addTodo(e) {
  if (e.keyCode === 13) {
    let Userdata = {
      todo: {
        title: e.target.value,
        isCompleted: false,
      },
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Userdata),
    }).then(() => {
      fetchData()
      e.target.value = ''
    })
  }
}

//updateTodo

function updateTodo(e, id) {
  let input = document.createElement('input')
  input.type = 'text'
  let parent = e.target.parentElement
  let p = e.target
  let pValue = e.target.innerText
  parent.replaceChild(input, p)
  input.value = pValue
  input.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      let data = {
        todo: {
          title: e.target.value,
        },
      }
      fetch(url + `/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(() => {
        fetchData()
      })
    }
  })
}

// handleToggel
function handleToggel(id, isCompleted) {
  let data = {
    todo: {
      isCompleted: !isCompleted,
    },
  }
  fetch(url + `/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(() => {
    fetchData()
  })
}

new Sortable(ul, {
  animation: 200,
})
input.addEventListener('keyup', addTodo)
fetchData()
