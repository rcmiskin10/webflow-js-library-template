const parceled = true;
import {
  setUpCartFromLocalStorage,
  addClickEventListenersToAddToQuoteButtons,
  addClickEventListenerToNavCartOpen,
  addClickEventListenerToNavCartClose,
  onRequestFormSubmit,
} from "./functions";

window.Webflow ||= [];
window.Webflow.push(async () => {
  // all cart items are stored in local storage,
  // so get stored items and place in cart div.
  setUpCartFromLocalStorage();
  // add click event handler for nav cart open link.
  addClickEventListenerToNavCartOpen();
  // add click event handler for nav cart close link.
  addClickEventListenerToNavCartClose();
  // add event handlers for each add to quote button the page.
  addClickEventListenersToAddToQuoteButtons();
  onRequestFormSubmit();
});
