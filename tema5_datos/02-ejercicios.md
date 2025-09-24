# Ejercicios - Tema 5: Datos

## Ejercicio 5.1: Eliminar obsesión con primitivos

Refactoriza el siguiente código que sufre de obsesión con primitivos:

```javascript
function createProduct(name, price, currency, weight, weightUnit, category, sku, stockQuantity) {
    // Validaciones básicas
    if (!name || name.length === 0) {
        throw new Error('Product name is required');
    }
    if (price <= 0) {
        throw new Error('Price must be positive');
    }
    if (!currency || currency.length !== 3) {
        throw new Error('Currency must be 3-letter code');
    }
    if (weight <= 0) {
        throw new Error('Weight must be positive');
    }
    if (!['kg', 'lb', 'g', 'oz'].includes(weightUnit)) {
        throw new Error('Invalid weight unit');
    }
    if (!sku || sku.length < 5) {
        throw new Error('SKU must be at least 5 characters');
    }

    return {
        name: name,
        price: price,
        currency: currency,
        weight: weight,
        weightUnit: weightUnit,
        category: category,
        sku: sku,
        stockQuantity: stockQuantity
    };
}

function calculateShippingCost(price, currency, weight, weightUnit, category) {
    let baseCost = 0;
    
    // Convert weight to kg for calculation
    let weightInKg = weight;
    if (weightUnit === 'lb') {
        weightInKg = weight * 0.453592;
    } else if (weightUnit === 'g') {
        weightInKg = weight / 1000;
    } else if (weightUnit === 'oz') {
        weightInKg = weight * 0.0283495;
    }
    
    // Base cost by weight
    if (weightInKg <= 1) {
        baseCost = 5;
    } else if (weightInKg <= 5) {
        baseCost = 10;
    } else {
        baseCost = 15;
    }
    
    // Category modifiers
    if (category === 'fragile') {
        baseCost *= 1.5;
    } else if (category === 'hazardous') {
        baseCost *= 2;
    }
    
    // Convert currency
    if (currency === 'EUR') {
        baseCost *= 0.85;
    } else if (currency === 'GBP') {
        baseCost *= 0.75;
    }
    
    return baseCost;
}

function formatProductDisplay(name, price, currency, weight, weightUnit, stockQuantity) {
    let display = `${name} - ${price} ${currency}`;
    display += ` (${weight} ${weightUnit})`;
    
    if (stockQuantity > 0) {
        display += ` - In Stock (${stockQuantity})`;
    } else {
        display += ' - Out of Stock';
    }
    
    return display;
}

// Uso problemático
const product = createProduct(
    'Gaming Laptop',
    1299.99,
    'USD',
    2.5,
    'kg',
    'electronics',
    'LAPTOP001',
    15
);

const shipping = calculateShippingCost(1299.99, 'USD', 2.5, 'kg', 'electronics');
const display = formatProductDisplay('Gaming Laptop', 1299.99, 'USD', 2.5, 'kg', 15);
```

**Instrucciones:**
1. Identifica los conceptos del dominio que merecen su propia clase
2. Crea Value Objects apropiados (Money, Weight, SKU, etc.)
3. Implementa validaciones en cada Value Object
4. Refactoriza las funciones para usar estos Value Objects
5. Asegúrate de que los Value Objects sean inmutables
6. Añade métodos útiles a cada Value Object

---

## Ejercicio 5.2: Mejorar estructura y reducir complejidad

El siguiente código maneja un sistema de reservas de hotel. Mejora su estructura para reducir la complejidad:

```javascript
function makeReservation(
    guestName, guestEmail, guestPhone,
    hotelId, hotelName, hotelStars,
    roomType, roomPrice, roomNumber,
    checkIn, checkOut,
    adults, children,
    specialRequests,
    paymentMethod, cardNumber, cardExpiry
) {
    // Validaciones dispersas
    if (!guestName || guestName.trim().length === 0) {
        throw new Error('Guest name is required');
    }
    if (!guestEmail || !guestEmail.includes('@')) {
        throw new Error('Valid email is required');
    }
    if (!guestPhone || guestPhone.length < 10) {
        throw new Error('Valid phone is required');
    }
    if (!hotelId) {
        throw new Error('Hotel ID is required');
    }
    if (hotelStars < 1 || hotelStars > 5) {
        throw new Error('Hotel stars must be between 1 and 5');
    }
    if (roomPrice <= 0) {
        throw new Error('Room price must be positive');
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
        throw new Error('Check-out must be after check-in');
    }
    if (adults < 1 || adults > 4) {
        throw new Error('Adults must be between 1 and 4');
    }
    if (children < 0 || children > 3) {
        throw new Error('Children must be between 0 and 3');
    }

    // Cálculos complejos embebidos
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    
    let totalPrice = roomPrice * nights;
    
    // Descuentos por duración
    if (nights >= 7) {
        totalPrice *= 0.9; // 10% descuento por semana
    } else if (nights >= 3) {
        totalPrice *= 0.95; // 5% descuento por 3+ noches
    }
    
    // Recargo por huéspedes adicionales
    if (adults > 2) {
        totalPrice += (adults - 2) * 25 * nights;
    }
    if (children > 0) {
        totalPrice += children * 15 * nights;
    }
    
    // Recargo por tipo de habitación
    if (roomType === 'suite') {
        totalPrice *= 1.5;
    } else if (roomType === 'deluxe') {
        totalPrice *= 1.3;
    }
    
    // Impuestos
    const taxRate = 0.12;
    const taxes = totalPrice * taxRate;
    const finalTotal = totalPrice + taxes;

    return {
        reservationId: 'RES-' + Date.now(),
        guestName: guestName,
        guestEmail: guestEmail,
        guestPhone: guestPhone,
        hotelId: hotelId,
        hotelName: hotelName,
        hotelStars: hotelStars,
        roomType: roomType,
        roomPrice: roomPrice,
        roomNumber: roomNumber,
        checkIn: checkIn,
        checkOut: checkOut,
        nights: nights,
        adults: adults,
        children: children,
        specialRequests: specialRequests,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        cardExpiry: cardExpiry,
        subtotal: totalPrice,
        taxes: taxes,
        totalAmount: finalTotal,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
}

function cancelReservation(reservationId, reason) {
    // Lógica de cancelación mezclada con validación
    if (!reservationId) {
        throw new Error('Reservation ID is required');
    }
    
    const reservation = getReservationById(reservationId);
    if (!reservation) {
        throw new Error('Reservation not found');
    }
    
    const checkInDate = new Date(reservation.checkIn);
    const today = new Date();
    const daysUntilCheckIn = (checkInDate - today) / (1000 * 60 * 60 * 24);
    
    let refundAmount = 0;
    let cancellationFee = 0;
    
    if (daysUntilCheckIn >= 7) {
        refundAmount = reservation.totalAmount; // Full refund
    } else if (daysUntilCheckIn >= 2) {
        cancellationFee = reservation.totalAmount * 0.25; // 25% fee
        refundAmount = reservation.totalAmount - cancellationFee;
    } else {
        cancellationFee = reservation.totalAmount * 0.5; // 50% fee
        refundAmount = reservation.totalAmount - cancellationFee;
    }
    
    return {
        reservationId: reservationId,
        status: 'cancelled',
        reason: reason,
        refundAmount: refundAmount,
        cancellationFee: cancellationFee,
        processedAt: new Date().toISOString()
    };
}

function getReservationById(id) {
    // Mock implementation
    return {
        reservationId: id,
        totalAmount: 500,
        checkIn: '2024-03-15',
        status: 'confirmed'
    };
}

function generateReservationSummary(reservation) {
    let summary = `Reservation Summary\n`;
    summary += `===================\n`;
    summary += `Guest: ${reservation.guestName}\n`;
    summary += `Email: ${reservation.guestEmail}\n`;
    summary += `Phone: ${reservation.guestPhone}\n`;
    summary += `Hotel: ${reservation.hotelName} (${reservation.hotelStars} stars)\n`;
    summary += `Room: ${reservation.roomType} #${reservation.roomNumber}\n`;
    summary += `Dates: ${reservation.checkIn} to ${reservation.checkOut} (${reservation.nights} nights)\n`;
    summary += `Guests: ${reservation.adults} adults`;
    if (reservation.children > 0) {
        summary += `, ${reservation.children} children`;
    }
    summary += `\n`;
    summary += `Subtotal: ${reservation.subtotal.toFixed(2)}\n`;
    summary += `Taxes: ${reservation.taxes.toFixed(2)}\n`;
    summary += `Total: ${reservation.totalAmount.toFixed(2)}\n`;
    summary += `Payment: ${reservation.paymentMethod}\n`;
    if (reservation.specialRequests) {
        summary += `Special Requests: ${reservation.specialRequests}\n`;
    }
    summary += `Status: ${reservation.status}\n`;
    
    return summary;
}
```

**Instrucciones:**
1. Identifica todas las entidades del dominio (Guest, Hotel, Room, Reservation, etc.)
2. Separa las responsabilidades en clases diferentes
3. Crea Value Objects para conceptos como DateRange, Money, ContactInfo
4. Implementa el patrón Strategy para los cálculos de precios y cancelaciones
5. Usa composición para estructurar las relaciones entre entidades
6. Elimina la lógica de negocio de las funciones de presentación

---

## Ejercicio 5.3: Aplicar principios SOLID

Refactoriza el siguiente sistema de notificaciones que viola varios principios SOLID:

```javascript
class NotificationManager {
    constructor() {
        this.emailConfig = {
            smtp: 'smtp.gmail.com',
            port: 587,
            username: 'admin@company.com',
            password: 'password123'
        };
        this.smsConfig = {
            apiUrl: 'https://api.sms.com',
            apiKey: 'sms-api-key-123'
        };
        this.slackConfig = {
            webhookUrl: 'https://hooks.slack.com/services/xxx',
            channel: '#notifications'
        };
    }

