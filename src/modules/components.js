import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft, faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const ITEM_HEIGHT = 48;

const dayjs = require('dayjs');

export function ComboBox(props) {
	return (
		<Autocomplete
			disablePortal
			disableClearable
			clearOnEscape
			className='combo-box'
			options={props.options}
			renderInput={(params) => 
				<TextField {...params} label={props.label} />
			}
			value={props.value === '' ? null	: props.value}
			onChange={(event, newValue) => props.handleChange(newValue)}
		/>);
}

export function LongMenu(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (e) => {
		if (e.target.innerText === 'Unit Converter') {
			props.onClickConverter();
		}
		else if (e.target.innerText === 'History') {
			props.onClickHistoryPanel();
		} else if (e.target.innerText === 'About') {
			props.onClickAboutPanel();
		} else {
			props.onClickDefault();
		}
		setAnchorEl(null);
	};

	return (
		<div id={props.id}>
		<IconButton
			aria-label="more"
			id="long-button"
			aria-controls={open ? 'long-menu' : undefined}
			aria-expanded={open ? 'true' : undefined}
			aria-haspopup="true"
			onClick={handleClick}
		>
			<MoreVertIcon />
		</IconButton>
		<Menu
			id="long-menu"
			MenuListProps={{
				'aria-labelledby': 'long-button',
			}}
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: {
					maxHeight: ITEM_HEIGHT * 4.5,
					width: '20ch',
				},
			}}
		>
			{props.options.map((option) => (
			<MenuItem key={option} 
			selected={option === 'None'} 
			onClick={handleClose}>
				{option}
			</MenuItem>
			))}
		</Menu>
		</div>
	);
}

function DateGroup(props) {
	const list = props.list;
	return (
		<div className="date-group">
			<p className="date">{props.date}</p>
			{list.map((ex, index) => 
				<div className="expression-result"
				key={props.date + `_${index}`}>
					<p className="expression" onClick={props.onClickItem}>{ex.expression}</p>
					<p className="result" onClick={props.onClickItem}>{ex.result}</p>
				</div>)
			}
		</div>
	);
}

export function History(props) {
	return (
		<div className={props.className}>
			<div className="head">
				<button onClick={props.togglePanel}>
				<FontAwesomeIcon icon={faChevronLeft} />
				</button>
				<h3>History</h3>
				<p onClick={props.onClickClearHistory}>Clear</p>
			</div>
			<div className="main">
				{props.list.length > 0 ? 
					props.list.map((ex, index) => 
					<DateGroup 
					date={relativeTime(dayjs(ex.date), dayjs())}
					list={ex.list}
					key={ex.date}
					onClickItem={props.onClickHistoryItem}
					/>) : ''
				}
			</div>
		</div>	
	);
}

export function About(props) {
	return (
		<div className={props.className}>
			<div className="head">
				<button onClick={props.togglePanel}>
				<FontAwesomeIcon icon={faChevronLeft} />
				</button>
				<h3>About</h3>
			</div>
			<div className="main">
				<p>{props.text}</p>
				<p className='footer'>
				Copyright &copy; {props.year} {props.author}&nbsp;
				<a href={props.source_link} target="_blank" rel="noreferrer">Source</a>
				</p>
			</div>
		</div>	
	);
}

export function NumberPad(props) {
	return (
		<div className={props.className}>
			{props.digits.map(d => 
				<button
				onClick={() => props.handleAddDigit(d.toString())}
				key={d}>{d}</button>
			)}
			<button onClick={() => props.handleAddDigit("0")}>0</button>
			<button onClick={() => props.handleAddConstant('π')}>π</button>	
			<button onClick={() => props.handleAddConstant('e')}>e</button>	
			<button onClick={() => props.handleAddDigit(".")}>.</button>
			<button  id="del" onClick={props.handleDeleteLast}>
			<FontAwesomeIcon icon={faDeleteLeft} />
			</button>
		</div>
	);
}

export function OperatorPad(props) {
	return (
		<div className={props.className}>
			<button onClick={() => props.handleAddBinary("+")}>+</button>
			<button onClick={() => props.handleAddBinary("-")}>-</button>
			<button onClick={() => props.handleAddBinary("x")}>&times;</button>
			<button onClick={() => props.handleAddBinary("÷")}>&divide;</button>
			<button onClick={() => props.handleAddParenthesis('(')}>(</button>
			<button onClick={() => props.handleAddParenthesis(')')}>)</button>
			<button onClick={() => props.handleAddBinary('^')}>^</button>
			<button onClick={() => props.handleAddBinary('mod')}>mod</button>
			<button onClick={props.handleCalculation}>=</button>
			<button onClick={props.handleResetCalculator}>AC</button>
		</div>
	);
}

export function Scientific(props) {
	return (
		<div className={props.className}>
			<div className={props.childClass.toggleButtons}>
				<button onClick={props.handleToggleDegree}>{props.unit}</button>
				<button onClick={props.handleToggleInverted}>INV</button>
			</div>
			<div className={props.childClass.functions}>
				{props.functions.map(e => 
					<button 
						key={e}
						onClick={() => props.handleAddFunction(e)}>{e}</button>	
					) 
				}
			</div>
		</div>
	);
}

export function Unit(props) {
	return (
		<div className={props.className}>
			<TextField 
				className='text-field'
				value={props.value} />
			<ComboBox 
				options={props.options}
				label={props.label}
				value={props.unit}
				handleChange={props.handleChange}
			/>
		</div>
	);
}

function relativeTime(date, today) {
	let relDiff = Math.floor((today - date) / 86400000);
	if (relDiff === 0) { return 'Today'; } 
	else if (relDiff === 1) { return 'Yesterday'; }
	else if (relDiff >= 2 && relDiff <= 6) { return `${relDiff} days ago`; }
	else {
		let d = Math.floor(relDiff / 7);
		if (d === 1) { return 'Last week'; }
		else { return `${d} weeks ago`; }
	}
}