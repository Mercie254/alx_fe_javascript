let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Don't cry because it's over, smile because it happened.", category: "Happiness" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<em>No quotes found for this category.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomQuote = filtered[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `<p>"${randomQuote.text}"</p><em>- ${randomQuote.category}</em>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories(); // Refresh categories dropdown

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added!");
}

function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const inputText = document.createElement('input');
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement('input');
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";

  const button = document.createElement('button');
  button.textContent = "Add Quote";
  button.onclick = addQuote;

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(button);

  document.body.appendChild(document.createElement("h2")).textContent = "Add a New Quote";
  document.body.appendChild(formContainer);
}

// ✅ Populate dropdown with unique categories
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const current = select.value;

  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Clear current options
  select.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter && categories.includes(savedFilter)) {
    select.value = savedFilter;
  } else {
    select.value = current || "all";
  }
}

// ✅ Return quotes filtered by dropdown selection
function getFilteredQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

// ✅ Update quoteDisplay based on filter
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// Export quotes
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error();
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// On load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportQuotesToJson);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  // Restore last quote
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const { text, category } = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML = `<p>"${text}"</p><em>- ${category}</em>`;
  }
});
