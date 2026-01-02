let addBtn = document.querySelector('.add-btn')

let modalCont = document.querySelector('.modal-cont');

let taskArea = document.querySelector(".textArea-cont")

let mainCont = document.querySelector(".main-cont")

let allPriorityColors = document.querySelectorAll('.priority-color')

let removeBtn = document.querySelector('.remove-btn')

let filterBoxColors = document.querySelectorAll('.color')


let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']

let removeBtnFlag = false;

let addBtnFlag = false;

let modalTaskColor = "lightPink"



//  Json.stringify




// Ticket Array

let ticketsArray = JSON.parse(localStorage.getItem('apptickets')) || [];




// Lock Variable

let lockOpen = 'fa-unlock'
let lockClose = 'fa-lock'



//  Ticket removal
removeBtn.addEventListener('click', function () {
    removeBtnFlag = !removeBtnFlag
    if (removeBtnFlag) {
        alert("Delete Button Activated")
        removeBtn.style.color = 'red'

    } else {

        removeBtn.style.color = 'white'
    }
})



// handle Removal
function handleRemoval(ticket) {
    ticket.addEventListener('click', function () {
        if (removeBtnFlag === true) {
            const id = ticket.querySelector('.ticket-id').innerText
            let idx = getIdx(id)
              ticketsArray.splice(idx,1)
       
            ticket.remove()
             updateLocalStorage()
           
        }
    })

}



//modal popup open and close

addBtn.addEventListener('click', function () {
    addBtnFlag = !addBtnFlag
    if (addBtnFlag) {
        // Display Modal Pop up
        modalCont.style.display = 'flex'
    } else {
        // Hide the modal pop up
        modalCont.style.display = 'none'
    }

})



// Handle Chnage of Priority Colors

function handleColor(ticket) {
    const ticketColorBand = ticket.querySelector('.ticket-color')
    const id = ticket.querySelector('.ticket-id').innerText
    

  
    ticketColorBand.addEventListener('click', function () {
        let currentColor = ticketColorBand.style.backgroundColor

        let ticketIdx = getIdx(id);
           
 
        let currentColorIdx = colors.findIndex(function (color) {
            return color === currentColor

        })

        currentColorIdx++

        let newColorIdx = currentColorIdx
        let newColor = colors[newColorIdx]

       ticketColorBand.style.backgroundColor = newColor

    //    
    ticketsArray[ticketIdx].ticketColor = newColor
       updateLocalStorage()
})


}






// Handle Lock to edit content
function handleLock(ticket) {
    const ticketLockContainer = ticket.querySelector('.ticket-lock')
    let ticketLock = ticketLockContainer.children[0]
    let taskArea = document.querySelector('.task-area')
    ticketLock.addEventListener('click', function () {
        if (ticketLock.classList.contains(lockClose)) {
            // lock open
            ticketLock.classList.add(lockOpen)
            ticketLock.classList.remove(lockClose)
            taskArea.setAttribute('contenteditable', 'true')

        } else {
            //  lock close
            ticketLock.classList.add(lockClose)
            ticketLock.classList.remove(lockOpen)
            taskArea.setAttribute('contenteditable', 'false')

        }
    })

}



// function to create the Ticket
function createTicket(taskColor, task, id) {
    const ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'ticket-cont')
    ticketCont.innerHTML = `<div class="ticket-color" style="background-color:${taskColor} ;"></div>
            <div class="ticket-id">${id}</div>
            <div class="task-area">${task}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>`
    mainCont.appendChild(ticketCont)
    handleRemoval(ticketCont)
    handleColor(ticketCont)
    handleLock(ticketCont)

}



// change priority of the tickets





// get data for the ticket on modal event

modalCont.addEventListener('keydown', function (e) {
    if (e.key == 'Shift') {
        const task = taskArea.value
        const id = shortid()
        // create the task ticket
        createTicket(modalTaskColor, task, id)
        modalCont.style.display = 'none'
        addBtnFlag = false
        taskArea.value = ''
        ticketsArray.push({ ticketColor: modalTaskColor, ticketTask: task,  ticketId: id })
        updateLocalStorage()


    }


})




// Moving Active class to respective coor and selecting it
allPriorityColors.forEach(function (colorElem) {
    colorElem.addEventListener('click', function () {
        allPriorityColors.forEach(function (priorityColor) {
            priorityColor.classList.remove('active')
        })
        colorElem.classList.add('active')

        modalTaskColor = colorElem.classList[0]
    })

})



// Filter task according to selected Color

filterBoxColors.forEach(function (color) {
    color.addEventListener('click', function () {
        let selectedColor = color.classList[0]
        let allTickets = document.querySelectorAll('.ticket-cont')

        allTickets.forEach(function (ticket) {
            let ticketColors = ticket.querySelector('.ticket-color')
            console.log(ticketColors)
            if (ticketColors.style.backgroundColor === selectedColor) {
                // display the ticketes
                ticket.style.display = 'block'
            }
            else {
                //    hide the tickets
                ticket.style.display = 'none'
            }

        })

    })
})



// set Local storage 

function updateLocalStorage() {
    localStorage.setItem('apptickets', JSON.stringify(ticketsArray))
}


function init() {
    if (localStorage.getItem('apptickets')) {

        ticketsArray.forEach(function (ticket) {
            createTicket(ticket.ticketColor, ticket.ticketTask ,ticket.ticcketId)
        })

    }
}
init()


// get ticket Id

function getIdx(selectedTicketId){
    const ticketIdx = ticketsArray.findIndex(function(ticket){
        return ticket.ticketId === selectedTicketId

    })
    return ticketIdx
    
}