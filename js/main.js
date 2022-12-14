'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStore = () => JSON.parse(localStorage.getItem('db_service')) ?? []
const setLocalStore = (dbService) => localStorage.setItem("db_service", JSON.stringify(dbService))

//Crud - create read update delete

const deleteService = (index) => {
    const dbService = readService()
    dbService.splice (index, 1)
    setLocalStore(dbService)
}

const readService = () => getLocalStore()

const updateService = (index, service) => {
    const dbService = readService()
    dbService[index] = service
    setLocalStore(dbService)
} 

const createService = (service) => {
    const dbService = getLocalStore ()
    dbService.push (service)
    setLocalStore (dbService)
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o usuário
const saveService = () => {
    if (isValidFields()) {
        const service = {
            numero: document.getElementById('numero').value,
            cliente: document.getElementById('cliente').value,
            vendedor: document.getElementById('vendedor').value,
            tipo: document.getElementById('tipo').value,
            status: document.getElementById('status').value,
        }
        const index = document.getElementById('numero').dataset.index
        if (index == 'new') {
            createService(service)
            updateTable()
            closeModal()
        } else {
            updateService(index, service)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (service, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${service.numero}</td>
        <td>${service.cliente}</td>
        <td>${service.vendedor}</td>
        <td>${service.tipo}</td>
        <td>${service.status}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>    
    `
    document.querySelector('#tableService>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableService>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbService = readService()
    clearTable()
    dbService.forEach(createRow)
}

const fillFields = (service) => {
    document.getElementById('numero').value = service.numero
    document.getElementById('cliente').value = service.cliente
    document.getElementById('vendedor').value = service.vendedor
    document.getElementById('tipo').value = service.tipo
    document.getElementById('status').value = service.status
    document.getElementById('numero').dataset.index = service.index 
}

const editService = (index) => {
    const service = readService()[index]
    service.index = index
    fillFields(service)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editService(index)
        } else {
            const service = readService()[index]
            const response = confirm (`Deseja realmente excluir a O.S nº: ${service.numero}`)
            if (response) {
                deleteService(index)
                updateTable()
            }

        }
    }
}

updateTable()

//Eventos
document.getElementById('entradaServico').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveService)

document.querySelector('#tableService>tbody').addEventListener('click', editDelete)