import { SiEthereum } from "react-icons/si";

const AddressBar = ( {connectedAccount} ) => {
  return (
    <div className="flex  items-center justify-start w-1/2 md:mt-0 mt-10">
      {/* this is the right side of the welcome page  */}
      <div className="p-2 justify-end items-start flex-col rounded-xl h-10 mb-4 pb-5 w-full my-5 gradient-btn">
        <p className="text-white flex justify-center items-center mb-2"> <SiEthereum color="#fff" fontSize={21} className="mr-8 flex justify-start"/> <span className="pr-2">Connected Account: </span> {connectedAccount} </p>
      </div>
    </div>
  );
};

export default AddressBar;
