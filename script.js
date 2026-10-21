// Перевірка підключення файлу
console.log("script.js підключено");

// Дані варіанта 12: масив тварин
const animals = [
  { name: "Мурка", species: "кіт", ageYears: 1 },
  { name: "Барсик", species: "кіт", ageYears: 5 },
  { name: "Рекс", species: "собака", ageYears: 3 },
  { name: "Бім", species: "собака", ageYears: 0.5 },
  { name: "Золотко", species: "риба", ageYears: 2 },
  { name: "Кеша", species: "папуга", ageYears: 1.5 },
  { name: "Пухнастик", species: "хом'як", ageYears: 0.8 },
  { name: "Тортілла", species: "черепаха", ageYears: 10 },
];

// Тварина до цього віку (у роках) вважається молодою
const YOUNG_LIMIT_YEARS = 2;

// Довідник для оформлення карток: клас виду, підпис, розмір, фото, id для навігації
const SPECIES_INFO = {
  кіт: {
    cls: "cat",
    tag: "Кіт",
    size: "medium",
    sizeText: "Середній",
    img: "assets/img/cat-british.jpg",
    anchor: "cats",
  },
  собака: {
    cls: "dog",
    tag: "Собака",
    size: "large",
    sizeText: "Великий",
    img: "assets/img/dog-labrador.jpg",
    anchor: "dogs",
  },
  риба: {
    cls: "fish",
    tag: "Риба",
    size: "small",
    sizeText: "Малий",
    img: "assets/img/fish-goldfish.jpg",
    anchor: "fish",
  },
  папуга: {
    cls: "bird",
    tag: "Папуга",
    size: "small",
    sizeText: "Малий",
    img: "assets/img/bird-budgie.jpg",
    anchor: "birds",
  },
  "хом'як": {
    cls: "rodent",
    tag: "Хом'як",
    size: "small",
    sizeText: "Малий",
    img: "assets/img/hamster-dzungarian.jpg",
    anchor: "rodents",
  },
  черепаха: {
    cls: "reptile",
    tag: "Черепаха",
    size: "medium",
    sizeText: "Середній",
    img: "assets/img/turtle-redeared.jpg",
    anchor: "reptiles",
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
// Для кожної тварини створює <article> з мета-даними, фото, h3 (ім'я) і p (вид),
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

    // Фото
    const img = document.createElement("img");
    img.src = info.img;
    img.alt = `${info.tag} ${animal.name}, ${classifyByAge(animal)}`;

    // Ім'я та вид
    const title = document.createElement("h3");
    title.textContent = animal.name;
    const text = document.createElement("p");
    text.textContent = animal.species;

    card.append(meta, img, title, text);
    listContainer.append(card);
  });
}

// Крок 8. Викликаємо рендер одразу після оголошення
renderPets(animals);

// Крок 9. Оновлюємо підсумковий елемент поза списком
petsCount.textContent = `Усього тварин: ${animals.length}`;

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

// Виклики з реальними даними
printAll(animals);
printBySpecies(animals, "кіт");
printBySpecies(animals, "собака");
console.log("Вік Рекса у місяцях:", ageInMonths(3));
