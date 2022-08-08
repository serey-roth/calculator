import { useReducer } from "react";

const math = require('mathjs');

const numbers = ['1', '2', '3', '4', 
'5', '6', '7', '8', '9', 'exp1', 'π'];
const binaryOps = ['+', '-', '*', '/', '^', '%'];
const unaryFns = ['sqrt', 'exp', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'ln'];
const invAngleFn = ['asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];

const rxDel = new RegExp(`(${unaryFns.join('|')})$`, 'i');
const rxAdd = unaryFns.map(fn => 
    new RegExp(`${fn}\\(\\d+\\.*\\d*(.\\d+\\.*\\d*)*\\)`, 'i'));

console.log(math.evaluate('0002 + 00002 + sin(0002)'))
export function useCalculator(initialValue) {
	const action = {
        ADD_EXPRESSION: 'ADD_EXPRESSION',
        ADD_DIGIT: 'ADD_DIGIT',
        ADD_CONSTANT: 'ADD_CONSTANT',
        ADD_UNARY: 'ADD_UNARY',
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
        let expr = state.expression;
        switch(action.type) {
            case 'ADD_EXPRESSION':{
                return {
                    ...state,
                    expression: expr + value,
                    forDisplay: state.forDisplay + value,
                    result: math.evaluate(expr + value).toString(), 
                };
            }
            case 'ADD_DIGIT': {
                if (expr.slice(-1) === ')') {
                    expr += '*';
                }
                let newExpr = expr;
                let newDispl = state.forDisplay;
                let actionType = 'ADD';
                if (value === '.') {
                    newExpr = expr === '' ? '0' : expr;
                    newDispl = state.forDisplay === '' ? '0' : state.forDisplay;
                    actionType = 'CALCULATE';
                }
                return {
                    ...state,
                    expression: newExpr + value,
                    forDisplay: newDispl + value,
                    result: evaluate(state.isDegree, newExpr, value, 
                        state.stack.length, actionType),
                };
            }
            case 'ADD_BINARY': {
                let newValue = value === 'mod' ? '%' : 
                (value === '÷' ? '/' : value);
                const invalid = (expr === '' || 
                binaryOps.includes(expr.slice(-1)) || 
                expr.slice(-1) === '(');
                if (invalid) {
                    return {...state};
                } else {
                    return {
                        ...state,
                        expression: expr + newValue,
                        forDisplay: state.forDisplay + value,
                    };
                }
            }
            case 'ADD_UNARY': {
                if (value === 'x^2')  {
                    if (numbers.includes(expr.slice(-1))) {
                        const newValue = value === 'x^2'? '^2': value;
                        return {
                            ...state,
                            expression: expr + newValue,
                            forDisplay: state.forDisplay + newValue,
                            result: evaluate(state.isDegree, expr + newValue, 
                                '', state.stack.length, 'CALCULATE'),
                        };
                    } else {
                        return {...state};
                    }
                } else {
                    let newValue = value;
                    if (value === 'e^x') {
                        newValue = 'exp';
                    } else if (value === '√') {
                        newValue = 'sqrt';
                    }
                    let newStack = (state.stack.length === 0) ? 
                                    [1] : [...state.stack, 1];
                    return {
                        ...state,
                        expression: expr + newValue + '(',
                        forDisplay: state.forDisplay + (value === '√' ? '√': newValue + '('),
                        stack: newStack,
                    };
                }
            }
            case 'ADD_CONSTANT': {
                const newValue = value === 'e' ? 'exp1' : value;
                return {
                    ...state,
                    expression: expr + newValue,
                    forDisplay: state.forDisplay + value,
                    result: evaluate(state.isDegree, expr, newValue, 
                        state.stack.length,'ADD'),
                };
            }
            case 'ADD_PARENTHESIS': {
                const conditionOpen = expr === '' || 
                    numbers.includes(expr.slice(-1)) ||
                    expr.slice(-1) === '(' ||
                    (expr.slice(-1) === ')' && state.stack.length === 0) ||
                    (binaryOps.includes(expr.slice(-1)));
                const conditionClose = numbers.includes(expr.slice(-1)) || 
				    state.stack.length > 0;
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
                    return {...state};
                }
            }
            case 'CALCULATE': {
                if (expr !== '' && !binaryOps.includes(expr.slice(-1))) {
                    let ex = fillInClosingParen(expr, state.stack.length);
                    let res = evaluate(state.isDegree, ex, '', 
                    state.stack.length,'CALCULATE');
                    let newHistory = state.history.length === 0 ? 
                                    [{
                                        expression: ex,
                                        result: res,
                                    }] : 
                                    [...state.history, 
                                    {
                                        expression: ex,
                                        result: res,
                                    }
                                    ];
                    return {
                        ...state,
                        expression: res,
                        forDisplay: res,
                        previous: ex,
                        history: newHistory, 
                        result: res,
                    };
                }
                return {...state};
            }
            case 'RESET': {
                return {
                    ...state,
                    expression: '',
                    forDisplay: '',
                    result: '',
                    stack: [],
                };
            }
            case 'CLEAR_HISTORY': {
                return {
                    ...state,
                    history: [],
                }
            }
            case 'TOGGLE_INVERTED': {
                return {
                    ...state,
                    isInverted: !state.isInverted,
                }
            }
            case 'TOGGLE_DEGREE': {
                return {
                    ...state,
                    isDegree: !state.isDegree,
                }
            }
            case 'DELETE_LAST': {
                let ex = state.previous !== '' ? state.previous : expr;
                let [newExpr, newStack, newDisplay] = removeLastValue(ex, state.stack, 
                    state.forDisplay);
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
                    result: evaluate(state.isDegree,
                        newExpr, value, newStack.length, actionType),
                    previous: '',
                }
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

	const handleAddUnaryOperator = (value) => {
		dispatch({type: action.ADD_UNARY, payload: value});
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
		handleAddUnaryOperator,
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

function fillInClosingParen(currentExpr, stackLength) {
    for (let i = 0; i < stackLength; i++) {
        currentExpr += ')';
    }
    return currentExpr;
}

function renderSymbolsForEval(currentExpr) {
    if (/π/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/π/gi, math.pi);
    } 
    if (/exp1/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/exp1/gi, math.exp(1));
    }
    if (/mod/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/mod/gi, '%');
    }
    if (/ln/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/ln/gi, 'log');
    }
    return currentExpr;
}

