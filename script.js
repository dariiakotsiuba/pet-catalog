// Крок 3. Перевірка підключення файлу
console.log("script.js підключено");

// Крок 4. Дані варіанта 12: масив тварин
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

// Стрілкова функція (крок 7): переводить вік із років у місяці
const ageInMonths = (years) => years * 12;

// Класифікує тварину за віком: повертає «молода» або «доросла»
function classifyByAge(animal) {
  if (animal.ageYears < YOUNG_LIMIT_YEARS) {
    return "молода";
  } else {
    return "доросла";
  }
}

// Цикл for...of (крок 5): виводить у консоль усіх тварин заданого виду
// з віком у роках і місяцях та віковою категорією, а також підсумок
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
