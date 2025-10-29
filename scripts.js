// scripts.js - Gestión completa de la aplicación de menú (VERSIÓN MEJORADA CON COMPLETAS)

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

// Datos de las completas
const completeProducts = {
    olga: {
        name: "Completa de Olga",
        image: "https://cdn.pixabay.com/photo/2017/03/10/13/57/tamale-2132273_1280.jpg",
        base: "2 tamales",
        description: "Una deliciosa combinación de sabores tradicionales con nuestra carne asada especial",
        variants: [
            { name: "Ligera", price: 2700, meat: "120g de carne asada desmenuzada" },
            { name: "Media", price: 3600, meat: "240g de carne asada desmenuzada" },
            { name: "Grande", price: 4500, meat: "360g de carne asada desmenuzada" },
            { name: "Exagerada", price: 5400, meat: "480g (más de 1lb) de carne asada desmenuzada" }
        ],
        includes: [
            "Tostones crujientes",
            "Ensalada de vegetales frescos",
            "Salsa 'La Medicina de Manteca'",
            "Base de 2 tamales tradicionales"
        ]
    },
    catalina: {
        name: "Completa de Catalina",
        image: "https://cdn.pixabay.com/photo/2016/03/05/19/57/yuca-1238617_1280.jpg",
        base: "Yuca",
        description: "La combinación perfecta entre la suavidad de la yuca y el sabor intenso de nuestra carne asada",
        variants: [
            { name: "Ligera", price: 2700, meat: "120g de carne asada desmenuzada" },
            { name: "Media", price: 3600, meat: "240g de carne asada desmenuzada" },
            { name: "Grande", price: 4500, meat: "360g de carne asada desmenuzada" },
            { name: "Exagerada", price: 5400, meat: "480g (más de 1lb) de carne asada desmenuzada" }
        ],
        includes: [
            "Tostones crujientes",
            "Ensalada de vegetales frescos",
            "Salsa 'La Medicina de Manteca'",
            "Yuca cocida al punto perfecto"
        ]
    },
    moro: {
        name: "Completa del Moro",
        image: "https://cdn.pixabay.com/photo/2017/06/30/22/39/rice-2461129_1280.jpg",
        base: "Arroz moro",
        description: "El sabor único del arroz moro combinado con nuestra exquisita carne asada",
        variants: [
            { name: "Ligera", price: 2700, meat: "120g de carne asada desmenuzada" },
            { name: "Media", price: 3600, meat: "240g de carne asada desmenuzada" },
            { name: "Grande", price: 4500, meat: "360g de carne asada desmenuzada" },
            { name: "Exagerada", price: 5400, meat: "480g (más de 1lb) de carne asada desmenuzada" }
        ],
        includes: [
            "Tostones crujientes",
            "Ensalada de vegetales frescos",
            "Salsa 'La Medicina de Manteca'",
            "Arroz moro con frijoles negros"
        ]
    }
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartList();
    positionPanels();
    initBannerSlider();
    adjustForMobile();
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

    // Modal de detalles de producto
    document.getElementById('productDetailsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeProductDetails();
        }
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProductDetails();
            closeModal();
        }
    });

    // Redimensionamiento de ventana
    window.addEventListener('resize', function() {
        positionPanels();
        adjustForMobile();
    });
}

// Banner rotativo
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.banner-indicator');
    let currentSlide = 0;
    
    function showSlide(index) {
        // Ocultar todos los slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Mostrar slide actual
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }
    
    // Cambiar slide cada 3 segundos
    setInterval(nextSlide, 3000);
    
    // Click en indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
}

// Posicionar paneles flotantes
function positionPanels() {
    if (notificationPanel.style.display === 'block') {
        positionPanelUnderButton('notificationBtn', notificationPanel);
    }
    
    if (historyPanel.style.display === 'block') {
        positionPanelUnderButton('historyBtn', historyPanel);
    }
}

