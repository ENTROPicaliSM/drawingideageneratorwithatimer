import nouns from "./nouns.js"
/*import structures from "./structures.js"
import {NOUN, ADJ, VERB} from "./structures.js"*/

const mainDialog = document.getElementById("main-dialog")
const generateButton = document.getElementById("generate-button")
const output = document.getElementById("output")

const timeAmount = document.getElementById("time-amount")
const timeLeft = document.getElementById("time-left")
const startTimerButton = document.getElementById("start-timer")

function getRandInt(min, max) { // [min, max)
    return min + Math.floor((max-min)*Math.random())
}

function click() {
    let noun = nouns[getRandInt(0, nouns.length)]
    let url = `https://api.datamuse.com/words?rel_jjb=${noun}`

    fetch(url)
    .then(response => response.json())
    .then(adjs => {
        let index = Math.floor(Math.random()**4 * adjs.length)
        let adj = adjs[index]

        if (!adj) return click();

        output.textContent = adj.word + " " + noun
    })
}
generateButton.onclick = click

{
    function formatTime(millis) {
        let seconds = millis / 1000

        let hr = Math.floor(seconds / 3600)
        let min = Math.floor((seconds % 3600) / 60)
        let sec = Math.floor(seconds % 60)

        let returning = (min) + ":" + (sec > 10 ? sec.toString() : "0" + sec.toString())
        if (hr) {
            returning = hr + ":" + returning
        }

        return returning
    }

    let startTime = Date.now()
    let amountTime = 0
    let active = false

    startTimerButton.onclick = () => {
        if (active) {
            active = false
            timeLeft.textContent = "0:00"
            startTimerButton.textContent = "start"
        } else{
            startTime = Date.now()
            amountTime = (Number(timeAmount.value) || 0) * 1000
            active = true
            startTimerButton.textContent = "stop"
        }
        
    }

    setInterval(() => {
        if (active) {
            let nTimeLeft = amountTime - (Date.now() - startTime)
            if (Math.floor(nTimeLeft) <= 0) {
                nTimeLeft = 0
            }
            timeLeft.textContent = formatTime(nTimeLeft)
            
            if (nTimeLeft <= 0) {
                timeLeft.style.color = "rgb(255, 0, 0)"
                active = false
                startTimerButton.textContent = "start"
            } else {
                delete timeLeft.style.color
            }
        }
    }, 500)
}