# Tema 4: Funciones

> *"The first rule of functions is that they should be small. The second rule of functions is that they should be smaller than that."* - Robert C. Martin

## 4.1 Nombrado y argumentos

### Concepto clave
Las funciones son los bloques de construcción fundamentales del software. Un buen nombre de función debe expresar claramente **qué hace**, no **cómo lo hace**. Los argumentos deben tener un propósito claro y estar ordenados de manera lógica.

### Principios del nombrado de funciones:
1. **Usa verbos**: Las funciones hacen algo
2. **Sé específico**: Evita nombres genéricos
3. **Expresa la intención**: El nombre debe explicar el propósito
4. **Mantén consistencia**: Usa el mismo vocabulario en todo el proyecto

### Ejemplo MALO ❌
```javascript
function calc(n1, n2, op) {
    switch (op) {
        case 1: return n1 + n2;
        case 2: return n1 - n2;
        case 3: return n1 * n2;
        case 4: return n1 / n2;
    }
}

function process(data) {
    // ¿Qué tipo de procesamiento?
    return data.filter(x => x > 0).map(x => x * 2);
}

function handle(user, type, flag) {
    // ¿Manejar qué? ¿Para qué sirve flag?
    if (flag) {
        return user.status === type;
    }
    return false;
}
```

### Ejemplo BUENO ✅
```javascript
function calculateBasicOperation(firstOperand, secondOperand, operation) {
    switch (operation) {
        case 'add': return firstOperand + secondOperand;
        case 'subtract': return firstOperand - secondOperand;
        case 'multiply': return firstOperand * secondOperand;
        case 'divide': return firstOperand / secondOperand;
        default: throw new Error(`Unknown operation: ${operation}`);
    }
}

function extractPositiveAndDouble(numbers) {
    return numbers
        .filter(number => number > 0)
        .map(number => number * 2);
}

function isUserInStatus(user, expectedStatus) {
    return user.status === expectedStatus;
}
```

### Reglas para argumentos:
- **Máximo 3-4 argumentos**: Más argumentos indican que la función hace demasiado
- **Orden lógico**: Los más importantes primero
- **Evita banderas booleanas**: Mejor dividir en dos funciones
- **Usa objetos para múltiples parámetros**: Más legible y extensible

### Ejemplo de refactoring de argumentos:

#### MALO ❌
```javascript
function createUser(name, email, age, isActive, role, department, startDate) {
    // Demasiados parámetros, difícil de recordar el orden
}

function sendEmail(to, subject, body, isUrgent, shouldTrack, template, attachments) {
    // Imposible de usar sin documentación
}
```

#### BUENO ✅
```javascript
function createUser(userData) {
    const {
        name,
        email,
        age,
        isActive = true,
        role = 'user',
        department,
        startDate = new Date()
    } = userData;
    
    // Lógica de creación...
}

function sendEmail({ recipient, subject, body, options = {} }) {
    const {
        isUrgent = false,
        shouldTrack = true,
        template,
        attachments = []
    } = options;
    
    // Lógica de envío...
}

// Uso claro y autodocumentado
createUser({
    name: 'Juan Pérez',
    email: 'juan@email.com',
    age: 30,
    department: 'Engineering'
});
```

## 4.2 Validación y salida temprana

### Concepto clave
La **validación de entrada** y la **salida temprana** (early return) mejoran la legibilidad y reducen la complejidad ciclomática del código. En lugar de anidar múltiples condiciones, validamos primero los casos inválidos y retornamos inmediatamente.

### Patrón de salida temprana:
1. **Validar argumentos** al inicio de la función
2. **Manejar casos edge** primero
3. **Procesar el caso principal** al final

### Ejemplo MALO ❌
```javascript
function processUserOrder(user, order, paymentMethod) {
    let result;
    
    if (user) {
        if (user.isActive) {
            if (order) {
                if (order.items && order.items.length > 0) {
                    if (paymentMethod) {
                        if (paymentMethod.isValid) {
                            // Lógica principal anidada muy profundamente
                            const total = order.items.reduce((sum, item) => {
                                return sum + (item.price * item.quantity);
                            }, 0);
                            
                            if (total > 0) {
                                result = {
                                    orderId: generateOrderId(),
                                    total: total,
                                    status: 'processed'
                                };
                            } else {
                                result = { error: 'Invalid total' };
                            }
                        } else {
                            result = { error: 'Invalid payment method' };
                        }
                    } else {
                        result = { error: 'Payment method required' };
                    }
                } else {
                    result = { error: 'Order must have items' };
                }
            } else {
                result = { error: 'Order required' };
            }
        } else {
            result = { error: 'User is not active' };
        }
    } else {
        result = { error: 'User required' };
    }
    
    return result;
}
```

