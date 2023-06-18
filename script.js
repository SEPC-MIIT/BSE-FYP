// Function to fetch JSON data
async function fetchJSONData() {
  try {
    const response = await fetch("data.json"); // Path to the JSON file
    if (!response.ok) {
      throw new Error("Error fetching JSON data");
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
}

// Function to generate dynamic cards and display card count
async function generateCards() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const activeTagButton = document.querySelector(".tag-button.active");
  const selectedTag = activeTagButton ? activeTagButton.dataset.tag : null;

  const jsonData = await fetchJSONData();
  const filteredProjects = jsonData.filter(project => {
    if (selectedTag && selectedTag !== "" && project.field !== selectedTag) {
      return false;
    }
    if (searchInput !== "" && !isProjectMatchingSearch(project, searchInput)) {
      return false;
    }
    return true;
  });

  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";

  filteredProjects.forEach(project => {
    const card = document.createElement("div");
    card.classList.add("col-lg-3", "col-md-6", "mb-4");
    card.innerHTML = `
        <div class="card border-0">
          <img src="${project.image}" class="card-img-top" alt="Project Image">
          <div class="card-body">
            <h5 class="card-title fw-bold text-center">${project.title}</h5>
            <div class="table-responsive">
              <table class="table table-borderless">
                  <tbody>
                      <tr>
                          <td>Name</td>
                          <td>:</td>
                          <td> ${project.studentName}</td>
                      </tr>
                      <tr>
                          <td>StudentID</td>
                          <td>:</td>
                          <td> ${project.studentID}</td>
                      </tr>
                      <tr>
                          <td>Supervisor</td>
                          <td>:</td>
                          <td> ${project.supervisor}</td>
                      </tr>
                      <tr>
                          <td>Field</td>
                          <td>:</td>
                          <td> ${project.field}</td>
                      </tr>
                  </tbody>
              </table>
            </div>
          <div class="card-footer border-0 d-grid">
            <button type="button" class="btn btn-primary">More Info</button>
          </div>
        </div>
      `;

    // Add event listener to "More Info" button
    const moreInfoButton = card.querySelector(".btn-primary");
    moreInfoButton.addEventListener("click", () => {
      displayModal(project);
    });

    cardContainer.appendChild(card);
  });

  // Display card count
  const displayedCount = filteredProjects.length;
  // const totalCount = jsonData.length;
  const cardCountText = document.getElementById("cardCountText");
  // cardCountText.innerHTML = `Result: <strong>${displayedCount}</strong> out of ${totalCount} projects.`;
  cardCountText.innerHTML = `Result: <strong>${displayedCount}</strong> projects.`;
}

function isProjectMatchingSearch(project, searchInput) {
  const lowercaseSearchInput = searchInput.toLowerCase();

  for (const key in project) {
    if (project[key] !== null && project[key].toString().toLowerCase().includes(lowercaseSearchInput)) {
      return true;
    }
  }

  return false;
}


// Function to handle tag selection
function handleTagSelection() {
  const tagButtons = document.querySelectorAll(".tag-button");

  // Set "All" tag as default on page load
  const allTagButton = document.querySelector(".tag-button[data-tag='']");
  allTagButton.classList.add("active");

  tagButtons.forEach(button => {
    button.addEventListener("click", () => {
      tagButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      generateCards();
    });
  });
}

function displayModal(project) {
  // Create a modal element
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${project.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <div class="d-flex">
            <img src="${project.poster}" class="img-fluid shadow-lg rounded-2 mx-auto d-block">
          </div>
          <hr class="border border-dark border-1">
          <div class="table-responsive">
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <td>${project.studentName}</td>
                    </tr>
                    <tr>
                        <td>${project.studentID}</td>
                    </tr>
                    <tr>
                        <td>Supervisor: ${project.supervisor}</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  `;

  // Append the modal to the document body
  document.body.appendChild(modal);

  // Initialize the modal using Bootstrap's JavaScript
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();

  // Remove the modal from the DOM after it is hidden
  modal.addEventListener("hidden.bs.modal", () => {
    modal.remove();
  });
}

// Event listeners
document.getElementById("searchInput").addEventListener("input", generateCards);

// Initial setup
generateCards();
handleTagSelection();
