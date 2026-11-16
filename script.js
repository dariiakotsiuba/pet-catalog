// Практична 10. Обрано Vue 3: працює з CDN без Babel і JSX, шаблони схожі на
// звичайний HTML, а зміни масиву (push, присвоєння) Vue відстежує сам.
// Практична 11: дані зберігаються в IndexedDB (з одноразовою міграцією з localStorage).

// Перевірка підключення файлу
console.log("script.js підключено");

// Тварина до цього віку (у роках) вважається молодою
const YOUNG_LIMIT_YEARS = 2;

// Довідник для оформлення карток: клас виду, підпис, розмір, фото за замовчуванням,
// загальний опис (для нових тварин із форми) і id для навігації.
// Це незмінна константа; у компонент PetCard вона потрапляє лише через props.
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

// Практична 11: стартові тварини (раніше були в data() PetsCatalog).
// Поля моделі: id, name, species, photoUrl, notes (+ ageYears з попередніх практикумів).
// Використовуються лише для першого заповнення IndexedDB.
const DEFAULT_PETS = [
  {
    id: 1,
    name: "Мурка",
    species: "кіт",
    ageYears: 1,
    photoUrl: "assets/img/cat-tabby.jpg",
    notes: "Грайлива молода кішка, любить ганяти м'ячик і спати на підвіконні.",
  },
  {
    id: 2,
    name: "Барсик",
    species: "кіт",
    ageYears: 5,
    photoUrl: "assets/img/cat-british.jpg",
    notes: "Спокійний дорослий кіт британської породи, не любить галасу.",
  },
  {
    id: 3,
    name: "Рекс",
    species: "собака",
    ageYears: 3,
    photoUrl: "assets/img/dog-labrador.jpg",
    notes: "Активний лабрадор, потребує щоденних прогулянок і ігор.",
  },
  {
    id: 4,
    name: "Бім",
    species: "собака",
    ageYears: 0.5,
    photoUrl: "assets/img/dog-puppy.jpg",
    notes: "Цікаве цуценя, якого ще треба привчати до команд.",
  },
  {
    id: 5,
    name: "Золотко",
    species: "риба",
    ageYears: 2,
    photoUrl: "assets/img/fish-goldfish.jpg",
    notes: "Спокійна золота рибка, яка полюбляє просторий акваріум.",
  },
  {
    id: 6,
    name: "Кеша",
    species: "папуга",
    ageYears: 1.5,
    photoUrl: "assets/img/bird-budgie.jpg",
    notes: "Балакучий хвилястий папужка, вже вміє повторювати кілька слів.",
  },
  {
    id: 7,
    name: "Пухнастик",
    species: "хом'як",
    ageYears: 0.8,
    photoUrl: "assets/img/hamster-dzungarian.jpg",
    notes: "Маленький джунгарський хом'як, активний уночі й любить колесо.",
  },
  {
    id: 8,
    name: "Тортілла",
    species: "черепаха",
    ageYears: 10,
    photoUrl: "assets/img/turtle-redeared.jpg",
    notes: "Доросла червоновуха черепаха, любить гріти спинку під лампою.",
  },
];

// Стрілкова функція: переводить вік із років у місяці
const ageInMonths = (years) => years * 12;

// Класифікує тварину за віком: повертає «молода» або «доросла» (для консолі)
function classifyByAge(animal) {
  if (animal.ageYears < YOUNG_LIMIT_YEARS) {
    return "молода";
  } else {
    return "доросла";
  }
}

// ===== Практична 11: localStorage та IndexedDB =====
const LS_KEY = "pets";
const LS_MIGRATED_KEY = "petsMigrated";
const DB_NAME = "PetsDB";
const STORE = "pets";

// Кроки 2-4: localStorage (після переходу на IndexedDB потрібен лише для міграції).
// JSON.stringify перед записом, JSON.parse у try/catch після читання.
function saveToLocalStorage(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Пошкоджені дані в localStorage:", error);
    return [];
  }
}