### Ejemplo BUENO ✅
```javascript
function processUserOrder(user, order, paymentMethod) {
    // Validaciones con salida temprana
    if (!user) {
        throw new Error('User required');
    }
    
    if (!user.isActive) {
        throw new Error('User is not active');
    }
    
    if (!order) {
        throw new Error('Order required');
    }
    
    if (!order.items || order.items.length === 0) {
        throw new Error('Order must have items');
    }
    
    if (!paymentMethod) {
        throw new Error('Payment method required');
    }
    
    if (!paymentMethod.isValid) {
        throw new Error('Invalid payment method');
    }
    
    // Lógica principal clara y sin anidamiento
    const total = calculateOrderTotal(order.items);
    
    if (total <= 0) {
        throw new Error('Invalid order total');
    }
    
    return {
        orderId: generateOrderId(),
        total: total,
        status: 'processed'
    };
}

function calculateOrderTotal(items) {
    return items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
}
```

### Validación con tipos específicos:

```javascript
function calculateDiscount(user, purchaseAmount) {
    // Validación de tipos
    if (typeof purchaseAmount !== 'number') {
        throw new TypeError('Purchase amount must be a number');
    }
    
    if (purchaseAmount < 0) {
        throw new RangeError('Purchase amount cannot be negative');
    }
    
    // Validación de objeto
    if (!user || typeof user !== 'object') {
        throw new TypeError('User must be an object');
    }
    
    // Validación de propiedades requeridas
    if (!user.membershipLevel) {
        throw new Error('User must have a membership level');
    }
    
    // Caso principal
    const discountRates = {
        'bronze': 0.05,
        'silver': 0.10,
        'gold': 0.15,
        'platinum': 0.20
    };
    
    const rate = discountRates[user.membershipLevel] || 0;
    return purchaseAmount * rate;
}
```

## 4.3 Responsabilidad y tamaño

### Concepto clave
Cada función debe tener **una sola responsabilidad** (Single Responsibility Principle). Una función que hace una sola cosa bien es más fácil de entender, probar y mantener.

**Robert C. Martin** establece que las funciones deben ser **pequeñas**, idealmente no más de 20 líneas, y que deberían hacer **una cosa** bien.

### Indicadores de funciones problemáticas:
- **Más de 20-30 líneas**
- **Múltiples niveles de abstracción**
- **Nombres con "y", "o", "además"**
- **Múltiples razones para cambiar**
- **Difícil de nombrar claramente**

### Ejemplo MALO ❌
```javascript
function processUserRegistration(userData) {
    // Validación
    if (!userData.email) throw new Error('Email required');
    if (!userData.password) throw new Error('Password required');
    if (userData.password.length < 8) throw new Error('Password too short');
    
    // Formateo de datos
    userData.email = userData.email.toLowerCase().trim();
    userData.firstName = userData.firstName.trim();
    userData.lastName = userData.lastName.trim();
    
    // Generación de hash de contraseña
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);
    
    // Verificar si el usuario existe
    const existingUser = database.findUserByEmail(userData.email);
    if (existingUser) throw new Error('User already exists');
    
    // Crear usuario en base de datos
    const userId = generateUserId();
    const user = {
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        createdAt: new Date(),
        isActive: true
    };
    
    database.insertUser(user);
    
    // Enviar email de bienvenida
    const emailTemplate = `
        <h1>¡Bienvenido ${userData.firstName}!</h1>
        <p>Tu cuenta ha sido creada exitosamente.</p>
    `;
    
    emailService.send({
        to: userData.email,
        subject: 'Bienvenido a nuestra plataforma',
        html: emailTemplate
    });
    
    // Registrar evento de auditoría
    auditLog.record({
        action: 'USER_REGISTRATION',
        userId: userId,
        timestamp: new Date(),
        details: { email: userData.email }
    });
    
    return { success: true, userId: userId };
}
```

### Ejemplo BUENO ✅
```javascript
function registerUser(userData) {
    validateRegistrationData(userData);
    
    const sanitizedData = sanitizeUserData(userData);
    
    if (userExists(sanitizedData.email)) {
        throw new Error('User already exists');
    }
    
    const user = createUser(sanitizedData);
    const savedUser = saveUser(user);
    
    sendWelcomeEmail(savedUser);
    recordRegistrationAudit(savedUser);
    
    return { success: true, userId: savedUser.id };
}

function validateRegistrationData(userData) {
    if (!userData.email) {
        throw new Error('Email required');
    }
    if (!userData.password) {
        throw new Error('Password required');
    }
    if (!isValidPassword(userData.password)) {
        throw new Error('Password must be at least 8 characters');
    }
}

function sanitizeUserData(userData) {
    return {
        ...userData,
        email: userData.email.toLowerCase().trim(),
        firstName: userData.firstName?.trim(),
        lastName: userData.lastName?.trim()
    };
}

function isValidPassword(password) {
    return password && password.length >= 8;
}

function userExists(email) {
    return database.findUserByEmail(email) !== null;
}

function createUser(userData) {
    const hashedPassword = hashPassword(userData.password);
    
    return {
        id: generateUserId(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        createdAt: new Date(),
        isActive: true
    };
}

function hashPassword(password) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

function saveUser(user) {
    return database.insertUser(user);
}

function sendWelcomeEmail(user) {
    const template = buildWelcomeEmailTemplate(user);
    
    emailService.send({
        to: user.email,
        subject: 'Bienvenido a nuestra plataforma',
        html: template
    });
}

function buildWelcomeEmailTemplate(user) {
    return `
        <h1>¡Bienvenido ${user.firstName}!</h1>
        <p>Tu cuenta ha sido creada exitosamente.</p>
    `;
}

function recordRegistrationAudit(user) {
    auditLog.record({
        action: 'USER_REGISTRATION',
        userId: user.id,
        timestamp: new Date(),
        details: { email: user.email }
    });
}
```

