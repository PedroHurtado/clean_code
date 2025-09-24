# Ejercicios - Tema 4: Funciones

## Ejercicio 4.1: Nombrado y argumentos

Refactoriza las siguientes funciones para mejorar el nombrado y la gestión de argumentos:

```javascript
function calc(a, b, c, d, e) {
    if (e) {
        return (a * b) + (c * d);
    } else {
        return (a * b) - (c * d);
    }
}

function proc(user, data, flag1, flag2, type, mode) {
    let result = {};
    
    if (flag1) {
        result.name = user.firstName + " " + user.lastName;
    }
    
    if (flag2) {
        result.email = user.email.toLowerCase();
    }
    
    if (type === 1) {
        result.data = data.filter(x => x.active);
    } else if (type === 2) {
        result.data = data.map(x => x.value);
    }
    
    if (mode === 'admin') {
        result.permissions = ['read', 'write', 'delete'];
    }
    
    return result;
}

function handle(items, threshold, callback, shouldSort, reverseOrder) {
    let filtered = items.filter(item => item.score > threshold);
    
    if (shouldSort) {
        filtered.sort((a, b) => reverseOrder ? b.score - a.score : a.score - b.score);
    }
    
    return filtered.map(callback);
}
```

**Instrucciones:**
1. Mejora los nombres de las funciones para que expresen claramente su propósito
2. Reemplaza parámetros múltiples por objetos de configuración cuando sea apropiado
3. Elimina las banderas booleanas dividiendo funciones cuando sea necesario
4. Da nombres significativos a todos los parámetros

---

## Ejercicio 4.2: Validación y salida temprana

Refactoriza el siguiente código aplicando el patrón de salida temprana y mejorando la validación:

```javascript
function processPayment(payment, user, account) {
    let result = null;
    
    if (payment) {
        if (payment.amount && payment.amount > 0) {
            if (payment.currency && payment.currency.length === 3) {
                if (user) {
                    if (user.isActive && user.emailVerified) {
                        if (account) {
                            if (account.balance >= payment.amount) {
                                if (account.status === 'active') {
                                    // Verificar límites diarios
                                    if (user.dailyLimit >= payment.amount) {
                                        // Procesar pago
                                        account.balance -= payment.amount;
                                        const transaction = {
                                            id: generateTransactionId(),
                                            amount: payment.amount,
                                            currency: payment.currency,
                                            timestamp: new Date(),
                                            userId: user.id,
                                            accountId: account.id
                                        };
                                        
                                        result = {
                                            success: true,
                                            transaction: transaction,
                                            newBalance: account.balance
                                        };
                                    } else {
                                        result = { error: 'Daily limit exceeded' };
                                    }
                                } else {
                                    result = { error: 'Account not active' };
                                }
                            } else {
                                result = { error: 'Insufficient funds' };
                            }
                        } else {
                            result = { error: 'Account required' };
                        }
                    } else {
                        result = { error: 'User not active or email not verified' };
                    }
                } else {
                    result = { error: 'User required' };
                }
            } else {
                result = { error: 'Invalid currency code' };
            }
        } else {
            result = { error: 'Invalid payment amount' };
        }
    } else {
        result = { error: 'Payment required' };
    }
    
    return result;
}
```

**Instrucciones:**
1. Aplica el patrón de salida temprana para eliminar el anidamiento
2. Separa las validaciones en funciones específicas
3. Usa excepciones apropiadas en lugar de objetos de error
4. Crea funciones auxiliares para la lógica de procesamiento

---

## Ejercicio 4.3: Responsabilidad única

La siguiente función viola el principio de responsabilidad única. Refactorízala dividiéndola en funciones más pequeñas y específicas:

```javascript
function generateUserReport(userId, reportType, options) {
    // Obtener datos del usuario
    const user = database.getUserById(userId);
    if (!user) throw new Error('User not found');
    
    // Obtener historial de transacciones
    const transactions = database.getTransactionsByUserId(userId);
    
    // Calcular estadísticas
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageTransaction = totalSpent / transactions.length;
    const lastTransactionDate = new Date(Math.max(...transactions.map(t => new Date(t.date))));
    
    // Agrupar transacciones por categoría
    const transactionsByCategory = {};
    transactions.forEach(transaction => {
        if (!transactionsByCategory[transaction.category]) {
            transactionsByCategory[transaction.category] = [];
        }
        transactionsByCategory[transaction.category].push(transaction);
    });
    
    // Calcular totales por categoría
    const categoryTotals = {};
    Object.keys(transactionsByCategory).forEach(category => {
        categoryTotals[category] = transactionsByCategory[category]
            .reduce((sum, t) => sum + t.amount, 0);
    });
    
    // Generar HTML del reporte
    let html = `
        <html>
            <head><title>User Report - ${user.name}</title></head>
            <body>
                <h1>Report for ${user.name}</h1>
                <h2>Summary</h2>
                <p>Total Spent: $${totalSpent.toFixed(2)}</p>
                <p>Average Transaction: $${averageTransaction.toFixed(2)}</p>
                <p>Last Transaction: ${lastTransactionDate.toDateString()}</p>
                
                <h2>By Category</h2>
    `;
    
    // Agregar tabla de categorías
    html += '<table border="1"><tr><th>Category</th><th>Total</th></tr>';
    Object.keys(categoryTotals).forEach(category => {
        html += `<tr><td>${category}</td><td>$${categoryTotals[category].toFixed(2)}</td></tr>`;
    });
    html += '</table>';
    
    // Agregar lista de transacciones si se solicita
    if (options.includeTransactions) {
        html += '<h2>Transaction History</h2>';
        html += '<table border="1"><tr><th>Date</th><th>Amount</th><th>Category</th><th>Description</th></tr>';
        transactions.forEach(transaction => {
            html += `
                <tr>
                    <td>${new Date(transaction.date).toDateString()}</td>
                    <td>$${transaction.amount.toFixed(2)}</td>
                    <td>${transaction.category}</td>
                    <td>${transaction.description}</td>
                </tr>
            `;
        });
        html += '</table>';
    }
    
    html += '</body></html>';
    
    // Guardar reporte en el sistema de archivos
    const filename = `user_report_${userId}_${Date.now()}.html`;
    fileSystem.writeFile(filename, html);
    
    // Enviar email con el reporte si se solicita
    if (options.sendEmail) {
        emailService.send({
            to: user.email,
            subject: 'Your Transaction Report',
            html: html,
            attachments: [{
                filename: filename,
                content: html
            }]
        });
    }
    
    // Registrar en auditoría
    auditLog.record({
        action: 'REPORT_GENERATED',
        userId: userId,
        reportType: reportType,
        timestamp: new Date()
    });
    
    return {
        success: true,
        filename: filename,
        stats: {
            totalSpent,
            averageTransaction,
            lastTransactionDate,
            categoryTotals
        }
    };
}
```

**Instrucciones:**
1. Identifica todas las responsabilidades diferentes en la función
2. Crea funciones separadas para cada responsabilidad
3. Mantén un nivel de abstracción consistente en cada función
4. Asegúrate de que cada función tenga un nombre que describa claramente su propósito

---

## Ejercicio 4.4: Mejora integral de funciones

Refactoriza completamente el siguiente código aplicando todos los principios aprendidos:

