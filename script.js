const body = document.querySelector("body");
// on domcontent loaded
async function gettingCategoryList() {
  const allCategoriesResponse = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const allCategoriesData = await allCategoriesResponse.json();

  const root = document.getElementById("root");
  let content = ``;
  allCategoriesData.categories.map((category) => {
    content =
      content +
      `<div class="category" id=${category.idCategory}>
          <img class="category-img" src=${category.strCategoryThumb}>
          <h3 class="category-heading">${category.strCategory}</h3>
      </div>`;
  });
  root.innerHTML = content;
  allCategoriesData.categories.forEach((category) => {
    const categoryCard = document.getElementById(category.idCategory);

    categoryCard.addEventListener("click", () => {
      gettingCategoryMeals(category.strCategory);
    });
  });
}
window.addEventListener("DOMContentLoaded", gettingCategoryList);
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------

// on clicking categorey
async function gettingCategoryMeals(category) {
  const singleCategoryResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const singleCategoryData = await singleCategoryResponse.json();

  const categoryMeals = document.getElementById("category-meals");
  // removing selected categories meals before showing new category meals
  const singlemeals = document.querySelectorAll(".single-meal");
  singlemeals.forEach((singlemeal) => {
    categoryMeals.removeChild(singlemeal);
  });
  const hero = document.querySelector(".hero");

  const main = document.querySelector("main");
  if (hero) {
    main.removeChild(hero);
  }

  let content = ``;
  singleCategoryData.meals.map((meal) => {
    content =
      content +
      `<div class="single-meal" id=${meal.idMeal}>
          <img class="meal-img" src="${meal.strMealThumb}">
          <h3 class="meal-heading">${meal.strMeal}</h3>
    </div>`;
  });
  categoryMeals.innerHTML = content;

  singleCategoryData.meals.forEach((meal) => {
    const singleMealCard = document.getElementById(meal.idMeal);

    singleMealCard.addEventListener("click", () => {
      gettingSingleMeal(meal.idMeal);
    });
  });

  categoryMeals.style.paddingTop = "100px";
  // categoryMeals.innerHTML = content;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------

// on clicking singlemeal
async function gettingSingleMeal(id) {
  loading();
  const singleMealResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const singleMealData = await singleMealResponse.json();

  // removing selected categories meals before showing new category meals
  const loader = document.querySelector("#loading");
  body.removeChild(loader);
  const singlemeals = document.querySelectorAll(".single-meal-recipe");
  singlemeals.forEach((singlemeal) => {
    body.removeChild(singlemeal);
    body.style.overflow = "auto";
  });

  // creating ingredients list
  let ingredients =
    "<h4 class='ingredients-heading'>Ingredients</h4><ul class='ingredients-list'>";
  let i = 1;
  while (
    singleMealData.meals[0][`strIngredient${i}`] &&
    singleMealData.meals[0][`strIngredient${i}`] !== ""
  ) {
    const ingredient = singleMealData.meals[0][`strIngredient${i}`];
    const measure = singleMealData.meals[0][`strMeasure${i}`];

    if (ingredient) {
      const imgsrcresponse = await fetch(
        `https://www.themealdb.com/images/ingredients/${ingredient.replaceAll(
          " ",
          "_"
        )}.png`
      );
      const imgsrc = imgsrcresponse.url;
      ingredients += `<li>
      <span>${ingredient} - ${measure}</span>
      <img src="${imgsrc}">
      </li>`;
    }
    i++;
  }
  ingredients += "</ul>";
  // here if we work with inner html we are getting bug so it is prefered to this way

  singleMealData.meals.forEach((meal) => {
    const singleMeal = document.createElement("div");
    singleMeal.classList = "single-meal-recipe";
    singleMeal.setAttribute("id", meal.idMeal);
    singleMeal.innerHTML = `<div class="single-meal-wrapper" >
    <img class="meal-image-recipe" src="${meal.strMealThumb}">
     <h3 class="meal-heading-recipe">${meal.strMeal}</h3>
<i class="fa-solid fa-xmark close-button" style="color: #000000ff;"  onclick="hide()"></i>
    </div>
    <p class="meal-instructions">
    <span class="instructions-heading">Instructions</span><br>
    ${meal.strInstructions}</p>
    <div>${ingredients}</div>
    <a class="youtube-link" href=${meal.strYoutube} target="_blank">watch on Youtube</a>`;

    body.prepend(singleMeal);
  });
  body.style.overflow = "hidden";
}
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------
function hide() {
  const element = document.querySelector(".single-meal-recipe");
  body.removeChild(element);
  body.style.overflow = "auto";
}
function cancel() {
  const loader = document.getElementById("loading");
  body.removeChild(loader);
}
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------
async function handleSearch(event) {
  event.preventDefault();

  const userInput = document.getElementById("userInput").value;
  const mealResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`
  );
  const mealData = await mealResponse.json();

  //-----------------------------------------------------------------------------------------------------------------------------------------------
  const categoryMeals = document.getElementById("category-meals");
  // removing selected categories meals before showing new category meals
  const singlemeals = document.querySelectorAll(".single-meal");
  singlemeals.forEach((singlemeal) => {
    categoryMeals.removeChild(singlemeal);
  });
  const hero = document.querySelector(".hero");

  const main = document.querySelector("main");
  if (hero) {
    body.removeChild(hero);
  }

  let content = ``;
  mealData.meals.map((meal) => {
    content =
      `<div class="single-meal" id=${meal.idMeal}>
    <img class="meal-img" src="${meal.strMealThumb}">
    <h3 class="meal-heading">${meal.strMeal}</h3>
    </div>` + content;
  });
  categoryMeals.innerHTML = content;
  mealData.meals.forEach((meal) => {
    const singleMealCard = document.getElementById(meal.idMeal);

    singleMealCard.addEventListener("click", () => {
      gettingSingleMeal(meal.idMeal);
    });
  });
}

function loading() {
  const loader = document.createElement("div");
  loader.classList = "loading";
  loader.setAttribute("id", "loading");
  loader.innerHTML = `<div class="spinner"></div>
  <a  class="cancel-btn"  onclick="cancel()">cancel</a>`;
  body.append(loader);
}