    sendNotification(user, message, type, priority) {
        // Validaciones mezcladas
        if (!user || !user.email) {
            throw new Error('User email is required');
        }
        if (!message || message.trim().length === 0) {
            throw new Error('Message cannot be empty');
        }
        if (!['info', 'warning', 'error', 'success'].includes(type)) {
            throw new Error('Invalid message type');
        }
        if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
            throw new Error('Invalid priority level');
        }

        // Formateo específico por tipo
        let formattedMessage = message;
        if (type === 'error') {
            formattedMessage = `❌ ERROR: ${message}`;
        } else if (type === 'warning') {
            formattedMessage = `⚠️ WARNING: ${message}`;
        } else if (type === 'success') {
            formattedMessage = `✅ SUCCESS: ${message}`;
        } else {
            formattedMessage = `ℹ️ INFO: ${message}`;
        }

        // Lógica de envío mezclada
        const results = [];

        // Email (siempre enviar)
        try {
            this.sendEmail(user.email, formattedMessage, type);
            results.push({ channel: 'email', status: 'sent' });
        } catch (error) {
            results.push({ channel: 'email', status: 'failed', error: error.message });
        }

        // SMS (solo para prioridad alta o urgente)
        if (['high', 'urgent'].includes(priority) && user.phone) {
            try {
                this.sendSMS(user.phone, formattedMessage);
                results.push({ channel: 'sms', status: 'sent' });
            } catch (error) {
                results.push({ channel: 'sms', status: 'failed', error: error.message });
            }
        }

        // Slack (solo para errores y warnings)
        if (['error', 'warning'].includes(type)) {
            try {
                this.sendSlack(formattedMessage, type);
                results.push({ channel: 'slack', status: 'sent' });
            } catch (error) {
                results.push({ channel: 'slack', status: 'failed', error: error.message });
            }
        }

        // Push notifications (para usuarios móviles)
        if (user.deviceToken && ['high', 'urgent'].includes(priority)) {
            try {
                this.sendPushNotification(user.deviceToken, formattedMessage, type);
                results.push({ channel: 'push', status: 'sent' });
            } catch (error) {
                results.push({ channel: 'push', status: 'failed', error: error.message });
            }
        }

        // Logging mezclado
        console.log(`Notification sent to ${user.email}:`, results);
        
        // Base de datos mezclada
        this.saveNotificationLog(user.id, message, type, priority, results);

        return results;
    }

    sendEmail(email, message, type) {
        // Implementación específica de email
        console.log(`📧 Sending email to ${email}: ${message}`);
        if (Math.random() < 0.1) throw new Error('Email service unavailable');
    }

    sendSMS(phone, message) {
        // Implementación específica de SMS
        console.log(`📱 Sending SMS to ${phone}: ${message}`);
        if (Math.random() < 0.15) throw new Error('SMS service unavailable');
    }

    sendSlack(message, type) {
        // Implementación específica de Slack
        console.log(`💬 Sending to Slack: ${message}`);
        if (Math.random() < 0.05) throw new Error('Slack webhook failed');
    }

    sendPushNotification(deviceToken, message, type) {
        // Implementación específica de push
        console.log(`🔔 Sending push to ${deviceToken}: ${message}`);
        if (Math.random() < 0.2) throw new Error('Push notification failed');
    }

    saveNotificationLog(userId, message, type, priority, results) {
        // Simulación de guardado en base de datos
        const log = {
            userId,
            message,
            type,
            priority,
            results,
            timestamp: new Date().toISOString()
        };
        console.log('Saving to database:', log);
    }

    // Métodos adicionales que mezclan responsabilidades
    getUserPreferences(userId) {
        // Simulación de obtener preferencias del usuario
        return {
            emailEnabled: true,
            smsEnabled: true,
            slackEnabled: false,
            pushEnabled: true,
            quietHours: { start: '22:00', end: '08:00' }
        };
    }

    isInQuietHours(user) {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 22 || hour <= 8;
    }

    updateEmailConfig(smtp, port, username, password) {
        this.emailConfig = { smtp, port, username, password };
    }

    getDeliveryStats() {
        // Mezclando análisis con gestión de notificaciones
        return {
            totalSent: 1000,
            emailDeliveryRate: 0.95,
            smsDeliveryRate: 0.88,
            slackDeliveryRate: 0.99
        };
    }
}

