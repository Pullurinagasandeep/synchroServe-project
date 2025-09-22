// on domcontent loaded
async function gettingCategoryList() {
  const allCategoriesResponse = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const allCategoriesData = await allCategoriesResponse.json();
  // ---------------------------------------------------------------------------------------------------------------
  // root div
  const root = document.getElementById("root");
  let content = ``;
  allCategoriesData.categories.map((category) => {
    content =
      `<div class="category" id=${category.strCategory}>
         <img class="category-img" src=${category.strCategoryThumb}>
         <h3 class="category-heading">${category.strCategory}</h3>
         <p>${category.strCategoryDescription}</p>
      </div>` + content;
  });
  root.innerHTML = content;
  // --------------------------------------------------------------------------------------------------------------
  // adding click event on every category
  allCategoriesData.categories.map((category) => {
    const categoryCard = document.getElementById(category.strCategory);

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

  if (singlemeals.length !== 0) {
    singlemeals.forEach((singlemeal) => {
      categoryMeals.removeChild(singlemeal);
    });
  }

  let content = ``;
  singleCategoryData.meals.map((meal) => {
    content =
      `<div class="single-meal" id="${meal.strMeal}">
         <img class="meal-img" src=${meal.strMealThumb}>
         <h3 class="meal-heading">${meal.strMeal}</h3>
      </div>` + content;
  });
  categoryMeals.innerHTML = content;

  singleCategoryData.meals.forEach((meal) => {
    const singleMealCard = document.getElementById(meal.strMeal);

    singleMealCard.addEventListener("click", () => {
      gettingSingleMeal(meal.idMeal);
    });
  });

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

  let content = ``;
  singleMealData.meals.map((meal) => {
    content =
      `<div class="single-meal-recipe" id=${meal.strMeal}>
         <div style="display:flex;justify-content:space-between;align-items:center;">
          <img class="meal-image-recipe" src="${meal.strMealThumb}">
          <button style="padding:10px 20px; align-self:flex-start;position:fixed;top: 5%;right:10%;" onclick="hide()">X</button>
        </div>
        <h3 class="meal-heading-recipe">${meal.strMeal}</h3>
        <p>${meal.strInstructions}</p>
        <a href=${meal.strYoutube} target="_blank">link to youtube vedio</a>
      </div>` + content;
  });
  body.innerHTML = content + body.innerHTML;
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
  // getting user input from input-field
  const userinput = document.getElementById("userinput").value;
  console.log(userinput);

  const mealResponse = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${userinput}`
  );
  const mealData = await mealResponse.json();

  //-----------------------------------------------------------------------------------------------------------------------------------------------
  const categoryMeals = document.getElementById("category-meals");
  // removing selected categories meals before showing new category meals
  const singlemeals = document.querySelectorAll(".single-meal");
  singlemeals.forEach((singlemeal) => {
    categoryMeals.removeChild(singlemeal);
  });

  mealData.meals.map((meal) => {
    const singlemeal = document.createElement("div");
    singlemeal.classList = "single-meal";
    singlemeal.setAttribute("id", meal.strMeal);
    singlemeal.innerHTML = `<img class="meal-img" src="${meal.strMealThumb}"><h3 class="meal-heading">${meal.strMeal}</h3>`;

    categoryMeals.append(singlemeal);
  });

  mealData.meals.forEach((meal) => {
    const singleMealCard = document.getElementById(meal.strMeal);

    singleMealCard.addEventListener("click", () => {
      gettingSingleMeal(meal.idMeal);
    });
  });
}
