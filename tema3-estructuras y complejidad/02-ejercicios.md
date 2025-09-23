# Tema 3: Estructuras y Complejidad - Ejercicios

## Ejercicio 1: Refactorizar Condiciones Complejas

### Código Problemático:
```javascript
function canUserEditPost(user, post, currentTime) {
    if (user && user.id && post && post.id) {
        if (user.role === 'admin' || 
            (user.id === post.authorId && 
             (post.status === 'draft' || 
              (post.status === 'published' && 
               currentTime - post.publishedAt < 24 * 60 * 60 * 1000))) ||
            (user.role === 'moderator' && 
             (post.reported === true || post.status === 'flagged'))) {
            return true;
        }
    }
    return false;
}
```

### Tareas:
1. Extraer las condiciones complejas a funciones con nombres descriptivos
2. Aplicar guard clauses para reducir anidamiento
3. Mejorar la legibilidad general del código
4. Asegurar que cada función tenga una sola responsabilidad

---

## Ejercicio 2: Simplificar Bucles Complejos

### Código Problemático:
```javascript
function analyzeUserActivity(users, activities, startDate, endDate) {
    let result = [];
    
    for (let i = 0; i < users.length; i++) {
        let userActivities = [];
        let totalPoints = 0;
        let activeHours = 0;
        
        for (let j = 0; j < activities.length; j++) {
            if (activities[j].userId === users[i].id) {
                let activityDate = new Date(activities[j].timestamp);
                if (activityDate >= startDate && activityDate <= endDate) {
                    userActivities.push(activities[j]);
                    if (activities[j].points) {
                        totalPoints += activities[j].points;
                    }
                    if (activities[j].duration) {
                        activeHours += activities[j].duration;
                    }
                }
            }
        }
        
        if (userActivities.length > 0) {
            let avgSessionTime = activeHours / userActivities.length;
            let level = totalPoints < 100 ? 'beginner' : 
                       totalPoints < 500 ? 'intermediate' : 'advanced';
                       
            result.push({
                userId: users[i].id,
                username: users[i].username,
                totalActivities: userActivities.length,
                totalPoints: totalPoints,
                averageSessionTime: avgSessionTime,
                level: level,
                activities: userActivities
            });
        }
    }
    
    return result;
}
```

### Tareas:
1. Separar las diferentes responsabilidades en funciones específicas
2. Usar métodos funcionales (map, filter, reduce) donde sea apropiado
3. Extraer la lógica de cálculo a funciones reutilizables
4. Mejorar la eficiencia eliminando loops anidados innecesarios

---

## Ejercicio 3: Reducir Anidamiento Excesivo

### Código Problemático:
```javascript
function processFileUpload(file, user, config) {
    if (file) {
        if (file.size < config.maxFileSize) {
            if (isAllowedFileType(file.type, config.allowedTypes)) {
                if (user && user.permissions) {
                    if (user.permissions.includes('upload')) {
                        if (user.storageUsed < user.storageLimit) {
                            try {
                                const processedFile = processFile(file);
                                if (processedFile.valid) {
                                    const savedFile = saveFile(processedFile, user);
                                    if (savedFile.success) {
                                        updateUserStorage(user, file.size);
                                        logActivity(user.id, 'file_upload', savedFile.id);
                                        return {
                                            success: true,
                                            fileId: savedFile.id,
                                            url: savedFile.url
                                        };
                                    } else {
                                        throw new Error('Failed to save file');
                                    }
                                } else {
                                    throw new Error('File processing failed');
                                }
                            } catch (error) {
                                logError(user.id, 'file_upload_error', error.message);
                                throw error;
                            }
                        } else {
                            throw new Error('Storage limit exceeded');
                        }
                    } else {
                        throw new Error('No upload permission');
                    }
                } else {
                    throw new Error('Invalid user or permissions');
                }
            } else {
                throw new Error('File type not allowed');
            }
        } else {
            throw new Error('File too large');
        }
    } else {
        throw new Error('No file provided');
    }
}
```

### Tareas:
1. Aplicar guard clauses para validaciones tempranas
2. Extraer la lógica principal a funciones separadas
3. Mejorar el manejo de errores
4. Reducir el anidamiento a un máximo de 2-3 niveles

---

## Ejercicio 4: Refactorizar Sistema de Permisos

### Código Problemático:
```javascript
function checkUserAccess(user, resource, action) {
    if (user) {
        if (user.active) {
            if (user.roles) {
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].active) {
                        if (user.roles[i].permissions) {
                            for (let j = 0; j < user.roles[i].permissions.length; j++) {
                                let permission = user.roles[i].permissions[j];
                                if (permission.resource === resource || permission.resource === '*') {
                                    if (permission.actions) {
                                        if (permission.actions.includes(action) || permission.actions.includes('*')) {
                                            if (permission.conditions) {
                                                if (permission.conditions.timeRestriction) {
                                                    let currentHour = new Date().getHours();
                                                    if (currentHour >= permission.conditions.timeRestriction.start && 
                                                        currentHour <= permission.conditions.timeRestriction.end) {
                                                        if (permission.conditions.ipRestriction) {
                                                            if (permission.conditions.ipRestriction.includes(user.currentIP)) {
                                                                return true;
                                                            }
                                                        } else {
                                                            return true;
                                                        }
                                                    }
                                                } else {
                                                    if (permission.conditions.ipRestriction) {
                                                        if (permission.conditions.ipRestriction.includes(user.currentIP)) {
                                                            return true;
                                                        }
                                                    } else {
                                                        return true;
                                                    }
                                                }
                                            } else {
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            throw new Error('User is not active');
        }
    } else {
        throw new Error('User is required');
    }
    return false;
}
```

### Tareas:
1. Extraer las validaciones a funciones separadas con nombres descriptivos
2. Separar la lógica de permisos, condiciones temporales e IP
3. Usar métodos funcionales para iterar sobre roles y permisos
4. Aplicar guard clauses para reducir el anidamiento
5. Crear funciones puras para cada tipo de validación

---

## Ejercicio 5: Optimizar Procesamiento de Datos

### Código Problemático:
```javascript
function generateReport(orders, customers, products, startDate, endDate) {
    let report = {
        totalOrders: 0,
        totalRevenue: 0,
        topCustomers: [],
        topProducts: [],
        monthlyBreakdown: {}
    };
    
    let customerStats = {};
    let productStats = {};
    
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let orderDate = new Date(order.createdAt);
        
        if (orderDate >= startDate && orderDate <= endDate) {
            report.totalOrders++;
            report.totalRevenue += order.total;
            
            // Monthly breakdown
            let monthKey = orderDate.getFullYear() + '-' + (orderDate.getMonth() + 1);
            if (!report.monthlyBreakdown[monthKey]) {
                report.monthlyBreakdown[monthKey] = {
                    orders: 0,
                    revenue: 0
                };
            }
            report.monthlyBreakdown[monthKey].orders++;
            report.monthlyBreakdown[monthKey].revenue += order.total;
            
            // Customer stats
            if (!customerStats[order.customerId]) {
                for (let j = 0; j < customers.length; j++) {
                    if (customers[j].id === order.customerId) {
                        customerStats[order.customerId] = {
                            name: customers[j].name,
                            email: customers[j].email,
                            orders: 0,
                            revenue: 0
                        };
                        break;
                    }
                }
            }
            if (customerStats[order.customerId]) {
                customerStats[order.customerId].orders++;
                customerStats[order.customerId].revenue += order.total;
            }
            
            // Product stats
            for (let k = 0; k < order.items.length; k++) {
                let item = order.items[k];
                if (!productStats[item.productId]) {
                    for (let l = 0; l < products.length; l++) {
                        if (products[l].id === item.productId) {
                            productStats[item.productId] = {
                                name: products[l].name,
                                category: products[l].category,
                                quantity: 0,
                                revenue: 0
                            };
                            break;
                        }
                    }
                }
                if (productStats[item.productId]) {
                    productStats[item.productId].quantity += item.quantity;
                    productStats[item.productId].revenue += item.price * item.quantity;
                }
            }
        }
    }
    
    // Sort and get top customers
    let customerArray = Object.values(customerStats);
    customerArray.sort((a, b) => b.revenue - a.revenue);
    report.topCustomers = customerArray.slice(0, 10);
    
    // Sort and get top products
    let productArray = Object.values(productStats);
    productArray.sort((a, b) => b.revenue - a.revenue);
    report.topProducts = productArray.slice(0, 10);
    
    return report;
}
```

### Tareas:
1. Separar cada tipo de cálculo en funciones específicas
2. Crear funciones para filtrar órdenes por fecha
3. Usar Map para mejorar las búsquedas de customers y products
4. Extraer la lógica de ordenamiento y ranking
5. Usar métodos funcionales en lugar de loops tradicionales
6. Crear funciones puras para cada cálculo

---

## Instrucciones Generales

### Para todos los ejercicios:

1. **Aplicar Guard Clauses**: Validar parámetros al inicio y fallar rápido
2. **Extraer Funciones**: Cada bloque lógico debe ser una función con nombre descriptivo
3. **Una Responsabilidad**: Cada función debe hacer una cosa bien
4. **Nombres Descriptivos**: Los nombres deben explicar qué hace la función
5. **Evitar Anidamiento**: Máximo 3-4 niveles de indentación
6. **Usar Métodos Funcionales**: Preferir `map`, `filter`, `reduce` cuando sea apropiado
7. **Estructuras de Datos**: Usar Map, Set u otras estructuras para mejorar eficiencia

### Criterios de Evaluación:

- ✅ **Legibilidad**: ¿Es fácil entender qué hace cada función?
- ✅ **Mantenibilidad**: ¿Es fácil modificar o extender el código?
- ✅ **Testabilidad**: ¿Se pueden probar las funciones de forma independiente?
- ✅ **Reutilización**: ¿Las funciones pueden reutilizarse en otros contextos?
- ✅ **Complejidad**: ¿Se ha reducido la complejidad cognitiva?
- ✅ **Eficiencia**: ¿Se ha mejorado el rendimiento eliminando loops innecesarios?

### Metodología de Trabajo:

1. **Analizar el código**: Identifica los problemas principales
2. **Dividir en funciones**: Separa cada responsabilidad
3. **Nombrar apropiadamente**: Usa nombres que expliquen la intención
4. **Simplificar condiciones**: Aplica guard clauses y extrae condiciones complejas
5. **Optimizar iteraciones**: Usa las estructuras de datos y métodos más apropiados
6. **Validar el resultado**: Asegúrate de que el comportamiento se mantiene igual