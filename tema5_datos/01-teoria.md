# Tema 5: Datos

> *"Data dominates. If you've chosen the right data structures and organized things well, the algorithms will almost always be self-evident."* - Rob Pike

## 5.1 Obsesión con los primitivos

### Concepto clave
La **obsesión con los primitivos** (Primitive Obsession) es un code smell que ocurre cuando usamos tipos de datos primitivos (string, number, boolean) para representar conceptos del dominio que merecen su propia abstracción.

Este anti-patrón fue identificado por **Martin Fowler** en "Refactoring" como uno de los code smells más comunes. Sucede cuando representamos conceptos complejos del negocio usando únicamente tipos primitivos, perdiendo expresividad y seguridad de tipos.

### Problemas de usar solo primitivos:
- **Pérdida de expresividad**: El código no comunica la intención
- **Falta de validación**: No hay garantías sobre la validez de los datos
- **Duplicación de lógica**: Las validaciones se repiten en múltiples lugares
- **Errores de tipo**: Es fácil intercambiar parámetros del mismo tipo primitivo
- **Dificulta el mantenimiento**: Cambios requieren modificar múltiples lugares

### Ejemplo MALO ❌
```javascript
// Usando solo primitivos
function createUser(email, phone, age, country) {
    // Validaciones dispersas por el código
    if (!email || !email.includes('@')) {
        throw new Error('Email inválido');
    }
    if (!phone || phone.length < 10) {
        throw new Error('Teléfono inválido');
    }
    if (age < 0 || age > 150) {
        throw new Error('Edad inválida');
    }
    
    return {
        email: email,
        phone: phone,
        age: age,
        country: country
    };
}

function sendWelcomeEmail(email, phone, age, country) {
    // ¿Cuál es el orden correcto de los parámetros?
    // Las validaciones se repiten aquí...
    if (!email || !email.includes('@')) {
        throw new Error('Email inválido');
    }
    
    console.log(`Welcome ${email}!`);
}

// Uso propenso a errores
const user = createUser('john@email.com', '+1234567890', 25, 'US');
// ¡Error! Intercambio de parámetros
sendWelcomeEmail('+1234567890', 'john@email.com', 25, 'US');
```

### Ejemplo BUENO ✅
```javascript
// Creando Value Objects
class Email {
    constructor(value) {
        this.validateEmail(value);
        this._value = value;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error(`Email inválido: ${email}`);
        }
    }

    get value() {
        return this._value;
    }

    getDomain() {
        return this._value.split('@')[1];
    }

    equals(otherEmail) {
        return this._value === otherEmail._value;
    }

    toString() {
        return this._value;
    }
}

class PhoneNumber {
    constructor(value) {
        this.validatePhone(value);
        this._value = this.normalize(value);
    }

    validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            throw new Error(`Teléfono inválido: ${phone}`);
        }
    }

    normalize(phone) {
        // Normalizar formato del teléfono
        return phone.replace(/\D/g, '');
    }

    get value() {
        return this._value;
    }

    getFormattedValue() {
        // Formatear para mostrar
        const phone = this._value;
        return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
    }

    equals(otherPhone) {
        return this._value === otherPhone._value;
    }
}

class Age {
    constructor(value) {
        this.validateAge(value);
        this._value = value;
    }

    validateAge(age) {
        if (!Number.isInteger(age) || age < 0 || age > 150) {
            throw new Error(`Edad inválida: ${age}`);
        }
    }

    get value() {
        return this._value;
    }

    isMinor() {
        return this._value < 18;
    }

    isAdult() {
        return this._value >= 18;
    }

    isSenior() {
        return this._value >= 65;
    }

    equals(otherAge) {
        return this._value === otherAge._value;
    }
}

class Country {
    constructor(code) {
        this.validateCountryCode(code);
        this._code = code.toUpperCase();
    }

    validateCountryCode(code) {
        if (!code || code.length !== 2) {
            throw new Error(`Código de país inválido: ${code}`);
        }
    }

    get code() {
        return this._code;
    }

    getName() {
        const countryNames = {
            'US': 'United States',
            'ES': 'Spain',
            'FR': 'France',
            'DE': 'Germany'
        };
        return countryNames[this._code] || 'Unknown Country';
    }

    equals(otherCountry) {
        return this._code === otherCountry._code;
    }
}

// Uso con Value Objects
function createUser(email, phone, age, country) {
    // Los Value Objects ya validan automáticamente
    return {
        email: new Email(email),
        phone: new PhoneNumber(phone),
        age: new Age(age),
        country: new Country(country)
    };
}

function sendWelcomeEmail(user) {
    // Imposible confundir parámetros
    // Acceso claro a propiedades específicas
    console.log(`Welcome ${user.email.value}!`);
    console.log(`You're from ${user.country.getName()}`);
    
    if (user.age.isMinor()) {
        console.log('Parental consent required');
    }
}

