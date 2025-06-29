let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch all toys when page loads
  fetchToys();

  // Event listener for form submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", handleSubmit);
});

// Fetch all toys from the server
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    })
    .catch(error => console.error("Error fetching toys:", error));
}

// Render a single toy card
function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");
  
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  
  // Event listener to the like button
  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => increaseLikes(toy));
  
  toyCollection.appendChild(card);
}

// Handle form submission for new toy
function handleSubmit(event) {
  event.preventDefault();
  
  const name = event.target.name.value;
  const image = event.target.image.value;
  
  const newToy = {
    name,
    image,
    likes: 0
  };
  
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToy)
  })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy);      
      event.target.reset();
      document.querySelector(".container").style.display = "none";
      addToy = false;
    })
    .catch(error => console.error("Error adding new toy:", error));
}

// Increase likes for a toy
function increaseLikes(toy) {
  const newLikes = toy.likes + 1;
  
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    })
  })
    .then(response => response.json())
    .then(updatedToy => {      
      const card = document.querySelector(`#${toy.id}`).parentNode;
      card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      toy.likes = updatedToy.likes; 
    })
    .catch(error => console.error("Error updating likes:", error));
}