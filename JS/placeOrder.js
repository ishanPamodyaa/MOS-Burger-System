import {
  fetchCustomers,
  addCustomer,
  removeCustomer,
} from "./customerMange.js";

import {
  fetchProducts,
  addProduct,
  removeProduct,
} from "./productDataManage.js";

let uploadedImage = "";
const product = fetchProducts();
console.log("Product data:", product);
let isExpired = false;
let productEnabled = false;
let selectedCatogary = "Burgers";
let cartData = [];
let orderArray = [];
let discount = 0;
let amount = 0;
let currentOrderID = 11;

window.onload = function () {
  displayProductList(selectedCatogary);
};

function getNextID() {
  return "0" + currentOrderID.toString().padStart(3, "0");
}

function updateOrderID() {
  const orderIDElement = document.getElementById("orderId");
  currentOrderID++;

  orderIDElement.textContent = getNextID();
  console.log("Order ID updated:", orderIDElement.textContent);
}

let now = new Date();
let currentDate = now.toUTCString().slice(5, 16);
document.getElementById("currentDate").innerHTML = currentDate;

//when select product catogery default catogery is Burger
document
  .getElementById("burgers")
  .addEventListener("click", displayProductList.bind(null, "Burgers"));

document
  .getElementById("submarines")
  .addEventListener("click", displayProductList.bind(null, "Submarines"));

document
  .getElementById("fries")
  .addEventListener("click", displayProductList.bind(null, "Fries"));

document
  .getElementById("pasta")
  .addEventListener("click", displayProductList.bind(null, "Pasta"));

document
  .getElementById("chicken")
  .addEventListener("click", displayProductList.bind(null, "Chicken"));

document
  .getElementById("beverages")
  .addEventListener("click", displayProductList.bind(null, "Beverages"));

function displayProductList(catogary) {
  console.log("display ekata awa");

  selectedCatogary = catogary;

  console.log("Selected catogary:", selectedCatogary, catogary);

  // const selectedCatogarye = product[catogary];

  const dynamicProductTile = document.getElementById("productTile");
  dynamicProductTile.innerHTML = "";

  if (!selectedCatogary) return;

  product[catogary].forEach((item, index) => {
    const productTile = document.createElement("div");
    productTile.classList.add(
      "col",
      "col-sm",
      "col-md-4",
      "col-lg-3",
      "col-xl-",
      "mt-3",
      "custom-card-col"
    );

    productTile.innerHTML = `
  
              <div class="card card-custom " data-index="${index}" id="clickableCard"  >
                      <div class="imgDiv">
                          <img src="${item.img}" class="card-img-top"
                              alt="${item.name}" cap">
                      </div>
                      <div class="card-body cardBody">
                          <div class="nameDiv">
                              <p class="productName">${item.name}</p>
                          </div>
                          <div class="priceDiv" >
                              <h5 class="price text-center fw-bold ">LKR ${item.price}</h5>
                          </div>
                    
                          <div class="dateDiv pt-2" data-index="${index}">
                                  <p class="text-center fw-bold mb-0">${item.expiryDate}</p>
                              </div>
                          </div>
                      </div>
                  </div>
      `;

    dynamicProductTile.appendChild(productTile);
  });

  const dataDives = document.querySelectorAll(".dateDiv");
  const currentDate = new Date();
  dataDives.forEach((div) => {
    const pElement = div.querySelector("p");
    const expDate = new Date(pElement.textContent.trim());

    if (expDate < currentDate) {
      pElement.classList.add("expired");
      isExpired = true;
    } else {
      pElement.classList.add("not-expired");
      isExpired = false;
    }
  });
}

document
  .getElementById("productTile")
  .addEventListener("click", function (event) {
    const clickedCard = event.target.closest("#clickableCard");

    if (clickedCard) {
      const index = clickedCard.getAttribute("data-index");
      console.log(
        "clicked index:",
        index,
        selectedCatogary,
        product[selectedCatogary][index].name
      );

      addToCart(selectedCatogary, index);
    }
  });

