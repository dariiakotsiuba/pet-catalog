// Практична 10. Обрано Vue 3: працює з CDN без Babel і JSX, шаблони схожі на
// звичайний HTML, а зміни масиву (push, присвоєння) Vue відстежує сам.

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

// ===== Практична 10: компонент PetCard (варіант 12) =====
// Props: name, species, ageYears (за варіантом) + необов'язкові img, description,
// а також info (запис зі SPECIES_INFO) і youngLimit - щоб компонент не звертався
// до глобальних змінних напряму.
// Подія варіанта: клік по картці перемикає ЛОКАЛЬНИЙ прапорець isFavorite.
// Стан живе всередині компонента, тому $emit батьківському не потрібен.
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
  },
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
  // Бейдж «★ Обране» - третя «пігулка» в card-meta, щоб його не перекривало фото
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
    </article>
  `,
};

// ===== Практична 10: батьківський застосунок PetsCatalog =====
// Масив тварин тепер у реактивному стані data(), а не у зовнішній змінній.
const petsApp = Vue.createApp({
  name: "PetsCatalog",
  components: { PetCard },
  data() {
    return {
      // Дані варіанта 12 (з практикуму 6) + унікальний id для :key
      pets: [
        {
          id: 1,
          name: "Мурка",
          species: "кіт",
          ageYears: 1,
          img: "assets/img/cat-tabby.jpg",
          description:
            "Грайлива молода кішка, любить ганяти м'ячик і спати на підвіконні.",
        },
        {
          id: 2,
          name: "Барсик",
          species: "кіт",
          ageYears: 5,
          img: "assets/img/cat-british.jpg",
          description:
            "Спокійний дорослий кіт британської породи, не любить галасу.",
        },
        {
          id: 3,
          name: "Рекс",
          species: "собака",
          ageYears: 3,
          img: "assets/img/dog-labrador.jpg",
          description:
            "Активний лабрадор, потребує щоденних прогулянок і ігор.",
        },
        {
          id: 4,
          name: "Бім",
          species: "собака",
          ageYears: 0.5,
          img: "assets/img/dog-puppy.jpg",
          description: "Цікаве цуценя, якого ще треба привчати до команд.",
        },
        {
          id: 5,
          name: "Золотко",
          species: "риба",
          ageYears: 2,
          img: "assets/img/fish-goldfish.jpg",
          description:
            "Спокійна золота рибка, яка полюбляє просторий акваріум.",
        },
        {
          id: 6,
          name: "Кеша",
          species: "папуга",
          ageYears: 1.5,
          img: "assets/img/bird-budgie.jpg",
          description:
            "Балакучий хвилястий папужка, вже вміє повторювати кілька слів.",
        },
        {
          id: 7,
          name: "Пухнастик",
          species: "хом'як",
          ageYears: 0.8,
          img: "assets/img/hamster-dzungarian.jpg",
          description:
            "Маленький джунгарський хом'як, активний уночі й любить колесо.",
        },
        {
          id: 8,
          name: "Тортілла",
          species: "черепаха",
          ageYears: 10,
          img: "assets/img/turtle-redeared.jpg",
          description:
            "Доросла червоновуха черепаха, любить гріти спинку під лампою.",
        },
      ],
      nextId: 9,
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
  methods: {
    infoFor(species) {
      return SPECIES_INFO[species];
    },
    // Додавання нової тварини: звичайний push, Vue перемалює список сам
    addPet(pet) {
      this.pets.push({ id: this.nextId++, ...pet });
      // Скидаємо фільтри, щоб новий запис точно було видно
      this.speciesFilter = "all";
      this.sizeFilter = "all";
    },
  },
  // v-for з обов'язковим :key за унікальним id
  template: `
    <p id="pets-count">Показано: {{ filteredPets.length }} з {{ pets.length }}</p>
    <div class="animal-grid" id="pets-list">
      <PetCard
        v-for="pet in filteredPets"
        :key="pet.id"
        :id="anchorIds[pet.id]"
        :name="pet.name"
        :species="pet.species"
        :age-years="pet.ageYears"
        :img="pet.img"
        :description="pet.description"
        :info="infoFor(pet.species)"
        :young-limit="${YOUNG_LIMIT_YEARS}"
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

  // Фото й опис підставить PetCard зі SPECIES_INFO (через prop info)
  petsApp.addPet({
    name: name,
    species: speciesInput.value,
    ageYears: Number(ageInput.value),
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

// Виклики з реальними даними (з практикуму 6) - тепер дані беремо зі стану Vue
printAll(petsApp.pets);
printBySpecies(petsApp.pets, "кіт");
printBySpecies(petsApp.pets, "собака");
console.log("Вік Рекса у місяцях:", ageInMonths(3));
