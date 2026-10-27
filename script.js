// Перевірка підключення файлу
console.log("script.js підключено");

// Дані варіанта 12: масив тварин (у кожної свої фото й опис)
const animals = [
  {
    name: "Мурка",
    species: "кіт",
    ageYears: 1,
    img: "assets/img/cat-tabby.jpg",
    description:
      "Грайлива молода кішка, любить ганяти м'ячик і спати на підвіконні.",
  },
  {
    name: "Барсик",
    species: "кіт",
    ageYears: 5,
    img: "assets/img/cat-british.jpg",
    description: "Спокійний дорослий кіт британської породи, не любить галасу.",
  },
  {
    name: "Рекс",
    species: "собака",
    ageYears: 3,
    img: "assets/img/dog-labrador.jpg",
    description: "Активний лабрадор, потребує щоденних прогулянок і ігор.",
  },
  {
    name: "Бім",
    species: "собака",
    ageYears: 0.5,
    img: "assets/img/dog-puppy.jpg",
    description: "Цікаве цуценя, якого ще треба привчати до команд.",
  },
  {
    name: "Золотко",
    species: "риба",
    ageYears: 2,
    img: "assets/img/fish-goldfish.jpg",
    description: "Спокійна золота рибка, яка полюбляє просторий акваріум.",
  },
  {
    name: "Кеша",
    species: "папуга",
    ageYears: 1.5,
    img: "assets/img/bird-budgie.jpg",
    description:
      "Балакучий хвилястий папужка, вже вміє повторювати кілька слів.",
  },
  {
    name: "Пухнастик",
    species: "хом'як",
    ageYears: 0.8,
    img: "assets/img/hamster-dzungarian.jpg",
    description:
      "Маленький джунгарський хом'як, активний уночі й любить колесо.",
  },
  {
    name: "Тортілла",
    species: "черепаха",
    ageYears: 10,
    img: "assets/img/turtle-redeared.jpg",
    description:
      "Доросла червоновуха черепаха, любить гріти спинку під лампою.",
  },
];

// Тварина до цього віку (у роках) вважається молодою
const YOUNG_LIMIT_YEARS = 2;

// Довідник для оформлення карток: клас виду, підпис, розмір, фото за замовчуванням,
// загальний опис (для нових тварин із форми) і id для навігації
const SPECIES_INFO = {
  кіт: {
    cls: "cat",
    tag: "Кіт",
    size: "medium",
    sizeText: "Середній",
    img: "assets/img/cat-british.jpg",
    anchor: "cats",
    description:
      "Спокійна й доброзичлива тварина, підходить для квартирного утримання.",
  },
  собака: {
    cls: "dog",
    tag: "Собака",
    size: "large",
    sizeText: "Великий",
    img: "assets/img/dog-labrador.jpg",
    anchor: "dogs",
    description:
      "Активна тварина, потребує щоденних прогулянок і фізичних навантажень.",
  },
  риба: {
    cls: "fish",
    tag: "Риба",
    size: "small",
    sizeText: "Малий",
    img: "assets/img/fish-goldfish.jpg",
    anchor: "fish",
    description: "Невибаглива акваріумна риба, підходить для початківців.",
  },
  папуга: {
    cls: "bird",
    tag: "Папуга",
    size: "small",
    sizeText: "Малий",
    img: "assets/img/bird-budgie.jpg",
    anchor: "birds",
    description:
      "Товариський і балакучий птах, легко звикає до рук за регулярного спілкування.",
  },
  "хом'як": {
    cls: "rodent",
    tag: "Хом'як",
    size: "small",
    sizeText: "Малий",
    img: "assets/img/hamster-dzungarian.jpg",
    anchor: "rodents",
    description:
      "Невеликий нічний гризун, якому достатньо просторої клітки й колеса для бігу.",
  },
  черепаха: {
    cls: "reptile",
    tag: "Черепаха",
    size: "medium",
    sizeText: "Середній",
    img: "assets/img/turtle-redeared.jpg",
    anchor: "reptiles",
    description:
      "Водно-суходільна черепаха, потребує акватераріум з підігрівом і УФ-лампою.",
  },
};

// Стрілкова функція: переводить вік із років у місяці
const ageInMonths = (years) => years * 12;

// Класифікує тварину за віком: повертає «молода» або «доросла»
function classifyByAge(animal) {
  if (animal.ageYears < YOUNG_LIMIT_YEARS) {
    return "молода";
  } else {
    return "доросла";
  }
}

// Повертає CSS-клас за віком: "young" або "adult"
function ageClass(animal) {
  return animal.ageYears < YOUNG_LIMIT_YEARS ? "young" : "adult";
}

// Крок 3. Вибираємо контейнер і елемент-підсумок
const listContainer = document.querySelector("#pets-list");
const petsCount = document.querySelector("#pets-count");

// Крок 2. Динамічно видаляємо статичні картки-заглушки з практикуму 2
document
  .querySelectorAll("#pets-list .animal-card")
  .forEach((card) => card.remove());