function addToCart(catogary, index) {
  console.log("add to cart ekata awa");

  let productPotitionInCart = cartData.findIndex(
    (cartItem) =>
      cartItem.item.itemCode === product[selectedCatogary][index].itemCode
  );
  console.log("indexes ", productPotitionInCart);

  // const dynamicCartItem=document.getElementById("cartTable")
  if (cartData.length <= 0) {
    cartData = [
      {
        item: product[catogary][index],
        index: index,
        quantity: 1,
      },
    ];
  } else if (productPotitionInCart < 0) {
    cartData.push({
      item: product[catogary][index],
      index: index,
      quantity: 1,
    });
  } else {
    cartData[productPotitionInCart].quantity++;
  }
  addCartToHtml(catogary, index);
}

function addCartToHtml(catogary, index) {
  console.log("add to cart html ekata awa");
  const dynamicCartItem = document.getElementById("cartTable");
  const totalCount = document.getElementById("totalCount");

  dynamicCartItem.innerHTML = "";

  let priceItems = 0;
  let discountItems = 0;
  let subTotal = priceItems - discountItems;
  let totalItemCount = cartData.length;

  totalCount.innerHTML = "Total Items : " + totalItemCount;
  if (cartData.length > 0) {
    cartData.forEach((item, index) => {
      //   totalQty += item.quantity;
      let produuctItem = cartData[index].item;
      console.log("product item", produuctItem);
      console.log("cart data", cartData);
      console.log("cart data", cartData[index].item.name);

      const cartItem = document.createElement("div");
      cartItem.classList.add(
        "d-flex",
        "flex-row",
        "justify-content-between",
        "p-1",
        "align-items-center",
        "row",
        "row-cols-6",
        "g-0",
        "custom-boarder"
      );
      cartItem.innerHTML = `
          <div class="" style="width: 5%;">
            <p class="mb-0 text-light">${index + 1}</p>
          </div>
          <div class="" style="width: 10%;">
            <img src="${
              produuctItem.img
            }" class="img-fluid" width="45" alt="product">
          </div>
          <div class="" style="width: 25%;">
            <p class="mb-0 text-light">${produuctItem.name}</p>
          </div>
          <div class="" style="width: 20%;">
            <div class="d-block text-light">
              <div class="w-100">
                <p class="mb-0">LKR ${
                  (produuctItem.price -
                    (produuctItem.price * produuctItem.discount) / 100) *
                  item.quantity
                }</p>
              </div>
            </div>
          </div>
          <div class="col-lg-1" style="width: 20%;">
            <div class="quntityChanger">
         
                <div class="">
                  <button class="btn btn-sm btn-outline-warning" id="minus-${index}">-</button>
                  <span class="text-light">${item.quantity}</span>
                  <button class="btn btn-sm btn-outline-warning" id="plus-${index}">+</button>
              </div>

            </div>
          </div>
          <div class="col-lg-1" style="width: 8%;">
            <i class="ri-delete-bin-2-line text-danger fa-2x" id="delete-${index}"></i>     
          </div>
        `;
      dynamicCartItem.appendChild(cartItem);
      //   console.log("ptice" , produuctItem.price);
      console.log(
        produuctItem.name,
        produuctItem.price,
        produuctItem.discount,
        item.quantity
      );
      priceItems = priceItems + produuctItem.price * item.quantity;
      discountItems =
        discountItems +
        (produuctItem.price * produuctItem.discount * item.quantity) / 100;

      console.log("priceItems", priceItems);
      console.log("discountItems", discountItems);
      const subTotal = priceItems - discountItems;
      console.log("sub total", subTotal);

      const totaTable = document.getElementById("totalTable");
      totaTable.innerHTML = `
        <tr>
            <td class="leftCol">Sub Total :</td>
            <td id="subTotal">LKR ${priceItems}</td>
        </tr>
            <tr>
        <td class="leftCol">Discount :</td>
        <td id="discount">LKR ${discountItems}</td>
            </tr>
            <tr>
        <td class="f-w-7 leftCol font-18 text-success">
                <h4>Amount :</h4>
        </td>
            <td class="f-w-7 font-18 text-success ">
                <h4 id="amount">LKR ${subTotal}</h4>
            </td>
        </tr>
    `;
      // totalCount.innerHTML = cartData.length-1;
      console.log("cart data", cartData.length, "awaaaaaaaaaaaaaaaaaaaaaaaaa");

      document
        .getElementById(`minus-${index}`)
        .addEventListener("click", () => changeQuantity(index, -1));
      console.log("- eka ebuwa");

      document
        .getElementById(`plus-${index}`)
        .addEventListener("click", () => changeQuantity(index, 1));
      document
        .getElementById(`delete-${index}`)
        .addEventListener("click", () => removeItem(index));
      console.log("total ekta kalin");
    });

    priceItems, discountItems, subTotal;
    console.log("Updated orderArray:", orderArray);
  }
  //   orderArray.push(priceItems,discountItems,subTotal);
}

