import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'; // toast notification
import MetaMaskAccountProvider from '../context/meta-mask-account-provider';


function MyApp({ Component, pageProps }) {
  return (
  <MetaMaskAccountProvider>
  <Toaster /> {/* // toast notification displayer  That lets us send toasts from anywhere in our app and have them displayed!*/}
  <Component {...pageProps} />
  </MetaMaskAccountProvider>
  )
}

export default MyApp