// Función para ajustar elementos en móvil
function adjustForMobile() {
    const isMobile = window.innerWidth <= 480;
    
    if (isMobile) {
        document.body.classList.add('mobile-view');
        
        // Ajustar textos largos en productos
        document.querySelectorAll('.product-card h3').forEach(title => {
            const text = title.textContent;
            if (text.length > 20) {
                title.textContent = text.substring(0, 20) + '...';
            }
        });

        // Ajustar descripciones largas
        document.querySelectorAll('.product-description').forEach(desc => {
            const text = desc.textContent;
            if (text.length > 60) {
                desc.textContent = text.substring(0, 60) + '...';
            }
        });
    } else {
        document.body.classList.remove('mobile-view');
    }
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
    const button = event.target.closest('.btn-primary') || event.target;
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
        cartTotal.innerHTML = `<i class="fas fa-receipt"></i> Total: $0.00`;
        cartTotal.classList.add('empty');
        cartTotal.classList.remove('updated');
        return;
    }

    let total = 0;
    cartItems.forEach((item, index) => {
        const itemTotal = calculateItemTotal(item);
        total += itemTotal;

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60/f0f0f0/666666?text=Imagen'">
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

    // Actualizar total con icono y nuevos estilos
    cartTotal.innerHTML = `<i class="fas fa-receipt"></i> Total: $${total.toFixed(2)}`;
    cartTotal.classList.remove('empty');
    cartTotal.classList.add('updated');
    
    // Remover la clase de animación después de que termine
    setTimeout(() => {
        cartTotal.classList.remove('updated');
    }, 400);
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

// Funciones para las completas
function showProductDetails(productKey) {
    const product = completeProducts[productKey];
    if (!product) return;

    const modal = document.getElementById('productDetailsModal');
    const productName = document.getElementById('detailProductName');
    const productImage = document.getElementById('detailProductImage');
    const productDescription = document.getElementById('detailProductDescription');
    const variantList = document.getElementById('variantList');
    const includesList = document.getElementById('includesList');

    // Llenar la información del producto
    productName.textContent = product.name;
    productImage.src = product.image;
    productImage.alt = product.name;
    productDescription.textContent = product.description;

    // Llenar las variantes
    variantList.innerHTML = '';
    product.variants.forEach(variant => {
        const variantItem = document.createElement('div');
        variantItem.className = 'variant-item';
        variantItem.innerHTML = `
            <div>
                <div class="variant-name">${variant.name}</div>
                <small>${variant.meat}</small>
            </div>
            <div class="variant-price">$${variant.price.toLocaleString()}</div>
        `;
        variantList.appendChild(variantItem);
    });

    // Llenar los elementos incluidos
    includesList.innerHTML = '';
    product.includes.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        includesList.appendChild(li);
    });

    // Mostrar el modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProductDetails() {
    const modal = document.getElementById('productDetailsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function addCompleteToCart(productKey) {
    const product = completeProducts[productKey];
    if (!product) return;

    const selectId = `${productKey}-size`;
    const select = document.getElementById(selectId);
    const selectedOption = select.options[select.selectedIndex];

    // Validar que se haya seleccionado un tamaño
    if (!selectedOption.value) {
        alert('Por favor selecciona un tamaño antes de añadir al carrito');
        select.focus();
        return;
    }

    const variantName = selectedOption.value;
    const price = parseFloat(selectedOption.dataset.price);
    const productName = `${product.name} - ${variantName}`;

    // Añadir al carrito
    addToCart(productName, price, product.image);

    // Resetear el selector
    select.selectedIndex = 0;
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
    const summaryTotal = document.getElementById('summaryTotal');
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

// Función para manejar errores de imágenes
function handleImageError(img) {
    img.src = 'https://via.placeholder.com/160x160/f0f0f0/666666?text=Producto';
    img.alt = 'Imagen no disponible';
}

// Exportar funciones para uso global (necesario para los onclick en HTML)
window.addToCart = addToCart;
window.toggleModal = toggleModal;
window.closeModal = closeModal;
window.showCheckoutForm = showCheckoutForm;
window.showCartItems = showCartItems;
window.closeItemModal = closeItemModal;
window.saveItemCustomization = saveItemCustomization;
window.handleImageError = handleImageError;
window.showProductDetails = showProductDetails;
window.closeProductDetails = closeProductDetails;
window.addCompleteToCart = addCompleteToCart;

// Inicializar manejadores de errores de imágenes
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
});