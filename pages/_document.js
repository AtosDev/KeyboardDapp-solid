import Document, { Html, Head, Main, NextScript } from 'next/document'
import Footer from '../components/footer'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body className='bg-gradient-to-r from-gray-400  to-white'>
          <main className='max-w-3xl mx-auto'>
            <h1 className='mt-16 mb-5 text-4xl text-transparent bg-clip-text gradient-btn flex justify-start items-end font-bold'>
              Keyboard Creator Dapp
            </h1>
            <Main />
          </main>
          <Footer />
          <NextScript />

        </body>
      </Html>
    )
  }
}

export default MyDocument