// Uso seguro y expresivo
const user = createUser('john@email.com', '+1234567890', 25, 'US');
sendWelcomeEmail(user);

// Las validaciones están centralizadas y son automáticas
console.log(user.email.getDomain()); // email.com
console.log(user.phone.getFormattedValue()); // 123-456-7890
```

### Cuándo crear Value Objects:
- **Datos con validaciones específicas**: Email, teléfono, código postal
- **Conceptos del dominio**: Dinero, coordenadas, direcciones
- **Valores con comportamiento**: Fechas con cálculos, rangos numéricos
- **Identificadores**: IDs de usuario, códigos de producto

## 5.2 Estructuras y complejidad

### Concepto clave
La forma en que organizamos los datos afecta directamente la complejidad del código. Una buena estructura de datos puede simplificar los algoritmos y hacer el código más mantenible.

**"Bad programmers worry about the code. Good programmers worry about data structures and their relationships."** - Linus Torvalds

### Principios para estructurar datos:

#### 1. **Cohesión de datos relacionados**
Agrupa datos que pertenecen juntos conceptualmente.

```javascript
// MALO ❌: Datos relacionados dispersos
let userName = 'John Doe';
let userEmail = 'john@email.com';
let userAge = 25;
let userCountry = 'US';
let userStreet = '123 Main St';
let userCity = 'New York';
let userPostalCode = '10001';

function formatUserAddress(street, city, postalCode, country) {
    return `${street}, ${city} ${postalCode}, ${country}`;
}

// BUENO ✅: Datos cohesivos agrupados
class Address {
    constructor(street, city, postalCode, country) {
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
    }

    format() {
        return `${this.street}, ${this.city} ${this.postalCode}, ${this.country}`;
    }

    isInCountry(countryCode) {
        return this.country === countryCode;
    }
}

class User {
    constructor(name, email, age, address) {
        this.name = name;
        this.email = new Email(email);
        this.age = new Age(age);
        this.address = address;
    }

    getFormattedAddress() {
        return this.address.format();
    }
}
```

#### 2. **Jerarquías claras**
Organiza los datos en jerarquías que reflejen las relaciones del dominio.

```javascript
// MALO ❌: Estructura plana y confusa
const orderData = {
    orderId: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@email.com',
    productName1: 'Laptop',
    productPrice1: 999.99,
    productQuantity1: 1,
    productName2: 'Mouse',
    productPrice2: 29.99,
    productQuantity2: 2,
    shippingStreet: '123 Main St',
    shippingCity: 'New York',
    paymentMethod: 'credit_card',
    paymentCardNumber: '****1234'
};

// BUENO ✅: Estructura jerárquica clara
class Order {
    constructor(orderId, customer, items, shipping, payment) {
        this.orderId = orderId;
        this.customer = customer;
        this.items = items;
        this.shipping = shipping;
        this.payment = payment;
        this.createdAt = new Date();
    }

    getTotalAmount() {
        return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    isShippingRequired() {
        return this.items.some(item => item.product.requiresShipping);
    }
}

class Customer {
    constructor(name, email) {
        this.name = name;
        this.email = new Email(email);
    }
}

class OrderItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    getSubtotal() {
        return this.product.price * this.quantity;
    }
}

