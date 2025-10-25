// scripts.js - Gestión completa de la aplicación de menú (ACTUALIZADO)

// Variables globales
let cartItems = [];
let currentEditingItem = null;

// Elementos del DOM
const cartCount = document.getElementById('cartCount');
const cartList = document.getElementById('cartList');
const cartModal = document.getElementById('cartModal');
const overlay = document.getElementById('overlay');
const cartTotal = document.getElementById('cartTotal');
const checkoutForm = document.getElementById('checkoutForm');
const itemModal = document.getElementById('itemModal');
const modalHeaderBlur = document.getElementById('modalHeaderBlur');
const notificationPanel = document.getElementById('notificationPanel');
const historyPanel = document.getElementById('historyPanel');

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartList();
    positionPanels();
});

// Configuración de todos los event listeners
function initializeEventListeners() {
    // Categorías
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', handleCategoryChange);
    });

    // Notificaciones
    document.getElementById('notificationBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleNotificationPanel();
    });

    // Historial
    document.getElementById('historyBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleHistoryPanel();
    });

    // Cerrar paneles al hacer clic fuera
    document.addEventListener('click', closeAllPanels);

    // Métodos de pago
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', handlePaymentMethodSelection);
    });

    // Formulario de checkout
    checkoutForm.addEventListener('submit', handleCheckout);

    // Botón de carrito
    document.getElementById('cartButton').addEventListener('click', toggleModal);

    // Overlay para cerrar modal
    overlay.addEventListener('click', closeModal);

    // Botones del modal del carrito
    document.getElementById('continueShoppingBtn').addEventListener('click', closeModal);
    document.getElementById('checkoutBtn').addEventListener('click', showCheckoutForm);
    document.getElementById('backToCartBtn').addEventListener('click', showCartItems);

    // Botones del modal de personalización
    document.getElementById('cancelCustomizationBtn').addEventListener('click', closeItemModal);
    document.getElementById('saveCustomizationBtn').addEventListener('click', saveItemCustomization);

    // Prevenir que los clics en los paneles los cierren
    notificationPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    historyPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Posicionar paneles flotantes
function positionPanels() {
    // Los paneles ya están centrados por CSS con left: 50% y transform: translateX(-50%)
    // Esta función se mantiene para futuras adaptaciones si son necesarias
}

// Manejo de cambio de categorías
function handleCategoryChange() {
    // Remover clase active de todos los botones
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    // Añadir clase active al botón clickeado
    this.classList.add('active');

    // Ocultar todas las categorías
    document.querySelectorAll('.product-category').forEach(cat => {
        cat.classList.remove('active');
    });

    // Mostrar la categoría seleccionada
    const category = this.getAttribute('data-category');
    document.getElementById(category).classList.add('active');
}

// Panel de notificaciones
function toggleNotificationPanel() {
    const isVisible = notificationPanel.style.display === 'block';
    
    // Cerrar todos los paneles primero
    closeAllPanels();
    
    // Si no estaba visible, abrir notificaciones
    if (!isVisible) {
        notificationPanel.style.display = 'block';
        // Posicionar el panel debajo del botón
        positionPanelUnderButton('notificationBtn', notificationPanel);
    }
}

// Panel de historial
function toggleHistoryPanel() {
    const isVisible = historyPanel.style.display === 'block';
    
    // Cerrar todos los paneles primero
    closeAllPanels();
    
    // Si no estaba visible, abrir historial
    if (!isVisible) {
        historyPanel.style.display = 'block';
        // Posicionar el panel debajo del botón
        positionPanelUnderButton('historyBtn', historyPanel);
    }
}

// Posicionar panel debajo del botón correspondiente
function positionPanelUnderButton(buttonId, panel) {
    const button = document.getElementById(buttonId);
    const buttonRect = button.getBoundingClientRect();
    
    // El panel ya está centrado por CSS, solo necesitamos asegurar la posición vertical
    panel.style.top = (buttonRect.bottom + window.scrollY + 5) + 'px';
}

// Cerrar todos los paneles
function closeAllPanels() {
    notificationPanel.style.display = 'none';
    historyPanel.style.display = 'none';
}

// Selección de método de pago
function handlePaymentMethodSelection() {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    this.classList.add('selected');
    document.getElementById('paymentMethod').value = this.getAttribute('data-method');
}

// Funciones del carrito
function addToCart(name, price, image) {
    const item = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        image,
        note: '',
        addons: []
    };

    cartItems.push(item);
    updateCartCount();
    updateCartList();

    // Efecto visual de confirmación
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check" style="margin-right: 8px;"></i> Añadido';
    button.style.background = 'linear-gradient(to right, var(--success), #2a9d8f)';

    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = 'linear-gradient(to right, var(--primary), var(--secondary))';
    }, 1500);
}

function updateCartCount() {
    cartCount.textContent = cartItems.length;
}

