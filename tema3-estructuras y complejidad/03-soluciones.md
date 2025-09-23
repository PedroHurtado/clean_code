# Tema 3: Estructuras y Complejidad - Soluciones

## Solución Ejercicio 1: Condiciones Refactorizadas

### Código Refactorizado:
```javascript
function canUserEditPost(user, post, currentTime) {
    if (!user?.id || !post?.id) return false;
    
    return isAdmin(user) || 
           canAuthorEditPost(user, post, currentTime) || 
           canModeratorEditPost(user, post);
}

function isAdmin(user) {
    return user.role === 'admin';
}

function canAuthorEditPost(user, post, currentTime) {
    if (user.id !== post.authorId) return false;
    
    return post.status === 'draft' || 
           canEditPublishedPost(post, currentTime);
}

function canEditPublishedPost(post, currentTime) {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return post.status === 'published' && 
           (currentTime - post.publishedAt) < oneDayInMs;
}

function canModeratorEditPost(user, post) {
    return user.role === 'moderator' && 
           (post.reported === true || post.status === 'flagged');
}
```

### Mejoras Aplicadas:
- ✅ **Guard Clauses**: Validación temprana con `if (!user?.id || !post?.id) return false`
- ✅ **Extracción de Funciones**: Cada condición compleja ahora es una función con nombre descriptivo
- ✅ **Nombres Descriptivos**: `isAdmin`, `canAuthorEditPost`, `canModeratorEditPost`
- ✅ **Lógica Clara**: Cada función tiene una sola responsabilidad

---

## Solución Ejercicio 2: Bucles Simplificados

### Código Refactorizado:
```javascript
function analyzeUserActivity(users, activities, startDate, endDate) {
    const relevantActivities = getActivitiesInDateRange(activities, startDate, endDate);
    const activitiesByUser = groupActivitiesByUser(relevantActivities);
    
    return users
        .map(user => analyzeUserData(user, activitiesByUser.get(user.id) || []))
        .filter(userData => userData.totalActivities > 0);
}

function getActivitiesInDateRange(activities, startDate, endDate) {
    return activities.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= startDate && activityDate <= endDate;
    });
}

function groupActivitiesByUser(activities) {
    const grouped = new Map();
    activities.forEach(activity => {
        const userActivities = grouped.get(activity.userId) || [];
        grouped.set(activity.userId, [...userActivities, activity]);
    });
    return grouped;
}

function analyzeUserData(user, userActivities) {
    const totalPoints = calculateTotalPoints(userActivities);
    const activeHours = calculateActiveHours(userActivities);
    const averageSessionTime = userActivities.length > 0 ? activeHours / userActivities.length : 0;
    const level = determineUserLevel(totalPoints);
    
    return {
        userId: user.id,
        username: user.username,
        totalActivities: userActivities.length,
        totalPoints,
        averageSessionTime,
        level,
        activities: userActivities
    };
}

function calculateTotalPoints(activities) {
    return activities.reduce((total, activity) => total + (activity.points || 0), 0);
}

function calculateActiveHours(activities) {
    return activities.reduce((total, activity) => total + (activity.duration || 0), 0);
}

function determineUserLevel(totalPoints) {
    if (totalPoints < 100) return 'beginner';
    if (totalPoints < 500) return 'intermediate';
    return 'advanced';
}
```

### Mejoras Aplicadas:
- ✅ **Separación de Responsabilidades**: Cada función tiene un propósito específico
- ✅ **Métodos Funcionales**: Uso de `map`, `filter`, `reduce` en lugar de loops tradicionales
- ✅ **Eficiencia**: Map para evitar loops anidados O(n*m) → O(n+m)
- ✅ **Reutilización**: Funciones de cálculo pueden reutilizarse independientemente

---

## Solución Ejercicio 3: Anidamiento Reducido

### Código Refactorizado:
```javascript
function processFileUpload(file, user, config) {
    validateFileUploadRequirements(file, user, config);
    
    try {
        const processedFile = processAndValidateFile(file);
        const savedFile = saveFileForUser(processedFile, user);
        
        updateUserStorage(user, file.size);
        logActivity(user.id, 'file_upload', savedFile.id);
        
        return createSuccessResponse(savedFile);
    } catch (error) {
        logError(user.id, 'file_upload_error', error.message);
        throw error;
    }
}

function validateFileUploadRequirements(file, user, config) {
    if (!file) throw new Error('No file provided');
    if (file.size >= config.maxFileSize) throw new Error('File too large');
    if (!isAllowedFileType(file.type, config.allowedTypes)) throw new Error('File type not allowed');
    if (!user?.permissions) throw new Error('Invalid user or permissions');
    if (!user.permissions.includes('upload')) throw new Error('No upload permission');
    if (user.storageUsed >= user.storageLimit) throw new Error('Storage limit exceeded');
}

function processAndValidateFile(file) {
    const processedFile = processFile(file);
    if (!processedFile.valid) throw new Error('File processing failed');
    return processedFile;
}

function saveFileForUser(processedFile, user) {
    const savedFile = saveFile(processedFile, user);
    if (!savedFile.success) throw new Error('Failed to save file');
    return savedFile;
}

function createSuccessResponse(savedFile) {
    return {
        success: true,
        fileId: savedFile.id,
        url: savedFile.url
    };
}
```