class Product {
    constructor(name, price, requiresShipping = true) {
        this.name = name;
        this.price = price;
        this.requiresShipping = requiresShipping;
    }
}
```

#### 3. **Inmutabilidad cuando sea posible**
Los datos inmutables son más fáciles de entender y debuggear.

```javascript
// MALO ❌: Mutación directa
class BankAccount {
    constructor(balance) {
        this.balance = balance;
    }

    withdraw(amount) {
        this.balance -= amount; // Mutación directa
        return this.balance;
    }
}

// BUENO ✅: Operaciones inmutables con validaciones
class BankAccount {
    constructor(balance) {
        this.validateBalance(balance);
        this._balance = balance;
        this._transactions = [];
    }

    get balance() {
        return this._balance;
    }

    withdraw(amount) {
        this.validateWithdrawal(amount);
        
        const newBalance = this._balance - amount;
        const transaction = new Transaction('WITHDRAWAL', amount, new Date());
        
        return new BankAccount(newBalance)
            .withTransaction(transaction)
            .withTransactionHistory([...this._transactions, transaction]);
    }

    deposit(amount) {
        this.validateDeposit(amount);
        
        const newBalance = this._balance + amount;
        const transaction = new Transaction('DEPOSIT', amount, new Date());
        
        return new BankAccount(newBalance)
            .withTransaction(transaction)
            .withTransactionHistory([...this._transactions, transaction]);
    }

    validateBalance(balance) {
        if (balance < 0) {
            throw new Error('Balance cannot be negative');
        }
    }

    validateWithdrawal(amount) {
        if (amount <= 0) {
            throw new Error('Withdrawal amount must be positive');
        }
        if (amount > this._balance) {
            throw new Error('Insufficient funds');
        }
    }

    validateDeposit(amount) {
        if (amount <= 0) {
            throw new Error('Deposit amount must be positive');
        }
    }

    withTransaction(transaction) {
        const newAccount = Object.create(BankAccount.prototype);
        Object.assign(newAccount, this);
        newAccount._lastTransaction = transaction;
        return newAccount;
    }

    withTransactionHistory(transactions) {
        const newAccount = Object.create(BankAccount.prototype);
        Object.assign(newAccount, this);
        newAccount._transactions = transactions;
        return newAccount;
    }
}

class Transaction {
    constructor(type, amount, date) {
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.id = this.generateId();
    }

    generateId() {
        return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
```

## 5.3 Introducción a SOLID

### Concepto clave
**SOLID** son cinco principios de diseño orientado a objetos introducidos por **Robert C. Martin (Uncle Bob)**. Estos principios ayudan a crear código más mantenible, extensible y comprensible.

### S - Single Responsibility Principle (SRP)
*"Una clase debería tener solo una razón para cambiar"*

```javascript
// MALO ❌: Múltiples responsabilidades
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    // Responsabilidad 1: Validación
    validateEmail() {
        return this.email.includes('@');
    }

    // Responsabilidad 2: Persistencia
    save() {
        // Guardar en base de datos
        localStorage.setItem('user', JSON.stringify(this));
    }

    // Responsabilidad 3: Notificaciones
    sendWelcomeEmail() {
        console.log(`Sending welcome email to ${this.email}`);
    }

    // Responsabilidad 4: Formateo
    getDisplayName() {
        return this.name.toUpperCase();
    }
}

// BUENO ✅: Responsabilidades separadas
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    getName() {
        return this.name;
    }

    getEmail() {
        return this.email;
    }
}

class UserValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateUser(user) {
        return user.name && this.validateEmail(user.email);
    }
}

class UserRepository {
    save(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    findById(id) {
        const userData = localStorage.getItem(`user_${id}`);
        return userData ? JSON.parse(userData) : null;
    }
}

class EmailService {
    sendWelcomeEmail(user) {
        console.log(`Sending welcome email to ${user.getEmail()}`);
    }
}

class UserFormatter {
    static getDisplayName(user) {
        return user.getName().toUpperCase();
    }