// Кроки 5-6: відкриття бази PetsDB (версія 1). Object store «pets» з keyPath «id»
// створюється лише в onupgradeneeded.
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Крок 7: CRUD. put() і додає новий запис, і оновлює наявний із тим самим id.
async function addItem(item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Оновлення - той самий put()
const updateItem = addItem;

// Читання всіх записів (транзакція readonly)
async function getAllItems() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Видалення запису за id (транзакція readwrite)
async function deleteItem(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Крок 8: одноразова міграція. Якщо store порожній, переносимо дані з
// localStorage (а якщо там порожньо - стартових тварин) і ставимо прапорець,
// щоб перенесення не повторювалось при наступних завантаженнях.
async function migrateFromLocalStorage() {
  if (localStorage.getItem(LS_MIGRATED_KEY) === "true") return;

  const existing = await getAllItems();
  if (existing.length === 0) {
    const old = loadFromLocalStorage();
    const start = old.length > 0 ? old : DEFAULT_PETS;
    for (const pet of start) {
      await addItem({ ...pet });
    }
  }

  localStorage.setItem(LS_MIGRATED_KEY, "true");
}

// ===== Практична 10: компонент PetCard (варіант 12) =====
// Props: name, species, ageYears (за варіантом) + необов'язкові img, description,
// а також info (запис зі SPECIES_INFO) і youngLimit - щоб компонент не звертався
// до глобальних змінних напряму.
// Подія варіанта: клік по картці перемикає ЛОКАЛЬНИЙ прапорець isFavorite.
// Практична 11: removable + подія remove - кнопка «Видалити» (видаляє батько).
const PetCard = {
  name: "PetCard",
  props: {
    name: { type: String, required: true },
    species: { type: String, required: true },
    ageYears: { type: Number, default: null }, // у собаки з API віку немає
    img: { type: String, default: "" },
    description: { type: String, default: "" },
    info: { type: Object, required: true },
    youngLimit: { type: Number, default: 2 },
    removable: { type: Boolean, default: false },
  },
  emits: ["remove"],
  data() {
    return { isFavorite: false };
  },
  computed: {
    // Похідні значення: перераховуються самі, коли змінюються props
    hasAge() {
      return this.ageYears !== null;
    },
    ageClass() {
      if (!this.hasAge) return null;
      return this.ageYears < this.youngLimit ? "young" : "adult";
    },
    altText() {
      if (!this.hasAge) return `${this.info.tag} ${this.name}`;
      const category = this.ageYears < this.youngLimit ? "молода" : "доросла";
      return `${this.info.tag} ${this.name}, ${category}`;
    },
    imgSrc() {
      return this.img || this.info.img;
    },
    text() {
      return this.description || this.info.description;
    },
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite; // Vue сам перемалює картку
    },
  },
  // Бейдж «★ Обране» - третя «пігулка» в card-meta, щоб його не перекривало фото.
  // @click.stop і @keydown.stop на кнопці не дають події дійти до <article>.
  template: `
    <article
      class="animal-card"
      :class="['species-' + info.cls, ageClass, { favorite: isFavorite }]"
      :data-species="species"
      tabindex="0"
      @click="toggleFavorite"
      @keydown.enter.prevent="toggleFavorite"
      @keydown.space.prevent="toggleFavorite"
    >
      <div class="card-meta">
        <span class="species-tag">{{ info.tag }}</span>
        <span class="size-badge" :class="'size-' + info.size">{{ info.sizeText }}</span>
        <span v-if="isFavorite" class="fav-mark">★ Обране</span>
      </div>
      <img :src="imgSrc" :alt="altText" />
      <h3>{{ name }}</h3>
      <p>{{ text }}</p>
      <button
        v-if="removable"
        type="button"
        class="remove-btn"
        @click.stop="$emit('remove')"
        @keydown.stop
      >Видалити</button>
    </article>
  `,
};

// ===== Практична 10: батьківський застосунок PetsCatalog =====
// Практична 11: масив тварин заповнюється з IndexedDB у mounted() -> init().
const petsApp = Vue.createApp({
  name: "PetsCatalog",
  components: { PetCard },
  data() {
    return {
      pets: [],
      dbError: "",
      speciesFilter: "all",
      sizeFilter: "all",
    };
  },
  computed: {
    // Відфільтрований список - похідне значення замість ручного updateView()
    filteredPets() {
      return this.pets.filter((pet) => {
        const info = SPECIES_INFO[pet.species];
        const speciesOk =
          this.speciesFilter === "all" || info.cls === this.speciesFilter;
        const sizeOk =
          this.sizeFilter === "all" || info.size === this.sizeFilter;
        return speciesOk && sizeOk;
      });
    },
    // id для навігації (#cats, #dogs…) отримує лише перша картка кожного виду
    anchorIds() {
      const ids = {};
      const used = new Set();
      for (const pet of this.filteredPets) {
        const anchor = SPECIES_INFO[pet.species].anchor;
        if (!used.has(anchor)) {
          used.add(anchor);
          ids[pet.id] = anchor;
        }
      }
      return ids;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    infoFor(species) {
      return SPECIES_INFO[species];
    },
    // Крок 9: джерело даних для рендеру - IndexedDB
    async init() {
      try {
        await migrateFromLocalStorage();
        this.pets = await getAllItems();
      } catch (error) {
        // Крок 11: IndexedDB недоступна - показуємо повідомлення
        console.error(error);
        this.dbError = "Не вдалося відкрити IndexedDB. Зміни не збережуться.";
        this.pets = DEFAULT_PETS.map((pet) => ({ ...pet }));
      }

      // Виклики з практикуму 6 - тепер, коли дані вже завантажені
      printAll(this.pets);
      printBySpecies(this.pets, "кіт");
      printBySpecies(this.pets, "собака");
    },
    // Додавання: спершу запис в IndexedDB, потім оновлення стану Vue.
    // record - звичайний об'єкт (не Vue-проксі), інакше put() кине DataCloneError.
    async addPet(pet) {
      const record = { id: Date.now(), ...pet };
      try {
        await addItem(record);
        this.pets.push(record);
        this.dbError = "";
      } catch (error) {
        console.error(error);
        this.dbError = "Не вдалося зберегти тварину.";
      }
      // Скидаємо фільтри, щоб новий запис точно було видно
      this.speciesFilter = "all";
      this.sizeFilter = "all";
    },
    // Видалення: з IndexedDB і зі списку на екрані
    async removePet(id) {
      try {
        await deleteItem(id);
        this.pets = this.pets.filter((pet) => pet.id !== id);
        this.dbError = "";
      } catch (error) {
        console.error(error);
        this.dbError = "Не вдалося видалити тварину.";
      }
    },
  },
  // v-for з обов'язковим :key за унікальним id
  template: `
    <p id="pets-count">Показано: {{ filteredPets.length }} з {{ pets.length }}</p>
    <p v-if="dbError" class="error" role="alert">{{ dbError }}</p>
    <div class="animal-grid" id="pets-list">
      <PetCard
        v-for="pet in filteredPets"
        :key="pet.id"
        :id="anchorIds[pet.id]"
        :name="pet.name"
        :species="pet.species"
        :age-years="pet.ageYears"
        :img="pet.photoUrl"
        :description="pet.notes"
        :info="infoFor(pet.species)"
        :young-limit="${YOUNG_LIMIT_YEARS}"
        removable
        @remove="removePet(pet.id)"
      />
    </div>
  `,
}).mount("#pets-app");

// Крок 7. Ручний рендер із практикуму 7 (функція renderPets: createElement,
// innerHTML = "", append, видалення заглушок через querySelectorAll + remove)
// видалено - його замінив компонент PetCard + v-for у PetsCatalog.
// updateView() і getFilteredPets() також видалено: їх замінило обчислюване
// значення filteredPets, а лічильник «Показано: …» тепер у шаблоні.

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
const speciesSelect = document.querySelector("#species-select");
const sizeSelect = document.querySelector("#size-select");
const filtersForm = document.querySelector("#filters form");

// Елементи форми додавання
const petForm = document.querySelector("#pet-form");
const nameInput = document.querySelector("#pet-name");
const speciesInput = document.querySelector("#pet-species");
const ageInput = document.querySelector("#pet-age");
const ageError = document.querySelector("#age-error");
// Практична 11: нові поля форми
const photoInput = document.querySelector("#pet-photo");
const notesInput = document.querySelector("#pet-notes");

// Форма фільтрів не має надсилатися як звичайна форма
filtersForm.addEventListener("submit", (event) => event.preventDefault());

// Друга подія варіанта: change на select. Тепер вона лише змінює реактивний
// стан Vue - список перемальовується автоматично.
speciesSelect.addEventListener("change", () => {
  petsApp.speciesFilter = speciesSelect.value;
});
sizeSelect.addEventListener("change", () => {
  petsApp.sizeFilter = sizeSelect.value;
});

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

  // Порожні photoUrl і notes PetCard замінить значеннями зі SPECIES_INFO
  petsApp.addPet({
    name: name,
    species: speciesInput.value,
    ageYears: Number(ageInput.value),
    photoUrl: photoInput.value.trim(),
    notes: notesInput.value.trim(),
  });

  // Синхронізуємо select-и з уже скинутим станом
  speciesSelect.value = "all";
  sizeSelect.value = "all";

  petForm.reset();
  ageError.textContent = "";
});

