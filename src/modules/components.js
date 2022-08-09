import { useState } from "react";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const ITEM_HEIGHT = 48;

const dayjs = require('dayjs');

export function LongMenu(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (e) => {
		if (e.target.innerText === 'History') {
			props.onClickHistoryPanel();
		} else if (e.target.innerText === 'About') {
			props.onClickAboutPanel();
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