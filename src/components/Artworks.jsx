import React, { useState, useEffect } from 'react'
import { setGlobalState, useGlobalState, shortenString } from '../store'

const Artworks = () => {
    const [nfts] = useGlobalState('nfts')
    const [end, setEnd] = useState(4)
    const [count, setCount] = useState(4)
    const [collection, setCollection] = useState([])

    const getCollection = () => {
        return nfts.slice(0, end)
    }

    useEffect(() => {
        setCollection(getCollection())
    }, [nfts, end])
    return (
        <div className='bg-[#151c25] gradient-bg-artworks'>
            <div className='w-4/5 py-10 mx-auto'>
                <h4 className='text-white text-3xl font-bold uppercase
                text-gradient'>
                    {collection.length > 0 ? 'Latest Artworks' : 'No Artworks Yet'}
                </h4>
                <div className='grid grid-cols-1 md:grid-col-3 lg:grid-cols-4 gap-6 
                md:gaps-3 py-2.5'
                >
                    {
                        collection.map((nft, i) => {
                            return (
                                <Card key={i} nft={nft} />
                            )
                        })
                    }
                </div>
                {collection.length > 0 && nfts.length > collection.length
                    ?
                    <div className='text-center my-5'>
                        <button className='shadow-lg shadow-black text-white
                    bg-[#e32970] hover:bg-[#bd255f] rounded-full p-2'
                            onClick={() => setEnd(end + count)}>
                            Load more
                        </button>
                    </div>
                    :
                    null
                }
            </div>
        </div>
    )
}

const Card = ({ nft }) => {
    const setNft = () => {
        setGlobalState('nft', nft)
        setGlobalState('showModal', 'scale-100')
    }
    return (
        <div className='w-full shadow-xl shadow-black rounded-md overflow-hidden 
        bg-gray-800 my-2 p-3'>
            {/* relative */}
            <img className='h-60 w-full object-cover shadow-lg shadow-black
            rounded-lg mb-3' src={nft.metadataURI} alt={nft.title} />
            <h4 className='text-white font-semibold'>{nft.title}</h4>
            <p className='text-gray-400 text-sm my-1'>
                {shortenString(nft.description, 200)}
            </p>
            <div className='flex justify-between items-center mt-3 text-white'>
                {/* absolute bottom-0 */}
                <div className='flex flex-col'>
                    <small className='text-xs'>Current Price</small>
                    <p className='text-sm font-semibold'>{nft.cost} ETH</p>
                </div>
                <button className='shadow-lg shadow-black text-sm rounded-full px-1.5 py-1
                bg-[#e32970] hover:bg-[#bd255f]'
                    onClick={setNft}>
                    View Details
                </button>
            </div>

        </div>
    )
}
export default Artworks