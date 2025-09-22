# Tema 2: Nombrado

> *"There are only two hard things in Computer Science: cache invalidation and naming things."* - Phil Karlton

## 2.1 Reglas básicas de estilo, tamaños, espacios y comentarios

### Concepto clave
El nombrado es la herramienta más poderosa para hacer código autodocumentado. **Robert C. Martin** en "Clean Code" dedica un capítulo completo al nombrado, estableciendo que *"el nombre de una variable, función o clase debe responder a todas las grandes preguntas: por qué existe, qué hace y cómo se usa"*.

### Reglas fundamentales de nombrado

#### 1. **Nombres reveladores de intención**

### Ejemplo MALO ❌
```javascript
function calc(d) {
    return d * 0.1;
}

let x = getUserData();
let temp = [];
let flag = false;
```

### Ejemplo BUENO ✅
```javascript
function calculateTaxAmount(grossIncome) {
    const TAX_RATE = 0.1;
    return grossIncome * TAX_RATE;
}

let currentUser = getUserData();
let validatedEmails = [];
let isEmailVerified = false;
```

#### 2. **Evitar desinformación**

### Ejemplo MALO ❌
```javascript
let accountList = new Set(); // No es una lista, es un Set
let hp = "hypotenuse"; // hp puede confundirse con hit points
let theList = []; // Muy genérico, no dice qué contiene
```

### Ejemplo BUENO ✅
```javascript
let activeAccounts = new Set();
let hypotenuse = "hypotenuse";
let gameBoard = []; // O mejor: gameBoardCells
```

#### 3. **Hacer distinciones significativas**

### Ejemplo MALO ❌
```javascript
function getUserInfo() { ... }
function getUserData() { ... }
function getUserDetails() { ... }

let productInfo;
let productData;
```

### Ejemplo BUENO ✅
```javascript
function getUserProfile() { ... }
function getUserPreferences() { ... }
function getUserStatistics() { ... }

let productSpecifications;
let productReviews;
```

#### 4. **Usar nombres pronunciables y buscables**

### Ejemplo MALO ❌
```javascript
let yyyymmdstr = moment().format("YYYY/MM/DD");
let u = users.filter(u => u.age > 18);
let DtaRcrd102 = {
    genymdhms: moment().format("YYYY/MM/DD"),
    modymdhms: moment().format("YYYY/MM/DD"),
    pszqint: "102"
};
```

### Ejemplo BUENO ✅
```javascript
let currentDateString = moment().format("YYYY/MM/DD");
let adultUsers = users.filter(user => user.age > MINIMUM_AGE);

let customer = {
    generationTimestamp: moment().format("YYYY/MM/DD"),
    modificationTimestamp: moment().format("YYYY/MM/DD"),
    recordId: "102"
};
```

#### 5. **Convenciones de nomenclatura**

### JavaScript/TypeScript - Convenciones estándar
```javascript
// Variables y funciones: camelCase
let userName = "john_doe";
let isAuthenticated = true;
function calculateTotal() { ... }

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "https://api.example.com";

// Clases: PascalCase
class UserService { ... }
class EmailValidator { ... }

// Archivos: kebab-case
// user-service.js
// email-validator.js

// Variables privadas: underscore prefix
class UserService {
    constructor() {
        this._privateProperty = "private";
        this.publicProperty = "public";
    }
}
```

### Longitud apropiada según el alcance

### Ejemplo de alcances diferentes
```javascript
// Ámbito muy local: nombres cortos están bien
users.map(u => u.name);
for (let i = 0; i < items.length; i++) { ... }

// Ámbito de función: nombres descriptivos
function processUserRegistration(userData) {
    const validationResult = validateUserData(userData);
    const hashedPassword = hashPassword(userData.password);
    // ...
}

// Ámbito global/módulo: nombres muy descriptivos
const DATABASE_CONNECTION_TIMEOUT_MS = 5000;
class DatabaseConnectionManager { ... }
```

## 2.2 Uso de sustantivos para representar el modelo

### Concepto clave
Los **sustantivos** representan entidades, datos, estados y objetos en nuestro dominio. Deben ser **específicos** y **descriptivos** del concepto que modelan.

### Patrones para sustantivos

#### 1. **Entidades de dominio**

### Ejemplo MALO ❌
```javascript
let data = {
    name: "John",
    stuff: ["item1", "item2"],
    info: { ... }
};

class Manager {
    process() { ... }
    handle() { ... }
}
```

### Ejemplo BUENO ✅
```javascript
let customer = {
    fullName: "John Doe",
    purchaseHistory: ["laptop", "mouse"],
    shippingAddress: { ... }
};

class OrderManager {
    processPayment() { ... }
    handleShipping() { ... }
}

// Mejor aún, ser más específico:
class PaymentProcessor {
    processPayment() { ... }
}

class ShippingCoordinator {
    handleShipping() { ... }
}
```

#### 2. **Colecciones y estructuras de datos**

### Ejemplo MALO ❌
```javascript
let stuff = [];
let things = new Map();
let items = new Set();
```

