const containerDiv = document.querySelector(".container");
const resultadoDiv = document.getElementById("resultado");
const formulario = document.getElementById("formulario");

const templateSpinner = document.getElementById("templateSpinner").content;
const templateClima = document.getElementById("templateClima").content;
const fragment = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", () => {
  formulario.addEventListener("submit", buscarClima);
});

function buscarClima(e) {
  e.preventDefault();

  const ciudad = document.getElementById("ciudad").value;
  const pais = document.getElementById("pais").value;

  if (ciudad.trim() === "" || pais.trim() === "") {
    mostrarError("Ambos campos son obligatorios");
    return;
  }

  consultarApi(ciudad, pais);
}

function consultarApi(ciudad, pais) {
  limpiarHTML();

  const idApi = "626ce9efd32ae5c30791d4168af3dcea";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&units=metric&appid=${idApi}`;

  mostrarSpinner();

  setTimeout(() => {
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        if (datos.cod === "404") {
          mostrarError("Ciudad no encontrada");
        }

        mostrarClima(datos);
      });
  }, 3000);
}

function mostrarSpinner() {
  const cloneSpinner = templateSpinner.cloneNode(true);

  fragment.appendChild(cloneSpinner);
  resultadoDiv.appendChild(fragment);
}

function mostrarClima(arreglo) {
  limpiarHTML();

  const {
    name,
    main: { temp, temp_max, temp_min },
  } = arreglo;

  const cloneClima = templateClima.cloneNode(true);
  cloneClima.querySelector("#ciudad").textContent = `Clima en ${name}`;
  cloneClima.querySelector("#tempAct").textContent = `${temp} °C`;
  cloneClima.querySelector("#tempMax").textContent = `Max: ${temp_max} °C`;
  cloneClima.querySelector("#tempMin").textContent = `Min: ${temp_min} °C`;

  fragment.appendChild(cloneClima);
  resultadoDiv.appendChild(fragment);
}

function mostrarError(mensaje) {
  const isAlerta = document.querySelector(".bg-red-100");

  if (!isAlerta) {
    const alertaDiv = document.createElement("div");
    const strong = document.createElement("strong");
    const span = document.createElement("span");

    alertaDiv.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    strong.classList.add("font-bold");
    strong.textContent = "Error";

    span.classList.add("block");
    span.textContent = mensaje;

    strong.appendChild(span);
    alertaDiv.appendChild(strong);
    containerDiv.appendChild(alertaDiv);

    setTimeout(() => {
      alertaDiv.remove();
    }, 3000);
  }
}

function limpiarHTML() {
  while (resultadoDiv.firstChild) {
    resultadoDiv.removeChild(resultadoDiv.firstChild);
  }
}