function changeQuantity(index, change) {
  cartData[index].quantity += change;
  if (cartData[index].quantity <= 0) {
    removeItem(index);
  }
  addCartToHtml();
}

function removeItem(index) {
  //   cartData[index].quantity = 0;
  if (index == 0) {
    let fEle = cartData.shift();
  } else if (index > 0 && index < cartData.length - 1) {
    let pop = cartData.splice(index, 1);
  } else if (index == cartData.length - 1) {
    let pop = cartData.pop();
  }
  addCartToHtml();
}

const searchField = document.getElementById("searchField");

searchField.addEventListener("keypress", function (e) {
  if (e.key == "Enter") {
    e.preventDefault();
    console.log("serarch ekata rady");

    searchCustomer();
  }
});

function searchCustomer() {
  console.log("serarch ekata awa");
  const searchValue = searchField.value.trim();
  let customerData = fetchCustomers();
  const customer = customerData.find(
    (customer) =>
      customer.customerNIC == searchValue ||
      customer.primaryContact == searchValue ||
      customer.secondaryContact == searchValue
  );

  if (customer) {
    document.getElementById("fullName").value =
      customer.fName + " " + customer.lName;
    document.getElementById("location").value = customer.city;
  }

  orderArray.push(customer);

  console.log(" order array", orderArray);
}

document.getElementById("placeOrderBtn").addEventListener("click", () => {
  placeOrder();
  console.log("btn clicked");
});

function placeOrder() {
  // Retrieve values from dynamically generated table cells
  const subTotalElement = document.querySelector(
    "#totalTable tr:nth-child(1) td:nth-child(2)"
  );
  const discountElement = document.querySelector(
    "#totalTable tr:nth-child(2) td:nth-child(2)"
  );
  const amountElement = document.querySelector(
    "#totalTable tr:nth-child(3) td:nth-child(2)"
  );

  const subTotal = subTotalElement
    ? parseFloat(subTotalElement.textContent.replace("LKR", "").trim())
    : 0;
  const discount = discountElement
    ? parseFloat(discountElement.textContent.replace("LKR", "").trim())
    : 0;
  const amount = amountElement
    ? parseFloat(amountElement.textContent.replace("LKR", "").trim())
    : 0;

  const orderDate = currentDate;
  const orderId = getNextID();

  orderArray.push({
    orderID: orderId,
    orderDate: orderDate,
    items: cartData,
    subTotal: subTotal,
    discount: discount,
    amount: amount,
  });

  console.log("orderArray", orderArray);

  // cartData.length = 0;
  addCartToHtml();
  updateOrderID();
}

document.getElementById("canselBtn").addEventListener("click", () => {
  clearOrder();
  console.log(" order btn clicked");
});

function clearOrder() {
  cartData.length = 0;
  resetTotals();
  resetCustomerData();
  addCartToHtml();
}

function resetCustomerData() {
  searchField.value = "";
  document.getElementById("fullName").value = "";
  document.getElementById("location").value = "";
}

function resetTotals() {
  const subTotalElement = document.querySelector(
    "#totalTable tr:nth-child(1) td:nth-child(2)"
  );
  const discountElement = document.querySelector(
    "#totalTable tr:nth-child(2) td:nth-child(2)"
  );
  const amountElement = document.querySelector(
    "#totalTable tr:nth-child(3) td:nth-child(2)"
  );

  if (subTotalElement) subTotalElement.innerHTML = "LKR 0.00";
  if (discountElement) discountElement.innerHTML = "LKR 0.00";
  if (amountElement) amountElement.innerHTML = "<h4>LKR 0.00</h4>";

  console.log("Totals reset to zero");
}
