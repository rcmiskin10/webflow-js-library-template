export function clearCartList() {
  const cartList = Array.from(document.getElementsByClassName("cart-list"))[0];
  cartList.replaceChildren();
}

export function resetCart() {
  clearCartList();
  localStorage.clear();
}

export function onRequestFormSubmit() {
  const button = Array.from(
    document.getElementsByClassName("request-quote-button-form-button")
  )[0];
  button.addEventListener("click", function handleClick(event) {
    const target = event.target as HTMLButtonElement;
    if (target) {
      resetCart();
    }
  });
}

export function addClickEventListenersToRemoveLinks() {
  const removeItemLinks = Array.from(
    document.getElementsByClassName("cart-item-information-remove-link")
  );

  removeItemLinks.forEach((link) => {
    link.addEventListener("click", async (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target) {
        const quoteItems = await JSON.parse(
          localStorage?.getItem("quoteItems") || "{}"
        );

        if (target.dataset.slug) {
          delete quoteItems[target.dataset.slug];
          localStorage.setItem("quoteItems", JSON.stringify(quoteItems));
          const form = document.getElementById(
            "wf-form-Request-Quote"
          ) as HTMLFormElement;
          const hiddenInput = document.getElementById(
            target.dataset.slug
          ) as HTMLInputElement;
          form.removeChild(hiddenInput);
        }

        target.parentElement?.parentElement?.remove();
        toggleCartFooter(quoteItems);
        toggleCartEmptyListState(quoteItems);
        setCartItemsQuantity();
      }
    });
  });
}

export function toggleCartFooter(quoteItems: Object) {
  const cartFooter = Array.from(
    document.getElementsByClassName("cart-footer")
  )[0] as HTMLElement;
  if (Object.keys(quoteItems).length > 0) {
    cartFooter.style.display = "block";
    onRequestFormSubmit();
  } else {
    cartFooter.style.display = "none";
  }
}

export function toggleCartEmptyListState(quoteItems: Object) {
  const cartFooter = Array.from(
    document.getElementsByClassName("cart-empty")
  )[0] as HTMLElement;
  if (Object.keys(quoteItems).length > 0) {
    cartFooter.style.display = "none";
    onRequestFormSubmit();
  } else {
    cartFooter.style.display = "block";
  }
}

function addQuoteItemsToHiddenInput(item: any) {
  const hiddenInput = document.createElement("input");
  document.getElementById("wf-form-Request-Quote")?.appendChild(hiddenInput);
  hiddenInput.name = "Item: " + item["slug"];
  hiddenInput.id = item["slug"];
  hiddenInput.type = "hidden";
  hiddenInput.value = " Quantity: " + item["quantity"];
  hiddenInput.className = "quote-item";
  document.getElementById("wf-form-Request-Quote")?.appendChild(hiddenInput);
}

export function addClickEventListenersToAddToQuoteButtons() {
  const addToQuoteButtons = Array.from(
    document.getElementsByClassName("add-to-quote-button")
  );
  addToQuoteButtons.forEach((btn) => {
    btn.addEventListener("click", async function handleClick(event) {
      const target = event.target as HTMLButtonElement;
      if (target) {
        const { slug } = target.dataset;
        const productQuantityInput = document.getElementById(
          "product-quantity-" + slug
        ) as HTMLInputElement;
        const productQuantity = productQuantityInput.value;
        if (productQuantity === "" || productQuantity == null) {
          productQuantityInput.setCustomValidity("Please enter a number!");
          productQuantityInput.reportValidity();
          return;
        }

        const quoteItems = await JSON.parse(
          localStorage?.getItem("quoteItems") || "{}"
        );
        if (slug) {
          target.dataset.quantity = productQuantity;
          quoteItems[slug] = target.dataset;
        }

        localStorage.setItem("quoteItems", JSON.stringify(quoteItems));
        setUpCartFromLocalStorage();
        openCart();
      }
    });
  });
}

export function addClickEventListenersToCartItemQuantityInputs() {
  const cartQuantityInputs = Array.from(
    document.getElementsByClassName("cart-quantity")
  );

  cartQuantityInputs.forEach((cartQuantityInput) => {
    cartQuantityInput.addEventListener("input", async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target) {
        const quoteItems = await JSON.parse(
          localStorage?.getItem("quoteItems") || "{}"
        );

        if (target.dataset.slug) {
          const originalQuantity = quoteItems[target.dataset.slug]["quantity"];
          quoteItems[target.dataset.slug]["quantity"] =
            target.value == "" || target.value == null
              ? originalQuantity
              : target.value;
          localStorage.setItem("quoteItems", JSON.stringify(quoteItems));
          addQuoteItemsToHiddenInput(quoteItems[target.dataset.slug]);
        }
        toggleCartFooter(quoteItems);
        toggleCartEmptyListState(quoteItems);
        setCartItemsQuantity();
      }
    });
  });
}

export async function setCartItemsQuantity() {
  const quoteItems = await JSON.parse(
    localStorage?.getItem("quoteItems") || "{}"
  );
  const cartItemsQuantity = document.getElementById("cart-quantity");
  if (cartItemsQuantity) {
    cartItemsQuantity.innerHTML = Object.keys(quoteItems).length.toString();
  }
}

export async function setUpCartFromLocalStorage() {
  clearCartList();
  // load add to cart if local storage not empty
  const quoteItems = await JSON.parse(
    localStorage?.getItem("quoteItems") || "{}"
  );
  Object.keys(quoteItems).forEach(function (key) {
    const removeLink = document.createElement("a");
    removeLink.href = "#";
    removeLink.classList.add("cart-item-information-remove-link");
    removeLink.innerText = "Remove";
    removeLink.dataset.slug = quoteItems[key]["slug"];

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");

    const cartItem = `
            <div class="cart-item-image-wrapper">
              <img 
                src="${quoteItems[key]["image"]}" 
                loading="lazy" 
                sizes="(max-width: 991px) 
                100vw, 60px" 
                srcset="${quoteItems[key]["image"]} 500w, ${quoteItems[key]["image"]} 540w" 
                alt="" 
                class="cart-item-image"
              >
            </div>
            <div class="cart-item-information">
              <div class="cart-item-information-heading">${quoteItems[key]["name"]}</div>
              <div class="cart-item-information-subheading">${quoteItems[key]["description"]}</div>
              ${removeLink.outerHTML}
            </div>
            <div class="w-embed">
              <input 
                type="number" 
                class="w-commerce-commercecartquantity input cart-quantity" 
                min="1" 
                max="100000000"
                required 
                oninput="validity.valid||(value='');"
                name="quantity" 
                autocomplete="off" 
                value="${quoteItems[key]["quantity"]}"
                data-slug="${quoteItems[key]["slug"]}"
                onfocusout="if(this.value===''){this.value='${quoteItems[key]["quantity"]}'};"
              >
            </div>
          `;

    cartItemDiv.innerHTML = cartItem;
    const cartList = Array.from(
      document.getElementsByClassName("cart-list")
    )[0];
    cartList.appendChild(cartItemDiv);
    addQuoteItemsToHiddenInput(quoteItems[key]);
  });

  addClickEventListenersToRemoveLinks();
  addClickEventListenersToCartItemQuantityInputs();
  toggleCartFooter(quoteItems);
  toggleCartEmptyListState(quoteItems);
  setCartItemsQuantity();
}

export function openCart() {
  const cart = Array.from(
    document.getElementsByClassName("cart")
  )[0] as HTMLElement;
  cart.style.display = "block";
}

export function closeCart() {
  const cart = Array.from(
    document.getElementsByClassName("cart")
  )[0] as HTMLElement;
  cart.style.display = "none";
}

export function addClickEventListenerToNavCartOpen() {
  const cartLink = Array.from(document.getElementsByClassName("nav-cart"))[0];
  cartLink.addEventListener("click", function handleClick() {
    setUpCartFromLocalStorage();
    openCart();
  });
}

export function addClickEventListenerToNavCartClose() {
  const closeButton = Array.from(
    document.getElementsByClassName("close-button")
  )[0];
  closeButton.addEventListener("click", function handleClick() {
    closeCart();
  });
}
