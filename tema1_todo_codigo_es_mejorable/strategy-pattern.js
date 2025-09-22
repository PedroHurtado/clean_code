const OPERATIONS = Object.freeze({
    ADD: (a, b) => a + b,
    SUBTRACT: (a, b) => a - b,
    MULTIPLY: (a, b) => a * b,
    DIVIDE: (a, b) => {
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        return a / b
    }
});

function calculateBasicOperation(firstOperand, secondOperand, operation) {

    const operationFunction = OPERATIONS[operation]
    if (!operation) {
        throw new Error(`Unknown operation: ${operation}`);
    }
    return operationFunction(firstOperand, secondOperand)
}

//OPERATIONS.ADD = null ERROR
OPERATIONS.ADD = ()=>{} //NO DA ERROR Pero no se modifica el objeto