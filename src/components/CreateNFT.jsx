import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { setAlert, setGlobalState, setLoadingMsg, useGlobalState } from '../store'
const imgHero = 'https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg'
import { create } from 'ipfs-http-client'
import { mintNFT } from '../Blockchain.services'
import env from "react-dotenv";

const auth = 'Basic ' + Buffer.from(
    env.PROJECTID_INFURA + ':' + env.KEY_INFURA).toString('base64')

const client = create({
    host: 'ipfs.infura.io',
    port: '5001',
    protocol: 'https',
    headers: {
        authorization: auth
    }
})

const CreateNFT = () => {
    const [modal] = useGlobalState('modal')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [fileUrl, setFileUrl] = useState('')
    const [imgBase64, setImgBase64] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !description || !price) return
        setGlobalState('modal', 'scale-0')
        setLoadingMsg('Uploading to IPFS...')
        try {
            const created = await client.add(fileUrl);
            setLoadingMsg('Uploaded, approve transaction now...')
            const metadataURI = `https://ipfs.io/ipfs/${created.path}`
            const nft = { title, description, price, metadataURI }
            await mintNFT(nft)
            resetForm()
            closeModal()
            setAlert('Minting completed...')
            window.location.reload()
        } catch (error) {
            console.log('Error uploading file: ', error)
            setAlert('Minting failed...', 'red')
        }
    }

    const changeImage = async (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])

        reader.onload = (readerEvent) => {
            const file = readerEvent.target.result
            setImgBase64(file)
            setFileUrl(e.target.files[0])
        }
    }

    const resetForm = () => {
        setFileUrl('')
        setImgBase64('')
        setTitle('')
        setDescription('')
        setPrice('')
    }

    const closeModal = () => {
        setGlobalState('modal', 'scale-0')
        resetForm()
    }
    return (
        <div className={`fixed top-0 left-0 w-screen h-screen
        flex items-center justify-center bg-black bg-opacity-50
        transform transition-transform duration-300 ${modal}`}>
            <div className='bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12
            md:w-2/5 h-7/12 p-6'>
                <form onSubmit={handleSubmit} className='flex flex-col' action="">
                    <div className='flex justify-between items-center text-gray-400'>
                        <p className='font-semibold testt'>Add NFT</p>
                        <button type='button' className='border-0 bg-transparent
                        focus:outline-none' onClick={closeModal}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className='flex justify-center items-center rounded-xl mt-5'>
                        <div className='shrink-0 rounded-xl overflow-hidden h-20 w-20'>
                            <img className='h-full w-full object-cover
                            cursor-pointer' src={imgBase64 || imgHero} alt="NFT" />
                        </div>
                    </div>

                    <div className='flex justify-between items-center bg-gray-800 rounded-xl
                    mt-5'>
                        <label className='block'>
                            <span className='sr-only'>Choose Profile Photo</span>
                            <input
                                type="file"
                                accept='image/png, image/gif, image/jpeg, image/jpg, image/webp'
                                className='block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#19212c] file:text-gray-400
                                hover:file:bg-[#1d2631]
                                cursor-pointer focus:ring-0 focus:outline-none'
                                onChange={changeImage}
                                required
                            />
                        </label>
                    </div>

                    <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                        <input
                            className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
                            type="text"
                            name="title"
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            required
                        />
                    </div>
                    <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                        <input
                            className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
                            type="number"
                            step={0.01}
                            min={0.01}
                            name="price"
                            placeholder="Price (Eth)"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                            required
                        />
                    </div>

                    <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                        <textarea
                            className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 h-20"
                            type="text"
                            name="description"
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        // onClick={handleSubmit}
                        className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#e32970]
              hover:bg-[#bd255f] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#e32970]
              hover:border hover:border-[#bd255f]
              focus:outline-none focus:ring mt-5"
                    >
                        Mint Now
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateNFT