
const pistas = document.querySelectorAll(".pista");

let pistaActual = null;
let audioActual = null;

pistas.forEach((pista) => {
    pista.addEventListener("click", () => {

        const audioId = pista.getAttribute("data-audio");
        const audio = document.getElementById(audioId);

        if (pistaActual === pista) {
            
            detenerReproduccion();
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