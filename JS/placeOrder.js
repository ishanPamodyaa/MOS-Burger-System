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

window.onload = function () {
  displayProductList(selectedCatogary);
};

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

const addCartToHtml = (catogary, index) => {
  const dynamicCartItem = document.getElementById("cartTable");
  dynamicCartItem.innerHTML = "";
  let totalQty = 0;

  if (cartData.length > 0) {
    cartData.forEach((item, index) => {
      totalQty += item.quantity;
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
          <div class="" style="width: 15%;">
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
          <div class="" style="width: 15%;">
            <div class="form-group">
              <input type="number" class="form-control" name="cartQty${index}" id="cartQty${index}" value="${
        item.quantity
      }">
            </div>
          </div>
          <div class="" style="width: 5%;">
            <a href="#" class="text-danger"><i class="ri-delete-bin-2-line"></i></a>
          </div>
        `;
      dynamicCartItem.appendChild(cartItem);
    });
  }
};

///////////////////////////////////////////////////////////////////
// ************************************************
// Shopping Cart API
// ************************************************

// var shoppingCart = (function () {
//   // =============================
//   // Private methods and propeties
//   // =============================
//   cart = [];

//   // Constructor
//   function Item(name, price, count) {
//     this.name = name;
//     this.price = price;
//     this.count = count;
//   }

//   // Save cart
//   function saveCart() {
//     sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
//   }

//   // Load cart
//   function loadCart() {
//     cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
//   }
//   if (sessionStorage.getItem("shoppingCart") != null) {
//     loadCart();
//   }

//   // =============================
//   // Public methods and propeties
//   // =============================
//   var obj = {};

//   // Add to cart
//   obj.addItemToCart = function (name, price, count) {
//     for (var item in cart) {
//       if (cart[item].name === name) {
//         cart[item].count++;
//         saveCart();
//         return;
//       }
//     }
//     var item = new Item(name, price, count);
//     cart.push(item);
//     saveCart();
//   };
//   // Set count from item
//   obj.setCountForItem = function (name, count) {
//     for (var i in cart) {
//       if (cart[i].name === name) {
//         cart[i].count = count;
//         break;
//       }
//     }
//   };
//   // Remove item from cart
//   obj.removeItemFromCart = function (name) {
//     for (var item in cart) {
//       if (cart[item].name === name) {
//         cart[item].count--;
//         if (cart[item].count === 0) {
//           cart.splice(item, 1);
//         }
//         break;
//       }
//     }
//     saveCart();
//   };

//   // Remove all items from cart
//   obj.removeItemFromCartAll = function (name) {
//     for (var item in cart) {
//       if (cart[item].name === name) {
//         cart.splice(item, 1);
//         break;
//       }
//     }
//     saveCart();
//   };

//   // Clear cart
//   obj.clearCart = function () {
//     cart = [];
//     saveCart();
//   };

//   // Count cart
//   obj.totalCount = function () {
//     var totalCount = 0;
//     for (var item in cart) {
//       totalCount += cart[item].count;
//     }
//     return totalCount;
//   };

//   // Total cart
//   obj.totalCart = function () {
//     var totalCart = 0;
//     for (var item in cart) {
//       totalCart += cart[item].price * cart[item].count;
//     }
//     return Number(totalCart.toFixed(2));
//   };

//   // List cart
//   obj.listCart = function () {
//     var cartCopy = [];
//     for (i in cart) {
//       item = cart[i];
//       itemCopy = {};
//       for (p in item) {
//         itemCopy[p] = item[p];
//       }
//       itemCopy.total = Number(item.price * item.count).toFixed(2);
//       cartCopy.push(itemCopy);
//     }
//     return cartCopy;
//   };

//   // cart : Array
//   // Item : Object/Class
//   // addItemToCart : Function
//   // removeItemFromCart : Function
//   // removeItemFromCartAll : Function
//   // clearCart : Function
//   // countCart : Function
//   // totalCart : Function
//   // listCart : Function
//   // saveCart : Function
//   // loadCart : Function
//   return obj;
// })();

// // *****************************************
// // Triggers / Events
// // *****************************************
// // Add item
// $(".add-to-cart").click(function (event) {
//   event.preventDefault();
//   var name = $(this).data("name");
//   var price = Number($(this).data("price"));
//   shoppingCart.addItemToCart(name, price, 1);
//   displayCart();
// });

// // Clear items
// $(".clear-cart").click(function () {
//   shoppingCart.clearCart();
//   displayCart();
// });

// function displayCart() {
//   var cartArray = shoppingCart.listCart();
//   var output = "";
//   for (var i in cartArray) {
//     output +=
//       "<tr>" +
//       "<td>" +
//       cartArray[i].name +
//       "</td>" +
//       "<td>(" +
//       cartArray[i].price +
//       ")</td>" +
//       "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" +
//       cartArray[i].name +
//       ">-</button>" +
//       "<input type='number' class='item-count form-control' data-name='" +
//       cartArray[i].name +
//       "' value='" +
//       cartArray[i].count +
//       "'>" +
//       "<button class='plus-item btn btn-primary input-group-addon' data-name=" +
//       cartArray[i].name +
//       ">+</button></div></td>" +
//       "<td><button class='delete-item btn btn-danger' data-name=" +
//       cartArray[i].name +
//       ">X</button></td>" +
//       " = " +
//       "<td>" +
//       cartArray[i].total +
//       "</td>" +
//       "</tr>";
//   }
//   $(".show-cart").html(output);
//   $(".total-cart").html(shoppingCart.totalCart());
//   $(".total-count").html(shoppingCart.totalCount());
// }

// // Delete item button

// $(".show-cart").on("click", ".delete-item", function (event) {
//   var name = $(this).data("name");
//   shoppingCart.removeItemFromCartAll(name);
//   displayCart();
// });

// // -1
// $(".show-cart").on("click", ".minus-item", function (event) {
//   var name = $(this).data("name");
//   shoppingCart.removeItemFromCart(name);
//   displayCart();
// });
// // +1
// $(".show-cart").on("click", ".plus-item", function (event) {
//   var name = $(this).data("name");
//   shoppingCart.addItemToCart(name);
//   displayCart();
// });

// // Item count input
// $(".show-cart").on("change", ".item-count", function (event) {
//   var name = $(this).data("name");
//   var count = Number($(this).val());
//   shoppingCart.setCountForItem(name, count);
//   displayCart();
// });

// displayCart();
//////////////////////////////////////////////////////////////////////////
//   document
//     .getElementById("addProductForm")
//     .addEventListener("submit", function (event) {
//       event.preventDefault();
//       addNewProduct();
//     });

//   function addNewProduct() {
//     const productCode = document.getElementById("itemCode").value;
//     const cat = document.getElementById("itemCategory");
//     const productCatogery = cat.options[cat.selectedIndex].text;
//     const productName = document.getElementById("itemName").value;
//     const productPrice =
//       parseFloat(document.getElementById("itemPrice").value) || 0;
//     const productDiscount =
//       parseFloat(document.getElementById("itemDiscount").value) || 0;
//     const productQty = parseFloat(document.getElementById("itemQty").value) || 0;
//     const productExpDate = document.getElementById("itemExpDate").value;

//     for (let i = 0; i < product[productCatogery].length; i++) {
//       if (product[productCatogery][i].itemCode === productCode) {
//         // console.log("ADD NEW", productCode, product[productCatogery][i].itemCode);
//         removeProduct(i, productCatogery);
//         console.log(
//           "add new eka athule product eka remive karala iwrai",
//           selectedCatogary
//         );

//         displayProductList(selectedCatogary);
//       }
//     }

//     const newProduct = {
//       itemCode: productCode,
//       name: productName,
//       price: productPrice,
//       discount: productDiscount,
//       quantity: productQty,
//       expiryDate: productExpDate,
//       img: uploadedImage,
//     };
//     console.log("sasasasasa", uploadedImage);

//     if (!product[productCatogery]) {
//       product[productCatogery] = [];
//     }

//     selectedCatogary = productCatogery;

//     addProduct(newProduct, selectedCatogary);
//     updateProduct(
//       newProduct,
//       product[selectedCatogary].length - 1,
//       selectedCatogary
//     );
//     console.log("update eken eliye");

//     displayProductList(selectedCatogary);

//     console.log("lsllsls ", newProduct);
//   }

//   function previewImage(event) {
//     const file = event.target.files[0];
//     console.log("file ekaaaa", file);

//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e) {
//         const imagePreview = document.getElementById("imagePreview");
//         imagePreview.src = e.target.result;
//         imagePreview.style.display = "block";
//         uploadedImage = e.target.result;
//         console.log("e.target.result;",e.target.result);
//         console.log("uploadedImage", uploadedImage);

//       };
//       reader.readAsDataURL(file);
//     }
//     console.log(uploadedImage);
//   }
//   document.getElementById("itemImg").addEventListener("change", previewImage);

//   function updateProduct(newProduct, index, catogary) {
//     const dynamicProductTile = document.getElementById("productTile");
//     console.log("update eka atule", index, catogary);

//     const productTile = document.createElement("div");
//     productTile.classList.add(
//       "col",
//       "col-sm",
//       "col-md-4",
//       "col-lg-3",
//       "col-xl-2",
//       "mt-3",
//       "custom-card-col"
//     );
//     console.log("img seen", newProduct.img);

//     productTile.innerHTML = `

//   <div class="card card-custom"  >
//           <div class="imgDiv">
//               <img src="${newProduct.img}" class="card-img-top"
//                   alt="${newProduct.name}" cap">
//           </div>
//           <div class="card-body cardBody">
//               <div class="nameDiv">
//                   <p class="productName">${newProduct.name}</p>
//               </div>
//               <div class="priceDiv" >
//                   <h5 class="price text-center fw-bold ">LKR ${newProduct.price}</h5>
//               </div>
//               <div class="d-flex justify-content-sm-between flex-row ">

//                       <i class="fa fa-pencil-square-o fa-2x icon" data-index="${index}" data-action="edit" aria-hidden="true"></i>
//                       <i class="fa fa-trash-o fa-2x icon" data-index="${index}" data-action="delete" aria-hidden="true"></i>
//                       <i class="fa fa-shopping-cart fa-2x icon" data-index="${index}" data-action="shop" aria-hidden="true"></i>
//                   </div>

//               </div>
//           </div>
//       </div>
//   `;

//     // Attach event listeners to the new icons
//     console.log("methana p1");

//     const editIcon = productTile.querySelector(".fa-pencil-square-o");
//     const deleteIcon = productTile.querySelector(".fa-trash-o");
//     const shopIcon = productTile.querySelector(".fa-shopping-cart");

//     console.log("methana p2");

//     editIcon.addEventListener("click", (evt) => {
//       editProduct(index, catogary);
//       console.log("Edit eken passe");

//     });

//     deleteIcon.addEventListener("click", (evt) => {
//       removeProduct(index, catogary);
//       displayProductList(catogary);
//     });

//     shopIcon.addEventListener("click", (evt) => {
//       // console.log("Shop action triggered for index:", index);
//       // Implement shop functionality
//     });
//     console.log("methana p3");

//     // Append the product tile to the DOM
//     dynamicProductTile.appendChild(productTile);
//     console.log("methana p4");
//   }

//   function editProduct(index, catogary) {
//     // Ensure category is selected and product array exists
//     console.log("edit product ", index, catogary);

//     if (!product[catogary]) {
//       console.error("Category or product data is not defined");
//       return;
//     }

//     const productToEdit = product[catogary][index];

//     if (!productToEdit) {
//       console.error("Invalid product index:", index);
//       return;
//     }
//     console.log("image eekaa ", productToEdit.img);

//     // Populate form fields with the selected product's data
//     document.getElementById("itemCode").value = productToEdit.itemCode;
//     document.getElementById("itemName").value = productToEdit.name;
//     document.getElementById("itemPrice").value = productToEdit.price;
//     document.getElementById("itemDiscount").value = productToEdit.discount;
//     document.getElementById("itemQty").value = productToEdit.quantity;
//     document.getElementById("itemExpDate").value = productToEdit.expiryDate;

//     document.getElementById("imagePreview").src = productToEdit.img;
//     document.getElementById("imagePreview").style.display = "block";

//     document.getElementById("itemCategory").value = catogary;
//     console.log("imageeeee", uploadedImage);
//     const myModal = new bootstrap.Modal(document.getElementById("myModal"), {});
//     myModal.show();
//   }
