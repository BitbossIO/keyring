export const reduceSymbols = input => (input.length < 10 ? input : `${input.slice(0, 5)}...${input.slice(-5)}`);
