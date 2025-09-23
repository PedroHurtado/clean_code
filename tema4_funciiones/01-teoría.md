# 📚 Tema 4: Funciones - Teoría
## 4.1. Nombrado y Argumentos

### ¿Por qué son importantes las funciones?

Las funciones son los **bloques de construcción fundamentales** de cualquier aplicación. Una función bien diseñada:
- **Comunica su propósito** claramente
- **Encapsula una responsabilidad** específica
- **Es fácil de testear** y mantener
- **Reduce la duplicación** de código

> 📚 **Referencia**: Martin, R. C. (2009). *Clean Code: A Handbook of Agile Software Craftsmanship*. Capítulo 3: Functions.

---

### 🎯 Nombrado de Funciones

#### Principios básicos

**1. Usa verbos que expresen acción**
```javascript
// ❌ Malo - No está claro qué hace
function user(data) { ... }
function email(recipient) { ... }

// ✅ Bueno - Acción clara
function createUser(userData) { ... }
function sendEmail(recipient) { ... }
```

**2. Sé específico sobre lo que hace**
```javascript
// ❌ Malo - Demasiado genérico
function process(data) { ... }
function handle(input) { ... }

// ✅ Bueno - Específico y claro
function validateUserEmail(email) { ... }
function calculateMonthlyPayment(principal, rate, months) { ... }
```

**3. Evita abreviaciones innecesarias**
```javascript
// ❌ Malo - Abreviaciones confusas
function calcTotAmt(items) { ... }
function procUsrData(usr) { ... }

// ✅ Bueno - Nombres completos y claros
function calculateTotalAmount(items) { ... }
function processUserData(user) { ... }
```

#### Patrones de nombrado comunes

**Funciones de validación**
```javascript
function isValidEmail(email) { ... }
function hasPermission(user, action) { ... }
function canAccessResource(user, resource) { ... }
```

**Funciones de transformación**
```javascript
function formatCurrency(amount) { ... }
function parseUserInput(input) { ... }
function normalizePhoneNumber(phone) { ... }
```

**Funciones de consulta**
```javascript
function getUserById(id) { ... }
function findActiveUsers() { ... }
function countCompletedTasks(tasks) { ... }
```

---

### 🔧 Argumentos de Funciones

#### Número de argumentos

**Regla de oro: Menos es más**

```javascript
// ❌ Malo - Demasiados argumentos
function createUser(name, email, age, address, phone, country, city, postalCode) {
    // Es difícil recordar el orden y propósito de cada argumento
}

// ✅ Mejor - Objeto de configuración
function createUser(userConfig) {
    const { name, email, age, address, phone, country, city, postalCode } = userConfig;
    // Más legible y mantenible
}

// ✅ Aún mejor - Objeto con propiedades obligatorias separadas
function createUser(name, email, additionalData = {}) {
    // Los argumentos esenciales están explícitos
    // Los opcionales están agrupados
}
```

#### Orden de argumentos

**Principios para ordenar argumentos:**

1. **Argumentos obligatorios primero**
2. **Argumentos opcionales al final**
3. **Argumentos más importantes primero**

```javascript
// ✅ Bueno - Orden lógico
function sendNotification(userId, message, options = {}) {
    // userId y message son obligatorios
    // options es opcional
}

// ❌ Malo - Orden confuso
function sendNotification(options, userId, message) {
    // El argumento opcional va primero, esto es confuso
}
```

#### Valores por defecto

**Usa valores por defecto para argumentos opcionales**

```javascript
// ❌ Malo - Validaciones manuales
function createConnection(host, port, timeout) {
    host = host || 'localhost';
    port = port || 3000;
    timeout = timeout || 5000;
    // ...
}

// ✅ Bueno - Valores por defecto
function createConnection(host = 'localhost', port = 3000, timeout = 5000) {
    // Más claro y conciso
}
```

#### Destructuring en argumentos

**Para objetos con múltiples propiedades**

```javascript
// ❌ Menos claro
function updateUserProfile(user) {
    console.log(`Updating ${user.name} (${user.email})`);
    // user.name, user.email se repite mucho
}

// ✅ Más claro con destructuring
function updateUserProfile({ name, email, age = null }) {
    console.log(`Updating ${name} (${email})`);
    // Las propiedades están explícitas en la firma
}
```

---

### 🚨 Señales de Alerta

#### Nombres problemáticos
- Funciones que terminan en "Manager", "Handler", "Helper"
- Nombres genéricos como "process", "handle", "do"
- Abreviaciones poco claras
- Nombres que no son verbos

#### Argumentos problemáticos
- Más de 3-4 argumentos posicionales
- Argumentos booleanos (flags)
- Argumentos opcionales en el medio
- Orden no intuitivo

---

### 💡 Ejemplo de Refactoring

**Antes:**
```javascript
function calc(a, b, c, d, flag) {
    if (flag) {
        return (a + b) * c - d;
    }
    return (a - b) * c + d;
}
```

**Después:**
```javascript
function calculateDiscountedPrice({ originalPrice, discount, taxRate, shippingCost }) {
    const discountedPrice = originalPrice * (1 - discount);
    const withTax = discountedPrice * (1 + taxRate);
    return withTax + shippingCost;
}

function calculatePenalizedPrice({ originalPrice, penalty, taxRate, shippingCost }) {
    const penalizedPrice = originalPrice * (1 + penalty);
    const withTax = penalizedPrice * (1 + taxRate);
    return withTax + shippingCost;
}
```

---

### 📋 Checklist para Funciones

Antes de considerar una función "terminada", pregúntate:

- [ ] **¿El nombre explica claramente qué hace la función?**
- [ ] **¿Puedo entender los argumentos sin mirar la implementación?**
- [ ] **¿Tiene menos de 4 argumentos posicionales?**
- [ ] **¿Los argumentos están en un orden lógico?**
- [ ] **¿Usa valores por defecto apropiados?**
- [ ] **¿Evita flags booleanos que cambien el comportamiento?**

---

### 📖 Referencias y Lecturas Recomendadas

**Libros fundamentales:**
- **Clean Code** - Robert C. Martin (Capítulo 3: Functions) 📖
- **The Pragmatic Programmer** - Hunt & Thomas 📖
- **Code Complete** - Steve McConnell (Capítulo 7: High-Quality Routines) 📖

**Artículos y guías online:**
- [JavaScript Function Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) - MDN Web Docs 🌐
- [Function Parameters in JavaScript](https://javascript.info/function-expressions) - JavaScript.info 🌐
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript#functions) - GitHub Guide 🌐
- [Airbnb JavaScript Style Guide - Functions](https://github.com/airbnb/javascript#functions) 🌐

**Videos y recursos:**
- [Clean Code - Uncle Bob / Lesson 3: Functions](https://www.youtube.com/watch?v=QjVCuSwNUMo) 📺
- [JavaScript Functions Best Practices](https://www.youtube.com/watch?v=C1PZh_ea-7I) 📺

**Herramientas útiles:**
- [ESLint Rules para funciones](https://eslint.org/docs/rules/#possible-problems) 🔧
- [SonarJS Quality Rules](https://rules.sonarsource.com/javascript) 🔧
- [JSHint Documentation](https://jshint.com/docs/) 🔧

---

*"El nombre de una función debe contar una historia completa sobre lo que hace, sin sorpresas."* - Robert C. Martin