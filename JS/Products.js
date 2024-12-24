import { getProduct } from "./data.js";

const product = getProduct();
console.log("Product data:", product);

let selectedCatogary = "Burgers";
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
  const selectedCatogary = product[catogary];
  const dynamicProductTile = document.getElementById("productTile");
  dynamicProductTile.innerHTML = "";

  if (!selectedCatogary) return;

  selectedCatogary.forEach((item) => {
    const productTile = document.createElement("div");
    productTile.classList.add(
      "col",
      "col-sm",
      "col-md-4",
      "col-lg-3",
      "col-xl-2",
      "mt-3",
      "custom-card-col"
    );

    productTile.innerHTML = `

            <div class="card card-custom">
                    <div class="imgDiv">
                        <img src="${item.img}" class="card-img-top"
                            alt="${item.name}" cap">
                    </div>
                    <div class="card-body cardBody">
                        <div class="nameDiv">
                            <p class="productName">${item.name}</p>
                        </div>
                        <div class="priceDiv" >
                            <h5 class="price text-center fw-bold ">${item.price}</h5>
                        </div>
                        <div class="d-flex justify-content-sm-between flex-row ">
                            
                            <i class="fa fa-pencil-square-o fa-2x icon" aria-hidden="true"></i>
                            <i class="fa fa-trash-o fa-2x icon" aria-hidden="true"></i>
                            <i class="fa fa-shopping-cart fa-2x icon" aria-hidden="true"></i>

                        </div>
                    </div>
                </div>
    `;

    dynamicProductTile.appendChild(productTile);
  });
}
