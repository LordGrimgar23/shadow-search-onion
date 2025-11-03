const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeModal = document.getElementById("closeModal");
const submitAdd = document.getElementById("submitAdd");

searchBtn.onclick = () => {
  const q = searchInput.value.trim();
  if (!q) {
    alert("Please enter a search term.");
    return;
  }
  fetch(`/search?q=${q}`)
    .then(res => res.json())
    .then(data => {
      displayResults(data);
    })
    .catch(() => {
      alert("Failed to retrieve search results.");
    });
};

addBtn.onclick = () => modal.style.display = "flex";
closeModal.onclick = () => modal.style.display = "none";

submitAdd.onclick = () => {
  const name = document.getElementById("nameInput").value;
  const url = document.getElementById("urlInput").value;
  const description = document.getElementById("descInput").value;

  if (!name || !url || !description || !url.endsWith('.onion')) {
    alert("Please fill all fields correctly with a valid .onion URL.");
    return;
  }

  fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, url, description })
  })
  .then(res => res.json())
  .then(msg => alert(msg.message || msg.error))
  .catch(() => alert("Failed to submit."));

  modal.style.display = "none";
};

function displayResults({ database, external }) {
  resultsDiv.innerHTML = "<h3>Local Database Results:</h3>";
  if (database.length === 0) {
    resultsDiv.innerHTML += "<p>No entries found.</p>";
  }
  database.forEach(item => {
    resultsDiv.innerHTML += `
      <div class="result-item">
        <strong>${item.name}</strong><br>
        <a href="${item.url}" target="_blank">${item.url}</a><br>
        <p>${item.description}</p>
      </div>`;
  });

  if (external && external.length > 0) {
    resultsDiv.innerHTML += "<h3>External Search Results:</h3>";
    external.forEach(item => {
      resultsDiv.innerHTML += `
        <div class="result-item">
          <strong>${item.title || "External Result"}</strong><br>
          <a href="${item.link}" target="_blank">${item.link}</a><br>
          <p>${item.snippet || ""}</p>
        </div>`;
    });
  }
}
