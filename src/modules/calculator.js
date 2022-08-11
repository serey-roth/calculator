import { useReducer } from "react";
import { ExpressionResult } from "./history";
import {
    addExpression,
    addDigit,
    addBinary,
    addConstant,
    addFunction,
    addParenthesis,
    calculate,
    reset,
    clearHistory,
    toggleInverted,
    toggleDegree,
    deleteLast,
} from "./calculatorUpdate"

const math = require('mathjs');

export const numbers = ['0', '1', '2', '3', '4', 
'5', '6', '7', '8', '9', 'E', 'π'];
export const binaryOps = ['+', '-', '*', '/', '^', '%'];
const func = ['sqrt', 'exp', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'ln'];
const trigFnInv = ['asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];

const rxDel = new RegExp(`(${func.join('|')})$`, 'i');
const rxAdd = func.map(fn => 
    new RegExp(`${fn}\\(\\d+\\.*\\d*(.\\d+\\.*\\d*)*\\)`, 'i'));

export function useCalculator(initialValue) {
	const action = {
        ADD_EXPRESSION: 'ADD_EXPRESSION',
        ADD_DIGIT: 'ADD_DIGIT',
        ADD_CONSTANT: 'ADD_CONSTANT',
        ADD_FUNCTION: 'ADD_FUNCTION',
        ADD_BINARY: 'ADD_BINARY',
        ADD_PARENTHESIS: 'ADD_PARENTHESIS',
        CALCULATE: 'CALCULATE',
        RESET: 'RESET',
        TOGGLE_DEGREE: 'TOGGLE_DEGREE',
        TOGGLE_INVERTED: 'TOGGLE_INVERTED',
        CLEAR_HISTORY: 'CLEAR_HISTORY',
        DELETE_LAST: 'DELETE_LAST',
    };

    const reducer = (state, action) => {
        let value = action.payload;
        switch(action.type) {
            case 'ADD_EXPRESSION':{
                return addExpression(state, value);
            }
            case 'ADD_DIGIT': {
                return addDigit(state, value);
            }
            case 'ADD_BINARY': {
                return addBinary(state, value);
            }
            case 'ADD_FUNCTION': {
                return addFunction(state, value);
            }
            case 'ADD_CONSTANT': {
                return addConstant(state, value);
            }
            case 'ADD_PARENTHESIS': {
                return addParenthesis(state, value);
            }
            case 'CALCULATE': {
                return calculate(state);
            }
            case 'RESET': {
                return reset(state);
            }
            case 'CLEAR_HISTORY': {
                return clearHistory(state);
            }
            case 'TOGGLE_INVERTED': {
                return toggleInverted(state);
            }
            case 'TOGGLE_DEGREE': {
                return toggleDegree(state);
            }
            case 'DELETE_LAST': {
                return deleteLast(state);
            }
            default: return {...state};
        }
    }

    const [state, dispatch] = useReducer(reducer, initialValue);

    const handleAddExpression = (value) => {
        dispatch({type: action.ADD_EXPRESSION, payload: value});
    };

	const handleAddDigit = (value) => {
		dispatch({type: action.ADD_DIGIT, payload: value});
    };

	const handleAddBinaryOperator = (value) => {
		dispatch({type: action.ADD_BINARY, payload: value});
	};

	const handleAddFunction = (value) => {
		dispatch({type: action.ADD_FUNCTION, payload: value});
	};

	const handleAddConstant = value => {
		dispatch({type: action.ADD_CONSTANT, payload: value});
	};

	const handleAddParenthesis = (value) => {
        dispatch({type: action.ADD_PARENTHESIS, payload: value});
	};
	
    const handleCalculation = () => {
        dispatch({type: action.CALCULATE, payload: 0});
    };

    const handleDeleteLast = () => {
        dispatch({type: action.DELETE_LAST, payload: 0});
    };

    const handleResetCalculator = () => {
        dispatch({type: action.RESET, payload: 0});
    };

    const handleClearHistory = () => {
        dispatch({type: action.CLEAR_HISTORY, payload: 0});
    };

    const handleToggleDegree = () => {
        dispatch({type: action.TOGGLE_DEGREE, payload: 0});
    };

    const handleToggleInverted = () => {
        dispatch({type: action.TOGGLE_INVERTED, payload: 0});
    };

	return {
		state, 
        handleAddExpression,
		handleAddDigit,
		handleAddConstant,
		handleAddFunction,
		handleAddBinaryOperator,
		handleAddParenthesis,
        handleCalculation,
        handleResetCalculator,
        handleToggleDegree,
        handleClearHistory,
        handleToggleInverted,
        handleDeleteLast
	};
}

export function fillInClosingParen(currentExpr, stackLength) {
    for (let i = 0; i < stackLength; i++) {
        currentExpr += ')';
    }
    return currentExpr;
}

function renderSymbolsForEval(currentExpr) {
    if (/π/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/π/gi, math.pi);
    } 
    if (/E/g.test(currentExpr)) {
        currentExpr = currentExpr.replace(/E/gi, math.exp(1));
    }
    if (/mod/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/mod/gi, '%');
    }
    if (/ln/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/ln/gi, 'log');
    }
    return currentExpr;
}

