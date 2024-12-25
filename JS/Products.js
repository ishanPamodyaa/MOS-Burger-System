import {
  fetchProducts,
  addProduct,
  removeProduct,
} from "./productDataManage.js";


let uploadedImage = "";
const product = fetchProducts();
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

  selectedCatogary.forEach((item, index) => {
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
                            <h5 class="price text-center fw-bold ">LKR ${item.price}</h5>
                        </div>
                        <div class="d-flex justify-content-sm-between flex-row ">
                            
   
                                <i class="fa fa-pencil-square-o fa-2x icon" data-index="${index}" data-action="edit" aria-hidden="true"></i>
                                <i class="fa fa-trash-o fa-2x icon" data-index="${index}" data-action="delete" aria-hidden="true"></i>
                                <i class="fa fa-shopping-cart fa-2x icon" data-index="${index}" data-action="shop" aria-hidden="true"></i>
                            </div>

                        </div>
                    </div>
                </div>
    `;

    dynamicProductTile.appendChild(productTile);
  });

    document.querySelectorAll(".icon").forEach(icon => {
        icon.addEventListener("click", (evt)=>{
            const action = evt.target.dataset.action;
            const index  = evt.target.dataset.index;

            if(action == "edit"){
                //
            }else if (action == "delete"){
                removeProduct(index, catogary);
               displayProductList(catogary);
            }else if (action == "shop"){
                //
            }    
        });
    });

}

document.getElementById("addProductForm").addEventListener("submit",function (event) {
event.preventDefault();
addNewProduct();    
});

function addNewProduct() {

const productCode = document.getElementById("itemCode").value;
const cat = document.getElementById("itemCategory");
const productCatogery = cat.options[cat.selectedIndex].text;
const productName = document.getElementById("itemName").value;
const productPrice = parseFloat(document.getElementById("itemPrice").value)|| 0;
const productDiscount = parseFloat(document.getElementById("itemDiscount").value)|| 0;
const productQty = parseFloat(document.getElementById("itemQty").value)||0;
const productExpDate = document.getElementById("itemExpDate").value;

for(let i = 0; i< product[productCatogery].length; i++){

    if(product[productCatogery][i].itemCode == productCode){
        removeProduct(i,productCatogery);
    }
}

const newProduct = {

    itemCode: productCode,
      name: productName,
      price: productPrice,
      discount: productDiscount,
      quantity : productQty,
      expiryDate: productExpDate,
      img: uploadedImage,
};

if (!product[productCatogery]) {
    product[productCatogery] = [];
  }
  
addProduct(newProduct,productCatogery);
console.log(newProduct);

}



function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Show the image preview
      const imagePreview = document.getElementById("imagePreview");
      imagePreview.src = e.target.result; // Set the image source to the uploaded file
      imagePreview.style.display = "block"; // Make the image visible
      // Store the image data for further use
      uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  // Optionally log the uploaded image (Base64 string)
  console.log(uploadedImage);
}
// Attach the preview function to the file input
document.getElementById("itemImg").addEventListener("change", previewImage);


