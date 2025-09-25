# Tema 6: Artesanía de software

> *"Software craftsmanship is about professionalism in software development. It's about being responsible for your work, and taking pride in what you produce."* - Sandro Mancuso

## 6.1 Hacer las cosas bien

### Concepto clave
La artesanía de software (Software Craftsmanship) es un enfoque que eleva la programación de ser simplemente una actividad técnica a ser una disciplina profesional con estándares de calidad, ética y mejora continua.

Un **artesano del software** no solo hace que el código funcione, sino que se esfuerza por hacerlo **bien**. Esto significa crear software que no solo cumple los requisitos, sino que es mantenible, legible, testeable y evolucionable.

### Los cuatro valores del Manifesto de Artesanía de Software:
1. **No solo individuos que interactúan, sino también una comunidad de profesionales**
2. **No solo software que funciona, sino también software bien diseñado**
3. **No solo colaboración con el cliente, sino también asociaciones productivas**
4. **No solo responder al cambio, sino también agregar valor constantemente**

### Principios fundamentales

#### 1. Responsabilidad profesional
Un artesano del software asume la responsabilidad completa de su trabajo:

```javascript
// Ejemplo MALO ❌ - "Funciona, no preguntes cómo"
function processPayment(amount, cardNumber) {
    // TODO: add validation later
    let result = cardNumber.substring(0, 4) + '****';
    if (amount > 0) {
        // Magic happens here
        return { success: true, card: result };
    }
    return { success: false };
}
```

```javascript
// Ejemplo BUENO ✅ - Código responsable y profesional
class PaymentProcessor {
    constructor(paymentGateway, validator, logger) {
        this.paymentGateway = paymentGateway;
        this.validator = validator;
        this.logger = logger;
    }

    async processPayment(paymentRequest) {
        try {
            this.validatePaymentRequest(paymentRequest);
            
            const processedPayment = await this.paymentGateway.charge(paymentRequest);
            
            this.logger.logSuccessfulPayment(processedPayment.id, paymentRequest.amount);
            
            return {
                success: true,
                transactionId: processedPayment.id,
                maskedCardNumber: this.maskCardNumber(paymentRequest.cardNumber)
            };
        } catch (error) {
            this.logger.logFailedPayment(error, paymentRequest.amount);
            throw new PaymentProcessingError('Payment failed', error);
        }
    }

    validatePaymentRequest(request) {
        if (!this.validator.isValidAmount(request.amount)) {
            throw new InvalidPaymentError('Invalid payment amount');
        }
        
        if (!this.validator.isValidCard(request.cardNumber)) {
            throw new InvalidPaymentError('Invalid card number');
        }
    }

    maskCardNumber(cardNumber) {
        const visibleDigits = 4;
        const maskedSection = '*'.repeat(cardNumber.length - visibleDigits);
        return cardNumber.substring(0, visibleDigits) + maskedSection;
    }
}
```

#### 2. Mejora continua
Un artesano nunca deja de aprender y mejorar:

```javascript
// Ejemplo de evolución del código a través de la mejora continua

// Versión 1: Funcional pero básica
function calculateTax(price) {
    return price * 0.21;
}

// Versión 2: Más flexible
function calculateTax(price, taxRate = 0.21) {
    return price * taxRate;
}

// Versión 3: Manejo de casos especiales
function calculateTax(price, taxRate = 0.21) {
    if (price <= 0) {
        throw new Error('Price must be positive');
    }
    return Math.round(price * taxRate * 100) / 100; // Redondeo a 2 decimales
}

// Versión 4: Clase completa con múltiples tipos de impuestos
class TaxCalculator {
    constructor() {
        this.taxRates = {
            standard: 0.21,
            reduced: 0.10,
            superReduced: 0.04,
            exempt: 0.00
        };
    }

    calculate(price, taxType = 'standard') {
        this.validatePrice(price);
        this.validateTaxType(taxType);
        
        const taxRate = this.taxRates[taxType];
        const taxAmount = price * taxRate;
        
        return this.roundToTwoDecimals(taxAmount);
    }

    validatePrice(price) {
        if (typeof price !== 'number' || price <= 0) {
            throw new TaxCalculationError('Price must be a positive number');
        }
    }

    validateTaxType(taxType) {
        if (!this.taxRates.hasOwnProperty(taxType)) {
            throw new TaxCalculationError(`Unknown tax type: ${taxType}`);
        }
    }

    roundToTwoDecimals(amount) {
        return Math.round(amount * 100) / 100;
    }
}
```

