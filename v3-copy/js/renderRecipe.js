const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const recipeContainer = document.getElementById("recipe");

if (!recipeId) {
  recipeContainer.innerHTML = "<p>Recipe not found.</p>";
}

fetch("data/recipes.json")
  .then((response) => response.json())
  .then((data) => {
    const recipe = data.recipes.find((r) => r.id === recipeId);

    const recipeSchema = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: recipe.title,
      description: recipe.description,
      image: [recipe.image],
      author: {
        "@type": "Organization",
        name: "TryTasty",
      },
      prepTime: recipe.metaPrepTime,
      cookTime: recipe.metaCookTime,
      recipeYield: recipe.metaServings,
      recipeIngredient: recipe.metaIngredients,

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
      recipeContainer.innerHTML = "<p>Recipe not found.</p>";
      return;
    }

    document.title = `${recipe.title} | TryTasty`;

    document.getElementById("recipe").innerHTML = `
                  <a class="backBtn" href="../index.html">← Back</a>
                  
                  <article>
                  <h2>${recipe.title}</h2>
                  <section class="meta">
  <span>⏱ Prep: ${recipe.prepTime} min</span>
  <span>🔥 Cook: ${recipe.cookTime} min</span>
  <span>⌛ Total: ${recipe.totalTime} min</span>
  <span>🍽 Serves: ${recipe.servings}</span>
</section>
              <p>${recipe.description}</p>

<img src="${recipe.image}" alt="${recipe.title}" loading="lazy" />

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
            </article>
          `;
  })
  .catch(() => {
    document.getElementById("recipe").innerHTML =
      "<p>Failed to load recipe.</p>";
  });
