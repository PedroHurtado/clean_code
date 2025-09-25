# Ejercicios - Tema 6: Artesanía de software

## Ejercicio 6.1: Identificar prácticas de artesanía

Analiza el siguiente código y identifica qué principios de artesanía de software se están violando:

```javascript
// Sistema de gestión de usuarios - v2.3.1
class UserManager {
    constructor() {
        this.users = [];
        this.db = new Database('mongodb://localhost');
    }

    createUser(name, email, age) {
        // TODO: validar datos de entrada
        let user = {
            id: Math.random() * 1000,
            name: name,
            email: email,
            age: age,
            created: new Date()
        };
        
        this.users.push(user);
        this.db.save(user); // A veces falla pero no importa
        
        console.log('Usuario creado: ' + name);
        return user;
    }

    deleteUser(id) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == id) {
                this.users.splice(i, 1);
                break;
            }
        }
        // No actualizamos la base de datos, solo el array local
        console.log('Usuario eliminado');
    }

    updateUser(id, newData) {
        let user = this.findUser(id);
        if (user) {
            user.name = newData.name || user.name;
            user.email = newData.email || user.email;
            user.age = newData.age || user.age;
            // Guardar cambios... a veces
            if (Math.random() > 0.3) {
                this.db.update(id, user);
            }
        }
    }

    findUser(id) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == id) {
                return this.users[i];
            }
        }
        return null;
    }

    getAllUsers() {
        return this.users; // Devolvemos la referencia directa
    }
}

// Uso en producción
const userManager = new UserManager();
userManager.createUser('Juan', 'juan@email', 25);
userManager.createUser('', '', -5); // Esto va a producir datos inválidos
```

**Instrucciones:**
1. Identifica al menos 8 violaciones de principios de artesanía
2. Clasifica cada problema según su gravedad (Alto, Medio, Bajo)
3. Propón mejoras específicas para cada problema identificado
4. Explica cómo cada mejora contribuye a la calidad del software

---

## Ejercicio 6.2: Implementar pruebas siguiendo TDD

Siguiendo la metodología TDD (Test-Driven Development), implementa un sistema de validación de contraseñas que cumpla estos criterios:

**Requisitos de la contraseña:**
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula  
- Al menos un número
- Al menos un carácter especial (!@#$%^&*)
- No debe contener espacios
- No debe ser una contraseña común (usar una lista básica)

**Instrucciones:**
1. **RED**: Escribe primero las pruebas (que fallarán)
2. **GREEN**: Implementa el código mínimo para que pasen
3. **REFACTOR**: Mejora el código manteniendo las pruebas verdes

```javascript
// Estructura inicial para las pruebas
describe('PasswordValidator', () => {
    // Implementa aquí tus casos de prueba
    
    test('debería rechazar contraseñas menores a 8 caracteres', () => {
        // Tu código aquí
    });
    
    test('debería rechazar contraseñas sin mayúsculas', () => {
        // Tu código aquí
    });
    
    // Continúa con el resto de casos...
});

// Estructura inicial para la implementación
class PasswordValidator {
    constructor() {
        // Tu inicialización aquí
    }
    
    validate(password) {
        // Tu implementación aquí
    }
    
    // Métodos auxiliares que consideres necesarios
}
```

**Entregables:**
- Suite completa de pruebas
- Implementación de la clase PasswordValidator
- Documentación de cada ciclo RED-GREEN-REFACTOR aplicado

---

## Ejercicio 6.3: Refactoring con cobertura de pruebas

El siguiente código funciona pero no está bien estructurado. Refactorízalo manteniendo el 100% de cobertura de pruebas:

```javascript
function processOrderData(orderData) {
    let result = {
        totalAmount: 0,
        itemCount: 0,
        hasDiscounts: false,
        shippingCost: 0,
        taxes: 0,
        finalTotal: 0,
        errors: []
    };

    // Validar datos de entrada
    if (!orderData || !orderData.items || orderData.items.length === 0) {
        result.errors.push('Orden debe tener al menos un item');
        return result;
    }

    // Procesar items
    for (let i = 0; i < orderData.items.length; i++) {
        let item = orderData.items[i];
        
        if (!item.price || item.price <= 0) {
            result.errors.push(`Item ${i + 1} tiene precio inválido`);
            continue;
        }
        
        if (!item.quantity || item.quantity <= 0) {
            result.errors.push(`Item ${i + 1} tiene cantidad inválida`);
            continue;
        }

        let itemTotal = item.price * item.quantity;
        
        // Aplicar descuentos
        if (item.discount && item.discount > 0 && item.discount <= 100) {
            itemTotal = itemTotal * (1 - item.discount / 100);
            result.hasDiscounts = true;
        }
        
        result.totalAmount += itemTotal;
        result.itemCount += item.quantity;
    }

    // Calcular envío
    if (result.totalAmount < 50) {
        result.shippingCost = 10;
    } else if (result.totalAmount < 100) {
        result.shippingCost = 5;
    } else {
        result.shippingCost = 0; // Envío gratis
    }

    // Calcular impuestos
    result.taxes = result.totalAmount * 0.21; // IVA 21%

    // Total final
    result.finalTotal = result.totalAmount + result.shippingCost + result.taxes;

    return result;
}

// Pruebas existentes (no modificar)
describe('processOrderData', () => {
    test('procesa correctamente una orden válida', () => {
        const order = {
            items: [
                { price: 10, quantity: 2 },
                { price: 20, quantity: 1 }
            ]
        };
        
        const result = processOrderData(order);
        
        expect(result.totalAmount).toBe(50);
        expect(result.itemCount).toBe(3);
        expect(result.shippingCost).toBe(5);
        expect(result.taxes).toBe(10.5);
        expect(result.finalTotal).toBe(65.5);
        expect(result.errors).toHaveLength(0);
    });

    test('aplica descuentos correctamente', () => {
        const order = {
            items: [
                { price: 100, quantity: 1, discount: 10 }
            ]
        };
        
        const result = processOrderData(order);
        
        expect(result.totalAmount).toBe(90);
        expect(result.hasDiscounts).toBe(true);
    });

    test('maneja errores de validación', () => {
        const order = {
            items: [
                { price: -10, quantity: 1 },
                { price: 10, quantity: 0 }
            ]
        };
        
        const result = processOrderData(order);
        
        expect(result.errors).toHaveLength(2);
    });

    // Más pruebas...
});
```

**Instrucciones:**
1. Ejecuta las pruebas iniciales para verificar que pasen
2. Refactoriza el código extrayendo funciones más pequeñas
3. Mantén todas las pruebas verdes durante todo el proceso
4. Asegúrate de que la cobertura de pruebas se mantenga al 100%
5. Aplica principios SOLID donde sea apropiado

---

## Ejercicio 6.4: Implementar disciplinas de artesanía

Diseña y configura un pipeline de desarrollo que implemente las siguientes disciplinas de artesanía de software:

**Requerimientos del pipeline:**

1. **Control de calidad de código**
   - Linting automático
   - Formateo consistente
   - Análisis de complejidad ciclomática
   - Detección de code smells

2. **Testing automático**
   - Pruebas unitarias
   - Cobertura mínima del 80%
   - Pruebas de integración básicas

3. **Integración continua**
   - Ejecución automática en cada commit
   - Bloqueo de merge si fallan las pruebas
   - Reportes de calidad automáticos

```javascript
// Estructura base del proyecto
package.json
├── scripts
│   ├── "test": "jest --coverage",
│   ├── "lint": "eslint src/",
│   ├── "format": "prettier --write src/",
│   └── "quality": "npm run lint && npm run test"
├── devDependencies
│   ├── "jest": "^29.0.0",
│   ├── "eslint": "^8.0.0",
│   └── "prettier": "^2.0.0"

// Implementa una función simple pero completa
src/
├── calculator.js
├── calculator.test.js
└── utils/
    ├── validator.js
    └── validator.test.js
```

**Tareas a realizar:**

1. **Configuración del entorno:**
   ```bash
   # Crea la estructura de archivos necesaria
   # Configura package.json con scripts apropiados
   # Instala y configura las herramientas de calidad
   ```

2. **Configuración de herramientas:**
   - Archivo `.eslintrc.js` con reglas estrictas
   - Archivo `.prettierrc` con formato consistente
   - Configuración de Jest para cobertura
   - Pre-commit hooks con husky

3. **Implementación de código ejemplo:**
   - Una calculadora básica con operaciones matemáticas
   - Validadores para entrada de datos
   - Suite completa de pruebas
   - Documentación JSDoc

4. **Integración continua (conceptual):**
   - Archivo `.github/workflows/ci.yml` (GitHub Actions)
   - Pipeline que ejecute: lint → test → build
   - Configuración para reportes de cobertura

**Entregables:**
- Estructura completa del proyecto
- Archivos de configuración de todas las herramientas
- Código implementado siguiendo las mejores prácticas
- Documentación del pipeline de CI/CD
- Justificación de cada herramienta elegida y su configuración

**Criterios de evaluación:**
- ✅ Todas las herramientas configuradas correctamente
- ✅ Código que pase todos los checks de calidad
- ✅ Cobertura de pruebas superior al 80%
- ✅ Pipeline automatizado funcional
- ✅ Documentación clara del proceso