
const pistas = document.querySelectorAll(".pista");
const btnShuffle = document.getElementById("btn-shuffle");


let pistaActual = null;
let audioActual = null;

pistas.forEach((pista) => {

        const audioId = pista.getAttribute("data-audio");
        const audio = document.getElementById(audioId);

        const slider = pista.querySelector(".pista__slider");
        const tiempoActual = pista.querySelector(".pista__tiempo-actual");
        const tiempoTotal = pista.querySelector(".pista__tiempo-total");

        audio.addEventListener("loadedmetadata", () => {

            slider.max = audio.duration;
            tiempoTotal.textContent = formatearTiempo(audio.duration);
        });

        if (audio.duration) {

            slider.max = audio.duration;
            tiempoTotal.textContent = formatearTiempo(audio.duration);
        }

        audio.addEventListener("timeupdate", () => {

            slider.value = audio.currentTime;
            tiempoActual.textContent = formatearTiempo(audio.currentTime);
        });

        slider.addEventListener("input", () => {

            audio.currentTime = slider.value;
        });

        pista.addEventListener("click", (e) => {

            //if (e.target.classList.contains('pista__slider')) return;

            if (e.target.closest(".pista__progreso")) return;

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

function formatearTiempo(segundos) {

    if (isNaN(segundos)) {
        return "0:00";
    }
    const mins = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
}