### Ejemplo BUENO ✅
```javascript
let activeUsers = [];
let userPreferencesMap = new Map();
let uniqueEmailAddresses = new Set();

// Para arrays, usar plural descriptivo
let completedOrders = [];
let pendingInvoices = [];
let availableProducts = [];
```

#### 3. **Estados y configuraciones**

### Ejemplo MALO ❌
```javascript
let config = {
    val1: 100,
    val2: "prod",
    flag: true
};

let state = {
    current: "active",
    data: { ... }
};
```

### Ejemplo BUENO ✅
```javascript
let applicationConfig = {
    maxConnections: 100,
    environment: "production",
    enableLogging: true
};

let userInterfaceState = {
    currentView: "dashboard",
    userData: { ... }
};
```

## 2.3 Uso de verbos para indicar procesos

### Concepto clave
Los **verbos** representan acciones, procesos y comportamientos. Las funciones deben tener nombres que claramente indiquen **qué acción realizan**.

### Patrones para verbos

#### 1. **Verbos de acción específicos**

### Ejemplo MALO ❌
```javascript
function handleUser(user) { ... } // ¿Qué hace con el usuario?
function processData(data) { ... } // ¿Cómo procesa los datos?
function manageOrder(order) { ... } // ¿Qué gestiona exactamente?
```

### Ejemplo BUENO ✅
```javascript
function validateUser(user) { ... }
function transformDataToJson(data) { ... }
function cancelOrder(order) { ... }

// Incluso mejor: ser más específico
function validateUserEmail(user) { ... }
function transformUserDataToProfileJson(userData) { ... }
function cancelOrderAndRefund(order) { ... }
```

#### 2. **Convenciones de verbos comunes**

```javascript
// CREAR/CONSTRUIR
function createUser(userData) { ... }
function buildSearchQuery(filters) { ... }
function generateReport(data) { ... }

// OBTENER/RECUPERAR
function getUser(id) { ... }
function fetchUserProfile(userId) { ... }
function retrieveOrderHistory(customerId) { ... }

// MODIFICAR/ACTUALIZAR
function updateUserProfile(userId, newData) { ... }
function modifyOrderStatus(orderId, status) { ... }
function setUserPreferences(userId, preferences) { ... }

// ELIMINAR/LIMPIAR
function deleteUser(userId) { ... }
function removeExpiredSessions() { ... }
function clearCache() { ... }

// VALIDAR/VERIFICAR
function validateEmail(email) { ... }
function verifyUserCredentials(username, password) { ... }
function checkInventoryAvailability(productId) { ... }

// CONVERTIR/TRANSFORMAR
function convertToUpperCase(text) { ... }
function transformToViewModel(data) { ... }
function parseJsonToObject(jsonString) { ... }
```

#### 3. **Funciones de consulta (query) vs comando**

### Principio Command-Query Separation (CQS)
**Bertrand Meyer** introdujo el principio CQS: *"Una función debe ser o bien un comando que realiza una acción, o bien una consulta que devuelve datos, pero no ambas"*.

```javascript
// CONSULTAS (queries) - Devuelven información, no modifican estado
function isUserActive(userId) { ... }          // Boolean
function getUserCount() { ... }                // Number
function findUsersByAge(minAge) { ... }        // Array
function hasPermission(user, action) { ... }   // Boolean

// COMANDOS - Modifican estado, no devuelven información relevante
function activateUser(userId) { ... }          // void o boolean de éxito
function addUser(userData) { ... }             // void o id del nuevo usuario
function sendEmail(recipient, message) { ... } // void o boolean de éxito

// MALO: Mezcla consulta y comando
function getUserAndMarkAsViewed(userId) { ... } // Hace dos cosas

// BUENO: Separar responsabilidades
function getUser(userId) { ... }
function markUserAsViewed(userId) { ... }
```

#### 4. **Funciones predicado (boolean)**

```javascript
// Usar is/has/can/should para funciones que devuelven boolean
function isValidEmail(email) { ... }
function hasPermission(user, action) { ... }
function canUserEdit(user, document) { ... }
function shouldRefreshCache() { ... }

// Ejemplos específicos
function isUserLoggedIn(userId) { ... }
function hasExpiredSubscription(user) { ... }
function canProcessPayment(order) { ... }
function shouldSendReminder(user) { ... }
```

---

## Referencias y lecturas recomendadas

📚 **Libros fundamentales:**
- **"Clean Code"** - Robert C. Martin - Capítulo 2: "Meaningful Names"
- **"Code Complete"** - Steve McConnell - Capítulo 11: "The Power of Variable Names"
- **"The Art of Readable Code"** - Dustin Boswell & Trevor Foucher

🔗 **Recursos online:**
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) - Convenciones de nombrado
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) - Estándares de la industria
- [MDN JavaScript Naming Conventions](https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines/JavaScript#naming_conventions)

💡 **Herramientas útiles:**
- **ESLint** - Para enforcar convenciones de nombrado
- **Prettier** - Para formateo consistente
- **Better Comments** (VS Code) - Para mejorar comentarios