function updateCartList() {
    cartList.innerHTML = '';

    if (cartItems.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <div>Tu carrito está vacío</div>
            </div>
        `;
        cartTotal.textContent = 'Total: $0.00';
        return;
    }

    let total = 0;
    cartItems.forEach((item, index) => {
        const itemTotal = item.price + item.addons.reduce((sum, addon) => sum + addon.price, 0);
        total += itemTotal;

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.note ? `<div class="cart-item-note">Nota: ${item.note}</div>` : ''}
                ${item.addons.length > 0 ? `<div class="cart-item-addons">Agregos: ${item.addons.map(a => a.name).join(', ')}</div>` : ''}
            </div>
            <div class="cart-item-price-badge">$${itemTotal.toFixed(2)}</div>
            <div class="cart-item-actions">
                <button class="action-btn edit-item" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn remove-item" data-index="${index}" style="background: var(--danger);">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartList.appendChild(li);
    });

    // Agregar event listeners a los botones recién creados
    document.querySelectorAll('.edit-item').forEach(btn => {
        btn.addEventListener('click', function() {
            editItem(parseInt(this.getAttribute('data-index')));
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            removeItem(parseInt(this.getAttribute('data-index')));
        });
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function editItem(index) {
    currentEditingItem = index;
    const item = cartItems[index];

    document.getElementById('modalItemName').textContent = item.name;
    document.getElementById('itemNote').value = item.note;

    // Reset checkboxes
    document.querySelectorAll('.addon-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Check previously selected addons
    item.addons.forEach(addon => {
        const checkboxes = document.querySelectorAll('.addon-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.dataset.name === addon.name) {
                checkbox.checked = true;
            }
        });
    });

    itemModal.style.display = 'block';
    overlay.style.display = 'block';
}

function saveItemCustomization() {
    if (currentEditingItem === null) return;

    const note = document.getElementById('itemNote').value;
    const selectedAddons = [];

    document.querySelectorAll('.addon-checkbox:checked').forEach(checkbox => {
        selectedAddons.push({
            name: checkbox.dataset.name,
            price: parseFloat(checkbox.dataset.price)
        });
    });

    cartItems[currentEditingItem].note = note;
    cartItems[currentEditingItem].addons = selectedAddons;

    updateCartList();
    closeItemModal();
}

function removeItem(index) {
    cartItems.splice(index, 1);
    updateCartCount();
    updateCartList();
}

function closeItemModal() {
    itemModal.style.display = 'none';
    overlay.style.display = 'none';
    currentEditingItem = null;
}

// Funciones del modal
function toggleModal() {
    const isVisible = cartModal.style.display === 'block';
    cartModal.style.display = isVisible ? 'none' : 'block';
    overlay.style.display = isVisible ? 'none' : 'block';
    modalHeaderBlur.style.display = isVisible ? 'none' : 'block';
    
    // Agregar/remover clase para el efecto blur
    if (!isVisible) {
        document.body.classList.add('modal-open');
        showCartItems();
    } else {
        document.body.classList.remove('modal-open');
    }
    
    // Cerrar paneles flotantes cuando se abre el modal
    closeAllPanels();
}

function closeModal() {
    cartModal.style.display = 'none';
    overlay.style.display = 'none';
    modalHeaderBlur.style.display = 'none';
    // Remover clase del blur
    document.body.classList.remove('modal-open');
    // Cerrar paneles flotantes
    closeAllPanels();
}

function showCartItems() {
    document.querySelector('.cart-items').style.display = 'block';
    document.getElementById('cartTotal').style.display = 'block';
    document.querySelector('.form-actions').style.display = 'flex';
    checkoutForm.style.display = 'none';
}

function showCheckoutForm() {
    if (cartItems.length === 0) {
        alert('Tu carrito está vacío. Agrega algunos productos antes de realizar el pedido.');
        return;
    }

    document.querySelector('.cart-items').style.display = 'none';
    document.getElementById('cartTotal').style.display = 'none';
    document.querySelector('.form-actions').style.display = 'none';
    checkoutForm.style.display = 'flex';
}

// Manejo del checkout
function handleCheckout(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const municipio = document.getElementById('municipio').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const note = document.getElementById('note').value;

    if (!paymentMethod) {
        alert('Por favor selecciona un método de pago');
        return;
    }

    const orderDetails = cartItems.map(item => {
        const itemTotal = item.price + item.addons.reduce((sum, addon) => sum + addon.price, 0);
        let details = `${item.name} - $${itemTotal.toFixed(2)}`;
        if (item.note) details += ` (Nota: ${item.note})`;
        if (item.addons.length > 0) details += ` [Agregos: ${item.addons.map(a => a.name).join(', ')}]`;
        return details;
    }).join('\n');

    const total = cartItems.reduce((sum, item) => {
        return sum + item.price + item.addons.reduce((addonSum, addon) => addonSum + addon.price, 0);
    }, 0).toFixed(2);

    alert(`¡Pedido enviado con éxito!\n\nNombre: ${name}\nDirección: ${address}\nTeléfono: ${phone}\nMunicipio: ${municipio}\nMétodo de pago: ${paymentMethod}\nNota adicional: ${note || "Ninguna"}\n\nDetalles del pedido:\n${orderDetails}\n\nTotal: $${total}\n\nGracias por tu compra.`);

    // Limpiar carrito y formulario
    cartItems = [];
    updateCartCount();
    updateCartList();
    closeModal();
    checkoutForm.reset();
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    document.getElementById('paymentMethod').value = '';
    showCartItems();
}

// Funciones auxiliares para calcular totales
function calculateItemTotal(item) {
    return item.price + item.addons.reduce((sum, addon) => sum + addon.price, 0);
}

function calculateCartTotal() {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
}

// Exportar funciones para uso global (necesario para los onclick en HTML)
window.addToCart = addToCart;
window.toggleModal = toggleModal;
window.closeModal = closeModal;
window.showCheckoutForm = showCheckoutForm;
window.showCartItems = showCartItems;
window.closeItemModal = closeItemModal;
window.saveItemCustomization = saveItemCustomization;