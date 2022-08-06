import { useState, useCallback } from "react";

const math = require('mathjs');

const binaryOps = ['+', '-', '*', '/', '.', '^', '%'];
const unaryFns = ['sqrt', 'exp', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
'log', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];
export const digits = Array.from(Array(9), (_, d) => d + 1);

export function useDisplayUpdate(initialValue) {
	const [display, updateDisplay] = useState(initialValue);
	
    const handleAddExpression = useCallback((expression) => {
        updateDisplay(function(prevState) {
            return {
                ...prevState,
                expression: prevState.expression + expression,
                result: math.evaluate(prevState.expression + expression).toString(), 
            };
        });
    }, []);

	const handleAddDigit = useCallback((value) => {
		updateDisplay(function(prevState) {
            console.log(prevState);
            return {
			...prevState,
			expression: prevState.expression + value,
			result: evaluateWithNewValue(prevState.expression, 
				value, prevState.stack.length),
		    };
        });
    }, []);

	const handleAddBinaryOperator = useCallback((value) => {
		updateDisplay(function(prevState) {
            const invalid = (prevState.expression === '' || 
						binaryOps.includes(prevState.expression.slice(-1)) || 
						prevState.expression.slice(-1) === '(');
            if (invalid) {
                return;
            } else {
                return {
                    ...prevState,
                    expression: prevState.expression + value,
                };
            }
        });
	}, []);

	const handleAddUnaryOperator = useCallback((value) => {
		updateDisplay(function(prevState) {
            if (value === '^2' || value === '!')  {
                if (digits.includes(prevState.expression.slice(-1))) {
                    return {
                        ...prevState,
                        expression: prevState.expression + value,
                        result: evaluateWithNewValue(prevState.expression, 
                            value, prevState.stack.length),
                    };
                } else {
                    return;
                }
            } else {
                let newStack = (prevState.stack.length === 0) ? 
                                [1] : [...prevState.stack, 1];
                return {
                    ...prevState,
                    expression: prevState.expression + value + '(',
                    stack: newStack,
                };
            }
        });
	}, []);

	const handleAddSpecial = useCallback(value => {
		updateDisplay(function(prevState) {
            if (value === 'pi') {
                value = math.pi;
            } else if (value === '!' && 
            !digits.includes(Number.parseInt(prevState.expression.slice(-1)))) {
                value = '';
            } 
            return {
                ...prevState,
                expression: prevState.expression + value,
                result: evaluateWithNewValue(prevState.expression, 
                    value, prevState.stack.length),
            };
        });
	}, []);

	const handleAddParenthesis = useCallback((value) => {
        updateDisplay(function(prevState) {
            const conditionOpen = prevState.expression === '' || 
				digits.includes(Number.parseInt(prevState.expression.slice(-1))) ||
				prevState.expression.slice(-1) === '(' ||
			    (prevState.expression.slice(-1) === ')' && prevState.stack.length === 0) ||
				(binaryOps.includes(prevState.expression.slice(-1)));
            const conditionClose = digits.includes(Number.parseInt(prevState.expression.slice(-1))) || 
				prevState.stack.length > 0;
            if (value === '(' && conditionOpen) {
                let newState = {
                    ...prevState,
                    expression: prevState.expression + value,
                    stack: [...prevState.stack, 1],
                    result: evaluateWithNewValue(prevState.expression,
                        value, prevState.stack.length + 1),
                };
                return newState;
            } else if (value === ')' && conditionClose) {
                let newState = {
                    ...prevState,
                    expression: prevState.expression + value,
                    stack: prevState.stack.filter((_, i) => i < prevState.stack.length - 1),
                    result: evaluateWithNewValue(prevState.expression,
                        value, prevState.stack.length - 1),
                };
                return newState;
            } else {
                return;
            }
        });
	}, []);
	
    const handleCalculation = useCallback(() => {
        updateDisplay(function(prevState) {
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
        updateDisplay(function(prevState) {
            let expr = prevState.previous !== '' ? prevState.previous : prevState.expression;
            let [newExpr, newStack] = removePreviousValue(expr, prevState.stack);
            return {
                ...prevState,
                expression: newExpr,
                stack: newStack,
                result: evaluateWithNewValue(newExpr, 'deleteLast', newStack.length),
                previous: '',
            }
        });
    }, []);

    const handleResetCalculator = useCallback(() => {
        updateDisplay(function(prevState) {
            return {
                ...prevState,
                expression: '',
                result: '',
                stack: [],
            }
        });
    }, []);

    const handleClearHistory = useCallback(() => {
        updateDisplay({
            history: [],
        });
    }, []);

    const handleToggleDegree = useCallback(() => {
        updateDisplay(function(prevState) {
            return {
                ...prevState,
                isDegree: !prevState.isDegree,
            }
        });
    }, []);

    const handleToggleInverted = useCallback(() => {
        updateDisplay(function(prevState) {
            return {
                ...prevState,
                isInverted: !prevState.isInverted,
            }
        });
    }, []);

	return {
		display, 
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

function evaluateWithNewValue(currentExpr, newValue, stackLength) {
	if (digits.includes(Number.parseInt(newValue)) || 
    newValue === ')') {
		return math.evaluate(fillInClosingParen(currentExpr + newValue, 
            stackLength)).toString();
	} else if (newValue === "calculate") {
        return math.evaluate(fillInClosingParen(currentExpr, stackLength)).toString();
    }
	return '';
}

function removePreviousValue(currentExpr, currentStack) {
    const regex = new RegExp(`(${unaryFns.join('|')})$`, 'gi');
    let lastValue = currentExpr.slice(-1);
    let newExpr = currentExpr.slice(0, -1);
    let newStack = null;
    if (lastValue.slice(-1) === ')') {
        newStack = currentStack.length === 0 ? [1] : [...currentStack, 1];
    } else if (lastValue.slice(-1) === '(') {
        if (regex.test(newExpr)) {
            newExpr = newExpr.replace(regex, '');
        }
        newStack = currentStack.filter((_, i) => i < currentStack.length - 1);
    } else {
        newStack = currentStack.map(i => i);
    }
    return [newExpr, newStack];
}