// ----------------------------------------------------------------
// evaluate the current expression based on the given action type
// - 'ADD': add the correct value and then evaluate
// - 'CALCULATE': evaluate
// - 'DELETE': do nothing
//
// before evaluating, replace symbols, fill in closing parenthesis,
// add correct angle units
// ----------------------------------------------------------------
export function evaluate(isDegree, currentExpr, newValue, stackLength, actionType) {
    if (numbers.includes(newValue) || newValue === ')'  || actionType === 'CALCULATE') {
        if (numbers.includes(newValue) && 
        !(newValue === 'π' || newValue === 'E')) {
            newValue = Number.parseInt(newValue);
        }
        if (actionType === 'ADD') {
            currentExpr += newValue;
        }
        currentExpr = renderSymbolsForEval(currentExpr);
        currentExpr = fillInClosingParen(currentExpr, stackLength);
        try {
            currentExpr = renderFunctions(isDegree, currentExpr);
            if (currentExpr !== '') {
                return math.evaluate(currentExpr).toString();
            }
        } catch(error) {
            return error.message;
        }
    }
    return;
}

// ----------------------------------------------------------------
// remove the last value in the current expression and display
// ----------------------------------------------------------------
export function removeLastValue(currentExpr, currentStack, currentDisplay) {
    let lastValue = currentExpr.slice(-1);
    let newExpr = currentExpr.slice(0, -1);
    let newStack = null;
    let newDisplay = currentDisplay.slice(0, -1);
    if (lastValue === ')') {
        newStack = currentStack.length === 0 ? [1] : [...currentStack, 1];
    } else if (lastValue === '(') {
        // if last value is a function operator then remove the function in one go
        if (rxDel.test(newExpr)) { 
            newExpr = newExpr.replace(rxDel, '');
            newDisplay = newDisplay.replace(rxDel, '');
        }
        newStack = currentStack.filter((_, i) => i < currentStack.length - 1);
    } else {
        if (/mo$/.test(newDisplay)) {//this is for mod in display
            newDisplay = newDisplay.replace(/mo$/, '');
        }
        newStack = currentStack.map(i => i);
    }
    return [newExpr, newStack, newDisplay];
}

// ----------------------------------------------------------------
// start from the end of the expression and recursively parse
// through and add correct angle units for trig functions, 
// if necessary, and check for valid domains then evaluate
// 
// ----------------------------------------------------------------
function renderFunctions(isDegree, currentExpr) {
    if (/\(\)/g.test(currentExpr)) {
        throw new Error('Invalid Expression'); // e.g sin() -> invalid
    }
    let [fnExist, ind] = testForFunction(currentExpr)
    if (!fnExist) {
        return currentExpr;
    } else {
        let fn = func[ind]; // the complete function operator e.g sin(2) -> sin
        currentExpr = currentExpr.replace(
            //looks for expressions like sin(2 + 2 + 3) or sin(3) then add units
            //otherwise, evaluate
            new RegExp(`${fn}\\(\\d+\\.*\\d*(.\\d+\\.*\\d*)*\\)`, 'i'), function(a) {
                if (fn === 'exp' || fn === 'sqrt') {
                    return math.evaluate(a);
                } else {
                    //for sin(2 + 2 + 2), then c is 2 + 2 + 2
                    let b = a.replace(/\d+\.*\d*(.\d+\.*\d*)*/g, function(c) {
                        c = math.evaluate(c);
                        if (validDomain(fn, Number.parseFloat(c), isDegree)) {
                            return c.toString();
                        } else {
                            throw new Error('Domain Error');
                        }
                    });
                    if (trigFnInv.includes(fn)) {
                        let res = math.evaluate(b);
                        return isDegree ? convertAngleUnit('rad', 'deg', res) : res;
                    } else {
                        b = b.replace(/\d+\.*\d*/g, (c) => math.unit(Number.parseFloat(c), 
                            isDegree ? 'deg' : 'rad'));
                        return math.evaluate(b);
                    }
                }
            }
        );
        return renderFunctions(isDegree, currentExpr);
    }
}

// ----------------------------------------------------------------
// check if there is a complete function, e.g. sin(2)
// in the current expression 
// ----------------------------------------------------------------
function testForFunction(currentExpr) {
    for (let i = 0; i < rxAdd.length; i++) {
        if (rxAdd[i].test(currentExpr)) {
            return [true, i];
        }
    }
    return [false, -1];
}

function convertAngleUnit(from, to, value) {
    if (from === 'deg' && to === 'rad') {
        return value * Math.PI / 180;
    } else if (from === 'rad' && to === 'deg') {
        return value * 180 / Math.PI;
    } else {
        return value;
    }
}

function validDomain(fn, value, isDegree) {
    if (trigFnInv.includes(fn)) {
        if (fn === 'asin' || fn === 'acos') {
            return value >= -1 && value <= 1;
        } else if (fn === 'asec' || fn === 'acsc') {
            return value <= -1 || value >= 1;
        } else {
            return true;
        }
    } else {
        value = isDegree ? convertAngleUnit('deg', 'rad', value) : value;
        if (fn === 'tan' || fn === 'sec') {
            return !math.isInteger(2 * value / (math.pi));
        } else if (fn === 'cot' || fn === 'csc') {
            return !math.isInteger(value / (math.pi));
        } else {
            return true;
        }
    }
}

export function addToHistory(date, expression, result, history) {
    let item = new ExpressionResult(expression, result);
    history.addItem(date, item);
    return history;
}
