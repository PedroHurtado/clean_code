# Soluciones Completas - Tema 2: Nombrado

## Solución Ejercicio 2.1: Mejorar nombres reveladores de intención

### Código original vs. mejorado:

```javascript
// ANTES - Variables problemáticas
let d = new Date();
let u = [];
let temp = 0;
let flag = false;
let data = {};
let list = [];
let info = null;
let result = "";

// DESPUÉS - Variables con intención clara
let currentDate = new Date();
let registeredUsers = [];
let totalPrice = 0;
let isEmailVerified = false;
let userProfile = {};
let availableProducts = [];
let shippingInformation = null;
let validationMessage = "";
```

```javascript
// ANTES - Funciones problemáticas
function calc(x, y) {
    return x * y * 0.15;
}

// DESPUÉS - Función con propósito claro
function calculateSalesTax(basePrice, quantity) {
    const SALES_TAX_RATE = 0.15;
    return basePrice * quantity * SALES_TAX_RATE;
}
```

```javascript
// ANTES
function process(input) {
    return input.filter(i => i.status === 'active');
}

// DESPUÉS
function getActiveUsers(users) {
    return users.filter(user => user.status === 'active');
}
```

```javascript
// ANTES
function handle(req, res) {
    const data = getData();
    res.send(data);
}

// DESPUÉS
function getUserProfile(request, response) {
    const userProfile = fetchUserProfileData();
    response.send(userProfile);
}
```

```javascript
// ANTES - Clase problemática
class Manager {
    constructor() {
        this.stuff = [];
        this.config = {};
    }

    do(item) {
        this.stuff.push(item);
    }

    get() {
        return this.stuff;
    }
}

// DESPUÉS - Clase con propósito específico
class OrderManager {
    constructor() {
        this.pendingOrders = [];
        this.processingConfiguration = {};
    }

    addOrder(order) {
        this.pendingOrders.push(order);
    }

    getPendingOrders() {
        return this.pendingOrders;
    }
}
```

---

## Solución Ejercicio 2.2: Aplicar convenciones de nomenclatura

### Código corregido:

```javascript
// DESPUÉS - Siguiendo convenciones JavaScript
const MAX_USERS = 100;                    // Constante: UPPER_SNAKE_CASE
const API_URL = "https://api.example.com"; // Constante: UPPER_SNAKE_CASE
let username = "john";                    // Variable: camelCase
let userCount = 0;                        // Variable: camelCase
let isActive = true;                      // Variable booleana: camelCase con 'is'

class UserService {                       // Clase: PascalCase
    constructor() {
        this.users = [];                  // Propiedad: camelCase
        this.currentUser = null;          // Propiedad: camelCase
    }

    getUser(id) {                        // Método: camelCase con verbo
        return this.users.find(user => user.id === id);
    }

    addUser(userData) {                  // Método: camelCase con verbo
        this.users.push(userData);
    }
}

function calculateTax(income) {          // Función: camelCase con verbo
    const TAX_RATE = 0.2;               // Constante local: UPPER_SNAKE_CASE
    return income * TAX_RATE;
}

// Nombres de archivos sugeridos:
// user-service.js        (kebab-case para archivos)
// process-user-data.js   (función como módulo)
// user-email-list.js     (descriptivo del contenido)
```

### Convenciones aplicadas:
- **Constantes**: `UPPER_SNAKE_CASE` para valores inmutables
- **Variables y métodos**: `camelCase` para elementos mutables
- **Clases**: `PascalCase` para constructores
- **Archivos**: `kebab-case` para nombres de archivo

---

## Solución Ejercicio 2.3: Distinguir entre sustantivos y verbos

### Análisis y corrección:

```javascript
// ANTES - Mezcla confusa
let validate = {};
let process = [];
let email = function(to, subject) { ... };
let user = function() { ... };
let calculate = "result";

// DESPUÉS - Sustantivos y verbos apropiados
let validationRules = {};               // Sustantivo: datos de validación
let activeProcesses = [];               // Sustantivo: lista de procesos
function sendEmail(to, subject) { ... } // Verbo: acción de enviar
function getCurrentUser() { ... }       // Verbo: acción de obtener
let calculationResult = "result";       // Sustantivo: resultado de cálculo
```

```javascript
// ANTES
function data() {
    return { name: "John", age: 30 };
}

function information(userId) {
    return users.find(u => u.id === userId);
}

// DESPUÉS
function getUserData() {                 // Verbo claro: obtener datos
    return { name: "John", age: 30 };
}

function getUserInformation(userId) {    // Verbo claro: obtener información
    return users.find(user => user.id === userId);
}
```

```javascript
// ANTES
class Process {
    validate() { ... }
    email() { ... }
}

// DESPUÉS
class DataProcessor {                    // Sustantivo: procesador de datos
    validateInput() { ... }             // Verbo específico
    sendNotificationEmail() { ... }     // Verbo específico
}
```

```javascript
// ANTES - Variables que suenan como funciones
let getUserById = userData;
let sendEmail = emailData;
let validateForm = formState;

// DESPUÉS - Sustantivos apropiados
let userDataById = userData;            // O mejor: cachedUserData
let emailConfiguration = emailData;     // O: emailSettings
let formValidationState = formState;    // O: formErrors
```

---

## Solución Ejercicio 2.4: Evitar desinformación y ambigüedad

### Problemas identificados y soluciones:

```javascript
// ANTES - Desinformación de tipos
let accountList = new Set();
let accounts = "john,mary,peter";
let userArray = new Map();

// DESPUÉS - Nombres honestos sobre el tipo
let uniqueAccountIds = new Set();           // Clarifica que es Set
let accountNamesString = "john,mary,peter"; // Clarifica que es string
let userDataMap = new Map();                // Clarifica que es Map
```

```javascript
// ANTES - Funciones mentirosas
function getUserList() {
    return new Set([...users]);
}

function saveUser(user) {
    validateUser(user);
    database.save(user);
    emailService.sendWelcomeEmail(user);
}

// DESPUÉS - Funciones honestas
function getUniqueUsers() {                 // Honesto sobre retornar Set
    return new Set([...users]);
}

// Separar responsabilidades
function registerNewUser(user) {            // Nombre que refleja todo lo que hace
    validateUser(user);
    database.save(user);
    emailService.sendWelcomeEmail(user);
}

// O mejor aún, separar en funciones individuales:
function validateUser(user) { ... }
function saveUser(user) { ... }
function sendWelcomeEmail(user) { ... }
```

```javascript
// ANTES - Abreviaciones ambiguas
let hp = 150;
let mp = 50;

// DESPUÉS - Nombres específicos según contexto
// Para un juego:
let playerHealthPoints = 150;
let playerMagicPoints = 50;

// Para un automóvil:
let engineHorsepower = 150;
let milesPerGallon = 50;
```

```javascript
// ANTES - Nombres muy similares
let userAccountData;
let userAccountDetails;
let userAccountInfo;
let userAccountInformation;

// DESPUÉS - Distinciones claras
let userAccountCredentials;    // Login info
let userAccountPreferences;    // Settings
let userAccountBalance;        // Financial data
let userAccountHistory;        // Transaction log
```

---

## Solución Ejercicio 2.5: Aplicar Command-Query Separation

### Código refactorizado con CQS:

```javascript
class UserService {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.activityLog = [];
    }

    // QUERIES - Solo devuelven información, sin efectos secundarios
    getUser(userId) {
        return this.users.find(user => user.id === userId);
    }

    getUserCount() {
        return this.users.length;
    }

    getAllUsers() {
        return [...this.users]; // Retorna copia para evitar mutación externa
    }

    isValidUserData(userData) {
        return userData.email && userData.password;
    }

    hasPermission(userId, action) {
        const user = this.getUser(userId);
        return user && user.permissions.includes(action);
    }

    // COMMANDS - Solo realizan acciones, no retornan información de negocio
    markUserAsViewed(userId) {
        const user = this.getUser(userId);
        if (user) {
            user.lastViewed = new Date();
            user.viewCount = (user.viewCount || 0) + 1;
        }
    }

    addUser(userData) {
        this.users.push(userData);
    }

    removeUser(userId) {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
    }

    saveUser(userData) {
        if (this.isValidUserData(userData)) {
            this.addUser(userData);
        } else {
            throw new Error('Invalid user data');
        }
    }

    logUserAction(userId, action) {
        this.activityLog.push({
            userId,
            action,
            timestamp: new Date()
        });
    }
}

// Uso refactorizado con CQS
const userService = new UserService();

// Separación clara entre consultas y comandos
const user = userService.getUser(123);        // Query: solo obtiene
userService.markUserAsViewed(123);            // Command: solo modifica

userService.addUser(newUser);                 // Command: solo añade
const count = userService.getUserCount();     // Query: solo consulta

userService.removeUser(456);                  // Command: solo elimina
const remaining = userService.getAllUsers();  // Query: solo obtiene

// Validación separada de guardado
if (userService.isValidUserData(userData)) {  // Query: solo valida
    userService.saveUser(userData);           // Command: solo guarda
}

// Verificación de permisos separada del log
if (userService.hasPermission(userId, 'delete')) { // Query: solo verifica
    userService.logUserAction(userId, 'delete');   // Command: solo registra
    userService.removeUser(targetId);              // Command: solo elimina
}
```

### Beneficios de aplicar CQS:

1. **Claridad**: Es evidente qué funciones modifican el estado y cuáles no
2. **Testabilidad**: Las queries se pueden probar sin efectos secundarios
3. **Composabilidad**: Las queries se pueden combinar sin riesgo
4. **Debugging**: Más fácil rastrear cambios de estado
5. **Paralelización**: Las queries son seguras para ejecución concurrente

---

## Solución Ejercicio 2.6: Contexto y alcance de nombres

### Contexto: Sistema de E-commerce

```javascript
// ANTES - Nombres genéricos sin contexto
const MAX = 100;
const MIN = 1;

// DESPUÉS - Nombres específicos del dominio e-commerce
const MAX_ITEMS_PER_ORDER = 100;
const MIN_ORDER_QUANTITY = 1;
const MAX_CART_ITEMS = 50;
const MIN_PURCHASE_AMOUNT = 1;

// ANTES - Función con parámetros crípticos
function calc(a, b, c) {
    return (a * b) - (a * b * c);
}

// DESPUÉS - Función específica del dominio
function calculateDiscountedPrice(itemPrice, quantity, discountRate) {
    const subtotal = itemPrice * quantity;
    const discountAmount = subtotal * discountRate;
    return subtotal - discountAmount;
}

// ANTES - Clase genérica
class Service {
    constructor() {
        this.data = [];
        this.current = null;
        this.temp = {};
    }

    get(id) {
        return this.data.find(item => item.id === id);
    }

    add(item) {
        this.data.push(item);
    }

    update(id, changes) {
        const item = this.get(id);
        Object.assign(item, changes);
    }
}

// DESPUÉS - Servicio específico de e-commerce
class ShoppingCartService {
    constructor() {
        this.cartItems = [];
        this.activeCart = null;
        this.pendingCalculations = {};
    }

    getCartItem(productId) {
        return this.cartItems.find(item => item.productId === productId);
    }

    addItemToCart(cartItem) {
        this.cartItems.push(cartItem);
    }

    updateCartItem(productId, itemChanges) {
        const existingItem = this.getCartItem(productId);
        if (existingItem) {
            Object.assign(existingItem, itemChanges);
        }
    }

    calculateCartTotal() {
        return this.cartItems.reduce((total, item) => 
            total + (item.price * item.quantity), 0);
    }
}
```

### Ajuste de nombres según alcance:

