# Tema 3: Estructuras y Complejidad - Teoría

## Introducción

La complejidad del código no solo radica en los algoritmos que implementamos, sino también en cómo estructuramos nuestras decisiones, iteraciones y flujos de control. Un código con estructuras complejas y mal organizadas es difícil de leer, mantener y depurar.

En este tema aprenderemos a simplificar nuestras estructuras de control para crear código más legible y mantenible.

---

## 3.1. Condiciones

### Simplificando las Condiciones

Las condiciones complejas son uno de los mayores enemigos de la legibilidad del código. Veamos algunos patrones problemáticos y sus soluciones.

#### ❌ Código Malo: Condiciones Complejas y Anidadas

```javascript
// Ejemplo 1: Condición compleja sin nombres descriptivos
function canUserAccess(user, resource) {
    if (user && user.role && (user.role === 'admin' || 
        (user.role === 'user' && resource && resource.owner === user.id) || 
        (user.role === 'moderator' && resource && resource.public === true))) {
        return true;
    }
    return false;
}

// Ejemplo 2: Anidamiento excesivo
function processPayment(payment) {
    if (payment) {
        if (payment.amount > 0) {
            if (payment.method) {
                if (payment.method === 'card' || payment.method === 'paypal') {
                    if (payment.user && payment.user.verified) {
                        // Procesar pago
                        return processTransaction(payment);
                    } else {
                        throw new Error('User not verified');
                    }
                } else {
                    throw new Error('Invalid payment method');
                }
            } else {
                throw new Error('Payment method required');
            }
        } else {
            throw new Error('Amount must be positive');
        }
    } else {
        throw new Error('Payment required');
    }
}
```

#### ✅ Código Bueno: Condiciones Claras y Guard Clauses

```javascript
// Ejemplo 1: Condiciones extraídas a funciones con nombres descriptivos
function canUserAccess(user, resource) {
    return isAdmin(user) || 
           canUserAccessOwnResource(user, resource) || 
           canModeratorAccessPublicResource(user, resource);
}

function isAdmin(user) {
    return user?.role === 'admin';
}

function canUserAccessOwnResource(user, resource) {
    return user?.role === 'user' && resource?.owner === user.id;
}

function canModeratorAccessPublicResource(user, resource) {
    return user?.role === 'moderator' && resource?.public === true;
}

// Ejemplo 2: Guard clauses para reducir anidamiento
function processPayment(payment) {
    if (!payment) throw new Error('Payment required');
    if (payment.amount <= 0) throw new Error('Amount must be positive');
    if (!payment.method) throw new Error('Payment method required');
    if (!isValidPaymentMethod(payment.method)) throw new Error('Invalid payment method');
    if (!payment.user?.verified) throw new Error('User not verified');
    
    return processTransaction(payment);
}

function isValidPaymentMethod(method) {
    const validMethods = ['card', 'paypal'];
    return validMethods.includes(method);
}
```

### Principios Clave para Condiciones

1. **Guard Clauses**: Salir temprano de las funciones para reducir anidamiento
2. **Nombres Descriptivos**: Las condiciones deben leerse como lenguaje natural
3. **Extracción de Métodos**: Condiciones complejas deben extraerse a funciones con nombres claros
4. **Evitar Negaciones**: `if (isValid)` es mejor que `if (!isInvalid)`

---

## 3.2. Repeticiones

### Optimizando Loops y Iteraciones

Los bucles mal estructurados pueden hacer que el código sea difícil de entender y mantener. El problema principal suele ser la falta de claridad sobre qué se está iterando y por qué.

#### ❌ Código Malo: Loops Complejos y Poco Claros

```javascript
// Ejemplo 1: Loop complejo con múltiples responsabilidades
function processUsers(users) {
    let activeUsers = [];
    let totalRevenue = 0;
    let notifications = [];
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].status === 'active' && users[i].lastLogin) {
            let daysSinceLogin = Math.floor((Date.now() - users[i].lastLogin) / (1000 * 60 * 60 * 24));
            if (daysSinceLogin < 30) {
                activeUsers.push(users[i]);
                if (users[i].subscription && users[i].subscription.amount) {
                    totalRevenue += users[i].subscription.amount;
                    if (users[i].subscription.expiresAt < Date.now() + (7 * 24 * 60 * 60 * 1000)) {
                        notifications.push({
                            userId: users[i].id,
                            message: 'Subscription expiring soon'
                        });
                    }
                }
            }
        }
    }
    
    return { activeUsers, totalRevenue, notifications };
}

// Ejemplo 2: Loop anidado innecesario
function findUserPermissions(users, permissions) {
    let result = [];
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < permissions.length; j++) {
            if (permissions[j].userId === users[i].id) {
                let found = false;
                for (let k = 0; k < result.length; k++) {
                    if (result[k].userId === users[i].id) {
                        result[k].permissions.push(permissions[j]);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    result.push({
                        userId: users[i].id,
                        username: users[i].username,
                        permissions: [permissions[j]]
                    });
                }
            }
        }
    }
    return result;
}
```

