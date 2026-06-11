# Sonic Pulse - Jukebox 🪙🎵

Sonic Pulse es un reproductor de música interactivo que funciona con un sistema de monedas estilo Jukebox.

---

## 🚀 ¿Cómo funciona?

El flujo de uso de la Jukebox es el siguiente:

1. **Insertar Saldo**: 
   - Haces clic en los botones de monedas (`0.05 €` a `2.00 €`) o billetes (`5.00 €`) para recargar saldo.
   - Cada inserción reproduce un sonido de moneda y aumenta el saldo disponible en pantalla.

2. **Seleccionar y Reproducir Canciones**:
   - Cada canción cuesta **1.00 €**.
   - **Bloqueo Visual**: Si tu saldo actual es **menor a 1.00 €**, las canciones se atenuarán (opacidad reducida) y el cursor cambiará a no permitido (`not-allowed`) para indicar visualmente que están bloqueadas.
   - **Excepción de la Pista Activa**: La canción que se está reproduciendo actualmente mantendrá su opacidad normal e interactividad completa (para pausar/reanudar gratuitamente) aunque el saldo esté por debajo de 1.00 €, hasta que termine de sonar.
   - Si tienes saldo suficiente (>= 1.00 €) y seleccionas una canción nueva, se descuentan **1.00 €** de tu saldo, se reproducirá, y las demás volverán a bloquearse.
   - Si intentas forzar la reproducción de una canción bloqueada, se mostrará un mensaje de alerta indicando saldo insuficiente.

3. **Devolver Saldo**:
   - Si quieres cancelar y recuperar tu dinero acumulado, haces clic en **"Devolver Saldo"**.
   - El sistema calcula y te devuelve el importe exacto desglosado en el menor número de monedas posible (por ejemplo, si tienes `1.85 €` te devolverá una moneda de `1.00 €`, una de `0.50 €`, una de `0.20 €`, una de `0.10 €` y una de `0.05 €`).

4. **Modal de Entrada y Saludo**:
   - Al entrar en la web por primera vez, se mostrará una ventana flotante personalizada (modal) de bienvenida.
   - Al pulsar el botón "Entrar a la Jukebox", el modal se cerrará suavemente y se reproducirá de forma garantizada el sonido de saludo de bienvenida (`Saludo.mp3`).

---

## 📁 Estructura del Proyecto

El proyecto se compone de los siguientes archivos:

*   **`index.html`**: Estructura de la página. Está dividida en dos columnas principales en pantallas de ordenador (canciones en cuadrícula a la izquierda y el panel de Jukebox a la derecha).
*   **`style.css`**: Estilo visual. Contiene el diseño oscuro y luces tipo Neon, y se adapta a pantallas de móviles y ordenadores (responsivo).
*   **`script.js`**: Lógica de funcionamiento. Controla los reproductores de audio, el control del saldo, el cobro por reproducción y el cálculo de la devolución del cambio.
*   **`audio/`**: Carpeta que contiene los archivos de audio de las canciones y el sonido de las monedas.
*   **`imagenes/`**: Carpeta con las carátulas e iconos utilizados.
