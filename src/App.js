import { useState } from 'react';
import { 
	LongMenu, 
	History 
} from './modules/components'
import { useDisplayUpdate, digits } from './modules/logic';

function App() {
	const special = ['pi', 'e', '!'];
	const unaryOps = ['exp', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc'];
	const unaryOpsInv = ['log', 'asin', 'acos', 'atan', 'acot', 'asec', 'acsc'];
	const menuOptions = ['None', 'History'];

	const {
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
	} = useDisplayUpdate({
		expression: '',
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
	console.log(display.stack);

  	return (
      	<div className="app"> 
			<div className="calculator">
				<History 
				className={historyVisible ? "history open" : "history closed"}
				contents={display.history ? display.history : []}
				onClickHistoryItem={(e) => handleClickHistoryItem(e)}
				onClickClearHistory={handleClearHistory}
				/>
				<LongMenu 
				id="menu"
				options={menuOptions} 
				onClickHistoryPanel={() => toggleHistoryPanel()}/>
				<div className="display">
					<p>{display.expression || "0"}</p>
					{display.result ?  <p>({display.result})</p> : ""}					
				</div>
				<div className="scientific">
					<div className="alwaysVisible">
					  	{special.map(e => 
							<button 
							key={e}
							onClick={() => handleAddSpecial(e)}>{e}</button>	
						)}
					</div>
					<div className="drawer">
					   <div className="switchButtons">
							<button onClick={handleToggleDegree}>{display.isDegree ? 'DEG' : 'RAD'}</button>
							<button onClick={handleToggleInverted}>INV</button>
					   </div>
					   <div className="invertible">
						{display.isInverted ? 
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
						<button onClick={() => handleAddDigit(".")}>.</button>
						<button onClick={handleDeleteLast}>DEL</button>
					</div>
					<div className="operators">
						<button onClick={() => handleAddBinaryOperator("+")}>+</button>
						<button onClick={() => handleAddBinaryOperator("-")}>-</button>
						<button onClick={() => handleAddBinaryOperator("*")}>&times;</button>
						<button onClick={() => handleAddBinaryOperator("/")}>&divide;</button>
						<button onClick={() => handleAddParenthesis('(')}>(</button>
						<button onClick={() => handleAddParenthesis(')')}>)</button>
						<button onClick={() => handleAddBinaryOperator('%')}>mod</button>
						<button onClick={handleCalculation}>=</button>
						<button onClick={handleResetCalculator}>AC</button>
					</div>
				</div>
          	</div>
      	</div>
  	);
}

export default App;