// Крок 4-8. Рендер списку тварин із масиву.
// Для кожної тварини створює <article> з мета-даними, фото, h3 (ім'я) і p (опис),
// ставить атрибути (img.src, img.alt, data-species) та клас young/adult за віком.
function renderPets(list) {
  // Очищаємо контейнер перед виведенням
  listContainer.innerHTML = "";
  // Щоб id для навігації (#cats, #dogs…) отримала лише перша картка виду
  const usedAnchors = new Set();

  list.forEach((animal) => {
    const info = SPECIES_INFO[animal.species];

    // Картка
    const card = document.createElement("article");
    card.classList.add("animal-card", `species-${info.cls}`, ageClass(animal));
    card.dataset.species = animal.species;
    if (!usedAnchors.has(info.anchor)) {
      card.id = info.anchor;
      usedAnchors.add(info.anchor);
    }

    // Мета-дані: вид і розмір
    const meta = document.createElement("div");
    meta.classList.add("card-meta");
    const tag = document.createElement("span");
    tag.classList.add("species-tag");
    tag.textContent = info.tag;
    const size = document.createElement("span");
    size.classList.add("size-badge", `size-${info.size}`);
    size.textContent = info.sizeText;
    meta.append(tag, size);

    // Фото: своє, а якщо його немає - стандартне для виду
    const img = document.createElement("img");
    img.src = animal.img || info.img;
    img.alt = `${info.tag} ${animal.name}, ${classifyByAge(animal)}`;

    // Ім'я та опис: свій, а якщо його немає - загальний для виду
    const title = document.createElement("h3");
    title.textContent = animal.name;
    const text = document.createElement("p");
    text.textContent = animal.description || info.description;

    card.append(meta, img, title, text);
    listContainer.append(card);
  });
}

// Цикл for...of: виводить у консоль усіх тварин заданого виду (з практикуму 6)
function printBySpecies(list, species) {
  console.log(`--- Тварини виду «${species}» ---`);
  let count = 0;

  for (const animal of list) {
    if (animal.species === species) {
      const category = classifyByAge(animal);
      const months = ageInMonths(animal.ageYears);
      console.log(
        `${animal.name}: ${animal.ageYears} р. (${months} міс.) - ${category}`,
      );
      count++;
    }
  }

  console.log(`Усього знайдено: ${count}`);
}

// Виводить усіх тварин зі списку з віковою категорією (класичний for з індексом)
function printAll(list) {
  console.log("--- Усі тварини ---");
  for (let i = 0; i < list.length; i++) {
    console.log(
      `${i + 1}. ${list[i].name} (${list[i].species}) - ${classifyByAge(list[i])}`,
    );
  }
}

// ===== Практична 8: події, форма, валідація =====

// Елементи фільтрів
const speciesFilter = document.querySelector("#species-select");
const sizeFilter = document.querySelector("#size-select");
const filtersForm = document.querySelector("#filters form");

// Елементи форми додавання
const petForm = document.querySelector("#pet-form");
const nameInput = document.querySelector("#pet-name");
const speciesInput = document.querySelector("#pet-species");
const ageInput = document.querySelector("#pet-age");
const ageError = document.querySelector("#age-error");

// Повертає тварин, що відповідають обраним фільтрам виду й розміру
function getFilteredPets() {
  return animals.filter((animal) => {
    const info = SPECIES_INFO[animal.species];
    const speciesOk =
      speciesFilter.value === "all" || info.cls === speciesFilter.value;
    const sizeOk = sizeFilter.value === "all" || info.size === sizeFilter.value;
    return speciesOk && sizeOk;
  });
}

// Перемальовує список з урахуванням фільтрів і оновлює підсумок
function updateView() {
  const list = getFilteredPets();
  renderPets(list);
  petsCount.textContent = `Показано: ${list.length} з ${animals.length}`;
}

// Форма фільтрів не має надсилатися як звичайна форма
filtersForm.addEventListener("submit", (event) => event.preventDefault());

// Друга подія варіанта: change на select виду фільтрує список
speciesFilter.addEventListener("change", updateView);
sizeFilter.addEventListener("change", updateView);

// Додаткова валідація: input на ageYears (від'ємне або більше 50)
ageInput.addEventListener("input", () => {
  const value = ageInput.value;

  if (value === "") {
    ageInput.setCustomValidity("");
  } else if (Number(value) < 0) {
    ageInput.setCustomValidity("Вік не може бути від'ємним");
  } else if (Number(value) > 50) {
    ageInput.setCustomValidity("Вік завеликий: максимум 50 років");
  } else {
    ageInput.setCustomValidity("");
  }

  // Показуємо повідомлення поруч із полем
  ageError.textContent = ageInput.validationMessage;
});

// Знімаємо помилку імені, коли користувач починає виправляти
nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));

// Обробка надсилання форми: без перезавантаження сторінки
petForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  if (name === "") {
    // required пропускає рядок із самих пробілів, тому перевіряємо вручну
    nameInput.setCustomValidity("Введіть ім'я тварини");
    nameInput.reportValidity();
    return;
  }

  // Новий об'єкт тієї самої форми, що й елементи масиву
  // (фото й опис підставляться автоматично зі SPECIES_INFO)
  const newPet = {
    name: name,
    species: speciesInput.value,
    ageYears: Number(ageInput.value),
  };

  animals.push(newPet);

  // Скидаємо фільтри, щоб новий запис точно було видно
  speciesFilter.value = "all";
  sizeFilter.value = "all";

  updateView();
  petForm.reset();
  ageError.textContent = "";
});

// Перший показ списку
updateView();

// Виклики з реальними даними (з практикуму 6)
printAll(animals);
printBySpecies(animals, "кіт");
printBySpecies(animals, "собака");
console.log("Вік Рекса у місяцях:", ageInMonths(3));
