
// Elementos de la interfaz de usuario
const pistas = document.querySelectorAll(".pista");
const btnShuffle = document.getElementById("btn-shuffle");

// Elementos del sistema Jukebox
const btnMonedas = document.querySelectorAll(".btn-moneda");
const btnRefund = document.getElementById("btn-refund");
const txtSaldo = document.getElementById("jukebox-saldo");
const sonidoMoneda = document.getElementById("sonidoMoneda");

let saldoActual = 0.00;
let pistaActual = null;
let audioActual = null;

// Sistema de Ranking de reproducciones
let reproducciones = {};

// Cargar estadísticas guardadas del localStorage
const datosGuardados = localStorage.getItem("jukebox_reproducciones");
if (datosGuardados) {
    reproducciones = JSON.parse(datosGuardados);
}

// Escuchar la inserción de saldo
btnMonedas.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const valor = Number(e.currentTarget.value);
        saldoActual += valor;
        txtSaldo.textContent = `${saldoActual.toFixed(2)} €`;
        if (sonidoMoneda) {
            sonidoMoneda.currentTime = 0;
            sonidoMoneda.play();
        }
        actualizarEstadoPistas();
    });
});

// Devolución del cambio al pulsar devolver
btnRefund.addEventListener("click", () => {
    if (saldoActual <= 0) {
        window.alert("No tienes saldo acumulado para devolver.");
        return;
    }
    const cambioDesglose = calcularCambio(saldoActual);
    window.alert(`Compra cancelada.\nAquí tienes tu dinero (${saldoActual.toFixed(2)} €):${cambioDesglose}`);
    saldoActual = 0.00;
    txtSaldo.textContent = "0.00 €";
    actualizarEstadoPistas();
});

// Función para calcular el desglose del cambio
function calcularCambio(importeMonetario) {
    let detalle = "";
    let importeCentimos = Math.round(importeMonetario * 100);
    const monedasCentimos = [500, 200, 100, 50, 20, 10, 5];
    const monedasValores = [5.00, 2.00, 1.00, 0.50, 0.20, 0.10, 0.05];
    
    for (let i = 0; i < monedasCentimos.length; i++) {
        if (importeCentimos >= monedasCentimos[i]) {
            let veces = Math.floor(importeCentimos / monedasCentimos[i]);
            importeCentimos = importeCentimos % monedasCentimos[i];
            detalle += `\n- ${veces} x ${monedasValores[i].toFixed(2)} €`;
        }
    }
    return detalle;
}

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

            if (e.target.closest(".pista__progreso")) return;

            if (pistaActual === pista) {
                // Control gratuito (pausar o reanudar pista activa actual)
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
                // Seleccionar una pista nueva requiere cobrar 1.00 €
                if (saldoActual >= 1.00) {
                    const iniciarNuevaPista = () => {
                        saldoActual -= 1.00;
                        txtSaldo.textContent = `${saldoActual.toFixed(2)} €`;
                        detenerReproduccion();
                        audioReproducir(pista, audio);
                    };

                    if (audioActual) {
                        const confirmar = window.confirm("¿Seguro que quieres parar la pista actual y reproducir esta? (Se descontará 1.00 €)");
                        if (confirmar) {
                            iniciarNuevaPista();
                        }
                    } else {
                        iniciarNuevaPista();
                    }
                } else {
                    window.alert(`Saldo insuficiente. Cada canción cuesta 1.00 €.\nSaldo actual: ${saldoActual.toFixed(2)} €.\n¡Introduce más monedas!`);
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
    actualizarEstadoPistas();
}

function audioReproducir(pista, audio){

    audio.play();
    pista.classList.add("activa");
    pistaActual = pista;
    audioActual = audio;

    // Incrementar el contador de la canción que empezó a sonar
    const titulo = pista.querySelector(".pista__titulo").textContent;
    reproducciones[titulo] = (reproducciones[titulo] || 0) + 1;
    localStorage.setItem("jukebox_reproducciones", JSON.stringify(reproducciones));
    actualizarRankingUI();

    actualizarEstadoPistas();
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

// Función para bloquear o desbloquear las pistas visualmente según el saldo
function actualizarEstadoPistas() {
    pistas.forEach((pista) => {
        if (pista === pistaActual) {
            // La pista activa nunca se bloquea
            pista.classList.remove("bloqueada");
        } else if (saldoActual < 1.00) {
            // Se bloquea si no hay saldo suficiente (1.00 €) y no está reproduciendo
            pista.classList.add("bloqueada");
        } else {
            // Se desbloquea si hay saldo suficiente
            pista.classList.remove("bloqueada");
        }
    });
}

// Inicializar todas las canciones a 0 si no están registradas
pistas.forEach((pista) => {
    const titulo = pista.querySelector(".pista__titulo").textContent;
    if (reproducciones[titulo] === undefined) {
        reproducciones[titulo] = 0;
    }
});

// Función para actualizar y renderizar el panel del Top 5
function actualizarRankingUI() {
    const rankingLista = document.getElementById("ranking-lista");
    if (!rankingLista) return;

    // Convertir el objeto de estadísticas en un array y ordenarlo de mayor a menor
    const cancionesArray = Object.entries(reproducciones);
    cancionesArray.sort((a, b) => b[1] - a[1]);

    // Filtrar el top 5
    const top5 = cancionesArray.slice(0, 5);

    // Limpiar y maquetar el ranking
    rankingLista.innerHTML = "";
    top5.forEach((cancion, index) => {
        const [titulo, count] = cancion;

        // Encontrar el autor correspondiente a esta canción
        let autor = "";
        pistas.forEach((pista) => {
            if (pista.querySelector(".pista__titulo").textContent === titulo) {
                autor = pista.querySelector(".pista__autor").textContent;
            }
        });

        const li = document.createElement("li");
        li.className = "ranking-panel__item";
        li.innerHTML = `
            <div class="ranking-panel__puesto">${index + 1}</div>
            <div class="ranking-panel__info">
                <span class="ranking-panel__cancion-titulo">${titulo}</span>
                <span class="ranking-panel__cancion-autor">${autor}</span>
            </div>
            <div class="ranking-panel__contador">
                <span class="ranking-panel__numero">${count}</span>
                <span class="ranking-panel__veces">${count === 1 ? 'reproducción' : 'reproducciones'}</span>
            </div>
        `;
        rankingLista.appendChild(li);
    });
}

// Inicializar estado de las pistas bloqueadas al cargar la página
actualizarEstadoPistas();

// Inicializar la interfaz del Top 5
actualizarRankingUI();

// Control del Modal de Bienvenida y Audio de Saludo
const welcomeModal = document.getElementById("welcome-modal");
const welcomeBtn = document.getElementById("welcome-btn");

if (welcomeBtn && welcomeModal) {
    welcomeBtn.addEventListener("click", () => {
        // Ocultar modal con transición
        welcomeModal.classList.add("hidden");
        // Reproducir el saludo inmediatamente
        if (sonidoSaludo) {
            sonidoSaludo.currentTime = 0;
            sonidoSaludo.play().catch((err) => {
                console.log("Error al reproducir audio de saludo:", err);
            });
        }
    });
}                                 