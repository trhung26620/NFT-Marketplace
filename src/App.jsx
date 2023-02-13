import Artworks from "./components/Artworks"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Transactions from "./components/Transactions"
import CreateNFT from "./components/CreateNFT"
import ShowNFT from "./components/ShowNFT"
import UpdateNFT from "./components/UpdateNFT"
import Loading from "./components/Loading"
import Alert from "./components/Alert"
import { useEffect } from "react"
import { getAllNFTs, isWalletConnected } from "./Blockchain.services"

const App = () => {
  useEffect(async () => {
    await isWalletConnected()
    await getAllNFTs()
  }, [])
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
        <Hero />
      </div>
      <Artworks />
      <Transactions />
      <Footer />
      <CreateNFT />
      <ShowNFT />
      <UpdateNFT />
      <Loading />
      <Alert />
    </div>
  )
}

export default App
