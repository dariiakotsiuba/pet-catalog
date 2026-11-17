// Практична 10. Обрано Vue 3: працює з CDN без Babel і JSX, шаблони схожі на
// звичайний HTML, а зміни масиву (push, присвоєння) Vue відстежує сам.
// Практична 11: дані зберігаються в IndexedDB (з одноразовою міграцією з localStorage).
// Практична 12: Canvas-акваріум, кількість рибок залежить від кількості тварин у каталозі.
// Практична 13: SPA-маршрутизація (router.js). PetsCatalog тепер малює різні «сторінки»
// залежно від page: список, деталі однієї тварини, «Не знайдено».

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
// Практична 13: petId - якщо заданий, на картці є посилання «Детальніше» на #/pets/:id.
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
    petId: { type: Number, default: null },
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
  // @click.stop і @keydown.stop на кнопці й посиланні не дають події дійти до <article>.
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
      <div>
        <a
          v-if="petId !== null"
          class="details-link"
          :href="'#/pets/' + petId"
          @click.stop
          @keydown.stop
        >Детальніше</a>
      </div>
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
// Практична 13: застосунок змонтовано в #app; поле page перемикає роутер (router.js):
//   { name: "list" } | { name: "detail", id } | { name: "notfound" }
const petsApp = Vue.createApp({
  name: "PetsCatalog",
  components: { PetCard },
  data() {
    return {
      pets: [],
      dbError: "",
      speciesFilter: "all",
      sizeFilter: "all",
      page: { name: "list" },
      loaded: false, // чи вже прочитано дані з IndexedDB
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
    // Практична 13: тварина для маршруту /pets/:id (undefined, якщо такого id немає)
    currentPet() {
      return this.pets.find((pet) => pet.id === this.page.id);
    },
    // Яку «сторінку» показувати. Деталі без даних: loading, а потім detail або notfound
    view() {
      if (this.page.name === "detail") {
        if (!this.loaded) return "loading";
        return this.currentPet ? "detail" : "notfound";
      }
      return this.page.name;
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
      this.loaded = true;

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
      // Практична 13: повертаємось на головну, щоб адреса відповідала списку
      navigate("/");
    },
    // Видалення: з IndexedDB і зі списку на екрані
    async removePet(id) {
      try {
        await deleteItem(id);
        this.pets = this.pets.filter((pet) => pet.id !== id);
        this.dbError = "";
        // Практична 13: зі сторінки деталей повертаємось до списку
        if (this.page.name === "detail") navigate("/");
      } catch (error) {
        console.error(error);
        this.dbError = "Не вдалося видалити тварину.";
      }
    },
  },
  // v-for з обов'язковим :key за унікальним id
  template: `
    <p v-if="dbError" class="error" role="alert">{{ dbError }}</p>

    <template v-if="view === 'list'">
      <p id="pets-count">Показано: {{ filteredPets.length }} з {{ pets.length }}</p>
      <p v-if="speciesFilter !== 'all'" class="route-note">
        Фільтр за видом. <a href="#/">Показати всіх</a>
      </p>
      <div class="animal-grid" id="pets-list">
        <PetCard
          v-for="pet in filteredPets"
          :key="pet.id"
          :pet-id="pet.id"
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
    </template>

    <div v-else-if="view === 'detail'">
      <p><a class="back-link" href="#/">← До списку</a></p>
      <div class="animal-grid detail-grid">
        <PetCard
          :key="currentPet.id"
          :name="currentPet.name"
          :species="currentPet.species"
          :age-years="currentPet.ageYears"
          :img="currentPet.photoUrl"
          :description="currentPet.notes"
          :info="infoFor(currentPet.species)"
          :young-limit="${YOUNG_LIMIT_YEARS}"
          removable
          @remove="removePet(currentPet.id)"
        />
      </div>
      <p class="route-note">Вік: {{ currentPet.ageYears }} р.</p>
    </div>

    <p v-else-if="view === 'loading'">Завантаження…</p>

    <div v-else class="not-found">
      <h3>Не знайдено</h3>
      <p>Такої сторінки або тварини немає.</p>
      <a class="back-link" href="#/">На головну</a>
    </div>
  `,
}).mount("#app");

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

// Друга подія варіанта: change на select.
// Практична 13: вид тепер змінюється через роутер (/species/:species), тому
// адреса, список і select завжди збігаються. Розмір, як і раніше, - стан Vue.
speciesSelect.addEventListener("change", () => {
  navigate(
    speciesSelect.value === "all" ? "/" : "/species/" + speciesSelect.value,
  );
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

// ===== Практична 12: Canvas-акваріум (варіант 12) =====
// Декоративна анімація, яка залежить від даних каталогу: на кожну тварину
// з petsApp.pets припадає одна рибка. Колір рибки - за видом тварини, розмір - за віком.
// Рибки рухаються по синусоїді: x змінюється рівномірно, y = baseY + amp * sin(phase + x * wave).

const aquariumCanvas = document.querySelector("#aquarium-canvas");
const aquariumToggle = document.querySelector("#aquarium-toggle");
const ctx = aquariumCanvas.getContext("2d");

const AQUARIUM_W = aquariumCanvas.width;
const AQUARIUM_H = aquariumCanvas.height;
const MAX_FISH = 40; // обмеження, щоб анімація не гальмувала за великої кількості записів

// Кольори видів (ті самі, що в CSS-змінних --cat, --dog ...)
const SPECIES_COLORS = {
  cat: "#d9761f",
  dog: "#7cb342",
  fish: "#4f8a6d",
  bird: "#c9a227",
  rodent: "#8b5e34",
  reptile: "#6b8e4e",
};

// id тварини -> стан її рибки. Так при додаванні/видаленні тварини
// з'являється або зникає саме її рибка, а решта не «стрибають».
const fishById = new Map();

let aquariumFrameId = null; // id запиту requestAnimationFrame (null - анімація зупинена)
let lastFrameTime = null;
let userPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let aquariumInView = true;

// Створює рибку для тварини з випадковими параметрами руху
function createFish(pet) {
  const info = SPECIES_INFO[pet.species];
  const age = typeof pet.ageYears === "number" ? pet.ageYears : 2;
  const size = 12 + Math.min(age, 10) * 1.5; // старша тварина - більша рибка
  const amp = 8 + Math.random() * 14;
  return {
    x: size + Math.random() * (AQUARIUM_W - size * 2),
    baseY: amp + size + Math.random() * (AQUARIUM_H - 2 * (amp + size)),
    amp: amp,
    wave: 0.015 + Math.random() * 0.02, // «частота» синусоїди, рад/піксель
    phase: Math.random() * Math.PI * 2,
    speed: 30 + Math.random() * 50, // піксель/секунду
    dir: Math.random() < 0.5 ? 1 : -1,
    size: size,
    color: SPECIES_COLORS[info.cls],
  };
}

// Приводить набір рибок у відповідність до поточного масиву тварин
function syncFish() {
  const pets = petsApp.pets.slice(0, MAX_FISH);
  const ids = new Set(pets.map((pet) => pet.id));

  for (const pet of pets) {
    if (!fishById.has(pet.id)) {
      fishById.set(pet.id, createFish(pet));
    }
  }
  for (const id of fishById.keys()) {
    if (!ids.has(id)) {
      fishById.delete(id);
    }
  }
}

// Оновлення стану: dt у секундах, тому швидкість не залежить від частоти кадрів
function updateFish(dt) {
  for (const fish of fishById.values()) {
    fish.x += fish.dir * fish.speed * dt;

    if (fish.x > AQUARIUM_W - fish.size) {
      fish.x = AQUARIUM_W - fish.size;
      fish.dir = -1;
    } else if (fish.x < fish.size) {
      fish.x = fish.size;
      fish.dir = 1;
    }
  }
}

// Малює одну рибку: тіло-еліпс, хвіст-трикутник, око
function drawFish(fish) {
  const y = fish.baseY + fish.amp * Math.sin(fish.phase + fish.x * fish.wave);
  // Нахил за похідною синусоїди, щоб рибка «пливла» вздовж кривої
  const slope =
    fish.amp * fish.wave * Math.cos(fish.phase + fish.x * fish.wave);
  const s = fish.size;

  ctx.save(); // збереження системи координат: трансформації не «протікають» у наступні кадри
  ctx.translate(fish.x, y);
  ctx.scale(fish.dir, 1); // дзеркалимо, коли рибка пливе вліво
  ctx.rotate(Math.atan(slope * fish.dir));

  ctx.fillStyle = fish.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-s * 0.8, 0);
  ctx.lineTo(-s * 1.5, -s * 0.45);
  ctx.lineTo(-s * 1.5, s * 0.45);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(s * 0.5, -s * 0.12, s * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2b3a1a";
  ctx.beginPath();
  ctx.arc(s * 0.55, -s * 0.12, s * 0.09, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Малює повний кадр: очищення, фон-вода, рибки, підпис
function drawAquarium() {
  ctx.clearRect(0, 0, AQUARIUM_W, AQUARIUM_H); // без цього нові кадри накладалися б на попередні

  const water = ctx.createLinearGradient(0, 0, 0, AQUARIUM_H);
  water.addColorStop(0, "#d8f0f7");
  water.addColorStop(1, "#8cc6d8");
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, AQUARIUM_W, AQUARIUM_H);

  for (const fish of fishById.values()) {
    drawFish(fish);
  }

  ctx.fillStyle = "rgba(43, 58, 26, 0.85)";
  ctx.font = "bold 16px Nunito, system-ui, sans-serif";
  ctx.textBaseline = "top";
  if (fishById.size === 0) {
    ctx.fillText("Акваріум порожній: у каталозі немає тварин", 16, 14);
  } else {
    ctx.fillText(`Рибок: ${fishById.size}`, 16, 14);
  }
}

// Цикл анімації: оновити стан -> перемалювати кадр -> запросити наступний
function aquariumFrame(time) {
  if (lastFrameTime === null) lastFrameTime = time;
  // Обмежуємо dt, щоб після повернення на вкладку рибки не «телепортувались»
  const dt = Math.min((time - lastFrameTime) / 1000, 0.05);
  lastFrameTime = time;

  syncFish();
  updateFish(dt);
  drawAquarium();

  aquariumFrameId = requestAnimationFrame(aquariumFrame);
}

function startAquarium() {
  if (aquariumFrameId !== null) return;
  lastFrameTime = null;
  aquariumFrameId = requestAnimationFrame(aquariumFrame);
}

function stopAquarium() {
  if (aquariumFrameId === null) return;
  cancelAnimationFrame(aquariumFrameId);
  aquariumFrameId = null;
}

// Анімація працює, лише якщо користувач не поставив паузу і canvas видно на екрані
function updateAquarium() {
  if (!userPaused && aquariumInView) {
    startAquarium();
  } else {
    stopAquarium();
  }
}

aquariumToggle.textContent = userPaused ? "Старт" : "Пауза";
aquariumToggle.addEventListener("click", () => {
  userPaused = !userPaused;
  aquariumToggle.textContent = userPaused ? "Старт" : "Пауза";
  updateAquarium();
});

// Зупиняємо цикл, коли акваріум прокручено за межі екрана
if ("IntersectionObserver" in window) {
  new IntersectionObserver((entries) => {
    aquariumInView = entries[0].isIntersecting;
    updateAquarium();
  }).observe(aquariumCanvas);
} else {
  updateAquarium();
}

// Один початковий кадр, щоб canvas не був порожнім, навіть якщо анімація на паузі
syncFish();
drawAquarium();
