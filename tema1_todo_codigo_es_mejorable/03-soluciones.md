# Soluciones - Tema 1: Todo código es mejorable

## Solución Ejercicio 1.1: Mejorar legibilidad

### Código original:
```javascript
function p(d, r, t) {
    let a = d;
    for (let i = 0; i < t; i++) {
        a = a + (a * r);
    }
    return a;
}
```

### Solución refactorizada:
```javascript
/**
 * Calcula el interés compuesto de una inversión
 * @param {number} principal - Cantidad inicial invertida
 * @param {number} interestRate - Tasa de interés anual (como decimal, ej: 0.05 = 5%)
 * @param {number} years - Número de años de la inversión
 * @returns {number} El monto final después del interés compuesto
 */
function calculateCompoundInterest(principal, interestRate, years) {
    if (principal <= 0) {
        throw new Error('El principal debe ser mayor que cero');
    }
    if (interestRate < 0) {
        throw new Error('La tasa de interés no puede ser negativa');
    }
    if (years <= 0 || !Number.isInteger(years)) {
        throw new Error('Los años deben ser un número entero positivo');
    }

    let finalAmount = principal;
    
    for (let year = 0; year < years; year++) {
        finalAmount = finalAmount + (finalAmount * interestRate);
    }
    
    return Math.round(finalAmount * 100) / 100; // Redondear a 2 decimales
}

// Alternativa usando la fórmula matemática directa:
function calculateCompoundInterestFormula(principal, interestRate, years) {
    validateInputs(principal, interestRate, years);
    return Math.round(principal * Math.pow(1 + interestRate, years) * 100) / 100;
}

function validateInputs(principal, interestRate, years) {
    if (principal <= 0) throw new Error('El principal debe ser mayor que cero');
    if (interestRate < 0) throw new Error('La tasa de interés no puede ser negativa');
    if (years <= 0 || !Number.isInteger(years)) throw new Error('Los años deben ser un número entero positivo');
}

// Uso con constantes claras
const INITIAL_INVESTMENT = 1000;
const ANNUAL_INTEREST_RATE = 0.05; // 5%
const INVESTMENT_PERIOD_YEARS = 3;

const finalAmount = calculateCompoundInterest(
    INITIAL_INVESTMENT, 
    ANNUAL_INTEREST_RATE, 
    INVESTMENT_PERIOD_YEARS
);

console.log(`Inversión final: $${finalAmount}`);
```

---

## Solución Ejercicio 1.2: Identificar deuda técnica

### Problemas identificados:

#### 1. **Inconsistencia en cálculos**
- `addItem()` actualiza `this.total` directamente
- `getTotal()` recalcula desde cero, ignorando `this.total`
- `removeItem()` intenta revertir descuentos de forma incorrecta

#### 2. **Lógica de negocio duplicada**
```javascript
// En addItem():
if (item.category == 'electronics' && item.price > 500) {
    this.total = this.total * 0.9;
}

// En removeItem() (incorrectamente):
if (item.category == 'electronics' && item.price > 500) {
    this.total = this.total / 0.9;
}
```

#### 3. **Números mágicos**
- `0.9` (descuento del 10%)
- `500` (umbral de precio)

#### 4. **Problemas de tipo**
- `==` en lugar de `===`
- Falta validación de parámetros

#### 5. **Code smells**
- TODOs y HACKs en producción
- Comentarios confusos
- Método `removeItem()` puede fallar con índices inválidos

### Código refactorizado:

```javascript
class ShoppingCart {
    static ELECTRONICS_DISCOUNT_RATE = 0.1;
    static ELECTRONICS_DISCOUNT_THRESHOLD = 500;

    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.validateItem(item);
        this.items.push({ ...item }); // Crear copia para evitar mutaciones
    }

    removeItem(index) {
        if (index < 0 || index >= this.items.length) {
            throw new Error('Índice inválido');
        }
        this.items.splice(index, 1);
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + this.calculateItemTotal(item);
        }, 0);
    }

    calculateItemTotal(item) {
        const baseTotal = item.price * item.qty;
        return this.applyDiscounts(item, baseTotal);
    }

    applyDiscounts(item, baseTotal) {
        if (this.qualifiesForElectronicsDiscount(item)) {
            return baseTotal * (1 - ShoppingCart.ELECTRONICS_DISCOUNT_RATE);
        }
        return baseTotal;
    }

    qualifiesForElectronicsDiscount(item) {
        return item.category === 'electronics' && 
               item.price > ShoppingCart.ELECTRONICS_DISCOUNT_THRESHOLD;
    }

    validateItem(item) {
        if (!item || typeof item !== 'object') {
            throw new Error('Item inválido');
        }
        if (!item.price || item.price <= 0) {
            throw new Error('El precio debe ser mayor que cero');
        }
        if (!item.qty || item.qty <= 0) {
            throw new Error('La cantidad debe ser mayor que cero');
        }
    }
}
```

---

## Solución Ejercicio 1.3: Refactoring paso a paso

### Código refactorizado:

