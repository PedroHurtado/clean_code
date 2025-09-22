# Tema 1: Todo código es mejorable

> *"Programs must be written for people to read, and only incidentally for machines to execute."* - Harold Abelson

## 1.1 Se escribe para leer

### Concepto clave
El código se escribe **una vez** pero se lee **muchas veces**. Cada vez que revisamos, depuramos, modificamos o extendemos una funcionalidad, necesitamos leer y entender el código existente.

**Robert C. Martin** en "Clean Code" establece que el código se lee 10 veces más de lo que se escribe. Esta ratio hace que la legibilidad sea fundamental para la productividad del equipo.

### Ejemplo MALO ❌
```javascript
function calc(x, y, z) {
    let r = 0;
    if (z === 1) {
        r = x + y;
    } else if (z === 2) {
        r = x - y;
    } else if (z === 3) {
        r = x * y;
    } else if (z === 4) {
        r = x / y;
    }
    return r;
}

const result = calc(10, 5, 1);
```

### Ejemplo BUENO ✅
```javascript
const OPERATIONS = {
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    DIVIDE: 'divide'
};

function calculateBasicOperation(firstOperand, secondOperand, operation) {
    switch (operation) {
        case OPERATIONS.ADD:
            return firstOperand + secondOperand;
        case OPERATIONS.SUBTRACT:
            return firstOperand - secondOperand;
        case OPERATIONS.MULTIPLY:
            return firstOperand * secondOperand;
        case OPERATIONS.DIVIDE:
            if (secondOperand === 0) {
                throw new Error('Division by zero is not allowed');
            }
            return firstOperand / secondOperand;
        default:
            throw new Error(`Unknown operation: ${operation}`);
    }
}

const result = calculateBasicOperation(10, 5, OPERATIONS.ADD);
```

## 1.2 El paso del tiempo lo empeora todo

### Concepto clave
El código tiende a degradarse con el tiempo debido a:
- Cambios rápidos sin refactorización
- Presión de entregas
- Diferentes estilos de programadores
- Requisitos cambiantes
- Deuda técnica acumulada

Este fenómeno es conocido como **"software entropy"** o entropía del software, un concepto introducido en **"The Pragmatic Programmer"** por Andrew Hunt y David Thomas. La segunda ley de la termodinámica aplicada al software: todo sistema tiende al desorden con el tiempo si no se aplica energía para mantenerlo.

### Ejemplo de degradación temporal

#### Estado inicial (bueno)
```javascript
class UserService {
    constructor(database) {
        this.database = database;
    }

    async getUserById(id) {
        return await this.database.findUser(id);
    }
}
```

#### Después de varios cambios (degradado)
```javascript
class UserService {
    constructor(database) {
        this.database = database;
        this.cache = new Map(); // Añadido después
    }

    async getUserById(id) {
        // TODO: remover este hack temporal
        if (!id) return null;
        
        // Caché añadido para mejorar rendimiento
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }
        
        const user = await this.database.findUser(id);
        
        // Validación añadida por bug #1234
        if (user && user.isActive !== undefined) {
            this.cache.set(id, user);
            return user;
        }
        
        return null; // Retorno añadido por bug #5678
    }

    // Método añadido urgentemente
    getUserByIdQuick(id) {
        return this.database.findUser(id); // Sin caché ni validaciones
    }
}
```

## 1.3 Refactorizar manteniendo la funcionalidad

### Concepto clave
Refactorizar significa **mejorar la estructura del código sin cambiar su comportamiento externo**. Es esencial para mantener la calidad del código a lo largo del tiempo.

El término "refactoring" fue popularizado por **Martin Fowler** en su libro "Refactoring: Improving the Design of Existing Code". Fowler define refactoring como *"una técnica disciplinada para reestructurar un cuerpo de código existente, alterando su estructura interna sin cambiar su comportamiento externo"*.

### Principios del refactoring:
1. **Hacer pequeños cambios incrementales**
2. **Mantener los tests pasando en todo momento**
3. **Una modificación a la vez**
4. **Verificar que el comportamiento no cambia**

### La regla del Boy Scout
Robert C. Martin propone aplicar la **"Boy Scout Rule"**: *"Deja el código más limpio de como lo encontraste"*. Cada vez que tocas código, mejóralo un poco, aunque sea mínimamente.

### Ejemplo de refactoring paso a paso

#### Código original
```javascript
function processOrder(order) {
    let total = 0;
    for (let i = 0; i < order.items.length; i++) {
        let item = order.items[i];
        let price = item.price;
        if (item.type === 'book') {
            price = price * 0.9; // 10% descuento libros
        }
        if (order.customer.isPremium) {
            price = price * 0.95; // 5% descuento premium
        }
        total += price * item.quantity;
    }
    
    if (total > 100) {
        total = total * 0.98; // 2% descuento por compra mayor a 100
    }
    
    return total;
}
```

#### Después del refactoring
```javascript
function processOrder(order) {
    const subtotal = calculateSubtotal(order.items);
    const discountedSubtotal = applyCustomerDiscount(subtotal, order.customer);
    return applyBulkDiscount(discountedSubtotal);
}

function calculateSubtotal(items) {
    return items.reduce((total, item) => {
        const itemPrice = calculateItemPrice(item);
        return total + (itemPrice * item.quantity);
    }, 0);
}

function calculateItemPrice(item) {
    let price = item.price;
    
    if (isBookItem(item)) {
        price = applyBookDiscount(price);
    }
    
    return price;
}

function applyCustomerDiscount(subtotal, customer) {
    return customer.isPremium 
        ? subtotal * DISCOUNTS.PREMIUM_CUSTOMER 
        : subtotal;
}

function applyBulkDiscount(total) {
    return total > BULK_PURCHASE_THRESHOLD 
        ? total * DISCOUNTS.BULK_PURCHASE 
        : total;
}

function isBookItem(item) {
    return item.type === 'book';
}

function applyBookDiscount(price) {
    return price * DISCOUNTS.BOOK;
}

const DISCOUNTS = {
    BOOK: 0.9,
    PREMIUM_CUSTOMER: 0.95,
    BULK_PURCHASE: 0.98
};

const BULK_PURCHASE_THRESHOLD = 100;
```

### Beneficios del código refactorizado:
- ✅ Cada función tiene una responsabilidad clara
- ✅ Los nombres explican qué hace cada parte
- ✅ Las constantes están centralizadas
- ✅ Es fácil añadir nuevos tipos de descuento
- ✅ Es fácil testear cada función por separado
- ✅ El flujo principal es fácil de seguir

---

## Referencias y lecturas recomendadas

📚 **Libros fundamentales:**
- **"Clean Code"** - Robert C. Martin (Uncle Bob)
- **"Refactoring: Improving the Design of Existing Code"** - Martin Fowler
- **"The Pragmatic Programmer"** - Andrew Hunt & David Thomas
- **"Code Complete"** - Steve McConnell

🔗 **Recursos online:**
- [Refactoring.com](https://refactoring.com/) - Catálogo de técnicas de refactoring de Martin Fowler
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript) - Principios adaptados a JavaScript
- [CodeSmells](https://refactoring.guru/refactoring/smells) - Guía visual de code smells