// ===== Практична 9: клієнт для API (fetch/AJAX) =====

// Адреса ендпоінта винесена в константу (крок 3)
const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";

const dogLoading = document.querySelector("#dog-loading");
const dogError = document.querySelector("#dog-error");
const dogRefresh = document.querySelector("#dog-refresh");

// Практична 10: картку собаки теж рендерить PetCard (окремий Vue-застосунок).
// :key за адресою фото - нова собака отримує новий екземпляр компонента
// зі скинутим isFavorite.
const dogApp = Vue.createApp({
  name: "RandomDog",
  components: { PetCard },
  data() {
    return { dog: null };
  },
  methods: {
    infoFor(species) {
      return SPECIES_INFO[species];
    },
  },
  template: `
    <PetCard
      v-if="dog"
      :key="dog.img"
      :name="dog.name"
      :species="dog.species"
      :img="dog.img"
      :description="dog.description"
      :info="infoFor(dog.species)"
    />
  `,
}).mount("#dog-list");

// Показує/ховає стан завантаження і блокує кнопку на час запиту
function showLoading(isLoading) {
  dogLoading.hidden = !isLoading;
  dogRefresh.disabled = isLoading;
}

// Виводить зрозуміле повідомлення користувачу (порожній рядок - прибрати)
function showError(message) {
  dogError.textContent = message;
}

