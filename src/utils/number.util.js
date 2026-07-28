/**
 *
 * @param {*} number
 * @param {*} decimals default: 2
 * @returns decimal number 0.00
 */
export const round = (number, decimals = 2) => {
    return +(Number(number).toFixed(decimals));
};
