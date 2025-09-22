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
      `<div class="category" id=${category.idCategory}>
      <img class="category-img" src=${category.strCategoryThumb}>
      <h3 class="category-heading">${category.strCategory}</h3>
      </div>` + content;
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

  let content = ``;
  singleCategoryData.meals.map((meal) => {
    content =
      `<div class="single-meal" id=${meal.idMeal}>
    <img class="meal-img" src="${meal.strMealThumb}">
    <h3 class="meal-heading">${meal.strMeal}</h3>
    </div>` + content;
  });
  categoryMeals.innerHTML = content;

  singleCategoryData.meals.forEach((meal) => {
    const singleMealCard = document.getElementById(meal.idMeal);

    singleMealCard.addEventListener("click", () => {
      gettingSingleMeal(meal.idMeal);
    });
  });

  // categoryMeals.innerHTML = content;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------

// on clicking singlemeal
async function gettingSingleMeal(id) {
  const singleMealResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const singleMealData = await singleMealResponse.json();
  const body = document.querySelector("body");

  // removing selected categories meals before showing new category meals
  const singlemeals = document.querySelectorAll(".single-meal-recipe");
  singlemeals.forEach((singlemeal) => {
    body.removeChild(singlemeal);
  });
  // here if we work with inner html we are getting bug so it is prefered to this way
  singleMealData.meals.forEach((meal) => {
    const singleMeal = document.createElement("div");
    singleMeal.classList = "single-meal-recipe";
    singleMeal.setAttribute("id", meal.idMeal);
    singleMeal.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><img class="meal-image-recipe" src="${meal.strMealThumb}"><button style="padding:10px 20px; align-self:flex-start;position:fixed;top: 5%;right:10%;" onclick="hide()">X</button></div><h3 class="meal-heading-recipe">${meal.strMeal}</h3><p>${meal.strInstructions}</p>
    <a href=${meal.strYoutube} target="_blank">link to youtube vedio</a>`;

    body.append(singleMeal);
  });
}
// -------------------------------------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------------------------
function hide() {
  const element = document.querySelector(".single-meal-recipe");
  const body = document.querySelector("body");
  body.removeChild(element);
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