// Uso problemático
const notificationManager = new NotificationManager();

const user = {
    id: 'user123',
    email: 'john@example.com',
    phone: '+1234567890',
    deviceToken: 'device-token-abc'
};

notificationManager.sendNotification(
    user,
    'Your order has been processed',
    'success',
    'medium'
);

notificationManager.sendNotification(
    user,
    'System maintenance in 30 minutes',
    'warning',
    'high'
);
```

**Instrucciones:**
1. **Single Responsibility**: Separa las diferentes responsabilidades en clases distintas
2. **Open/Closed**: Diseña el sistema para que sea fácil agregar nuevos canales de notificación
3. **Liskov Substitution**: Asegúrate de que todas las implementaciones de canales sean intercambiables
4. **Interface Segregation**: Crea interfaces específicas en lugar de una interfaz grande
5. **Dependency Inversion**: Haz que las clases de alto nivel dependan de abstracciones
6. Implementa el patrón Strategy para diferentes canales y políticas de envío
7. Usa inyección de dependencias para las configuraciones y servicios externos

---

## Ejercicio 5.4: Diseño de Value Objects complejos

Diseña un sistema para manejar direcciones postales internacionales que sea extensible y manejable:

```javascript
// Sistema actual problemático
function validateAddress(street, city, state, zipCode, country) {
    const errors = [];
    
    if (!street) errors.push('Street is required');
    if (!city) errors.push('City is required');
    
    // Validaciones específicas por país (hardcodeadas)
    if (country === 'US') {
        if (!state || state.length !== 2) {
            errors.push('US state must be 2-letter code');
        }
        if (!zipCode || !/^\d{5}(-\d{4})?$/.test(zipCode)) {
            errors.push('US zip code format invalid');
        }
    } else if (country === 'UK') {
        if (!zipCode || !/^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/.test(zipCode)) {
            errors.push('UK postcode format invalid');
        }
    } else if (country === 'CA') {
        if (!state || state.length !== 2) {
            errors.push('Canadian province must be 2-letter code');
        }
        if (!zipCode || !/^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(zipCode)) {
            errors.push('Canadian postal code format invalid');
        }
    }
    // ... más países hardcodeados
    
    return errors;
}

function formatAddress(street, city, state, zipCode, country) {
    // Formateo específico por país (hardcodeado)
    if (country === 'US') {
        return `${street}\n${city}, ${state} ${zipCode}\nUnited States`;
    } else if (country === 'UK') {
        return `${street}\n${city} ${zipCode}\nUnited Kingdom`;
    } else if (country === 'DE') {
        return `${street}\n${zipCode} ${city}\nGermany`;
    }
    // Formato genérico
    return `${street}\n${city}, ${state} ${zipCode}\n${country}`;
}

function calculateShippingZone(country, state) {
    // Lógica de zonas de envío hardcodeada
    if (country === 'US') {
        const eastCoast = ['NY', 'NJ', 'PA', 'CT', 'MA', 'ME', 'NH', 'VT', 'RI'];
        const westCoast = ['CA', 'OR', 'WA', 'NV'];
        
        if (eastCoast.includes(state)) return 'US-EAST';
        if (westCoast.includes(state)) return 'US-WEST';
        return 'US-CENTRAL';
    } else if (country === 'CA') {
        return 'CANADA';
    } else if (['UK', 'FR', 'DE', 'IT', 'ES'].includes(country)) {
        return 'EU';
    }
    
    return 'INTERNATIONAL';
}

// Uso problemático
const address = {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US'
};

const errors = validateAddress(
    address.street, 
    address.city, 
    address.state, 
    address.zipCode, 
    address.country
);

if (errors.length === 0) {
    const formatted = formatAddress(
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.country
    );
    
    const zone = calculateShippingZone(address.country, address.state);
    
    console.log('Formatted Address:', formatted);
    console.log('Shipping Zone:', zone);
}
```

**Instrucciones:**
1. Crea una jerarquía de clases Address que maneje diferentes formatos por país
2. Usa el patrón Strategy para las validaciones específicas por país
3. Implementa Value Objects para componentes como PostalCode, StateProvince
4. Diseña el sistema para que sea fácil agregar nuevos países
5. Separa las responsabilidades de validación, formateo y cálculo de zonas
6. Asegúrate de que los Value Objects sean inmutables y comparables
7. Implementa un sistema de configuración para las reglas por país