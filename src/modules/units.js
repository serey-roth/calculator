import { useState } from 'react';
import { numbers } from './calculator';

const UNITS = {
    'length': {
        'kilometer': 'km',
        'meter': 'm',
        'centimeter': 'cm',
        'millimeter': 'mm',
        'micrometer': 'um',
        'nanometer': 'nm',
        'mile': 'mi',
        'yard': 'yd',
        'foot': 'ft',
        'inch': 'in',
        'angstrom': 'angstrom'
    },
    'area': {
        'square kilometer': 'km2',
        'square meter': 'm2',
        'square mile': 'sqmi',
        'square yard': 'sqyd',
        'square foot': 'sqft',
        'square inch': 'sqin',
        'hectare': 'hectare',
        'acre': 'acre',
    },
    'volume': {
        'cubic meter': 'm2',
        'liter': 'l',
        'milliliter': 'ml',
        'cubic yard': 'cuyd',
        'cubic foot': 'cuft',
        'cubic inch': 'cuin',
        'teaspoon': 'teaspoon',
        'tablespoon': 'tablespoon',
        'fluid ounce': 'floz',
        'cup': 'cp',
        'pint': 'pt',
        'quart': 'qt',
        'gallon': 'gallon',
    },
    'time': {
        'nanosecond': 'ns',
        'microsecond': 'us',
        'millisecond': 'ms',
        'second': 'secs',
        'minute': 'mins',
        'hour': 'hrs',
        'day': 'days',
        'week': 'weeks',
        'month': 'months',
        'year': 'years',
        'decades': 'decades',
        'century': 'century',
        'millenium': 'millennia',
    },
    'temperature': {
        'celsuis': 'degC',
        'fahrenheit': 'degF',
        'kelvin': 'K',
    },
    'mass': {
        'tonne': 'tonne',
        'kilogram': 'kg',
        'gram': 'g',
        'milligram': 'mg',
        'microgram': 'ug',
        'pound': 'lb',
        'ounce': 'oz',
        'stone': 'stone',
    },
    'energy' : {
        'kilojoule': 'kJ',
        'joule': 'J',
        'kilowatt hour': 'kWh',
        'watt hour': 'Wh',
        'electronvolt': 'eV'
    },
    'frequency': {
        'gigahertz': 'GHz',
        'megahertz': 'MHz',
        'kilohertz': 'gHz',
        'hertz': 'gHz',
    },
    'pressure': {
        'bar': 'bar',
        'pascal': 'Pa',
        'pound-force per square inch': 'psi',
        'standard atmosphere': 'atm',
        'torr': 'torr'
    },
    'plane angle': {
        'degree': 'deg',
        'gradian': 'grad',
        'milliradian': 'mrad',
        'minute of arc': 'arcmin',
        'radian': 'rad',
        'second of arc': 'arcsec',
    },
    'digital storage': {
        'bit': 'b',
        'megabit': 'b',
        'gigabit': 'b',
        'terabit': 'b',
        'petabit': 'b',
        'byte': 'B',
        'megabyte': 'B',
        'gigabyte': 'B',
        'terabyte': 'B',
        'petabyte': 'B',
    },
    'fuel economy': {
        'miles per gallon': 'mi/gallon',
        'kilometer per liter':  'km/l',
    },
    'electricty and magnetism': {
        'ampere': 'A',
        'coulomb': 'C',
        'watt': 'W',
        'volt': 'V', 
        'ohm': 'ohm',
        'farad': 'F',
        'weber': 'Wb',
        'tesla': 'T',
        'henry': 'H',
        'siemens': 'S',
        'electronvolt': 'eV',
    }
}

const math = require('mathjs');

export function getCategories() {
    return Object.keys(UNITS);
}

function removeUnitsFromStringRep(result) {
    return result.replace(/ .+/g, '');
}
export function useConverter(initialValue) {
    const [converter, updateConverter] = useState(initialValue);

    const addDigit = (value) => {
        updateConverter(function(prevState) {
            if (value === '.' && !numbers.includes(prevState.value.slice(-1))) {
                return {...prevState};
            }
            let newValue = prevState.value + value;
            let newResult = prevState.result;
            if (!(prevState.to === '' || prevState.from === '')) {
                newResult = removeUnitsFromStringRep(math.evaluate(
                    `${newValue} ${prevState.from} to ${prevState.to}`).toString());
            }
            return {
                ...prevState,
                value: newValue,
                result: newResult,
            }
        });
    }

    const deleteDigit = () => {
        updateConverter(function(prevState) {
            let newValue = prevState.value.slice(0, -1);
            let newResult = prevState.result;
            if (!(newValue === '' || 
            prevState.to === '' || prevState.from === '')) {
                newResult = removeUnitsFromStringRep(math.evaluate(
                    `${newValue} ${prevState.from} to ${prevState.to}`).toString());
            } else if (newValue === '') {
                newResult = '';
            }
            return {
                ...prevState,
                value: newValue,
                result: newResult,
            }
        });
    }

    const changeFromUnit = (from) => {
        updateConverter(function(prevState) {
            const newUnit = UNITS[prevState.category][from];
            let newTo = prevState.to;
            let newToLabel = prevState.toLabel;
            if (newUnit === prevState.to) {
                newTo = prevState.from;
                newToLabel = prevState.fromLabel;
            }
            let newResult = prevState.result;
            if (!(prevState.value === '' || prevState.to === '')) {
                newResult = removeUnitsFromStringRep(math.evaluate(
                    `${prevState.value} ${newUnit} to ${newTo}`).toString());
            }
            return {
                ...prevState,
                fromLabel: from,
                from: newUnit,
                toLabel: newToLabel,
                to: newTo,
                result: newResult,
            }
        });
    }

    const changeToUnit = (to) => {
        updateConverter(function(prevState) {
            const newUnit = UNITS[prevState.category][to];
            let newFrom = prevState.from;
            let newFromLabel = prevState.fromLabel;
            if (newUnit === prevState.from) {
                newFrom = prevState.to;
                newFromLabel = prevState.toLabel;
            }
            let newResult = prevState.result;
            if (!(prevState.value === '' || prevState.from === '')) {
                newResult = removeUnitsFromStringRep(math.evaluate(
                    `${prevState.value} ${newFrom} to ${newUnit}`).toString());
            }            
            return {
                ...prevState,
                fromLabel: newFromLabel,
                from: newFrom,
                toLabel: to,
                to: newUnit,
                result: newResult,
            }
        });
    }

    const handleCategoryChange = (category) => { 
        updateConverter(prevState => ({
            ...prevState,
            category: category,
            units: UNITS[category],
        }));
    }

    return {
        converter,
        changeToUnit,
        changeFromUnit,
        addDigit,
        deleteDigit,
        handleCategoryChange,
    }
}

