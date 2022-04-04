export const shortenAddress = (address) => ( // implicit return
`${address.slice(0, 6)}...${address.slice(address.length - 5)}`
);