// Запит до Dog CEO API (https://dog.ceo/dog-api/): випадкове фото собаки.
// Перевіряє HTTP-статус (response.ok) і окремо поле status === "success",
// бо API інколи повертає 200 зі status: "error".
async function loadDog() {
  showError("");
  showLoading(true);

  try {
    const response = await fetch(DOG_API_URL);

    // fetch не вважає 404/500 помилкою, тому перевіряємо вручну
    if (!response.ok) {
      throw new Error(`Сервер відповів кодом ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    // Окрема перевірка поля status (може бути 200 зі status: "error")
    if (data.status !== "success") {
      throw new Error(`API повернуло status: ${data.status}`);
    }

    // URL має вигляд .../breeds/hound-afghan/xxx.jpg - беремо породу зі шляху
    const breed = data.message.split("/")[4].replace("-", " ");

    // Новий об'єкт у реактивному стані - Vue сам перемалює картку
    dogApp.dog = {
      name: "Випадкова собака",
      species: "собака",
      img: data.message,
      description: `Порода (за даними API): ${breed}.`,
    };
  } catch (error) {
    // Користувачу - зрозуміле повідомлення, розробнику - деталі в консоль
    showError("Не вдалося завантажити фото собаки. Спробуйте пізніше.");
    console.error(error);
  } finally {
    // Ховаємо індикатор і за успіху, і за помилки
    showLoading(false);
  }
}

// Кнопка «Оновити» - повторний запит без перезавантаження сторінки
dogRefresh.addEventListener("click", loadDog);

// Перше завантаження фото з API
loadDog();

console.log("Вік Рекса у місяцях:", ageInMonths(3));
