// app.js - versão debug pra gente identificar o problema rápido

let cart = JSON.parse(localStorage.getItem('pubCoffeCart')) || [];

const cartModal   = document.getElementById('cartModal');
const cartItems   = document.getElementById('cartItems');
const totalEl     = document.getElementById('total');
const countEl     = document.getElementById('count');

document.getElementById('openCart').onclick = () => {
  console.log('Abrindo modal. Carrinho atual:', cart); // debug
  renderCart();
  cartModal.classList.remove('hidden');
};

function closeCart() {
  cartModal.classList.add('hidden');
}

function addToCart(name, price) {
  console.log(`Adicionando: ${name} - R$${price}`); // debug
  
  let item = cart.find(i => i.name === name);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  
  saveCart();
  renderCart();
  
  // Pulsar no contador
  countEl.parentElement.style.transform = 'scale(1.2)';
  setTimeout(() => countEl.parentElement.style.transform = '', 200);
}

function removeFromCart(name) {
  console.log(`Removendo: ${name}`); // debug
  cart = cart.filter(i => i.name !== name);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('pubCoffeCart', JSON.stringify(cart));
  console.log('Carrinho salvo:', cart); // debug
}

function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;

  console.log('Renderizando. Itens:', cart); // debug

  if (cart.length === 0) {
    cartItems.innerHTML = '<li style="text-align:center; color:#777; padding:1.5rem 0;">Seu carrinho está vazio ☕</li>';
  } else {
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.innerHTML = `
        <span>${item.name} × ${item.quantity}</span>
        <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
        <button class="remove-btn" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">×</button>
      `;
      cartItems.appendChild(li);
    });
  }

  totalEl.textContent = total.toFixed(2).replace('.', ',');
  countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// Fecha com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});

// Atualiza contador na carga da página
renderCart();
