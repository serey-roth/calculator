import { useState, useEffect, useCallback } from "react";

const math = require('mathjs');

const ops = ['+', '-', '*', '/', '.', '^', '%'];
export const digits = Array.from(Array(9), (_, d) => d + 1);

function fillInClosingParen(currentExpr, stackLength) {
    for (let i = 0; i < stackLength; i++) {
        currentExpr += ')';
    }
    return currentExpr;
}

function evaluateWithNewValue(currentExpr, newValue, stackLength) {
	if (digits.includes(Number.parseInt(newValue)) || 
    newValue === ')' 
    || newValue === "") {
		return math.evaluate(fillInClosingParen(currentExpr + newValue, stackLength)).toString();
	}	
	return '';
}

export function useDisplayUpdate(initialValue) {
	const [display, updateDisplay] = useState(initialValue);

	useEffect(() => {
		updateDisplay(prevState => ({
			...prevState,
			expression: '',
			stack: [],
			result: '',
			previous: '',
            history: [],
			isDegree: true,
			isInverted: false,
		}))
	}, [])
	
    const handleAddExpression = useCallback((expression) => {
        updateDisplay(prevState => ({
            ...prevState,
            expression: prevState.expression + expression,
            result: math.evaluate(prevState.expression + expression).toString(), 
        }))
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
		const invalid = (display.expression === '' || 
						ops.includes(display.expression.slice(-1)) || 
						display.expression.slice(-1) === '(');
		if (invalid) {
			return;
		} else {
			updateDisplay(prevState => ({
				...prevState,
				expression: prevState.expression + value,
			}));
		}
	}, [display.expression]);

	const handleAddUnaryOperator = useCallback((value) => {
		updateDisplay(function(prevState) {
            console.log(prevState);
            let newStack = (prevState.stack.length === 0) ? 
            [1] : 
            [...prevState.stack, 1];
            return {
                ...prevState,
                expression: prevState.expression + value + '(',
                stack: [...newStack],
            };
        });
	}, []);

	const handleAddSpecial = useCallback(value => {
		if (value === 'pi') {
			value = math.pi;
		} else if (value === '!' && 
        !digits.includes(Number.parseInt(display.expression.slice(-1)))) {
			value = '';
		} 
		updateDisplay(prevState => ({
			...prevState,
			expression: prevState.expression + value,
			result: evaluateWithNewValue(prevState.expression, 
				value, prevState.stack.length),
		}));
		
	}, [display.expression]);

	const handleAddParenthesis = useCallback((value) => {
		if (value === '(') {
			const conditionOpen = display.expression === '' || 
								digits.includes(Number.parseInt(display.expression.slice(-1))) ||
								display.expression.slice(-1) === '(' ||
								(display.expression.slice(-1) === ')' && display.stack.length === 0) ||
								(ops.includes(display.expression.slice(-1)));
			if (conditionOpen) {
				updateDisplay(function(prevState) {
                    console.log(prevState);
                    let newState = {
                        ...prevState,
                        expression: prevState.expression + value,
                        stack: [...prevState.stack, 1],
                        result: evaluateWithNewValue(prevState.expression,
                            value, prevState.stack.length + 1),
                    };
                    console.log(newState);
                    return newState;
                });
			} else {
				return;
			}
		} else {
			const conditionClose = digits.includes(Number.parseInt(display.expression.slice(-1))) || 
								display.stack.length > 0;
			if (conditionClose) {
                updateDisplay(function(prevState) {
                    console.log(prevState);
                    let newState = {
                        ...prevState,
                        expression: prevState.expression + value,
                        stack: prevState.stack.filter((_, i) => i < prevState.stack.length - 1),
                        result: evaluateWithNewValue(prevState.expression,
                            value, prevState.stack.length - 1),
                    };
                    console.log(newState);
                    return newState;
                });
			} else {
				return;
			}
		}
	}, [display.expression, display.stack]);
	
    const handleCalculation = useCallback(() => {
        if (display.expression !== '' && !ops.includes(display.expression.slice(-1))) {
            updateDisplay(function(prevState) {
                let expr = fillInClosingParen(prevState.expression, prevState.stack.length);
                let res = evaluateWithNewValue(prevState.expression, '', 
                prevState.stack.length);
                let newState = {
                    ...prevState,
                    expression: res,
                    previous: expr,
                    history: [...prevState.history, {
                        expression: expr,
                        result: res,
                    }], 
                    result: res,
                };
                console.log(newState);
                return newState;
            });
        }
    }, [display.expression]);

    const handleDeleteLast = useCallback((value) => {
        let expr = display.previous !== '' ? display.previous : display.expression;
        if (expr.slice(-1) === ')') {
            updateDisplay(prevState => ({
                ...prevState,
                expression: prevState.expression.slice(0, -1),
                stack: [...prevState.stack, 1],
                result: evaluateWithNewValue(prevState.expression.slice(0, -1), '', 
                prevState.stack.length + 1),
                previous: '',
            }));
        } else if (expr.slice(-1) === '(') {
            updateDisplay(prevState => ({
                ...prevState,
                expression: prevState.expression.slice(0, -1),
                stack: prevState.stack.filter((_, i) => i < prevState.stack.length),
                result: evaluateWithNewValue(prevState.expression.slice(0, -1), '', 
                prevState.stack.length - 1),
                previous: '',
            }));
        }
    }, [display.expression, display.previous]);

    const handleResetCalculator = useCallback(() => {
        updateDisplay({
            expression: '',
            result: '',
            stack: [],
        });
    }, []);

    const handleClearHistory = useCallback(() => {
        updateDisplay({
            history: [],
        });
    }, []);

    const handleToggleDegree = useCallback(() => {
        updateDisplay(prevState => ({
            isDegree: !prevState.isDegree,
        }));
    }, []);

    const handleToggleInverted = useCallback(() => {
        updateDisplay(prevState => ({
            isInverted: !prevState.isInverted,
        }));
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