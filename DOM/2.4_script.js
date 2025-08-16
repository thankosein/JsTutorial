// ✅ Best Practice: Cache selectors in constants
const pageTitle = document.getElementById("page-title");
const fruitsList = document.querySelector("#fruits");
const fruitItems = document.querySelectorAll(".item");

// ✅ Best Practice: Avoid innerHTML unless necessary (security & performance)
console.log("Page Title:", pageTitle.textContent);
console.log("Fruits List Tag:", fruitsList.tagName);

// ✅ Best Practice: Loop using forEach (works on NodeList)
fruitItems.forEach((fruit, index) => {
  console.log(`Fruit ${index + 1}:`, fruit.textContent);
});

// Example: Changing text
pageTitle.textContent = "Updated Fruit List";

// Example: Adding a new fruit
const newFruit = document.createElement("li");
newFruit.classList.add("item");
newFruit.textContent = "Mango";
fruitsList.appendChild(newFruit);

// Recheck the updated list
console.log("Updated Fruits:");
document.querySelectorAll(".item").forEach(fruit => {
  console.log(fruit.textContent);
});