### Mejoras Aplicadas:
- ✅ **Guard Clauses**: Todas las validaciones al inicio con fallos rápidos
- ✅ **Extracción de Funciones**: Lógica principal dividida en pasos claros
- ✅ **Anidamiento Reducido**: De 7+ niveles a máximo 2 niveles
- ✅ **Manejo de Errores**: Centralizado y consistente

---

## Solución Ejercicio 4: Sistema de Permisos Refactorizado

### Código Refactorizado:
```javascript
function checkUserAccess(user, resource, action) {
    validateUser(user);
    
    const userPermissions = extractUserPermissions(user);
    const relevantPermissions = filterPermissionsForResource(userPermissions, resource);
    const actionPermissions = filterPermissionsForAction(relevantPermissions, action);
    
    return actionPermissions.some(permission => 
        validatePermissionConditions(permission, user)
    );
}

function validateUser(user) {
    if (!user) throw new Error('User is required');
    if (!user.active) throw new Error('User is not active');
}

function extractUserPermissions(user) {
    if (!user.roles?.length) return [];
    
    return user.roles
        .filter(role => role.active)
        .flatMap(role => role.permissions || []);
}

function filterPermissionsForResource(permissions, resource) {
    return permissions.filter(permission => 
        permission.resource === resource || permission.resource === '*'
    );
}

function filterPermissionsForAction(permissions, action) {
    return permissions.filter(permission => 
        permission.actions?.includes(action) || permission.actions?.includes('*')
    );
}

function validatePermissionConditions(permission, user) {
    if (!permission.conditions) return true;
    
    return validateTimeRestriction(permission.conditions, user) &&
           validateIpRestriction(permission.conditions, user);
}

function validateTimeRestriction(conditions, user) {
    if (!conditions.timeRestriction) return true;
    
    const currentHour = new Date().getHours();
    const { start, end } = conditions.timeRestriction;
    
    return currentHour >= start && currentHour <= end;
}

function validateIpRestriction(conditions, user) {
    if (!conditions.ipRestriction) return true;
    
    return conditions.ipRestriction.includes(user.currentIP);
}
```

### Mejoras Aplicadas:
- ✅ **Funciones Puras**: Cada validación es independiente y testeable
- ✅ **Métodos Funcionales**: Uso de `filter`, `flatMap`, `some` para claridad
- ✅ **Separación de Concerns**: Validación de usuario, permisos y condiciones separadas
- ✅ **Anidamiento Eliminado**: De 10+ niveles a máximo 2 niveles

---

## Solución Ejercicio 5: Procesamiento de Datos Optimizado

### Código Refactorizado:
```javascript
function generateReport(orders, customers, products, startDate, endDate) {
    const customerMap = createCustomerMap(customers);
    const productMap = createProductMap(products);
    const ordersInRange = filterOrdersByDateRange(orders, startDate, endDate);
    
    return {
        totalOrders: ordersInRange.length,
        totalRevenue: calculateTotalRevenue(ordersInRange),
        topCustomers: getTopCustomers(ordersInRange, customerMap),
        topProducts: getTopProducts(ordersInRange, productMap),
        monthlyBreakdown: generateMonthlyBreakdown(ordersInRange)
    };
}

function createCustomerMap(customers) {
    return new Map(customers.map(customer => [
        customer.id, 
        { name: customer.name, email: customer.email }
    ]));
}

function createProductMap(products) {
    return new Map(products.map(product => [
        product.id,
        { name: product.name, category: product.category }
    ]));
}

function filterOrdersByDateRange(orders, startDate, endDate) {
    return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
    });
}

function calculateTotalRevenue(orders) {
    return orders.reduce((total, order) => total + order.total, 0);
}

function getTopCustomers(orders, customerMap, limit = 10) {
    const customerStats = calculateCustomerStats(orders, customerMap);
    return sortByRevenue(customerStats).slice(0, limit);
}

function calculateCustomerStats(orders, customerMap) {
    const stats = new Map();
    
    orders.forEach(order => {
        const customerId = order.customerId;
        const customerInfo = customerMap.get(customerId);
        
        if (customerInfo) {
            const existing = stats.get(customerId) || {
                ...customerInfo,
                orders: 0,
                revenue: 0
            };
            
            stats.set(customerId, {
                ...existing,
                orders: existing.orders + 1,
                revenue: existing.revenue + order.total
            });
        }
    });
    
    return Array.from(stats.values());
}

function getTopProducts(orders, productMap, limit = 10) {
    const productStats = calculateProductStats(orders, productMap);
    return sortByRevenue(productStats).slice(0, limit);
}

function calculateProductStats(orders, productMap) {
    const stats = new Map();
    
    orders.forEach(order => {
        order.items.forEach(item => {
            const productId = item.productId;
            const productInfo = productMap.get(productId);
            
            if (productInfo) {
                const existing = stats.get(productId) || {
                    ...productInfo,
                    quantity: 0,
                    revenue: 0
                };
                
                stats.set(productId, {
                    ...existing,
                    quantity: existing.quantity + item.quantity,
                    revenue: existing.revenue + (item.price * item.quantity)
                });
            }
        });
    });
    
    return Array.from(stats.values());
}

function sortByRevenue(items) {
    return items.sort((a, b) => b.revenue - a.revenue);
}

function generateMonthlyBreakdown(orders) {
    const breakdown = {};
    
    orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
        
        if (!breakdown[monthKey]) {
            breakdown[monthKey] = { orders: 0, revenue: 0 };
        }
        
        breakdown[monthKey].orders++;
        breakdown[monthKey].revenue += order.total;
    });
    
    return breakdown;
}
```