```javascript
// Variables con diferentes alcances - nombres ajustados a su contexto

// Ámbito global/módulo - nombres más descriptivos
const ECOMMERCE_CONFIG = {
    maxItemsPerOrder: 100,
    defaultShippingCost: 5.99,
    freeShippingThreshold: 50.00
};

// Función con alcance amplio - nombre autodocumentado
function processCustomerOrderWithShippingCalculation(orderData) {
    // Variables locales - nombres más cortos dentro del contexto específico
    const items = orderData.items;
    const customer = orderData.customer;
    
    // Bucles anidados - nombres progresivamente más cortos
    for (const item of items) {
        for (const attr of item.attributes) {
            for (const val of attr.values) {
                // En el ámbito más interno, nombres muy cortos son aceptables
                if (val.includes('premium')) {
                    item.price *= 1.2;
                }
            }
        }
    }
    
    return calculateOrderTotal(items, customer);
}

// Funciones anidadas con contexto específico
function processProductCatalog(products) {
    
    function extractProductAttributes(product) {
        return product.specifications.map(spec => ({
            name: spec.attributeName,
            value: spec.attributeValue,
            displayOrder: spec.sortOrder
        }));
    }
    
    function calculateProductScore(product, userPreferences) {
        return userPreferences.reduce((score, pref) => {
            return score + (product.categories.includes(pref.category) ? pref.weight : 0);
        }, 0);
    }
    
    function enrichProductWithMetadata(product, attributes, score) {
        return {
            ...product,
            enrichedAttributes: attributes,
            relevanceScore: score,
            isRecommended: score > 0.7
        };
    }
    
    // Uso de las funciones anidadas
    return products.map(product => {
        const attributes = extractProductAttributes(product);
        const score = calculateProductScore(product, userPreferences);
        return enrichProductWithMetadata(product, attributes, score);
    });
}
```

### Ejemplo con diferentes contextos de dominio:

```javascript
// Contexto: Sistema Bancario
class AccountService {
    constructor() {
        this.accounts = [];
        this.transactionHistory = [];
    }

    calculateInterestEarnings(principal, annualRate, months) {
        const monthlyRate = annualRate / 12;
        return principal * Math.pow(1 + monthlyRate, months) - principal;
    }

    processWireTransfer(fromAccount, toAccount, amount) {
        this.validateSufficientFunds(fromAccount, amount);
        this.debitAccount(fromAccount, amount);
        this.creditAccount(toAccount, amount);
        this.recordTransaction('WIRE_TRANSFER', fromAccount, toAccount, amount);
    }
}

// Contexto: Sistema de Gestión de Biblioteca
class LibraryService {
    constructor() {
        this.bookCollection = [];
        this.loanRecords = [];
    }

    calculateOverdueFines(borrowDate, returnDate, bookType) {
        const loanPeriodDays = this.getLoanPeriodForBookType(bookType);
        const overdueDays = Math.max(0, returnDate - borrowDate - loanPeriodDays);
        const dailyFineRate = this.getDailyFineRate(bookType);
        return overdueDays * dailyFineRate;
    }

    processBookReturn(membershipId, bookIsbn, actualReturnDate) {
        this.validateBookLoan(membershipId, bookIsbn);
        this.updateBookAvailability(bookIsbn, 'AVAILABLE');
        this.closeLoanRecord(membershipId, bookIsbn, actualReturnDate);
        return this.calculateOverdueFines(loanDate, actualReturnDate, bookType);
    }
}
```

### Principios aplicados:

1. **Contexto específico**: Nombres que reflejan el dominio de negocio
2. **Alcance apropiado**: Nombres más largos para ámbitos amplios, más cortos para contextos específicos
3. **Autodocumentación**: Los nombres explican el propósito sin necesidad de comentarios
4. **Consistencia**: Mantener patrones de nombres dentro del mismo contexto
5. **Evolución**: Los nombres pueden refinarse según crece el entendimiento del dominio