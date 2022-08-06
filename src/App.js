import { useState } from 'react';
import { 
	LongMenu, 
	History 
} from './modules/components'
import { digits, useCalculator } from './modules/logic';

function App() {
	const unaryOps = ['√', 'e^x', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc'];
	const unaryOpsInv = ['x^2', 'log', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];
	const menuOptions = ['None', 'History'];

	const {
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
	} = useCalculator({
		expression: '',
		forDisplay: '',
        stack: [],
        result: '',
        previous: '',
        history: [],
        isDegree: true,
        isInverted: false,
	});

	const [historyVisible, setHistoryVisible] = useState(false);

	const toggleHistoryPanel = () => {
		setHistoryVisible(!historyVisible);
	}

	const handleClickHistoryItem = (e) => {
		const item = e.target.textContent;
		handleAddExpression(item);
	}
	console.log(calc.stack);

  	return (
      	<div className="app"> 
			<div className="calculator">
				<History 
				className={historyVisible ? "history open" : "history closed"}
				contents={calc.history ? calc.history : []}
				onClickHistoryItem={(e) => handleClickHistoryItem(e)}
				onClickClearHistory={handleClearHistory}
				/>
				<LongMenu 
				id="menu"
				options={menuOptions} 
				onClickHistoryPanel={() => toggleHistoryPanel()}/>
				<div className="display">
					<p>{calc.forDisplay || "0"}</p>
					{calc.result ?  <p>({calc.result})</p> : ""}					
				</div>
				<div className="scientific">
					<div className="alwaysVisible">
						<button onClick={() => handleAddSpecial('π')}>π</button>	
						<button onClick={() => handleAddSpecial('e')}>e</button>	
					</div>
					<div className="drawer">
					   <div className="switchButtons">
							<button onClick={handleToggleDegree}>{calc.isDegree ? 'DEG' :
							 'RAD'}</button>
							<button onClick={handleToggleInverted}>INV</button>
					   </div>
					   <div className="invertible">
						{calc.isInverted ? 
							unaryOpsInv.map(e => 
								<button 
								key={e}
								onClick={() => handleAddUnaryOperator(e)}>{e}</button>	
								) : 
							unaryOps.map(e => 
								<button 
								key={e}
								onClick={() => handleAddUnaryOperator(e)}>{e}</button>	
								)}
					   </div>
					</div>
				</div>
				<div className="standard">
					<div className="digits">
						{digits.map(d => 
							<button
							onClick={() => handleAddDigit(d.toString())}
							key={d}>{d}</button>
						)}
						<button onClick={() => handleAddDigit("0")}>0</button>
						<button onClick={() => handleAddExpression(".")}>.</button>
						<button onClick={handleDeleteLast}>DEL</button>
					</div>
					<div className="operators">
						<button onClick={() => handleAddBinaryOperator("+")}>+</button>
						<button onClick={() => handleAddBinaryOperator("-")}>-</button>
						<button onClick={() => handleAddBinaryOperator("*")}>&times;</button>
						<button onClick={() => handleAddBinaryOperator("/")}>&divide;</button>
						<button onClick={() => handleAddParenthesis('(')}>(</button>
						<button onClick={() => handleAddParenthesis(')')}>)</button>
						<button onClick={() => handleAddBinaryOperator('^')}>^</button>
						<button onClick={() => handleAddUnaryOperator('!')}>!</button>
						<button onClick={() => handleAddBinaryOperator('mod')}>mod</button>
						<button onClick={handleCalculation}>=</button>
						<button onClick={handleResetCalculator}>AC</button>
					</div>
				</div>
          	</div>
      	</div>
  	);
}

export default App;