```javascript
class ReportGenerator {
    constructor() {
        this.PREMIUM_MULTIPLIER = 1.1;
    }

    generateReport(salesData) {
        const processedData = this.processData(salesData);
        const summary = this.calculateSummary(processedData);
        return this.generateHTML(processedData, summary);
    }

    processData(data) {
        return data.map(product => ({
            ...product,
            sales: product.units,
            revenue: this.calculateRevenue(product)
        }));
    }

    calculateRevenue(product) {
        const baseRevenue = product.units * product.price;
        return this.isPremiumProduct(product) 
            ? baseRevenue * this.PREMIUM_MULTIPLIER 
            : baseRevenue;
    }

    isPremiumProduct(product) {
        return product.category === 'premium';
    }

    calculateSummary(processedData) {
        return processedData.reduce(
            (summary, product) => ({
                totalSales: summary.totalSales + product.sales,
                totalRevenue: summary.totalRevenue + product.revenue
            }),
            { totalSales: 0, totalRevenue: 0 }
        );
    }

    generateHTML(data, summary) {
        return `
            ${this.generateHeader()}
            ${this.generateTable(data)}
            ${this.generateSummary(summary)}
            ${this.generateFooter()}
        `;
    }

    generateHeader() {
        return `
            <html>
                <head><title>Report</title></head>
                <body>
                    <h1>Sales Report</h1>
        `;
    }

    generateTable(data) {
        const tableHeader = `
            <table border="1">
                <tr>
                    <th>Product</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                </tr>
        `;

        const tableRows = data.map(product => 
            this.generateTableRow(product)
        ).join('');

        return `${tableHeader}${tableRows}</table>`;
    }

    generateTableRow(product) {
        return `
            <tr>
                <td>${this.escapeHtml(product.name)}</td>
                <td>${product.sales}</td>
                <td>$${product.revenue.toFixed(2)}</td>
            </tr>
        `;
    }

    generateSummary(summary) {
        return `
            <h3>Summary</h3>
            <p>Total Sales: ${summary.totalSales}</p>
            <p>Total Revenue: $${summary.totalRevenue.toFixed(2)}</p>
        `;
    }

    generateFooter() {
        return '</body></html>';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Uso alternativo con template engine (conceptual)
class ModernReportGenerator {
    generateReport(salesData) {
        const processedData = this.processData(salesData);
        const summary = this.calculateSummary(processedData);
        
        // En un entorno real, usarías un template engine como Handlebars, EJS, etc.
        return this.renderTemplate('sales-report', {
            data: processedData,
            summary: summary
        });
    }

    // ... resto de métodos similares
}
```

---

## Solución Ejercicio 1.4: Análisis de evolución

### Problemas de evolución identificados:

1. **Función monolítica**: Todas las validaciones en una sola función
2. **Responsabilidades mezcladas**: Validación técnica y de negocio juntas
3. **Números mágicos**: `18`, `8`
4. **Configuración hardcodeada**: Lista de países restringidos
5. **TODOs acumulados**: Deuda técnica no resuelta

### Código refactorizado:

```javascript
// Configuración centralizada
const ValidationConfig = {
    MIN_AGE: 18,
    MIN_PASSWORD_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    RESTRICTED_COUNTRIES: ['XX', 'YY']
};

// Validadores específicos
class UserValidators {
    static validateBasicRequired(user) {
        if (!user) {
            throw new ValidationError('Usuario requerido');
        }
        if (!user.email || !user.password) {
            throw new ValidationError('Email y contraseña son requeridos');
        }
    }

    static validateAge(user) {
        if (user.age !== undefined && user.age < ValidationConfig.MIN_AGE) {
            throw new ValidationError(`Debe ser mayor de ${ValidationConfig.MIN_AGE} años`);
        }
    }

    static validateEmail(email) {
        if (!ValidationConfig.EMAIL_REGEX.test(email)) {
            throw new ValidationError('Formato de email inválido');
        }
    }

    static validatePassword(password) {
        if (password.length < ValidationConfig.MIN_PASSWORD_LENGTH) {
            throw new ValidationError(`La contraseña debe tener al menos ${ValidationConfig.MIN_PASSWORD_LENGTH} caracteres`);
        }
        
        // Aquí se pueden añadir más validaciones de fuerza
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            throw new ValidationError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
        }
    }

    static validateGDPRConsent(user) {
        if (!user.gdprConsent) {
            throw new ValidationError('Debe aceptar los términos de privacidad');
        }
    }

    static validateCountryRestrictions(user) {
        if (user.country && ValidationConfig.RESTRICTED_COUNTRIES.includes(user.country)) {
            throw new ValidationError('Registro no disponible en su país');
        }
    }
}

// Clase de error personalizada
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Validador principal
class UserValidator {
    static validate(user) {
        const errors = [];

        try {
            UserValidators.validateBasicRequired(user);
            UserValidators.validateAge(user);
            UserValidators.validateEmail(user.email);
            UserValidators.validatePassword(user.password);
            UserValidators.validateGDPRConsent(user);
            UserValidators.validateCountryRestrictions(user);
            
            return { isValid: true, errors: [] };
        } catch (error) {
            if (error instanceof ValidationError) {
                errors.push(error.message);
            } else {
                throw error; // Re-lanzar errores inesperados
            }
        }

        return { isValid: false, errors };
    }

    static validateAsync(user) {
        // Para futuras validaciones asíncronas (email único, etc.)
        return Promise.resolve(this.validate(user));
    }
}

// Uso mejorado
function registerUser(userData) {
    const validationResult = UserValidator.validate(userData);
    
    if (!validationResult.isValid) {
        console.error('Errores de validación:', validationResult.errors);
        return false;
    }
    
    // Proceder con el registro
    return true;
}
```

### Beneficios de la refactorización:

- ✅ **Separación de responsabilidades**: Cada validador tiene una función específica
- ✅ **Configuración centralizada**: Fácil modificar valores sin tocar código
- ✅ **Extensibilidad**: Añadir nuevos validadores es sencillo
- ✅ **Testabilidad**: Cada validador se puede testear independientemente
- ✅ **Manejo de errores**: Sistema consistente de errores
- ✅ **Mantenibilidad**: Cambios futuros son más simples y seguros