function evaluate(isDegree, currentExpr, newValue, stackLength, actionType) {
    if (numbers.includes(newValue) || newValue === ')'  || actionType === 'CALCULATE') {
        if (numbers.includes(newValue) && 
        !(newValue === 'π' || newValue === 'exp1')) {
            newValue = Number.parseInt(newValue);
        }
        if (actionType === 'ADD') {
            currentExpr += newValue;
        }
        currentExpr = renderSymbolsForEval(currentExpr);
        currentExpr = fillInClosingParen(currentExpr, stackLength);
        currentExpr = renderFunctions(isDegree, currentExpr);
        if (currentExpr !== '') {
            return math.evaluate(currentExpr).toString();
        }
    }
    return;
}

function removeLastValue(currentExpr, currentStack, currentDisplay) {
    let lastValue = currentExpr.slice(-1);
    let newExpr = currentExpr.slice(0, -1);
    let newStack = null;
    let newDisplay = currentDisplay.slice(0, -1);
    if (lastValue === ')') {
        newStack = currentStack.length === 0 ? [1] : [...currentStack, 1];
    } else if (lastValue === '(') {
        if (rxDel.test(newExpr)) {
            newExpr = newExpr.replace(rxDel, '');
            newDisplay = newDisplay.replace(rxDel, '');
        }
        newStack = currentStack.filter((_, i) => i < currentStack.length - 1);
    } else {
        if (/exp$/.test(newExpr)) {//this is for the number e which i set as exp1
            newExpr = newExpr.replace(/exp$/, '');
        } 
        if (/mo$/.test(newDisplay)) {//this is for mod in display
            newDisplay = newDisplay.replace(/mo$/, '');
        }
        newStack = currentStack.map(i => i);
    }
    return [newExpr, newStack, newDisplay];
}

function renderFunctions(isDegree, currentExpr) {
    let [fnExist, ind] = testForFunction(currentExpr)
    if (!fnExist) {
        return currentExpr;
    } else {
        let fn = unaryFns[ind];
        currentExpr = currentExpr.replace(
            new RegExp(`${fn}\\(\\d+\\.*\\d*(.\\d+\\.*\\d*)*\\)`, 'i'), function(a) {
                if (fn === 'exp' || fn === 'sqrt') {
                    return math.evaluate(a);
                } else if (invAngleFn.includes(fn)) {
                    let res = math.evaluate(a);
                    return isDegree ? convertAngleUnit('rad', 'deg', res) : res;
                } else {
                    let b = a.replace(/\d+\.*\d*(.\d+\.*\d*)*/g, (c) => math.evaluate(c).toString());
                    b = b.replace(/\d+\.*\d*/g, (c) => math.unit(Number.parseFloat(c), 
                            isDegree ? 'deg' : 'rad'));
                    return math.evaluate(b);
                }
            }
        );
        return renderFunctions(isDegree, currentExpr);
    }
}

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