#### ✅ Código Bueno: Iteraciones Claras y Enfocadas

```javascript
// Ejemplo 1: Separación de responsabilidades con métodos funcionales
function processUsers(users) {
    const recentlyActiveUsers = getRecentlyActiveUsers(users);
    const totalRevenue = calculateTotalRevenue(recentlyActiveUsers);
    const notifications = generateExpirationNotifications(recentlyActiveUsers);
    
    return { 
        activeUsers: recentlyActiveUsers, 
        totalRevenue, 
        notifications 
    };
}

function getRecentlyActiveUsers(users) {
    return users.filter(user => 
        user.status === 'active' && 
        isRecentlyActive(user)
    );
}

function isRecentlyActive(user) {
    if (!user.lastLogin) return false;
    const daysSinceLogin = getDaysSince(user.lastLogin);
    return daysSinceLogin < 30;
}

function calculateTotalRevenue(users) {
    return users
        .map(user => user.subscription?.amount || 0)
        .reduce((total, amount) => total + amount, 0);
}

function generateExpirationNotifications(users) {
    const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000);
    
    return users
        .filter(user => user.subscription?.expiresAt < sevenDaysFromNow)
        .map(user => ({
            userId: user.id,
            message: 'Subscription expiring soon'
        }));
}

// Ejemplo 2: Uso de Map para evitar loops anidados
function findUserPermissions(users, permissions) {
    const permissionsByUser = groupPermissionsByUser(permissions);
    
    return users.map(user => ({
        userId: user.id,
        username: user.username,
        permissions: permissionsByUser.get(user.id) || []
    }));
}

function groupPermissionsByUser(permissions) {
    const permissionMap = new Map();
    
    permissions.forEach(permission => {
        const existing = permissionMap.get(permission.userId) || [];
        permissionMap.set(permission.userId, [...existing, permission]);
    });
    
    return permissionMap;
}
```

### Principios Clave para Repeticiones

1. **Una Responsabilidad por Loop**: Cada iteración debe tener un propósito claro
2. **Métodos Funcionales**: Preferir `map`, `filter`, `reduce` sobre loops tradicionales cuando sea apropiado
3. **Extracción de Lógica**: Lógica compleja dentro de loops debe extraerse a funciones
4. **Estructuras de Datos Apropiadas**: Usar Map, Set u otras estructuras para evitar loops anidados innecesarios

---

## 3.3. Anidamiento Funcional

### Reduciendo la Complejidad Cognitiva

El anidamiento excesivo de código hace que sea difícil seguir el flujo lógico. La regla general es no superar 3-4 niveles de indentación.

#### ❌ Código Malo: Anidamiento Excesivo

```javascript
// Ejemplo 1: Callback hell y anidamiento profundo
function processOrder(order, callback) {
    if (order) {
        validateOrder(order, (validationError, isValid) => {
            if (!validationError && isValid) {
                checkInventory(order.items, (inventoryError, hasStock) => {
                    if (!inventoryError && hasStock) {
                        calculatePrice(order, (priceError, totalPrice) => {
                            if (!priceError) {
                                chargePayment(order.payment, totalPrice, (paymentError, transaction) => {
                                    if (!paymentError) {
                                        updateInventory(order.items, (updateError) => {
                                            if (!updateError) {
                                                sendConfirmation(order.customer, (emailError) => {
                                                    if (!emailError) {
                                                        callback(null, { 
                                                            success: true, 
                                                            orderId: order.id,
                                                            transaction 
                                                        });
                                                    } else {
                                                        callback(emailError);
                                                    }
                                                });
                                            } else {
                                                callback(updateError);
                                            }
                                        });
                                    } else {
                                        callback(paymentError);
                                    }
                                });
                            } else {
                                callback(priceError);
                            }
                        });
                    } else {
                        callback(inventoryError || new Error('No stock available'));
                    }
                });
            } else {
                callback(validationError || new Error('Invalid order'));
            }
        });
    } else {
        callback(new Error('Order is required'));
    }
}

// Ejemplo 2: Condicionales profundamente anidadas
function getUserPermissions(userId, resourceId) {
    if (userId) {
        const user = getUserById(userId);
        if (user) {
            if (user.active) {
                if (user.roles && user.roles.length > 0) {
                    const permissions = [];
                    for (let role of user.roles) {
                        if (role.active) {
                            if (role.permissions) {
                                for (let permission of role.permissions) {
                                    if (permission.resourceId === resourceId || permission.resourceId === '*') {
                                        if (permission.active && permission.expiresAt > Date.now()) {
                                            permissions.push(permission);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return permissions;
                } else {
                    return [];
                }
            } else {
                throw new Error('User is inactive');
            }
        } else {
            throw new Error('User not found');
        }
    } else {
        throw new Error('UserId is required');
    }
}
```