```javascript
function handleUserAction(u, a, d, opts) {
    let res;
    
    if (u && a && d) {
        if (a === 'create' || a === 'update' || a === 'delete') {
            if (u.role === 'admin' || (u.role === 'user' && a !== 'delete')) {
                if (a === 'create') {
                    if (d.name && d.email) {
                        if (!database.findByEmail(d.email)) {
                            const newUser = {
                                id: Math.random().toString(36),
                                name: d.name.trim(),
                                email: d.email.toLowerCase().trim(),
                                created: new Date(),
                                active: true
                            };
                            
                            database.insert(newUser);
                            
                            if (opts && opts.notify) {
                                // Enviar notificación
                                const msg = `Welcome ${newUser.name}! Your account has been created.`;
                                notificationService.send(newUser.email, msg);
                            }
                            
                            res = { success: true, user: newUser };
                        } else {
                            res = { error: 'Email already exists' };
                        }
                    } else {
                        res = { error: 'Name and email required' };
                    }
                } else if (a === 'update') {
                    const existingUser = database.findById(d.id);
                    if (existingUser) {
                        if (u.role === 'admin' || existingUser.id === u.id) {
                            existingUser.name = d.name || existingUser.name;
                            existingUser.email = d.email || existingUser.email;
                            existingUser.updated = new Date();
                            
                            database.update(existingUser);
                            res = { success: true, user: existingUser };
                        } else {
                            res = { error: 'Permission denied' };
                        }
                    } else {
                        res = { error: 'User not found' };
                    }
                } else if (a === 'delete') {
                    const userToDelete = database.findById(d.id);
                    if (userToDelete) {
                        database.delete(d.id);
                        res = { success: true, message: 'User deleted' };
                    } else {
                        res = { error: 'User not found' };
                    }
                }
            } else {
                res = { error: 'Permission denied' };
            }
        } else {
            res = { error: 'Invalid action' };
        }
    } else {
        res = { error: 'Missing required parameters' };
    }
    
    return res;
}
```

**Instrucciones:**
1. Mejora todos los nombres de variables y funciones
2. Aplica validación con salida temprana
3. Divide la función en múltiples funciones con responsabilidad única
4. Usa objetos para parámetros múltiples
5. Implementa manejo adecuado de errores

---

## Ejercicio 4.5: Refactoring de función compleja

La siguiente función maneja el cálculo de precios con descuentos. Refactorízala para que sea más mantenible:

```javascript
function calculatePrice(product, customer, quantity, coupon, date) {
    let basePrice = product.price * quantity;
    let discount = 0;
    let finalPrice;
    
    // Descuento por cantidad
    if (quantity >= 100) {
        discount += 0.15; // 15%
    } else if (quantity >= 50) {
        discount += 0.10; // 10%
    } else if (quantity >= 10) {
        discount += 0.05; // 5%
    }
    
    // Descuento por tipo de cliente
    if (customer.type === 'premium') {
        discount += 0.12;
    } else if (customer.type === 'gold') {
        discount += 0.08;
    } else if (customer.type === 'silver') {
        discount += 0.05;
    }
    
    // Descuento por categoría de producto
    if (product.category === 'electronics' && date.getMonth() === 10) { // Noviembre
        discount += 0.20; // Black Friday
    } else if (product.category === 'clothing' && (date.getMonth() === 0 || date.getMonth() === 6)) {
        discount += 0.30; // Rebajas enero/julio
    } else if (product.category === 'books') {
        discount += 0.10; // Siempre 10% en libros
    }
    
    // Aplicar cupón
    if (coupon && coupon.isValid && coupon.expiresAt > date) {
        if (coupon.type === 'percentage') {
            discount += coupon.value / 100;
        } else if (coupon.type === 'fixed' && basePrice >= coupon.minimumAmount) {
            finalPrice = basePrice * (1 - discount) - coupon.value;
            return Math.max(finalPrice, product.price * 0.1); // Mínimo 10% del precio original
        }
    }
    
    // Límite máximo de descuento
    if (discount > 0.50) {
        discount = 0.50; // Máximo 50%
    }
    
    finalPrice = basePrice * (1 - discount);
    
    // Precio mínimo
    if (finalPrice < product.price * 0.1) {
        finalPrice = product.price * 0.1;
    }
    
    // Redondear a 2 decimales
    return Math.round(finalPrice * 100) / 100;
}
```

**Instrucciones:**
1. Extrae cada tipo de descuento a funciones separadas
2. Crea constantes para todos los valores mágicos
3. Implementa validación de entrada
4. Separa la lógica de cálculo de la lógica de formateo
5. Considera usar un patrón strategy para los diferentes tipos de descuento
6. Mejora la legibilidad del flujo principal