### Beneficios de funciones pequeñas:
- ✅ **Fáciles de entender**: Una sola responsabilidad
- ✅ **Fáciles de probar**: Casos de prueba más simples
- ✅ **Fáciles de reusar**: Funcionalidad específica
- ✅ **Fáciles de mantener**: Cambios aislados
- ✅ **Composables**: Se pueden combinar para crear funcionalidad compleja

### La regla del nivel de abstracción:
Una función debe operar en **un solo nivel de abstracción**. No mezcles operaciones de bajo nivel (manipulación de strings) con operaciones de alto nivel (lógica de negocio).

```javascript
// MALO: Mezcla niveles de abstracción
function processOrder(order) {
    // Alto nivel: validación de negocio
    if (!isValidOrder(order)) return false;
    
    // Bajo nivel: manipulación de strings
    const customerName = order.customer.firstName.trim().toLowerCase() + 
                        ' ' + order.customer.lastName.trim().toLowerCase();
    
    // Alto nivel: cálculo de negocio
    const total = calculateTotal(order);
    
    return { customerName, total };
}

// BUENO: Un solo nivel de abstracción
function processOrder(order) {
    if (!isValidOrder(order)) return false;
    
    const customerName = formatCustomerName(order.customer);
    const total = calculateTotal(order);
    
    return { customerName, total };
}

function formatCustomerName(customer) {
    const firstName = customer.firstName.trim().toLowerCase();
    const lastName = customer.lastName.trim().toLowerCase();
    return `${firstName} ${lastName}`;
}
```

---

## Referencias y lecturas recomendadas

📚 **Libros fundamentales:**
- **"Clean Code"** - Robert C. Martin - Capítulo 3: Functions
- **"Code Complete"** - Steve McConnell - Capítulo 7: High-Quality Routines
- **"Refactoring"** - Martin Fowler - Extract Method, Replace Parameter with Explicit Methods
- **"The Pragmatic Programmer"** - Hunt & Thomas - Capítulo sobre funciones ortogonales

🔗 **Recursos online de calidad:**

**Artículos técnicos:**
- [Function Design Principles](https://martinfowler.com/articles/function-size.html) - Martin Fowler sobre el tamaño ideal de funciones
- [Clean Code JavaScript Functions](https://github.com/ryanmcdermott/clean-code-javascript#functions) - Guía práctica con ejemplos
- [JavaScript Function Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) - MDN Web Docs
- [Early Return Pattern](https://szymonkrajewski.pl/why-should-you-return-early/) - Explicación detallada del patrón

**Herramientas de análisis:**
- [ESLint Rules for Functions](https://eslint.org/docs/rules/max-lines-per-function) - Reglas para controlar la complejidad
- [SonarJS Function Rules](https://rules.sonarsource.com/javascript/tag/function) - Análisis estático de calidad
- [Cognitive Complexity](https://www.sonarsource.com/docs/CognitiveComplexity.pdf) - Paper sobre complejidad cognitiva

**Videos educativos:**
- [Clean Code - Functions](https://www.youtube.com/watch?v=7EmboKQH8lM) - Uncle Bob Martin explicando principios
- [JavaScript Functions Best Practices](https://www.youtube.com/watch?v=RR_dQ4sBSBM) - Ejemplos prácticos modernos

**Blogs de expertos:**
- [Kent C. Dodds - Function Composition](https://kentcdodds.com/blog/function-composition-in-javascript) - Composición de funciones
- [Eric Elliott - Functional Programming](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0) - Programación funcional
- [Dan Abramov - The WET Codebase](https://overreacted.io/the-wet-codebase/) - Cuándo no aplicar DRY en funciones

📊 **Conceptos clave:**
- **Single Responsibility Principle (SRP)** - Cada función debe tener una sola razón para cambiar
- **Cyclomatic Complexity** - Mide la complejidad de una función basada en el número de caminos de ejecución
- **Early Return Pattern** - Patrón para reducir anidamiento mediante validaciones tempranas
- **Function Composition** - Técnica para combinar funciones simples en operaciones complejas
- **Pure Functions** - Funciones que siempre retornan el mismo resultado para las mismas entradas