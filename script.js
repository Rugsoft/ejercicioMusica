
const pistas = document.querySelectorAll(".pista");
const btnShuffle = document.getElementById("btn-shuffle");


let pistaActual = null;
let audioActual = null;

pistas.forEach((pista) => {
    pista.addEventListener("click", () => {

        const audioId = pista.getAttribute("data-audio");
        const audio = document.getElementById(audioId);

        if (pistaActual === pista) {
            
            if (audio.paused) {
                audio.play();
                pista.classList.remove("pausada");
                pista.classList.add("activa");
            } else {
                audio.pause();
                pista.classList.remove("activa");
                pista.classList.add("pausada");
            }
        } else {
            if (audioActual) {
                
                const confirmar = window.confirm("¿Seguro que quieres parar la pista actual y reproducir esta?");

                if (confirmar) {

                    detenerReproduccion();
                    audioReproducir(pista, audio);
                }

            } else {
                audioReproducir(pista, audio);
            }  
        }
    });
});

function detenerReproduccion() {

    if (audioActual) {

        audioActual.pause();
        audioActual.currentTime = 0; 
    }
    if (pistaActual){

        pistaActual.classList.remove("activa");
        pistaActual.classList.remove("pausada");
    }

    audioActual = null;
    pistaActual = null;
}

function audioReproducir(pista, audio){

    audio.play();
    pista.classList.add("activa");
    pistaActual = pista;
    audioActual = audio;
    audio.onended = () => {
        detenerReproduccion();
    };
}

btnShuffle.addEventListener("click", () => {

    const pistasArray = Array.from(pistas);
    const pistasDisponibles = pistasArray.filter(pista => pista !== pistaActual)

    const indiceAleatorio = Math.floor(Math.random() * pistasDisponibles.length);
    const pistaAleatoria = pistasDisponibles[indiceAleatorio];
    pistaAleatoria.click();

});