### Mejoras Aplicadas:
- ✅ **Eficiencia**: Map lookup O(1) en lugar de búsquedas lineales O(n)
- ✅ **Separación de Responsabilidades**: Cada cálculo en su propia función
- ✅ **Métodos Funcionales**: Uso consistente de `map`, `filter`, `reduce`, `forEach`
- ✅ **Reutilización**: Funciones como `sortByRevenue` pueden reutilizarse
- ✅ **Legibilidad**: Flujo principal muy claro y fácil de seguir

---

## Análisis Comparativo de Mejoras

### Antes vs Después - Métricas:

| Métrica | Ejercicio 1 | Ejercicio 2 | Ejercicio 3 | Ejercicio 4 | Ejercicio 5 |
|---------|-------------|-------------|-------------|-------------|-------------|
| **Complejidad Ciclomática** | 8 → 3 | 12 → 4 | 15 → 3 | 20+ → 5 | 25+ → 6 |
| **Niveles de Anidamiento** | 5 → 2 | 4 → 2 | 8 → 2 | 10+ → 2 | 6 → 2 |
| **Líneas por Función** | 15 → 5 | 40+ → 8 | 50+ → 8 | 60+ → 10 | 80+ → 12 |
| **Funciones Testeables** | 1 → 5 | 1 → 7 | 1 → 5 | 1 → 8 | 1 → 9 |

### Principios Aplicados:

#### **Guard Clauses**
```javascript
// Antes: Anidamiento profundo
if (user) {
    if (user.active) {
        if (user.permissions) {
            // lógica principal
        }
    }
}

// Después: Validación temprana
if (!user) throw new Error('User required');
if (!user.active) throw new Error('User inactive');
if (!user.permissions) throw new Error('No permissions');
// lógica principal
```

#### **Extracción de Métodos**
```javascript
// Antes: Lógica compleja inline
if (user.role === 'admin' || (user.id === post.authorId && (post.status === 'draft' || ...)))

// Después: Funciones con nombres descriptivos
return isAdmin(user) || canAuthorEditPost(user, post, currentTime) || canModeratorEditPost(user, post);
```

#### **Métodos Funcionales**
```javascript
// Antes: Loops tradicionales con múltiples responsabilidades
for (let i = 0; i < users.length; i++) {
    // múltiples operaciones mezcladas
}

// Después: Pipeline funcional claro
return users
    .map(user => analyzeUserData(user, activitiesByUser.get(user.id) || []))
    .filter(userData => userData.totalActivities > 0);
```

#### **Estructuras de Datos Eficientes**
```javascript
// Antes: Búsquedas lineales O(n²)
for (let j = 0; j < customers.length; j++) {
    if (customers[j].id === order.customerId) {
        // encontrado
    }
}

// Después: Map lookup O(1)
const customerInfo = customerMap.get(order.customerId);
```

### Beneficios Conseguidos:

1. **📖 Legibilidad**: Código que se lee como prosa
2. **🧪 Testabilidad**: Funciones pequeñas y puras
3. **🔧 Mantenibilidad**: Cambios localizados y seguros
4. **⚡ Rendimiento**: Algoritmos más eficientes
5. **♻️ Reutilización**: Funciones modulares y composables
6. **🐛 Menos Bugs**: Lógica más simple y predecible

### Lecciones Clave:

- **Fail Fast**: Las validaciones tempranas simplifican el resto del código
- **Una Responsabilidad**: Cada función debe hacer una cosa bien
- **Nombres Importantes**: Un buen nombre elimina la necesidad de comentarios
- **Estructura de Datos**: La estructura correcta puede eliminar loops anidados
- **Composición**: Funciones pequeñas se combinan para crear comportamientos complejos