#### 3. Mentoría y enseñanza
Un artesano comparte conocimiento y ayuda a otros a crecer:

```javascript
// Ejemplo de código que enseña a través de su estructura

/**
 * Factory pattern implementation for creating different types of loggers.
 * This demonstrates how to use the Factory pattern to create objects
 * without exposing the instantiation logic.
 * 
 * @example
 * const logger = LoggerFactory.create('console', { level: 'debug' });
 * logger.info('Application started');
 */
class LoggerFactory {
    static create(type, options = {}) {
        const loggerTypes = {
            console: () => new ConsoleLogger(options),
            file: () => new FileLogger(options),
            database: () => new DatabaseLogger(options)
        };

        const createLogger = loggerTypes[type];
        if (!createLogger) {
            throw new Error(`Logger type '${type}' is not supported`);
        }

        return createLogger();
    }

    /**
     * Gets all available logger types.
     * Useful for documentation and testing.
     */
    static getAvailableTypes() {
        return ['console', 'file', 'database'];
    }
}

// Cada implementación sigue el mismo patrón,
// facilitando el aprendizaje y mantenimiento
class ConsoleLogger {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.prefix = options.prefix || '[LOG]';
    }

    info(message) {
        if (this.shouldLog('info')) {
            console.log(`${this.prefix} INFO: ${message}`);
        }
    }

    debug(message) {
        if (this.shouldLog('debug')) {
            console.log(`${this.prefix} DEBUG: ${message}`);
        }
    }

    shouldLog(messageLevel) {
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        return levels[messageLevel] <= levels[this.level];
    }
}
```

## 6.2 La importancia de las pruebas

### Concepto clave
Las pruebas no son solo una verificación de que el código funciona; son la **red de seguridad** que permite refactorizar con confianza, documentan el comportamiento esperado del sistema y facilitan el diseño de código más limpio.

**Kent Beck**, creador de TDD (Test-Driven Development), establece que las pruebas deben seguir el ciclo **Red-Green-Refactor**:
1. **Red**: Escribe una prueba que falle
2. **Green**: Escribe el mínimo código necesario para que pase
3. **Refactor**: Mejora el código manteniendo las pruebas en verde

### Tipos de pruebas

#### 1. Pruebas Unitarias
Prueban una unidad individual de código (función, método, clase):

```javascript
// Código a probar
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    addItem(product, quantity = 1) {
        if (!product || !product.id) {
            throw new Error('Product is required and must have an id');
        }
        
        if (quantity <= 0) {
            throw new Error('Quantity must be positive');
        }

        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
}

// Pruebas unitarias
describe('ShoppingCart', () => {
    let cart;

    beforeEach(() => {
        cart = new ShoppingCart();
    });

    describe('addItem', () => {
        it('should add a new item to the cart', () => {
            const product = { id: 1, name: 'Laptop', price: 999.99 };
            
            cart.addItem(product, 2);
            
            expect(cart.getItemCount()).toBe(2);
            expect(cart.getTotalPrice()).toBe(1999.98);
        });

        it('should increase quantity if product already exists', () => {
            const product = { id: 1, name: 'Laptop', price: 999.99 };
            
            cart.addItem(product, 1);
            cart.addItem(product, 1);
            
            expect(cart.items).toHaveLength(1);
            expect(cart.getItemCount()).toBe(2);
        });

        it('should throw error for invalid product', () => {
            expect(() => cart.addItem(null)).toThrow('Product is required and must have an id');
            expect(() => cart.addItem({})).toThrow('Product is required and must have an id');
        });

        it('should throw error for invalid quantity', () => {
            const product = { id: 1, name: 'Laptop', price: 999.99 };
            
            expect(() => cart.addItem(product, 0)).toThrow('Quantity must be positive');
            expect(() => cart.addItem(product, -1)).toThrow('Quantity must be positive');
        });
    });

    describe('getTotalPrice', () => {
        it('should return 0 for empty cart', () => {
            expect(cart.getTotalPrice()).toBe(0);
        });

        it('should calculate total for multiple items', () => {
            const laptop = { id: 1, name: 'Laptop', price: 1000 };
            const mouse = { id: 2, name: 'Mouse', price: 25 };
            
            cart.addItem(laptop, 1);
            cart.addItem(mouse, 2);
            
            expect(cart.getTotalPrice()).toBe(1050);
        });
    });
});
```

