import { 
    numbers,
    binaryOps,
    evaluate,
    removeLastValue,
    saveHistory,
    addToHistory,
    fillInClosingParen,
} from "./calculator";

import { History } from "./history";

const day = require('dayjs');

export function addExpression(state, value) {
    let expr = state.expression;
    let disp = state.forDisplay;
    if (numbers.includes(expr.slice(-1)) ||
        expr.slice(-1) === ')') {
        expr += '*';
        disp += '*';
    }
    return {
        ...state,
        expression: expr + value,
        forDisplay: disp + value,
        result: evaluate(state.isDegree, expr + value, '',
            state.stack.length, 'CALCULATE'),
        previous: '',
    };
}

export function addDigit(state, value) {
    let expr = state.expression;
    let disp = state.forDisplay;
    if (expr.slice(-1) === ')') {
        expr += '*';
        disp += '*';
    }
    let newExpr = expr;
    let actionType = 'ADD';
    if (value === '.') {
        if (expr.slice(-1) === '.' ||
            expr.slice(-1) === 'E' ||
            expr.slice(-1) === 'π') {
            return {
                ...state
            };
        }
        newExpr = expr === '' ? '0' : expr;
        disp = state.forDisplay === '' ? '0' : state.forDisplay;
        actionType = 'CALCULATE';
    }
    return {
        ...state,
        expression: newExpr + value,
        forDisplay: disp + value,
        result: evaluate(state.isDegree, newExpr, value,
            state.stack.length, actionType),
    };
}

export function addBinary(state, value) {
    let expr = state.expression;
    let newValue = value === 'mod' ? '%' :
        (value === '÷' ? '/' : value);
    const invalid = (expr === '' ||
        binaryOps.includes(expr.slice(-1)) ||
        expr.slice(-1) === '(');
    if (invalid) {
        return {
            ...state
        };
    } else {
        return {
            ...state,
            expression: expr + newValue,
            forDisplay: state.forDisplay + value,
        };
    }
}

export function addFunction(state, value) {
    let expr = state.expression;
    if (value === 'x^2') {
        if (numbers.includes(expr.slice(-1))) {
            const newValue = value === 'x^2' ? '^2' : value;
            return {
                ...state,
                expression: expr + newValue,
                forDisplay: state.forDisplay + newValue,
                result: evaluate(state.isDegree, expr + newValue,
                    '', state.stack.length, 'CALCULATE'),
            };
        } else {
            return {
                ...state
            };
        }
    } else {
        let newValue = value;
        if (value === 'e^x') {
            newValue = 'exp';
        } else if (value === '√') {
            newValue = 'sqrt';
        }
        let newStack = (state.stack.length === 0) ? [1] : [...state.stack, 1];
        if (expr === '' || binaryOps.includes(expr.slice(-1)) ||
            expr.slice(-1) === '(') {
            return {
                ...state,
                expression: expr + newValue + '(',
                forDisplay: state.forDisplay + (value === '√' ? '√' : newValue + '('),
                stack: newStack,
            };
        } else {
            let newExpr = newValue + '(' + expr;
            return {
                ...state,
                expression: newExpr,
                forDisplay: (value === '√' ? '√' : newValue + '(') + 
                state.forDisplay,
                stack: newStack,
                result: evaluate(state.isDegree, newExpr, '',
                    newStack.length, 'CALCULATE'),
            };
        }
    }
}
export function addConstant(state, value) {
    const newValue = value === 'e' ? 'E' : value;
    return {
        ...state,
        expression: state.expression + newValue,
        forDisplay: state.forDisplay + value,
        result: evaluate(state.isDegree, state.expression, 
            newValue, state.stack.length, 'ADD'),
    };
}

export function addParenthesis(state, value) {
    let expr = state.expression;
    const conditionOpen = expr === '' ||
        numbers.includes(expr.slice(-1)) ||
        expr.slice(-1) === '(' ||
        (expr.slice(-1) === ')' && state.stack.length === 0) ||
        (binaryOps.includes(expr.slice(-1)));
    const conditionClose = state.stack.length > 0 &&
        (numbers.includes(expr.slice(-1)) || expr.slice(-1) === ')');
    if (value === '(' && conditionOpen) {
        return {
            ...state,
            expression: expr + value,
            forDisplay: state.forDisplay + value,
            stack: [...state.stack, 1],
            result: evaluate(state.isDegree, expr,
                value, state.stack.length + 1, 'ADD'),
        };
    } else if (value === ')' && conditionClose) {
        return {
            ...state,
            expression: expr + value,
            forDisplay: state.forDisplay + value,
            stack: state.stack.filter((_, i) => i < state.stack.length - 1),
            result: evaluate(state.isDegree, expr,
                value, state.stack.length - 1, 'ADD'),
        };
    } else {
        return {
            ...state
        };
    }
}

export function calculate(state) {
    let expr = state.expression;
    if (expr !== '' && !binaryOps.includes(expr.slice(-1))) {
        let res = evaluate(state.isDegree, expr, '', 
        state.stack.length, 'CALCULATE');
        expr = fillInClosingParen(expr, state.stack.length);
        let newStack = [];
        let newHistory = addToHistory(day().format('MM/DD/YYYY'),
        expr, res, state.history);
        saveHistory(newHistory);
        return {
            ...state,
            expression: res,
            forDisplay: res,
            stack: newStack,
            previous: expr,
            history: newHistory, 
            result: res,
        };
    }
    return {...state};
}

export function toggleInverted(state) {
    return {
        ...state,
        isInverted: !state.isInverted,
    };
} 

export function toggleDegree(state) {
    return {
        ...state,
        isDegree: !state.isDegree,
        result: evaluate(!state.isDegree, state.expression, '', 
        state.stack.length, 'CALCULATE'),
    }
} 

export function deleteLast(state) {
    let ex = state.previous !== '' ? state.previous : state.expression;
    let disp = state.previous !== '' ? state.previous : state.forDisplay;
    let [newExpr, newStack, newDisplay] = removeLastValue(ex, state.stack, 
                    disp);
    let actionType = 'DELETE';
    let value = newExpr.slice(-1);
    if (value === '.') {
        actionType = 'CALCULATE';
        value = '';
    }
    return {
        ...state,
        expression: newExpr,
        forDisplay: newDisplay,
        stack: newStack,
        result: evaluate(state.isDegree, newExpr, value, 
            newStack.length, actionType),
        previous: '',
    };
}

export function clearHistory(state) {
    saveHistory(new History());
    return {
        ...state,
        history: new History(),
    };
}

export function reset(state) {
    return {
        ...state,
        expression: '',
        forDisplay: '',
        result: '',
        stack: [],
    };
}