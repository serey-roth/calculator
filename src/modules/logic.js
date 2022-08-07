import { useState, useCallback } from "react";

const math = require('mathjs');

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'exp1', 'π'];
const binaryOps = ['+', '-', '*', '/', '.', '^', '%'];
const unaryFns = ['sqrt', 'exp', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
'log', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];

export function useCalculator(initialValue) {
	const [calc, updateCalc] = useState(initialValue);
	
    const handleAddExpression = useCallback((expression) => {
        updateCalc(function(prevState) {
            return {
                ...prevState,
                expression: prevState.expression + expression,
                forDisplay: prevState.forDisplay + expression,
                result: math.evaluate(prevState.expression + expression).toString(), 
            };
        });
    }, []);

	const handleAddDigit = useCallback((value) => {
		updateCalc(function(prevState) {
            console.log(prevState);
            return {
			...prevState,
			expression: prevState.expression + value,
            forDisplay: prevState.forDisplay + value,
			result: evaluateWithNewValue(prevState.expression, 
				Number.parseInt(value), prevState.stack.length),
		    };
        });
    }, []);

	const handleAddBinaryOperator = useCallback((value) => {
		updateCalc(function(prevState) {
            const invalid = (prevState.expression === '' || 
						binaryOps.includes(prevState.expression.slice(-1)) || 
						prevState.expression.slice(-1) === '(');
            if (invalid) {
                return prevState;
            } else {
                return {
                    ...prevState,
                    expression: prevState.expression + value,
                    forDisplay: prevState.forDisplay + value,
                };
            }
        });
	}, []);

	const handleAddUnaryOperator = useCallback((value) => {
		updateCalc(function(prevState) {
            if (value === 'x^2')  {
                if (numbers.includes(prevState.expression.slice(-1))) {
                    const newValue = value === 'x^2'? '^2': value;
                    return {
                        ...prevState,
                        expression: prevState.expression + newValue,
                        forDisplay: prevState.forDisplay + newValue,
                        result: evaluateWithNewValue(prevState.expression, 
                            newValue, prevState.stack.length),
                    };
                } else {
                    return prevState;
                }
            } else {
                let newValue = value;
                if (value === 'e^x') {
                    newValue = 'exp';
                } else if (value === '√') {
                    newValue = 'sqrt';
                }
                let newStack = (prevState.stack.length === 0) ? 
                                [1] : [...prevState.stack, 1];
                return {
                    ...prevState,
                    expression: prevState.expression + newValue + '(',
                    forDisplay: prevState.forDisplay + (value === '√' ? '√': newValue + '('),
                    stack: newStack,
                };
            }
        });
	}, []);

	const handleAddSpecial = useCallback(value => {
		updateCalc(function(prevState) {
            const newValue = value === 'e' ? 'exp1' : value;
            return {
                ...prevState,
                expression: prevState.expression + newValue,
                forDisplay: prevState.forDisplay + value,
                result: evaluateWithNewValue(prevState.expression, 
                    newValue, prevState.stack.length),
            };
        });
	}, []);

	const handleAddParenthesis = useCallback((value) => {
        updateCalc(function(prevState) {
            const conditionOpen = prevState.expression === '' || 
				numbers.includes(Number.parseInt(prevState.expression.slice(-1))) ||
				prevState.expression.slice(-1) === '(' ||
			    (prevState.expression.slice(-1) === ')' && prevState.stack.length === 0) ||
				(binaryOps.includes(prevState.expression.slice(-1)));
            const conditionClose = numbers.includes(Number.parseInt(prevState.expression.slice(-1))) || 
				prevState.stack.length > 0;
            if (value === '(' && conditionOpen) {
                let newState = {
                    ...prevState,
                    expression: prevState.expression + value,
                    forDisplay: prevState.forDisplay + value,
                    stack: [...prevState.stack, 1],
                    result: evaluateWithNewValue(prevState.expression,
                        value, prevState.stack.length + 1),
                };
                return newState;
            } else if (value === ')' && conditionClose) {
                let newState = {
                    ...prevState,
                    expression: prevState.expression + value,
                    forDisplay: prevState.forDisplay + value,
                    stack: prevState.stack.filter((_, i) => i < prevState.stack.length - 1),
                    result: evaluateWithNewValue(prevState.expression,
                        value, prevState.stack.length - 1),
                };
                return newState;
            } else {
                return prevState;
            }
        });
	}, []);
	
    const handleCalculation = useCallback(() => {
        updateCalc(function(prevState) {
            if (prevState.expression !== '' && !binaryOps.includes(prevState.expression.slice(-1))) {
                let expr = fillInClosingParen(prevState.expression, prevState.stack.length);
                let res = evaluateWithNewValue(prevState.expression, 'calculate', 
                prevState.stack.length);
                let newHistory = prevState.history.length === 0 ? 
                                [{
                                    expression: expr,
                                    result: res,
                                }] : 
                                [...prevState.history, 
                                {
                                    expression: expr,
                                    result: res,
                                }
                                ];
                let newState = {
                    ...prevState,
                    expression: res,
                    forDisplay: res,
                    previous: expr,
                    history: newHistory, 
                    result: res,
                };
                console.log(newState);
                return newState;
            }
        });
    }, []);

    const handleDeleteLast = useCallback((value) => {
        updateCalc(function(prevState) {
            let expr = prevState.previous !== '' ? prevState.previous : prevState.expression;
            let [newExpr, newStack, newDisplay] = removeLastValue(expr, prevState.stack, 
                prevState.forDisplay);
            return {
                ...prevState,
                expression: newExpr,
                forDisplay: newDisplay,
                stack: newStack,
                result: evaluateWithNewValue(newExpr, 'deleteLast', newStack.length),
                previous: '',
            }
        });
    }, []);

    const handleResetCalculator = useCallback(() => {
        updateCalc(function(prevState) {
            return {
                ...prevState,
                expression: '',
                forDisplay: '',
                result: '',
                stack: [],
            }
        });
    }, []);

    const handleClearHistory = useCallback(() => {
        updateCalc(function(prevState) {
            return {
                ...prevState,
                history: [],
            }
        });
    }, []);

    const handleToggleDegree = useCallback(() => {
        updateCalc(function(prevState) {
            return {
                ...prevState,
                isDegree: !prevState.isDegree,
            }
        });
    }, []);

    const handleToggleInverted = useCallback(() => {
        updateCalc(function(prevState) {
            return {
                ...prevState,
                isInverted: !prevState.isInverted,
            }
        });
    }, []);

	return {
		calc, 
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
    const regex = new RegExp(`(${unaryFns.join('|')})$`, 'gi');
    let lastValue = currentExpr.slice(-1);
    let newExpr = currentExpr.slice(0, -1);
    let newStack = null;
    let newDisplay = currentDisplay.slice(0, -1);
    if (lastValue.slice(-1) === ')') {
        newStack = currentStack.length === 0 ? [1] : [...currentStack, 1];
    } else if (lastValue.slice(-1) === '(') {
        if (regex.test(newExpr)) {
            newExpr = newExpr.replace(regex, '');
            newDisplay = newDisplay.replace(regex, '');
        }
        newStack = currentStack.filter((_, i) => i < currentStack.length - 1);
    } else {
        if (/exp$/.test(newExpr)) {
            newExpr = newExpr.replace(/exp$/, '');
        } 
        if (/mo$/.test(newDisplay)) {
            newDisplay = newDisplay.replace(/mo$/, '');
        } 
        newStack = currentStack.map(i => i);
    }
    return [newExpr, newStack, newDisplay];
}
