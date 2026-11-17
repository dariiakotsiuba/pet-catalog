// Практична 13: SPA з hash-based роутингом (location.hash), без перезавантаження сторінки.
// Підключається ПІСЛЯ script.js, бо користується petsApp, SPECIES_INFO і speciesSelect.
// Контейнер усіх «сторінок» - <div id="app"> (Vue-застосунок PetsCatalog).
// Кожна view-функція лише вмикає потрібну «сторінку» (petsApp.page), а саме малювання
// робить Vue-шаблон і вже наявний компонент PetCard (практична 10), тому розмітка не дублюється.

const SPECIES_CLASSES = Object.values(SPECIES_INFO).map((info) => info.cls);

// ---- view-функції ----

// «/» - список усіх тварин
function renderHome() {
  petsApp.speciesFilter = "all";
  petsApp.page = { name: "list" };
}

// «/pets/:id» - картка однієї тварини (фото і нотатки), id - ключ запису в IndexedDB
function renderPetDetail({ id }) {
  petsApp.page = { name: "detail", id: Number(id) };
}

// «/species/:species» - список, відфільтрований за видом (cat, dog, fish, bird, rodent, reptile)
function renderSpecies({ species }) {
  if (!SPECIES_CLASSES.includes(species)) {
    renderNotFound();
    return;
  }
  petsApp.speciesFilter = species;
  petsApp.page = { name: "list" };
}

// Невідомий маршрут - сторінка «Не знайдено»
function renderNotFound() {
  petsApp.page = { name: "notfound" };
}

// ---- таблиця маршрутів ----
// Шлях зіставляється з патерном по сегментах; сегмент, що починається з «:», - параметр.
// Параметри потім потрапляють у view-функцію: {id} або {species}.
const routes = [
  { path: "/", view: renderHome },
  { path: "/pets/:id", view: renderPetDetail },
  { path: "/species/:species", view: renderSpecies },
];

function matchRoute(path) {
  const pathParts = path.split("/").filter(Boolean);

  for (const route of routes) {
    const routeParts = route.path.split("/").filter(Boolean);
    if (routeParts.length !== pathParts.length) continue;

    const params = {};
    const isMatch = routeParts.every((part, i) => {
      if (part.startsWith(":")) {
        params[part.slice(1)] = decodeURIComponent(pathParts[i]);
        return true;
      }
      return part === pathParts[i];
    });

    if (isMatch) return { view: route.view, params };
  }
  return null; // маршрут не знайдено - сторінка 404
}

// ---- рендер і навігація ----

function render() {
  const path = location.hash.slice(1) || "/";
  const match = matchRoute(path);

  if (match) {
    match.view(match.params);
  } else {
    renderNotFound();
  }

  // Випадний список виду має відповідати адресі (кнопки «назад»/«вперед», пряме посилання)
  speciesSelect.value = petsApp.speciesFilter;
}

// Програмний перехід (після додавання/видалення, зміни фільтра).
// Якщо хеш уже такий самий, hashchange не спрацює, тому рендеримо вручну.
function navigate(path) {
  if (location.hash === "#" + path) {
    render();
  } else {
    location.hash = path;
  }
}

// «назад»/«вперед» і ручна зміна адреси
window.addEventListener("hashchange", render);

// Перший показ сторінки за поточним хешем
render();
