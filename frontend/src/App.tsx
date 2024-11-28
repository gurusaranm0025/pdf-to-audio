import React, { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  // const [response, setResponse] = useState<string>('')
  const [audioURL, setAudioURL] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert("Please select a file.")
    }

    setLoading(true)
    // setResponse('')

    const formData = new FormData();
    if (file != null) {
      formData.append("file", file)
    } else {
      // setResponse("Recieved empty file.")
      setLoading(false)
      return
    }

    try {
      const res = await axios.post("my/server", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: 'blob',
      })

      const audioBlob = new Blob([res.data], { type: 'audio/mp3' })
      const url = URL.createObjectURL(audioBlob)
      setAudioURL(url)

      const link = document.createElement('a')
      link.href = audioURL
      link.download = 'audio.mp3'
      link.click()

      // work on the response from the backend
      // setResponse(res.data.message)
    } catch (error) {
      // setResponse("Error uplaoding the file");
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className='w-screen h-screen bg-lilac-gray flex flex-col gap-4'>

      <div className='pl-5 flex items-center'>
        <p className='text-2xl poppins-medium text-dusk-ame py-5'>PDF to Audio Convertor</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='w-4/5 mx-auto p-3 mt-8 bg-dusty-indigo rounded-xl shadow-sm'>
          {/* <h2 className='text-lg poppins-medium mb-4 text-center'>
            Upload a PDF file
          </h2> */}

          <label
            htmlFor="file-upload"
            className='w-full min-h-28 p-4 rounded-xl border-2 border-dashed border-lilac-gray cursor-pointer bg-transparent transition-all flex items-center justify-center duration-300 hover:border-white hover:text-white'
          >
            <span className='text-lilac-gray poppins-semibold text-xl'>
              Drag and drop a file here or click here to upload
            </span>
          </label>

          <input
            id='file-upload'
            type="file"
            accept='.pdf'
            className='hidden'
            onChange={handleFileChange}
          />

        </div>

        <div className='mt-4 flex justify-center'>
          <button
            type='submit'
            className={`px-7 py-3 rounded-xl text-lg mt-3 duration-300 outline-none bg-dusk-ame text-white hover:bg-dusty-indigo hover:outline-2 hover:outline-dusty-indigo focus:bg-dusty-indigo focus:outline-2 focus:outline-dusty-indigo ${loading && "bg-mauve outline-2 outline-mauve"}`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </form>

      {/* <div className='w-4/5 mx-auto mt-8 mb-3 flex-grow bg-dusty-indigo rounded-xl shadow-sm'>
        {
          response && <p className='text-center text-lg'>{response}</p>
        }
      </div> */}
    </div>
  )
}

export default App
