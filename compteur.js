
let numberEncounter = 0

function incremente(){
    numberEncounter++;
    displayEncounter()
}

function displayEncounter(){
    const element = document.getElementById("encounter")

    element.innerText = numberEncounter
}

function shiny(){
    console.log("houra");
}

displayEncounter()