import { useReducer } from "react";

const math = require('mathjs');

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'exp1', 'π'];
const binaryOps = ['+', '-', '*', '/', '.', '^', '%'];
const unaryFns = ['sqrt', 'exp', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
'log', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];

const rxDel = new RegExp(`(${unaryFns.join('|')})$`, 'i');
const rxAdd = unaryFns.map(fn => new RegExp(`${fn}`, 'i'));

export function useCalculator(initialValue) {
	const action = {
        ADD_EXPRESSION: 'ADD_EXPRESSION',
        ADD_DIGIT: 'ADD_DIGIT',
        ADD_SPECIAL: 'ADD_SPECIAL',
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
        switch(action.type) {
            case 'ADD_EXPRESSION':{
                return {
                    ...state,
                    expression: state.expression + value,
                    forDisplay: state.forDisplay + value,
                    result: math.evaluate(state.expression + value).toString(), 
                };
            }
            case 'ADD_DIGIT': {
                let newExpr = renderCorrectAngleUnit(state.isDegree,
                    state.expression, value)
                return {
                    ...state,
                    expression: renderCorrectAngleUnit(state.isDegree,
                        state.expression, value),
                    forDisplay: state.forDisplay + value,
                    result: evaluateWithNewValue(renderCorrectAngleUnit(state.isDegree,
                        state.expression, value), 
                        'calculate', state.stack.length),
                };
            }
            case 'ADD_BINARY': {
                const invalid = (state.expression === '' || 
                binaryOps.includes(state.expression.slice(-1)) || 
                state.expression.slice(-1) === '(');
                if (invalid) {
                    return {...state};
                } else {
                    return {
                        ...state,
                        expression: state.expression + value,
                        forDisplay: state.forDisplay + value,
                    };
                }
            }
            case 'ADD_UNARY': {
                if (value === 'x^2')  {
                    if (numbers.includes(state.expression.slice(-1))) {
                        const newValue = value === 'x^2'? '^2': value;
                        return {
                            ...state,
                            expression: state.expression + newValue,
                            forDisplay: state.forDisplay + newValue,
                            result: evaluateWithNewValue(state.expression, 
                                newValue, state.stack.length),
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
                        expression: state.expression + newValue + '(',
                        forDisplay: state.forDisplay + (value === '√' ? '√': newValue + '('),
                        stack: newStack,
                    };
                }
            }
            case 'ADD_SPECIAL': {
                const newValue = value === 'e' ? 'exp1' : value;
                const newExpr = renderCorrectAngleUnit(state.isDegree,
                    state.expression, newValue);
                return {
                    ...state,
                    expression: newExpr,
                    forDisplay: state.forDisplay + value,
                    result: evaluateWithNewValue(newExpr, 'calculate', state.stack.length),
                };
            }
            case 'ADD_PARENTHESIS': {
                const conditionOpen = state.expression === '' || 
                    numbers.includes(Number.parseInt(state.expression.slice(-1))) ||
                    state.expression.slice(-1) === '(' ||
                    (state.expression.slice(-1) === ')' && state.stack.length === 0) ||
                    (binaryOps.includes(state.expression.slice(-1)));
                const conditionClose = numbers.includes(Number.parseInt(state.expression.slice(-1))) || 
				    state.stack.length > 0;
                if (value === '(' && conditionOpen) {
                    return {
                        ...state,
                        expression: state.expression + value,
                        forDisplay: state.forDisplay + value,
                        stack: [...state.stack, 1],
                        result: evaluateWithNewValue(state.expression,
                            value, state.stack.length + 1),
                    };
                } else if (value === ')' && conditionClose) {
                    return {
                        ...state,
                        expression: state.expression + value,
                        forDisplay: state.forDisplay + value,
                        stack: state.stack.filter((_, i) => i < state.stack.length - 1),
                        result: evaluateWithNewValue(state.expression,
                            value, state.stack.length - 1),
                    };
                } else {
                    return {...state};
                }
            }
            case 'CALCULATE': {
                if (state.expression !== '' && !binaryOps.includes(state.expression.slice(-1))) {
                    let expr = fillInClosingParen(state.expression, state.stack.length);
                    let res = evaluateWithNewValue(state.expression, 'calculate', 
                    state.stack.length);
                    let newHistory = state.history.length === 0 ? 
                                    [{
                                        expression: expr,
                                        result: res,
                                    }] : 
                                    [...state.history, 
                                    {
                                        expression: expr,
                                        result: res,
                                    }
                                    ];
                    return {
                        ...state,
                        expression: res,
                        forDisplay: res,
                        previous: expr,
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
                let expr = state.previous !== '' ? state.previous : state.expression;
                let [newExpr, newStack, newDisplay] = removeLastValue(expr, state.stack, 
                    state.forDisplay);
                return {
                    ...state,
                    expression: newExpr,
                    forDisplay: newDisplay,
                    stack: newStack,
                    result: evaluateWithNewValue(newExpr, 'deleteLast', newStack.length),
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

	const handleAddSpecial = value => {
		dispatch({type: action.ADD_SPECIAL, payload: value});
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
		handleAddSpecial,
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

function renderForCalculation(currentExpr) {
    if (/π/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/π/gi, math.pi);
    } 
    if (/exp1/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/exp1/gi, 'exp(1)');
    }
    if (/mod/gi.test(currentExpr)) {
        currentExpr = currentExpr.replace(/mod/gi, '%');
    }
    return currentExpr;
}

function evaluateWithNewValue(currentExpr, newValue, stackLength) {
	if (numbers.includes(newValue) || newValue === ')' || newValue === "calculate") {
        currentExpr += newValue === 'calculate' ? '' : newValue;
        currentExpr = renderForCalculation(currentExpr);
		return math.evaluate(fillInClosingParen(currentExpr, stackLength)).toString();
	} 
	return '';
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
        if (/\d de$/g.test(newExpr)) {
            newExpr = newExpr.replace(/\d de$/g, '');
        }
        newStack = currentStack.map(i => i);
    }
    return [newExpr, newStack, newDisplay];
}

function testIfUnary(currentExpr) {
    for (let rx of rxAdd) {
        if (rx.test(currentExpr)) {
            return true;
        }
    }
    return false;
}

function renderCorrectAngleUnit(isDegree, currentExpr, newValue) {
    if (isDegree) {
        let boo = testIfUnary(currentExpr);
        if (boo) {
            if (/ deg$/g.test(currentExpr)) {
                currentExpr = currentExpr.replace(/ deg$/g, '')
            }
            return currentExpr + `${newValue} deg`;
        }
    } else {
        if (rxAdd.some(rx => rx.test(currentExpr))) {
            if (/ rad$/g.test(currentExpr)) {
                currentExpr = currentExpr.replace(/ rad$/g, '')
            }
            return currentExpr + `${newValue} rad`;
        }
    }
    return currentExpr + newValue;
}