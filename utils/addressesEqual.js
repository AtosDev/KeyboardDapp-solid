export default function addressesEqual(addr1, addr2) {
    if(!addr1 || !addr2) return false; // if addr1 or addr2 is undefined then return false
    return addr1.toUpperCase() === addr2.toUpperCase(); // if addr1 and addr2 are equal then return true
}
  
// so basically if both are undefined or not present then it will return false and will render tipping button 
// if both are present and equal then it will return true and will render user button