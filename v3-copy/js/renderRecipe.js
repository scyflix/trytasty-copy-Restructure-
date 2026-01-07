const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
import { addToFav } from "../../fav.js";

const recipeContainer = document.getElementById("recipe");

if (!recipeId) {
  recipeContainer.innerHTML = `<a class="backBtn" href="../index.html">← Back</a>
  <p style="text-align: center; opacity: 0.3;">Recipe not found.</p>`;
}

fetch("data/recipes.json")
  .then((response) => response.json())
  .then((data) => {
    const recipe = data.recipes.find((r) => r.id === recipeId);

    const toISO = (min) => `PT${min}M`;

    const recipeSchema = {
      "@context": "https://schema.org",
      "@type": "Recipe",

      name: recipe.title,
      description: recipe.description,
      image: [recipe.image],
      url: window.location.href,

      author: {
        "@type": "Organization",
        name: "TryTasty",
      },

      prepTime: toISO(recipe.prepTimeMin),
      cookTime: toISO(recipe.cookTimeMin),
      totalTime: toISO(recipe.prepTimeMin + recipe.cookTimeMin),

      recipeYield: `${recipe.servings} serving${
        recipe.servings === 1 ? "" : "s"
      }`,

      recipeIngredient: recipe.ingredients,

      recipeInstructions: recipe.steps.map((step) => ({
        "@type": "HowToStep",
        text: step,
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(recipeSchema);
    document.head.appendChild(script);

    if (!recipe) {
      recipeContainer.innerHTML = `<a class="backBtn" href="../index.html">← Back</a>
  <p>Recipe not found.</p>`;
      return;
    }

    document.title = `${recipe.title} | TryTasty`;
    const totalTimeMin = recipe.prepTimeMin + recipe.cookTimeMin;
    document.getElementById("recipe").innerHTML = `
                  <a class="backBtn" href="../index.html">← Back</a>
                  
                  <article>
                  <h2>${recipe.title}</h2>
                  <section class="meta">
                  <span>⏱ Prep: ${recipe.prepTimeMin} min</span>
                  <span>🔥 Cook: ${recipe.cookTimeMin} min</span>
                  <span>⌛ Total: ${totalTimeMin} min</span>
                  <span>🍽 Serves: ${recipe.servings}</span>
                  </section>
                  <p>${recipe.description}</p>
                  <section class="flexRecipeContent">
                  <img loading="lazy" src="${recipe.image}" alt="${
      recipe.title
    }" loading="lazy" />
                  <div class="recipeTexts">
                  <section>
                  <h3>Ingredients</h3>
                  <ul>
                  ${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}
                  </ul>
</section>

                <section>
                <h3>Instructions</h3>
                <ol>
                ${recipe.steps.map((s) => `<li>${s}</li>`).join("")}
                </ol>
                </section>
                <button
                class="add-fav"
                data-key="${recipe.id}"
                data-name="${recipe.title}"
                >
                Add to favorites
                </button>
                </div>
                </section>
                </article>
          `;

    addToFav();
  })
  .catch(() => {
    document.getElementById(
      "recipe"
    ).innerHTML = `<a class="backBtn" href="../index.html">← Back</a>
  <p style="text-align: center; opacity: 0.3;">Failed to load recipe.</p>`;
  });
