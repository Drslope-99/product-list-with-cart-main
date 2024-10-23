// selecting the various dom elements for manipulation
const productContainer = document.querySelector(".product__items");
const cartDetials = document.querySelector(".cart__details");
const cartCta = document.querySelector(".cart__cta");
const cartEmpty = document.querySelector(".cart__empty");
const cartDescription = document.querySelector(".cart__description");
const cartTotalQuantity = document.querySelector(".cart__total-qty");
const cartOrderTotal = document.querySelector(".cart__order-total");

const items = {
  products: [],
  cart: [],
};

function clearContent(el) {
  el.innerHTML = "";
}

const createdId = (prod) => {
  return prod.category.split(" ")[0];
};

// const renderProducts = (products) => {
//   productContainer.innerHTML = products;
// };

const renderProducts = (product) => {
  clearContent(productContainer);

  const checkProduct = (prod) => {
    return product.cart.find((cartProd) => cartProd.category === prod.category);
  };

  const productList = product.products
    .map((prod, i) => {
      return `<figure class="product__item" id=${createdId(prod)}>
            <img
              class="product__img ${checkProduct(prod) ? "active" : ""}"
              src=${prod.image.desktop}
              alt=${prod.name}
            />

            <div class="product__cta">
             
               <button class="product__btn product__btn--cart ${
                 checkProduct(prod) ? "hide" : ""
               }">
                <img
                  src="assets/images/icon-add-to-cart.svg"
                  alt="add to cart"
                />
                <span>Add to Cart</span>
              </button>
              
               <div class="product__qty ${!checkProduct(prod) ? "hide" : ""}">
                <button class="product__qty-btn product__qty--decrement">
                  <img
                    src="assets/images/icon-decrement-quantity.svg"
                    alt="-"
                  />
                </button>
                <span class="product__qty-value">${
                  checkProduct(prod)?.quantity || 0
                }</span>
                <button class="product__qty-btn product__qty--increment">
                  <img
                    src="assets/images/icon-increment-quantity.svg"
                    alt="+"
                  />
                </button>
              </div>
            </div>
            <div class="product__details">
              <h2 class="product__name">${prod.category}</h2>
              <h3 class="product__desc">${prod.name}</h3>
              <p class="product__price">$${prod.price.toFixed(2)}</p>
            </div>
          </figure>`;
    })
    .join("");

  productContainer.innerHTML = productList;
};

const renderCart = (cart = []) => {
  clearContent(cartDetials);
  let orderTotal;
  let cartTotal;
  let cartItems;
  if (cart.length === 0) {
    cartItems = "";
    cartTotal = 0;
    orderTotal = 0;
    cartEmpty.classList.remove("hide");
    cartCta.classList.remove("active");
    cartDescription.classList.remove("active");
  } else {
    cartTotal = cart
      .map((item) => item.quantity)
      .reduce((acc, val) => acc + val);
    orderTotal = cart
      .map((item) => item.quantity * item.price)
      .reduce((acc, val) => acc + val);

    cartEmpty.classList.add("hide");
    cartCta.classList.add("active");
    cartDescription.classList.add("active");
    cartItems = cart
      .map((cartItem) => {
        return `<div class="cart__items">
                <div class="cart__item">
                  <h3 class="cart__item-name">${cartItem.name}</h3>
                  <span class="cart__item-qty">${cartItem.quantity}x</span>
                  <span class="cart__item-price">@ $${cartItem.price.toFixed(
                    2
                  )}</span>
                  <span class="cart__item-total">$${(
                    cartItem.price * cartItem.quantity
                  ).toFixed(2)}</span>
                </div>

                <button class="cart__item-remove">
                <img src="assets/images/icon-remove-item.svg" alt="" />
                </button>
              </div>`;
      })
      .join("");
  }

  cartTotalQuantity.textContent = cartTotal;
  cartOrderTotal.textContent = orderTotal.toFixed(2);
  cartDetials.innerHTML = cartItems;
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Something went wrong, try reloading the page");
    }
    const data = await response.json();
    items.products = [...data];

    renderProducts(items);
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};
fetchData("../data.json");

function addProductById(productId, items) {
  const { products, cart } = items;
  const selectedProduct = products.find(
    (prod) => createdId(prod) === productId
  );

  const existingProductIndex = cart.findIndex(
    (prod) => prod.category === selectedProduct.category
  );

  if (existingProductIndex < 0) {
    cart.push({ ...selectedProduct, quantity: 1 });
  } else {
    cart[existingProductIndex] = {
      ...cart[existingProductIndex],
      quantity: cart[existingProductIndex].quantity + 1,
    };
  }
  renderProducts(items);
  renderCart(cart);
  console.log(cart);
}

function removeProductById(productId, items) {
  const { products, cart } = items;
  const selectedProductIndex = cart.findIndex(
    (prod) => createdId(prod) === productId
  );

  if (cart[selectedProductIndex].quantity === 1) {
    cart.splice(selectedProductIndex, 1);
  } else {
    cart[selectedProductIndex] = {
      ...cart[selectedProductIndex],
      quantity: cart[selectedProductIndex].quantity - 1,
    };
  }

  renderProducts(items);
  console.log(cart);
  renderCart(cart);
}

/* a function that adds items to the cart */

function addToCart(e, items) {
  const btn = e.target.closest(".product__btn");

  if (!btn) return;

  let id = btn.closest(".product__item").id;
  addProductById(id, items);
}

productContainer.addEventListener("click", (e) => {
  addToCart(e, items);
});

productContainer.addEventListener("click", (e) => {
  const incrementBtn = e.target.closest(".product__qty--increment");

  if (!incrementBtn) return;

  const id = incrementBtn.closest(".product__item").id;
  addProductById(id, items);
});

productContainer.addEventListener("click", (e) => {
  const decrementBtn = e.target.closest(".product__qty--decrement");

  if (!decrementBtn) return;

  const id = decrementBtn.closest(".product__item").id;
  removeProductById(id, items);
});
