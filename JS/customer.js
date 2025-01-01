import {
  fetchCustomers,
  addCustomer,
  removeCustomer,
} from "./customerMange.js";

let currentNumber = 0;
let isOpenCustomerAddForm = false;
//id increment
function idFormating() {
  console.log("func atule", currentNumber);

  const idField = document.getElementById("customerID");
  const formatNumber = String(currentNumber).padStart(4, 0);
  idField.value = `C${formatNumber}`;
}
document.getElementById("addCustomerBtn").addEventListener("click", () => {
  if (!isOpenCustomerAddForm) {
    currentNumber++;
    idFormating();
    isOpenCustomerAddForm = true;
    console.log("func atule add", currentNumber);
  }
});

document.getElementById("canselBtn").addEventListener("click", () => {
  if (isOpenCustomerAddForm) {
    currentNumber--;
    idFormating();
    isOpenCustomerAddForm = false;
    console.log("func atule cansel", currentNumber);
  }
});

document.getElementById("publishBtn").addEventListener("click", () => {
  if (isOpenCustomerAddForm) {
    isOpenCustomerAddForm = false;
    console.log("func atule publish", currentNumber);
  }
});

const gender = document.getElementById("Gender");
gender.addEventListener("change", () => {
  const genderOption = gender.options[gender.selectedIndex].text;
  console.log(genderOption);

  const imagePreview = document.getElementById("imagePreview");
  if (genderOption === "Male") {
    imagePreview.src = "../image/cutomer icon/men.png";
    imagePreview.style.display = "block";
  } else if (genderOption === "Female") {
    imagePreview.src = "../image/cutomer icon/women.png";
    imagePreview.style.display = "block";
  }
});