#### 2. Pruebas de Integración
Prueban cómo diferentes partes del sistema trabajan juntas:

```javascript
// Ejemplo de prueba de integración
describe('User Registration Integration', () => {
    let userService;
    let emailService;
    let database;

    beforeEach(async () => {
        // Configurar dependencias reales (o mocks integrados)
        database = new TestDatabase();
        emailService = new MockEmailService();
        userService = new UserService(database, emailService);
        
        await database.clear();
    });

    it('should register user and send welcome email', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'securePassword123',
            name: 'John Doe'
        };

        const result = await userService.registerUser(userData);

        // Verificar que el usuario se guardó en la base de datos
        const savedUser = await database.findUserByEmail(userData.email);
        expect(savedUser).toBeDefined();
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.isActive).toBe(false); // Pending email verification

        // Verificar que se envió el email de bienvenida
        expect(emailService.getSentEmails()).toHaveLength(1);
        const sentEmail = emailService.getSentEmails()[0];
        expect(sentEmail.to).toBe(userData.email);
        expect(sentEmail.subject).toBe('Welcome to our platform!');

        // Verificar el resultado del servicio
        expect(result.success).toBe(true);
        expect(result.userId).toBe(savedUser.id);
    });

    it('should not send email if database operation fails', async () => {
        const userData = {
            email: 'duplicate@example.com',
            password: 'password123',
            name: 'Jane Doe'
        };

        // Crear usuario duplicado para forzar error
        await database.createUser(userData);

        await expect(userService.registerUser(userData))
            .rejects.toThrow('User already exists');

        // Verificar que no se envió email
        expect(emailService.getSentEmails()).toHaveLength(0);
    });
});
```

#### 3. Test-Driven Development (TDD)
Ejemplo de desarrollo guiado por pruebas:

```javascript
// Paso 1: RED - Escribir la prueba que falla
describe('PasswordValidator', () => {
    it('should reject passwords shorter than 8 characters', () => {
        const validator = new PasswordValidator();
        
        expect(validator.isValid('short')).toBe(false);
        expect(validator.getErrors()).toContain('Password must be at least 8 characters long');
    });
});

// Paso 2: GREEN - Implementar el mínimo código para que pase
class PasswordValidator {
    isValid(password) {
        this.errors = [];
        
        if (password.length < 8) {
            this.errors.push('Password must be at least 8 characters long');
        }
        
        return this.errors.length === 0;
    }
    
    getErrors() {
        return this.errors || [];
    }
}

// Paso 3: RED - Añadir más pruebas
describe('PasswordValidator', () => {
    // ... prueba anterior ...
    
    it('should require at least one uppercase letter', () => {
        const validator = new PasswordValidator();
        
        expect(validator.isValid('lowercase123')).toBe(false);
        expect(validator.getErrors()).toContain('Password must contain at least one uppercase letter');
    });
    
    it('should require at least one number', () => {
        const validator = new PasswordValidator();
        
        expect(validator.isValid('NoNumbers')).toBe(false);
        expect(validator.getErrors()).toContain('Password must contain at least one number');
    });
    
    it('should accept valid passwords', () => {
        const validator = new PasswordValidator();
        
        expect(validator.isValid('ValidPass123')).toBe(true);
        expect(validator.getErrors()).toHaveLength(0);
    });
});

// Paso 4: GREEN - Implementar funcionalidad completa
class PasswordValidator {
    isValid(password) {
        this.errors = [];
        
        this.validateLength(password);
        this.validateUppercase(password);
        this.validateNumber(password);
        
        return this.errors.length === 0;
    }
    
    validateLength(password) {
        if (password.length < 8) {
            this.errors.push('Password must be at least 8 characters long');
        }
    }
    
    validateUppercase(password) {
        if (!/[A-Z]/.test(password)) {
            this.errors.push('Password must contain at least one uppercase letter');
        }
    }
    
    validateNumber(password) {
        if (!/[0-9]/.test(password)) {
            this.errors.push('Password must contain at least one number');
        }
    }
    
    getErrors() {
        return this.errors || [];
    }
}

// Paso 5: REFACTOR - Mejorar el código manteniendo las pruebas
class PasswordValidator {
    constructor() {
        this.rules = [
            {
                test: password => password.length >= 8,
                message: 'Password must be at least 8 characters long'
            },
            {
                test: password => /[A-Z]/.test(password),
                message: 'Password must contain at least one uppercase letter'
            },
            {
                test: password => /[0-9]/.test(password),
                message: 'Password must contain at least one number'
            }
        ];
    }
    
    isValid(password) {
        this.errors = [];
        
        this.rules.forEach(rule => {
            if (!rule.test(password)) {
                this.errors.push(rule.message);
            }
        });
        
        return this.errors.length === 0;
    }
    
    getErrors() {
        return this.errors || [];
    }
}
```