#### ✅ Código Bueno: Código Plano y Legible

```javascript
// Ejemplo 1: Usando async/await y extrayendo funciones
async function processOrder(order) {
    if (!order) throw new Error('Order is required');
    
    await validateOrderOrThrow(order);
    await checkInventoryOrThrow(order.items);
    
    const totalPrice = await calculatePrice(order);
    const transaction = await chargePayment(order.payment, totalPrice);
    
    await updateInventory(order.items);
    await sendConfirmation(order.customer);
    
    return {
        success: true,
        orderId: order.id,
        transaction
    };
}

async function validateOrderOrThrow(order) {
    const isValid = await validateOrder(order);
    if (!isValid) throw new Error('Invalid order');
}

async function checkInventoryOrThrow(items) {
    const hasStock = await checkInventory(items);
    if (!hasStock) throw new Error('No stock available');
}

// Ejemplo 2: Guard clauses y extracción de métodos
function getUserPermissions(userId, resourceId) {
    if (!userId) throw new Error('UserId is required');
    
    const user = getUserById(userId);
    if (!user) throw new Error('User not found');
    if (!user.active) throw new Error('User is inactive');
    
    return extractUserPermissions(user, resourceId);
}

function extractUserPermissions(user, resourceId) {
    if (!user.roles?.length) return [];
    
    return user.roles
        .filter(role => role.active)
        .flatMap(role => role.permissions || [])
        .filter(permission => canAccessResource(permission, resourceId))
        .filter(permission => isPermissionActive(permission));
}

function canAccessResource(permission, resourceId) {
    return permission.resourceId === resourceId || permission.resourceId === '*';
}

function isPermissionActive(permission) {
    return permission.active && permission.expiresAt > Date.now();
}
```

### Estrategias para Reducir Anidamiento

1. **Guard Clauses**: Validar condiciones y salir temprano
2. **Extracción de Métodos**: Cada nivel de anidamiento puede ser una función
3. **Async/Await**: Reemplazar callbacks anidados con código secuencial
4. **Early Returns**: Evitar else innecesarios
5. **Métodos Funcionales**: Usar `filter`, `map`, `flatMap` para procesar colecciones

### Métricas de Complejidad

- **Complejidad Ciclomática**: No más de 10 por función
- **Profundidad de Anidamiento**: Máximo 4 niveles
- **Longitud de Función**: No más de 20-30 líneas

---

## Referencias Externas

### Condiciones
- **Refactoring Guru - Replace Nested Conditional**: https://refactoring.guru/replace-nested-conditional-with-guard-clauses
- **Martin Fowler - Guard Clauses**: https://refactoring.com/catalog/replaceNestedConditionalWithGuardClauses.html
- **Clean Code - Chapter 17**: Smells and Heuristics

### Repeticiones
- **Eloquent JavaScript - Higher-order Functions**: https://eloquentjavascript.net/05_higher_order.html
- **MDN - Array Methods**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- **Functional Programming Principles**: https://mostly-adequate.gitbooks.io/mostly-adequate-guide/

### Anidamiento
- **Refactoring - Replace Nested Conditional**: https://refactoring.guru/replace-nested-conditional-with-guard-clauses
- **Code Complete - Cyclomatic Complexity**: https://www.construx.com/books/code-complete/
- **Clean Code - Functions Chapter**: https://www.oreilly.com/library/view/clean-code-a/9780136083238/
- **JavaScript Promises and Async/Await**: https://javascript.info/async

---

## Resumen del Tema

En este tema hemos aprendido a:

### **Simplificar Condiciones**
- Usar guard clauses para reducir anidamiento
- Extraer condiciones complejas a funciones con nombres descriptivos
- Evitar condiciones complejas anidadas

### **Optimizar Repeticiones** 
- Separar responsabilidades en cada iteración
- Usar métodos funcionales (`map`, `filter`, `reduce`) cuando sea apropiado
- Utilizar estructuras de datos apropiadas (Map, Set) para evitar loops anidados

### **Reducir Anidamiento**
- Aplicar early returns y guard clauses
- Extraer funciones para cada nivel de complejidad
- Usar async/await en lugar de callbacks anidados

### **Puntos Clave a Recordar**

- La complejidad cognitiva debe mantenerse baja (máximo 4 niveles de anidamiento)
- Cada función debe tener una sola responsabilidad
- Los nombres deben expresar claramente la intención
- Las validaciones deben hacerse temprano (fail fast)
- Preferir composición de funciones pequeñas sobre funciones grandes y complejas

### **Métricas Importantes**
- **Complejidad Ciclomática**: ≤ 10 por función
- **Profundidad de Anidamiento**: ≤ 4 niveles
- **Longitud de Función**: ≤ 20-30 líneas
- **Argumentos por Función**: ≤ 3-4 parámetros