# 💻 Tema 4: Funciones - Ejercicios Prácticos
## 4.1. Nombrado y Argumentos

---

## 📝 Ejercicio 1: Mejorar Nombres de Funciones

**Código problemático a refactorizar:**

```javascript
function calc(x, y, z) {
    return (x + y) * z;
}

function check(str) {
    return str.includes('@') && str.includes('.');
}

function do(items, flag) {
    if (flag) {
        return items.filter(item => item > 0);
    }
    return items.filter(item => item < 0);
}

function process(data) {
    return data.map(item => item.toUpperCase().trim());
}

function handle(user) {
    user.lastLogin = new Date();
    user.isActive = true;
    return user;
}
```

**📋 Tareas:**
1. Renombra cada función con un nombre descriptivo que indique claramente su propósito
2. Asegúrate de que los nombres sean verbos que expresen la acción
3. Mantén la funcionalidad exacta pero mejora la legibilidad
4. Evita abreviaciones innecesarias

---

## 📝 Ejercicio 2: Reducir Número de Argumentos

**Código problemático a refactorizar:**

```javascript
function createUser(name, email, age, country, city, street, number, phone, isActive, role) {
    return {
        name,
        email,
        age,
        address: {
            country,
            city,
            street,
            number
        },
        phone,
        isActive,
        role,
        createdAt: new Date()
    };
}

function sendNotification(userId, title, message, priority, channel, immediate, retryCount, callback) {
    // Lógica de envío de notificación
    if (callback) {
        setTimeout(callback, 1000);
    }
    
    return {
        userId,
        title,
        message,
        priority,
        channel,
        immediate,
        retryCount,
        sentAt: new Date()
    };
}

function calculateShipping(weight, dimensions, origin, destination, speed, insurance, packaging, carrier) {
    const baseCost = weight * 0.5;
    const sizeCost = dimensions.length * dimensions.width * dimensions.height * 0.001;
    const speedMultiplier = speed === 'express' ? 2 : 1;
    const insuranceCost = insurance ? baseCost * 0.1 : 0;
    
    return {
        baseCost,
        sizeCost,
        speedMultiplier,
        insuranceCost,
        total: (baseCost + sizeCost + insuranceCost) * speedMultiplier
    };
}
```

**📋 Tareas:**
1. Refactoriza cada función para reducir el número de argumentos
2. Agrupa argumentos relacionados en objetos
3. Identifica qué argumentos son obligatorios vs opcionales
4. Usa destructuring donde sea apropiado

---

## 📝 Ejercicio 3: Eliminar Flags Booleanos

**Código problemático a refactorizar:**

```javascript
function formatText(text, uppercase, removeSpaces, addPrefix, prefix) {
    let result = text;
    
    if (uppercase) {
        result = result.toUpperCase();
    }
    
    if (removeSpaces) {
        result = result.replace(/\s/g, '');
    }
    
    if (addPrefix) {
        result = prefix + result;
    }
    
    return result;
}

function calculatePrice(basePrice, includeDiscount, discount, includeTax, taxRate, includeShipping) {
    let price = basePrice;
    
    if (includeDiscount) {
        price = price * (1 - discount);
    }
    
    if (includeTax) {
        price = price * (1 + taxRate);
    }
    
    if (includeShipping) {
        price = price + 10;
    }
    
    return price;
}

function processOrder(order, validatePayment, checkInventory, sendEmail, updateAnalytics) {
    let result = { order, steps: [] };
    
    if (validatePayment) {
        result.steps.push('payment_validated');
    }
    
    if (checkInventory) {
        result.steps.push('inventory_checked');
    }
    
    if (sendEmail) {
        result.steps.push('email_sent');
    }
    
    if (updateAnalytics) {
        result.steps.push('analytics_updated');
    }
    
    return result;
}
```

**📋 Tareas:**
1. Elimina los flags booleanos creando funciones específicas
2. Usa objetos de configuración para opciones múltiples
3. Considera crear funciones separadas para comportamientos distintos
4. Mantén la funcionalidad pero mejora la claridad

---

## 📝 Ejercicio 4: Mejorar Orden de Argumentos

**Código problemático a refactorizar:**

```javascript
function searchUsers(limit = 10, offset = 0, sortBy = 'name', query, includeInactive = false) {
    // Simulación de búsqueda
    return {
        query,
        results: [`User matching "${query}"`],
        pagination: { limit, offset },
        sort: sortBy,
        includeInactive
    };
}

function transferMoney(fee = 0, currency = 'EUR', fromAccount, toAccount, amount) {
    return {
        fromAccount,
        toAccount,
        amount,
        currency,
        fee,
        transactionId: 'TXN123'
    };
}

function createReport(includeCharts = true, format = 'PDF', startDate, endDate, reportType) {
    return {
        reportType,
        startDate,
        endDate,
        format,
        includeCharts,
        generatedAt: new Date()
    };
}
```

