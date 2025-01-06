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

  orderArray.push({ customer: customer });

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
  console.log(orderArray[0].customer.fName);
  // cartData.length = 0;
  addCartToHtml();
  updateOrderID();

  var docDefinition = {
    content: [
      // Title and Order Info
      { text: "MOS Burgers", style: "header" },
      { text: "123, Galle Road, Colombo 03, Sri Lanka", style: "subHeader" },
      { text: "(+94) 077 123 4567", style: "subHeader" },
      { text: "contact@mosburgers.lk", style: "subHeader" },
      { text: "www.mosburgers.lk", style: "subHeader" },

      {
        text: `Order ID: ${orderArray[1].orderID}`,
        margin: [0, 10, 0, 5],
        style: "orderInfo",
      },
      {
        text: `Customer Name: ${orderArray[0].customer.fName + " " + orderArray[0].customer.lName}`,
        margin: [0, 0, 0, 5],
        style: "orderInfo",
      },
      {
        text: `Phone Number: ${orderArray[0].customer.primaryContact}`,
        margin: [0, 0, 0, 5],
        style: "orderInfo",
      },
      {
        text: `Address: ${orderArray[0].customer.address}`,
        margin: [0, 0, 0, 15],
        style: "orderInfo",
      },

      // Table of Items
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            [
              { text: "Item", style: "tableHeader" },
              { text: "Quantity", style: "tableHeader" },
              { text: "Price", style: "tableHeader" },
              { text: "Total", style: "tableHeader" },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? "#ee9f54" : null),
        },
      },

      // Summary section
      {
        text: `Total Items: ${cartData.length}`,
        margin: [0, 10, 0, 5],
        style: "summaryText",
      },
      {
        text: `Subtotal: LKR ${orderArray[1].subTotal}`,
        margin: [0, 0, 0, 5],
        style: "summaryText",
      },
      {
        text: `Discount: LKR ${orderArray[1].discount}`,
        margin: [0, 0, 0, 5],
        style: "summaryText",
      },
      {
        text: `Total: LKR ${orderArray[1].amount}`,
        style: "total",
        margin: [0, 10, 0, 0],
      },

    ],

    // Styles
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
        color: "#dc6b19",
      },
      subHeader: {
        fontSize: 12,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 3],
        color: "#424242",
      },
      orderInfo: {
        fontSize: 12,
        margin: [0, 5, 0, 5],
        color: "#424242",
      },
      tableHeader: {
        bold: true,
        fontSize: 14,
        color: "white",
        alignment: "center",
      },
      tableContent: {
        fontSize: 12,
        color: "#424242",
        alignment: "center",
      },
      summaryText: {
        fontSize: 12,
        bold: true,
        color: "#424242",
      },
      total: {
        fontSize: 16,
        bold: true,
        alignment: "right",
        color: "#dc6b19",
      },
     
    },
  };

  // Add order items to the table
  cartData.forEach((item) => {
    if (item.quantity > 0) {
      const itemPrice = Number(item.item.price) || 0;
      const itemQuantity = Number(item.quantity) || 0;
      docDefinition.content[9].table.body.push([
        { text: item.item.name, style: "tableContent" },
        { text: itemQuantity, style: "tableContent" },
        { text: `LKR ${itemPrice}`, style: "tableContent" },
        { text: `LKR ${itemPrice * itemQuantity}`, style: "tableContent" },
      ]);
    }
  });

  // Check if the table has items
  if (docDefinition.content[9].table.body.length <= 1) {
    console.error("No items to display in the table.");
    return;
  }

  // Generate the PDF
  const pdfName = orderId + ".pdf";
  pdfMake.createPdf(docDefinition).download(pdfName);
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

function pdfBilGenaretor() {
  var pdfObject = jsPDFInvoiceTemplate.default(props); //returns number of pages created
}
var props = {
  outputType: jsPDFInvoiceTemplate.OutputType.Save,
  onJsPDFDocCreation: function (jsPDFDoc) {
    // Custom logic for jsPDF document manipulation
    console.log("jsPDF document created:", jsPDFDoc);
  }, //Allows for additional configuration prior to writing among others, adds support for different languages and symbols
  returnJsPDFDocObject: true,
  fileName: "Invoice 2021",
  orientationLandscape: false,
  compress: true,
  // logo: {
  //     src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
  //     type: 'PNG', //optional, when src= data:uri (nodejs case)
  //     width: 53.33, //aspect ratio = width/height
  //     height: 26.66,
  //     margin: {
  //         top: 0, //negative or positive num, from the current position
  //         left: 0 //negative or positive num, from the current position
  //     }
  // },
  // stamp: {
  //     inAllPages: true, //by default = false, just in the last page
  //     src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
  //     type: 'JPG', //optional, when src= data:uri (nodejs case)
  //     width: 20, //aspect ratio = width/height
  //     height: 20,
  //     margin: {
  //         top: 0, //negative or positive num, from the current position
  //         left: 0 //negative or positive num, from the current position
  //     }
  // },
  business: {
    name: "MOS Burgers",
    address: "Albania, Tirane ish-Dogana, Durres 2001",
    phone: "(+355) 069 11 11 111",
    email: "email@example.com",
    email_1: "info@example.al",
    website: "www.example.al",
  },
  contact: {
    label: "Bill issued for:",
    name: "Client Name `${}`",
    address: "Albania, Tirane, Astir",
    phone: "(+355) 069 22 22 222",
    email: "client@website.al",
    otherInfo: "www.website.al",
  },
  invoice: {
    label: "Invoice #: ",
    num: 19,
    invDate: "Payment Date: 01/01/2021 18:12",
    invGenDate: "Invoice Date: 02/02/2021 10:17",
    headerBorder: false,
    tableBodyBorder: false,
    header: [
      {
        title: "#",
        style: {
          width: 10,
        },
      },
      {
        title: "Title",
        style: {
          width: 30,
        },
      },
      {
        title: "Description",
        style: {
          width: 80,
        },
      },
      { title: "Price" },
      { title: "Quantity" },
      { title: "Unit" },
      { title: "Total" },
    ],
    table: Array.from(Array(10), (item, index) => [
      index + 1,
      "There are many variations ",
      "Lorem Ipsum is simply dummy text dummy text ",
      200.5,
      4.5,
      "m2",
      400.5,
    ]),
    additionalRows: [
      {
        col1: "Total:",
        col2: "145,250.50",
        col3: "ALL",
        style: {
          fontSize: 14, //optional, default 12
        },
      },
      {
        col1: "VAT:",
        col2: "20",
        col3: "%",
        style: {
          fontSize: 10, //optional, default 12
        },
      },
      {
        col1: "SubTotal:",
        col2: "116,199.90",
        col3: "ALL",
        style: {
          fontSize: 10, //optional, default 12
        },
      },
    ],
    invDescLabel: "Invoice Note",
    invDesc:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
  },
  footer: {
    text: "The invoice is created on a computer and is valid without the signature and stamp.",
  },
  pageEnable: true,
  pageLabel: "Page ",
  onJsPDFDocCreation: (doc) => {
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
    const centerX = pageWidth / 2; // Calculate center of page

    // Add centered business information
    doc.setFontSize(14);
    doc.text("Business Name", centerX, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Albania, Tirane ish-Dogana, Durres 2001", centerX, 28, {
      align: "center",
    });
    doc.text("(+355) 069 11 11 111", centerX, 36, { align: "center" });
    doc.text("email@example.com", centerX, 44, { align: "center" });
    doc.text("www.example.al", centerX, 52, { align: "center" });
  },
};
