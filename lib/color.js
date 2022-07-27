import chalk from 'chalk';

const color = (text, specifiedColor) => {
    return !specifiedColor ? chalk.green(text) : chalk.keyword(specifiedColor)(text)
}

export default color