// === Element References ===
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeModalBtn = document.getElementById("closeModal");
const submitAddBtn = document.getElementById("submitAdd");

// === Search Handler ===
searchBtn.onclick = () => {
  const q = searchInput.value.trim();
  if (!q) {
    alert("Please enter a term to search.");
    return;
  }

  resultsDiv.innerHTML = `<p class="loading">🔍 Searching the abyss...</p>`;

  fetch(`/search?q=${encodeURIComponent(q)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Server error during search");
      return res.json();
    })
    .then((data) => {
      if (data.error) throw new Error(data.error);
      displayResults(data.database);
    })
    .catch((err) => {
      console.error("Search error:", err);
      resultsDiv.innerHTML = `<p class="error">❌ Error: ${err.message}</p>`;
    });
};

// === Display Search Results ===
function displayResults(results) {
  resultsDiv.innerHTML = `<h3>Search Results:</h3>`;

  if (!results || results.length === 0) {
    resultsDiv.innerHTML += `<p class="no-results">No entries found in your abyss...</p>`;
    return;
  }

  results.forEach((item) => {
    resultsDiv.innerHTML += `
      <div class="result-item">
        <strong>${item.name}</strong><br>
        <a href="${item.url}" target="_blank">${item.url}</a><br>
        <p>${item.description}</p>
      </div>`;
  });
}

// === Modal Handlers ===
addBtn.onclick = () => (modal.style.display = "flex");
closeModalBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// === Submit New Onion URL ===
submitAddBtn.onclick = () => {
  const name = document.getElementById("nameInput").value.trim();
  const url = document.getElementById("urlInput").value.trim();
  const description = document.getElementById("descInput").value.trim();

  if (!name || !url || !description) {
    alert("Please fill out all fields.");
    return;
  }
  if (!url.endsWith(".onion")) {
    alert("URL must end with a valid .onion address.");
    return;
  }

  fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, url, description }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to add new entry.");
      return res.json();
    })
    .then((msg) => {
      alert(msg.message || "Onion URL added!");
      modal.style.display = "none";
      searchInput.value = ""; // Clear search
    })
    .catch((err) => {
      console.error("Submit error:", err);
      alert("Error: " + err.message);
    });
};
