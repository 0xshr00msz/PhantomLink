document.addEventListener("DOMContentLoaded", loadEntries);
document.getElementById("loadBtn").addEventListener("click", loadEntries);

/**
 * Shuffle Function so that it randomizes every time rerfresh button is clicked
 * @param {Array} arr The array to shuffle.
 * @returns {Array} The shuffled array.
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadEntries() {
  const container = document.getElementById("entries");
  container.innerHTML = "<p>Loading entries...</p>";

  try {
    const apiUrl = window.APP_CONFIG.API_URL;
    const response = await fetch(`${apiUrl}/urls`, { method: "GET" });

    if (!response.ok) {
      // Attempt to parse error details, otherwise use statusText
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      container.innerHTML = `<p class="error">Error: ${errorData.error || "Unknown error"}</p>`;
      return;
    }
    
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      // Create a copy of the data array before shuffling
      const shuffledData = shuffleArray([...data]);

      container.innerHTML = shuffledData
        .map((item) => {
          // Extract values only
          const values = Object.values(item);
          return `
            <div class="entry">
              <pre>${values}</pre>
            </div>
          `
        })
        .join("");
    } else {
      container.innerHTML = "<p>No entries found.</p>";
    }
  } catch (err) {
    container.innerHTML = `<p class="error">Server error: ${err.message}</p>`;
  }
}