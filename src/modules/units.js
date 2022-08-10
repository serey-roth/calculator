import { useState } from 'react';

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

export function getUnits(category) {
    return Object.values(UNITS[category])
}  

export function useConverter(initialValue) {
    const [converter, updateConverter] = useState(initialValue);

    const convert = (value, category, from, to) => {
        updateConverter(prevState => ({
                ...prevState,
                value: value,
                category: category,
                from: from,
                to: to,
                result: math.evaluate(`${value} ${from} to ${to}`),
            })
        );
    }

    const changeFromUnit = (from) => {
        updateConverter(prevState => ({
            ...prevState,
            from: from,
            result: math.evaluate(`${prevState.value} ${from} to ${prevState.to}`),
        }));
    }

    const changeToUnit = (to) => {
        updateConverter(prevState => ({
            ...prevState,
            to: to,
            result: math.evaluate(`${prevState.value} ${prevState.from} to ${to}`),
        }));
    }

    return {
        converter,
        convert,
        changeToUnit,
        changeFromUnit,
    }
}