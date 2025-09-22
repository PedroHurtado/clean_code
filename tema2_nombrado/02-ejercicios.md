# Ejercicios - Tema 2: Nombrado

## Ejercicio 2.1: Mejorar nombres reveladores de intención

Refactoriza los siguientes nombres para que sean más reveladores:

```javascript
// Variables problemáticas
let d = new Date();
let u = [];
let temp = 0;
let flag = false;
let data = {};
let list = [];
let info = null;
let result = "";

// Funciones problemáticas
function calc(x, y) {
    return x * y * 0.15;
}

function process(input) {
    return input.filter(i => i.status === 'active');
}

function handle(req, res) {
    const data = getData();
    res.send(data);
}

// Clase problemática
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
```

**Instrucciones:**
- Propón nombres más descriptivos para cada variable y función
- Explica qué podría representar cada elemento en un contexto real
- Mantén las convenciones de JavaScript (camelCase, etc.)

---

## Ejercicio 2.2: Aplicar convenciones de nomenclatura

Corrige los siguientes nombres según las convenciones estándar de JavaScript:

```javascript
// Nombres que no siguen convenciones
const max_users = 100;
const APIURL = "https://api.example.com";
let Username = "john";
let user_count = 0;
let IsActive = true;

class userservice {
    constructor() {
        this.USERS = [];
        this.current_user = null;
    }

    GetUser(ID) {
        return this.USERS.find(User => User.id === ID);
    }

    add_user(user_data) {
        this.USERS.push(user_data);
    }
}

function Calculate_Tax(Income) {
    const tax_rate = 0.2;
    return Income * tax_rate;
}

// Archivo: UserService.js
// Función: ProcessUserData
// Variable: user_email_list
```

**Tareas:**
1. Corrige todos los nombres según las convenciones JavaScript
2. Explica qué convención aplicaste en cada caso
3. Sugiere nombres de archivos apropiados

---

## Ejercicio 2.3: Distinguir entre sustantivos y verbos

Clasifica y mejora los siguientes nombres según correspondan a sustantivos (datos/entidades) o verbos (acciones/funciones):

```javascript
// Mezcla confusa de nombres
let validate = {};
let process = [];
let email = function(to, subject) { ... };
let user = function() { ... };
let calculate = "result";

function data() {
    return { name: "John", age: 30 };
}

function information(userId) {
    // Obtiene información del usuario
    return users.find(u => u.id === userId);
}

class Process {
    validate() {
        // Valida datos
    }
    
    email() {
        // Envía email
    }
}

// Variables que deberían ser funciones
let getUserById = userData;
let sendEmail = emailData;
let validateForm = formState;

// Funciones que suenan como datos
function userData() { ... }
function emailContent() { ... }
function formState() { ... }
```

**Instrucciones:**
1. Identifica qué nombres deberían ser sustantivos y cuáles verbos
2. Refactoriza cada nombre para que sea semánticamente correcto
3. Explica la diferencia entre el nombre original y el mejorado

---

## Ejercicio 2.4: Evitar desinformación y ambigüedad

Identifica y corrige los problemas de desinformación en el siguiente código:

```javascript
// Código con nombres engañosos
let accountList = new Set(); // Estructura incorrecta
let accounts = "john,mary,peter"; // Tipo incorrecto
let userArray = new Map(); // Tipo incorrecto

function getUserList() {
    return new Set([...users]); // Retorna Set, no Array
}

function isValid() {
    // No está claro qué valida
    return true;
}

let hp = 150; // ¿Hit points? ¿Horsepower? ¿Height in pixels?
let mp = 50;  // ¿Magic points? ¿Miles per hour? ¿Megapixels?

class Handler {
    handle() { ... } // Muy genérico
    process() { ... } // Muy genérico
    manage() { ... } // Muy genérico
}

// Nombres que sugieren una cosa pero hacen otra
function saveUser(user) {
    // En realidad también valida y envía email
    validateUser(user);
    database.save(user);
    emailService.sendWelcomeEmail(user);
}

function getUsers() {
    // En realidad filtra usuarios activos
    return users.filter(u => u.isActive);
}

// Variables que se parecen mucho
let userAccountData;
let userAccountDetails;
let userAccountInfo;
let userAccountInformation;
```

**Tareas:**
1. Identifica todos los casos de desinformación
2. Propón nombres más precisos y honestos
3. Explica por qué cada cambio mejora la claridad
4. Sugiere cómo estructurar el código para evitar funciones que hacen múltiples cosas

---

## Ejercicio 2.5: Aplicar Command-Query Separation

Refactoriza el siguiente código aplicando el principio CQS:

```javascript
class UserService {
    constructor() {
        this.users = [];
        this.currentUser = null;
    }

    // Funciones que violan CQS
    getUserAndMarkAsViewed(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.lastViewed = new Date();
            user.viewCount++;
        }
        return user;
    }

    addUserAndReturnCount(userData) {
        this.users.push(userData);
        return this.users.length;
    }

    deleteUserAndGetRemaining(userId) {
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            this.users.splice(index, 1);
        }
        return this.users;
    }

    validateAndSaveUser(userData) {
        if (!userData.email || !userData.password) {
            return false;
        }
        this.users.push(userData);
        return userData;
    }

    checkPermissionAndLog(userId, action) {
        const user = this.users.find(u => u.id === userId);
        const hasPermission = user && user.permissions.includes(action);
        
        if (hasPermission) {
            console.log(`User ${userId} performed ${action}`);
        }
        
        return hasPermission;
    }
}

// Uso problemático actual
const userService = new UserService();
const user = userService.getUserAndMarkAsViewed(123); // Hace dos cosas
const count = userService.addUserAndReturnCount(newUser); // Hace dos cosas
```

**Instrucciones:**
1. Separa cada función en comandos y consultas independientes
2. Crea nombres apropiados para cada tipo de función
3. Muestra cómo se usaría el código refactorizado
4. Explica los beneficios de aplicar CQS

---

## Ejercicio 2.6: Contexto y alcance de nombres

Mejora los nombres según su contexto y alcance:

```javascript
// Contexto de e-commerce
const MAX = 100; // ¿Máximo de qué?
const MIN = 1;   // ¿Mínimo de qué?

function calc(a, b, c) {
    // Calcula precio con descuento
    return (a * b) - (a * b * c);
}

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

// Variables con alcance confuso
for (let userData of users) {
    let u = userData; // Redundante
    let temp = processUserData(u);
    let result = validateUserInformation(temp);
    let finalResult = saveProcessedUserData(result);
}

// Funciones anidadas con nombres pobres
function process(items) {
    function helper(item) {
        function inner(data) {
            return data.map(d => d.value);
        }
        return inner(item.details);
    }
    
    return items.map(item => helper(item));
}
```

**Tareas:**
1. Asigna un contexto específico (ej: e-commerce, gestión de usuarios, etc.)
2. Mejora los nombres según ese contexto
3. Ajusta la longitud de los nombres según su alcance
4. Crea una versión con nombres autodocumentados