### Beneficios de las pruebas bien escritas

#### 1. Confianza para refactorizar
```javascript
// Con pruebas, puedes cambiar la implementación sin miedo
class OrderCalculator {
    // Implementación original
    calculateTotal(items) {
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            total += items[i].price * items[i].quantity;
        }
        return total;
    }
}

// Refactorizada con confianza (las pruebas siguen pasando)
class OrderCalculator {
    calculateTotal(items) {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}
```

#### 2. Documentación viva
```javascript
// Las pruebas documentan el comportamiento esperado
describe('DateUtils.formatDate', () => {
    it('should format ISO dates to DD/MM/YYYY', () => {
        expect(DateUtils.formatDate('2023-12-25')).toBe('25/12/2023');
    });
    
    it('should handle null dates', () => {
        expect(DateUtils.formatDate(null)).toBe('');
    });
    
    it('should handle invalid dates', () => {
        expect(() => DateUtils.formatDate('invalid')).toThrow('Invalid date format');
    });
});
```

#### 3. Diseño mejorado
Las pruebas fuerzan un mejor diseño:

```javascript
// Código difícil de probar (mal diseño)
class UserService {
    registerUser(userData) {
        // Dependencias hardcodeadas
        const db = new DatabaseConnection('prod-server');
        const email = new EmailSender('smtp.gmail.com');
        
        // Lógica mezclada
        if (userData.email.includes('@')) {
            const user = db.save(userData);
            email.send(userData.email, 'Welcome!');
            console.log('User registered:', user.id);
            return user;
        }
        throw new Error('Invalid email');
    }
}

// Código fácil de probar (buen diseño)
class UserService {
    constructor(database, emailService, logger) {
        this.database = database;
        this.emailService = emailService;
        this.logger = logger;
    }
    
    async registerUser(userData) {
        this.validateUserData(userData);
        
        const user = await this.database.save(userData);
        await this.emailService.sendWelcomeEmail(user.email);
        
        this.logger.info('User registered:', user.id);
        
        return user;
    }
    
    validateUserData(userData) {
        if (!userData.email || !userData.email.includes('@')) {
            throw new UserValidationError('Invalid email address');
        }
    }
}
```

---

## Referencias y lecturas recomendadas

📚 **Libros fundamentales:**
- **"The Software Craftsman"** - Sandro Mancuso
- **"Clean Coder"** - Robert C. Martin (Uncle Bob)
- **"Test Driven Development: By Example"** - Kent Beck
- **"Working Effectively with Legacy Code"** - Michael Feathers
- **"Refactoring: Improving the Design of Existing Code"** - Martin Fowler

🔗 **Recursos online:**
- [Software Craftsmanship Manifesto](http://manifesto.softwarecraftsmanship.org/)
- [Test-Driven Development](https://www.agilealliance.org/glossary/tdd/) - Agile Alliance
- [London School of TDD vs Chicago School](https://medium.com/@adrianbooth/test-driven-development-wars-detroit-vs-london-classicist-vs-mockist-9956c78ae95f)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)