    static getFullInfo(user) {
        return `${user.getName()} <${user.getEmail()}>`;
    }
}
```

### O - Open/Closed Principle (OCP)
*"Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación"*

```javascript
// MALO ❌: Modificar código existente para agregar funcionalidad
class DiscountCalculator {
    calculateDiscount(customer, amount) {
        if (customer.type === 'regular') {
            return amount * 0.05; // 5%
        } else if (customer.type === 'premium') {
            return amount * 0.10; // 10%
        } else if (customer.type === 'vip') { // Nueva funcionalidad requiere modificar
            return amount * 0.20; // 20%
        }
        return 0;
    }
}

// BUENO ✅: Extensible sin modificar código existente
class DiscountStrategy {
    calculateDiscount(amount) {
        throw new Error('Must implement calculateDiscount method');
    }
}

class RegularCustomerDiscount extends DiscountStrategy {
    calculateDiscount(amount) {
        return amount * 0.05; // 5%
    }
}

class PremiumCustomerDiscount extends DiscountStrategy {
    calculateDiscount(amount) {
        return amount * 0.10; // 10%
    }
}

class VIPCustomerDiscount extends DiscountStrategy {
    calculateDiscount(amount) {
        return amount * 0.20; // 20%
    }
}

// Nueva estrategia sin modificar código existente
class StudentDiscount extends DiscountStrategy {
    calculateDiscount(amount) {
        return amount * 0.15; // 15%
    }
}

class DiscountCalculator {
    constructor() {
        this.strategies = new Map();
        this.registerStrategy('regular', new RegularCustomerDiscount());
        this.registerStrategy('premium', new PremiumCustomerDiscount());
        this.registerStrategy('vip', new VIPCustomerDiscount());
        this.registerStrategy('student', new StudentDiscount());
    }

    registerStrategy(type, strategy) {
        this.strategies.set(type, strategy);
    }

    calculateDiscount(customer, amount) {
        const strategy = this.strategies.get(customer.type);
        return strategy ? strategy.calculateDiscount(amount) : 0;
    }
}
```

### L - Liskov Substitution Principle (LSP)
*"Los objetos de una superclase deben ser reemplazables por objetos de sus subclases sin alterar el correcto funcionamiento del programa"*

```javascript
// MALO ❌: Viola LSP
class Bird {
    fly() {
        console.log('Flying...');
    }
}

class Eagle extends Bird {
    fly() {
        console.log('Eagle soaring high...');
    }
}

class Penguin extends Bird {
    fly() {
        throw new Error('Penguins cannot fly!'); // Viola LSP
    }
}

// BUENO ✅: Respeta LSP
class Bird {
    move() {
        console.log('Moving...');
    }
}

class FlyingBird extends Bird {
    fly() {
        console.log('Flying...');
    }

    move() {
        this.fly();
    }
}

class SwimmingBird extends Bird {
    swim() {
        console.log('Swimming...');
    }

    move() {
        this.swim();
    }
}

class Eagle extends FlyingBird {
    fly() {
        console.log('Eagle soaring high...');
    }
}

class Penguin extends SwimmingBird {
    swim() {
        console.log('Penguin swimming gracefully...');
    }
}

function makeBirdMove(bird) {
    bird.move(); // Funciona con cualquier tipo de ave
}
```

### I - Interface Segregation Principle (ISP)
*"Los clientes no deberían ser forzados a depender de interfaces que no usan"*

```javascript
// MALO ❌: Interfaz demasiado amplia
class Printer {
    print(document) {
        throw new Error('Must implement print method');
    }

    scan(document) {
        throw new Error('Must implement scan method');
    }

    fax(document) {
        throw new Error('Must implement fax method');
    }
}

class SimplePrinter extends Printer {
    print(document) {
        console.log(`Printing: ${document}`);
    }

    scan(document) {
        throw new Error('This printer cannot scan'); // Forzado a implementar
    }

