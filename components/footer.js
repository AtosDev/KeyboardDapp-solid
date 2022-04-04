import { FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className='w-full flex justify-center items-center mt-20 flex-wrap'>
      <a
        href='https://twitter.com/MFaiqKhan3'
        target='_blank'
        rel='noopener noreferrer'
        className="text-gray-500 font-medium text-sm text-center  cursor-pointer"
      >
       <p className="w-full flex justify-between m-5 text-lg"> MADE BY <FiTwitter className="text-blue-400  text-center text-4xl"/> @MFaiqKhan3 </p>
      </a>
    </footer>
  )
}