**📋 Tareas:**
1. Reordena los argumentos poniendo los obligatorios primero
2. Agrupa argumentos opcionales en objetos de configuración
3. Asegúrate de que el orden sea lógico e intuitivo
4. Considera qué argumentos son más importantes para el usuario

---

## 📝 Ejercicio 5: Usar Destructuring

**Código problemático a refactorizar:**

```javascript
function generateReport(user) {
    const title = `Reporte para ${user.name}`;
    const subtitle = `Usuario: ${user.email} | Rol: ${user.role}`;
    const content = `Último acceso: ${user.lastLogin}`;
    
    return { title, subtitle, content };
}

function validateUserData(userData) {
    const errors = [];
    
    if (!userData.name || userData.name.length < 2) {
        errors.push('Nombre inválido');
    }
    
    if (!userData.email || !userData.email.includes('@')) {
        errors.push('Email inválido');
    }
    
    if (!userData.age || userData.age < 18) {
        errors.push('Edad inválida');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function calculateLoan(loanData) {
    const monthlyRate = loanData.annualRate / 12 / 100;
    const numPayments = loanData.years * 12;
    const principal = loanData.amount;
    
    const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return {
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(monthlyPayment * numPayments * 100) / 100,
        totalInterest: Math.round((monthlyPayment * numPayments - principal) * 100) / 100
    };
}
```

**📋 Tareas:**
1. Refactoriza usando destructuring en los parámetros de función
2. Añade valores por defecto apropiados en el destructuring
3. Asegúrate de que las propiedades necesarias estén claramente definidas
4. Considera qué propiedades son opcionales vs obligatorias

---

## 📝 Ejercicio 6: Crear Funciones desde Cero

**📋 Tareas:** Crea las siguientes funciones aplicando todo lo aprendido:

### 6.1. Función para calcular precio final de producto
- Debe incluir precio base, descuento e impuestos
- Usa parámetros apropiados y nombres descriptivos
- Maneja casos edge (precios negativos, etc.)
- Retorna objeto detallado con el desglose

### 6.2. Función para validar contraseñas
- Verifique longitud mínima, mayúsculas, minúsculas, números
- Opcionalmente caracteres especiales
- Retorne un objeto con validación y errores específicos
- Incluya nivel de seguridad (débil, medio, fuerte)

### 6.3. Función para formatear fechas para la UI
- Acepte diferentes formatos de salida ('DD/MM/YYYY', 'MM/DD/YYYY', etc.)
- Maneje diferentes tipos de entrada (Date, string, timestamp)
- Use valores por defecto sensatos
- Valide entrada y maneje errores

### 6.4. Función para enviar emails
- Use destructuring para múltiples opciones
- Separe argumentos obligatorios (to, subject, body) de opcionales
- Incluya opciones como prioridad, adjuntos, copia, etc.
- Valide entrada y retorne resultado estructurado

### 6.5. Función para procesar arrays de datos
- Permita filtros y ordenamiento
- Use objetos de configuración
- Incluya paginación (limit, offset)
- Sea flexible pero mantenga simplicidad

---

## ✅ Criterios de Evaluación

Al completar los ejercicios, verifica que cumples:

- [ ] **Nombres descriptivos**: Las funciones usan verbos que expresan claramente la acción
- [ ] **Argumentos limitados**: Máximo 3-4 argumentos posicionales
- [ ] **Orden lógico**: Argumentos obligatorios van primero
- [ ] **Valores por defecto**: Se usan apropiadamente para argumentos opcionales
- [ ] **Sin flags**: Se evitan argumentos booleanos que cambien el comportamiento
- [ ] **Destructuring**: Se usa cuando mejora la legibilidad
- [ ] **Legibilidad mejorada**: El código es más claro que la versión original
- [ ] **Funcionalidad preservada**: El comportamiento se mantiene intacto

---

## 🎯 Consejos para la Práctica

1. **Empieza por el nombre**: Si no puedes describir qué hace la función en una frase simple, probablemente hace demasiadas cosas
2. **Piensa en el usuario**: ¿Qué argumentos necesita conocer vs cuáles puede asumir por defecto?
3. **Agrupa lo relacionado**: Si varios argumentos van siempre juntos, considera agruparlos en un objeto
4. **Evita sorpresas**: El comportamiento debe ser predecible basándose en el nombre y argumentos
5. **Refactoriza gradualmente**: Cambia una cosa a la vez y prueba que sigue funcionando