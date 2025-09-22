# Ejercicios - Tema 1: Todo código es mejorable

## Ejercicio 1.1: Mejorar legibilidad

Refactoriza el siguiente código para hacerlo más legible:

```javascript
function p(d, r, t) {
    let a = d;
    for (let i = 0; i < t; i++) {
        a = a + (a * r);
    }
    return a;
}

const result = p(1000, 0.05, 3);
console.log(result);
```

**Instrucciones:**
- Dale nombres significativos a la función y variables
- Añade comentarios donde sea necesario
- Considera usar constantes para valores mágicos
- Piensa en validaciones que podrían ser útiles

---

## Ejercicio 1.2: Identificar deuda técnica

Analiza el siguiente código e identifica todos los problemas que encuentres:

```javascript
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
    }

    addItem(item) {
        this.items.push(item);
        this.total += item.price * item.qty;
        
        // TODO: aplicar descuentos aquí
        if (item.category == 'electronics' && item.price > 500) {
            this.total = this.total * 0.9;
        }
        
        // HACK: fix para el bug #456 
        if (this.total < 0) this.total = 0;
    }

    removeItem(index) {
        let item = this.items[index];
        this.items.splice(index, 1);
        this.total -= item.price * item.qty;
        
        // Aplicar descuento al reves?? 
        if (item.category == 'electronics' && item.price > 500) {
            this.total = this.total / 0.9;
        }
    }

    getTotal() {
        // Recalcular por si acaso
        let t = 0;
        for (let i = 0; i < this.items.length; i++) {
            t += this.items[i].price * this.items[i].qty;
        }
        return t;
    }
}
```

**Tareas:**
1. Lista todos los code smells que encuentres
2. Identifica inconsistencias en el código
3. Señala problemas de mantenibilidad
4. Propón mejoras específicas

---

## Ejercicio 1.3: Refactoring paso a paso

Refactoriza el siguiente código aplicando el proceso incremental:

```javascript
function generateReport(data) {
    let html = '<html><head><title>Report</title></head><body>';
    html += '<h1>Sales Report</h1>';
    html += '<table border="1">';
    html += '<tr><th>Product</th><th>Sales</th><th>Revenue</th></tr>';
    
    let totalSales = 0;
    let totalRevenue = 0;
    
    for (let i = 0; i < data.length; i++) {
        let product = data[i];
        let sales = product.units;
        let revenue = product.units * product.price;
        
        if (product.category === 'premium') {
            revenue = revenue * 1.1; // 10% premium
        }
        
        totalSales += sales;
        totalRevenue += revenue;
        
        html += '<tr>';
        html += '<td>' + product.name + '</td>';
        html += '<td>' + sales + '</td>';
        html += '<td>$' + revenue.toFixed(2) + '</td>';
        html += '</tr>';
    }
    
    html += '</table>';
    html += '<h3>Summary</h3>';
    html += '<p>Total Sales: ' + totalSales + '</p>';
    html += '<p>Total Revenue: $' + totalRevenue.toFixed(2) + '</p>';
    html += '</body></html>';
    
    return html;
}
```

**Instrucciones:**
1. Identifica las diferentes responsabilidades dentro de la función
2. Extrae funciones más pequeñas paso a paso
3. Mejora los nombres de variables y funciones
4. Considera usar template literals o un template engine
5. Separa la lógica de negocio de la presentación

---

## Ejercicio 1.4: Análisis de evolución de código

Imagina que el siguiente código ha ido evolucionando durante 6 meses:

```javascript
// Versión inicial
function validateUser(user) {
    return user && user.email && user.password;
}

// Después de 2 meses
function validateUser(user) {
    if (!user) return false;
    if (!user.email || !user.password) return false;
    
    // Añadido por requerimiento de marketing
    if (user.age && user.age < 18) return false;
    
    return true;
}

// Después de 4 meses  
function validateUser(user) {
    if (!user) return false;
    if (!user.email || !user.password) return false;
    
    // Añadido por requerimiento de marketing
    if (user.age && user.age < 18) return false;
    
    // Validación de email mejorada (ticket #123)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) return false;
    
    // TODO: validar password strength
    
    return true;
}

// Estado actual (6 meses)
function validateUser(user) {
    if (!user) return false;
    if (!user.email || !user.password) return false;
    
    // Añadido por requerimiento de marketing
    if (user.age && user.age < 18) return false;
    
    // Validación de email mejorada (ticket #123)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) return false;
    
    // Password strength añadida urgentemente
    if (user.password.length < 8) return false;
    
    // GDPR compliance - verificar consentimiento
    if (!user.gdprConsent) return false;
    
    // Validación de país para términos legales
    const restrictedCountries = ['XX', 'YY']; // TODO: mover a config
    if (user.country && restrictedCountries.includes(user.country)) {
        return false;
    }
    
    return true;
}
```

**Tareas:**
1. Analiza cómo ha evolucionado la complejidad
2. Identifica puntos donde se podría haber refactorizado
3. Propón una versión refactorizada que mantenga toda la funcionalidad
4. Explica cómo estructurarías el código para facilitar futuros cambios