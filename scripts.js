// scripts.js - Gestión completa de la aplicación de menú (VERSIÓN MEJORADA Y CORREGIDA)

// Variables globales
let cartItems = [];
let currentEditingItem = null;
let orderSummaryData = null;

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
const summaryModal = document.getElementById('summaryModal');
const confirmationAnimation = document.getElementById('confirmationAnimation');

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartList();
    positionPanels();
    
    // Mostrar banner correcto según categoría activa inicial
    const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
    handleBannerVisibility(activeCategory);
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

    // Nuevos listeners para las modales de resumen y confirmación
    document.getElementById('confirmOrderBtn').addEventListener('click', confirmOrder);
    document.getElementById('backToFormBtn').addEventListener('click', backToForm);
    document.getElementById('closeConfirmationBtn').addEventListener('click', closeConfirmation);

    // Prevenir que los clics en los paneles los cierren
    notificationPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    historyPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Prevenir que los clics en las nuevas modales las cierren
    summaryModal.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    confirmationAnimation.addEventListener('click', function(e) {
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

    // Manejar visibilidad de banners
    handleBannerVisibility(category);
}

// Función para manejar la visibilidad de banners
function handleBannerVisibility(activeCategory) {
    const mainBanner = document.querySelector('.promo-banner');
    const bebidasBanner = document.querySelector('.bebidas-banner');

    // Ocultar todos los banners primero
    mainBanner.style.display = 'block';
    bebidasBanner.style.display = 'none';

    // Mostrar banner específico según la categoría
    if (activeCategory === 'bebidas') {
        mainBanner.style.display = 'none';
        bebidasBanner.style.display = 'block';
    }
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
        const itemTotal = calculateItemTotal(item);
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

// Nuevas funciones para el flujo mejorado de checkout
function handleCheckout(e) {
    e.preventDefault();
    
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const municipio = document.getElementById('municipio').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const note = document.getElementById('note').value;

    if (!paymentMethod) {
        alert('Por favor selecciona un método de pago');
        return;
    }

    if (!address || !phone || !municipio) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }

    // Guardar datos para el resumen
    orderSummaryData = {
        address,
        phone,
        municipio,
        paymentMethod,
        note,
        items: [...cartItems],
        total: calculateCartTotal().toFixed(2)
    };

    // Mostrar modal de resumen
    showOrderSummary();
}

// Mostrar resumen del pedido
function showOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const summaryTotal = document.getElementById('summaryModalTotal');
    const customerInfo = document.getElementById('customerInfo');

    // Limpiar contenido previo
    summaryItems.innerHTML = '';

    // Añadir items al resumen
    orderSummaryData.items.forEach(item => {
        const itemTotal = calculateItemTotal(item);
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                ${item.note ? `<br><small>Nota: ${item.note}</small>` : ''}
                ${item.addons.length > 0 ? `<br><small>Agregos: ${item.addons.map(a => a.name).join(', ')}</small>` : ''}
            </div>
            <div>$${itemTotal.toFixed(2)}</div>
        `;
        summaryItems.appendChild(summaryItem);
    });

    // Actualizar total
    summaryTotal.textContent = `Total: $${orderSummaryData.total}`;

    // Mostrar información del cliente
    customerInfo.innerHTML = `
        <strong>Información de Entrega:</strong><br>
        📍 ${orderSummaryData.address}<br>
        📞 ${orderSummaryData.phone}<br>
        🏙️ ${orderSummaryData.municipio}<br>
        💳 Pago: ${orderSummaryData.paymentMethod}
        ${orderSummaryData.note ? `<br>📝 Nota: ${orderSummaryData.note}` : ''}
    `;

    // Mostrar modal de resumen
    summaryModal.style.display = 'block';
    overlay.style.display = 'block';
}

// Confirmar pedido final
function confirmOrder() {
    // Ocultar modal de resumen
    summaryModal.style.display = 'none';
    
    // Mostrar animación de confirmación
    confirmationAnimation.style.display = 'block';

    // Aquí normalmente enviarías los datos al servidor
    console.log('Pedido confirmado:', orderSummaryData);

    // Después de 3 segundos, limpiar todo automáticamente
    setTimeout(() => {
        completeOrderCleanup();
    }, 3000);
}

// Cerrar animación de confirmación manualmente
function closeConfirmation() {
    confirmationAnimation.style.display = 'none';
    completeOrderCleanup();
}

// Limpiar todo después de confirmar el pedido
function completeOrderCleanup() {
    // Limpiar carrito
    cartItems = [];
    updateCartCount();
    updateCartList();
    
    // Limpiar formulario
    checkoutForm.reset();
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
    document.getElementById('paymentMethod').value = '';
    
    // Mostrar carrito vacío
    showCartItems();
    
    // Cerrar todas las modales
    confirmationAnimation.style.display = 'none';
    overlay.style.display = 'none';
    cartModal.style.display = 'none';
    modalHeaderBlur.style.display = 'none';
    document.body.classList.remove('modal-open');
    
    // Resetear datos del pedido
    orderSummaryData = null;
}

// Volver al formulario desde el resumen
function backToForm() {
    summaryModal.style.display = 'none';
}

// Funciones auxiliares para calcular totales
function calculateItemTotal(item) {
    return item.price + item.addons.reduce((sum, addon) => sum + addon.price, 0);
}

function calculateCartTotal() {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
}

// Función para mostrar detalles del producto (NUEVA)
function showProductDetails(name, description, price) {
    // Crear modal temporal para detalles
    const detailModal = document.createElement('div');
    detailModal.className = 'modal';
    detailModal.style.display = 'block';
    detailModal.innerHTML = `
        <h4>${name}</h4>
        <p style="color: var(--gray); margin: 1rem 0;">${description}</p>
        <div style="font-size: 1.2rem; font-weight: bold; color: var(--price-badge); margin: 1rem 0;">
            Precio: $${price.toFixed(2)}
        </div>
        <div class="form-actions">
            <button class="form-btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement); overlay.style.display='none';">Cerrar</button>
            <button class="form-btn btn-primary" onclick="addToCart('${name.replace(/'/g, "\\'")}', ${price}, '${getProductImage(name)}'); this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement); overlay.style.display='none';">Añadir al Carrito</button>
        </div>
    `;
    
    document.body.appendChild(detailModal);
    overlay.style.display = 'block';
}

// Función auxiliar para obtener imagen del producto
function getProductImage(productName) {
    // Mapeo de productos a imágenes (ajusta según tus necesidades)
    const imageMap = {
        'El Especial': 'img.webp',
        'De Carnaval': 'img (1).webp',
        'Matambre': 'img (2).webp',
        'Desmaya\\'o': 'img (3).webp',
        'Refresco': 'https://cdn.pixabay.com/photo/2014/09/26/19/51/drink-462776_1280.jpg',
        'Café': 'https://cdn.pixabay.com/photo/2015/09/05/23/34/coffee-926837_1280.jpg',
        'Batido': 'https://cdn.pixabay.com/photo/2017/01/12/05/34/cocktail-1973567_1280.jpg',
        'Combo Familiar': 'img.webp',
        'Combo Personal': 'img (1).webp',
        'Combo Pareja': 'img (2).webp'
    };
    
    return imageMap[productName] || 'img.webp';
}

// Exportar funciones para uso global (necesario para los onclick en HTML)
window.addToCart = addToCart;
window.toggleModal = toggleModal;
window.closeModal = closeModal;
window.showCheckoutForm = showCheckoutForm;
window.showCartItems = showCartItems;
window.closeItemModal = closeItemModal;
window.saveItemCustomization = saveItemCustomization;
window.showProductDetails = showProductDetails;