    fax(document) {
        throw new Error('This printer cannot fax'); // Forzado a implementar
    }
}

// BUENO ✅: Interfaces segregadas
class Printable {
    print(document) {
        throw new Error('Must implement print method');
    }
}

class Scannable {
    scan(document) {
        throw new Error('Must implement scan method');
    }
}

class Faxable {
    fax(document) {
        throw new Error('Must implement fax method');
    }
}

class SimplePrinter extends Printable {
    print(document) {
        console.log(`Printing: ${document}`);
    }
}

class MultiFunctionPrinter {
    constructor() {
        this.printer = new BasicPrinter();
        this.scanner = new BasicScanner();
        this.faxMachine = new BasicFax();
    }

    print(document) {
        return this.printer.print(document);
    }

    scan(document) {
        return this.scanner.scan(document);
    }

    fax(document) {
        return this.faxMachine.fax(document);
    }
}

class BasicPrinter extends Printable {
    print(document) {
        console.log(`Basic printing: ${document}`);
    }
}

class BasicScanner extends Scannable {
    scan(document) {
        console.log(`Basic scanning: ${document}`);
        return `scanned_${document}`;
    }
}

class BasicFax extends Faxable {
    fax(document) {
        console.log(`Basic faxing: ${document}`);
    }
}
```

### D - Dependency Inversion Principle (DIP)
*"Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones"*

```javascript
// MALO ❌: Dependencias concretas
class EmailService {
    sendEmail(to, subject, body) {
        console.log(`Sending email to ${to}: ${subject}`);
        // Implementación específica de email
    }
}

class UserService {
    constructor() {
        this.emailService = new EmailService(); // Dependencia concreta
    }

    registerUser(userData) {
        const user = new User(userData.name, userData.email);
        // Lógica de registro...
        
        this.emailService.sendEmail(
            user.email, 
            'Welcome!', 
            'Thank you for registering'
        );
        return user;
    }
}

// BUENO ✅: Dependencia de abstracciones
class NotificationService {
    send(to, subject, message) {
        throw new Error('Must implement send method');
    }
}

class EmailNotificationService extends NotificationService {
    send(to, subject, message) {
        console.log(`📧 Email to ${to}: ${subject}`);
        // Implementación específica de email
    }
}

class SMSNotificationService extends NotificationService {
    send(to, subject, message) {
        console.log(`📱 SMS to ${to}: ${message}`);
        // Implementación específica de SMS
    }
}

class PushNotificationService extends NotificationService {
    send(to, subject, message) {
        console.log(`🔔 Push to ${to}: ${subject}`);
        // Implementación específica de push
    }
}

class UserService {
    constructor(notificationService) {
        this.notificationService = notificationService; // Dependencia de abstracción
    }

    registerUser(userData) {
        const user = new User(userData.name, userData.email);
        // Lógica de registro...
        
        this.notificationService.send(
            user.email,
            'Welcome!',
            'Thank you for registering'
        );
        
        return user;
    }
}

// Uso flexible
const emailService = new EmailNotificationService();
const smsService = new SMSNotificationService();
const pushService = new PushNotificationService();

const userServiceWithEmail = new UserService(emailService);
const userServiceWithSMS = new UserService(smsService);
const userServiceWithPush = new UserService(pushService);
```

---

## Referencias y lecturas recomendadas

📚 **Libros fundamentales:**
- **"Refactoring: Improving the Design of Existing Code"** - Martin Fowler
- **"Clean Code: A Handbook of Agile Software Craftsmanship"** - Robert C. Martin
- **"Agile Software Development, Principles, Patterns, and Practices"** - Robert C. Martin
- **"Domain-Driven Design: Tackling Complexity in the Heart of Software"** - Eric Evans

🔗 **Recursos online:**
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID) - Wikipedia
- [Value Objects](https://martinfowler.com/bliki/ValueObject.html) - Martin Fowler
- [Primitive Obsession](https://refactoring.guru/smells/primitive-obsession) - Refactoring Guru
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript) - Ejemplos prácticos