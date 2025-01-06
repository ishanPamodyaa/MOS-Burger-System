import { fetchOrders, addOrder, removeOrder } from "./orderDataManage.js";

const orders = fetchOrders();

window.onload = function () {
  console.log("Orders loaded:", orders);
  displayOrderList();
};

function displayOrderList() {
    console.log("display order list come");
    
  const dyanamicOrderTile = document.getElementById("orderTile");

  dyanamicOrderTile.innerHTML = "";

  orders.forEach((order, index) => {
    const orderTile = document.createElement("div");
    orderTile.classList.add("row");
    orderTile.innerHTML = `
                    <div class="text-center">
                        <div class="col-lg-12 col-md-12 col-sm-12 b-example-divider "></div>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 text-center text-warning">
                        <p>${order.orderId}</p>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 text-center text-warning">
                        <p>${order.orderDate}</p>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 text-center text-warning">
                        <p>${
                          order.customer[0].fName + " " + order.customer[0].lName
                        }</p>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 text-center text-warning">
                        <p>${order.customer[0].primaryContact}</p>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-2 text-center text-warning">
                        <p>LKR  ${order.total}</p>
                    </div>
                    <div
                        class="d-flex flex-row justify-content-center align-items-center col-lg-2 col-md-2 col-sm-2 text-warning gap-2">
                        <a href="">
                            <p class="">View</p>
                        </a>
                        <!-- <img src="../image/icon/doc.png" class="align-items-lg-center" width="30px"> -->
                    </div>

    `;

    dyanamicOrderTile.appendChild(orderTile);
  });
}
