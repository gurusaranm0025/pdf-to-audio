import React, { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [file, setFile] = useState<File|null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [response, setResponse] = useState<string |null>(null)

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
    setResponse(null)

    const formData = new FormData();
    formData.append("file", file)

    try {
      const res = await axios.post("my/server", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // work on the response from the backend
      setResponse(res.data.message)
    } catch (error){
      setResponse("Error uplaoding the file");
    } finally {
      setLoading(false)
    }
  }

  return (
    
      <div className='w-screen h-screen bg-gray-400 flex flex-col gap-4'>
        <div className='pl-5 h-10 flex items-center'>
          <p className='text-lg poppins-regular'>PDF to Audio Convertor</p>
        </div>

        <div className='w-4/5 mx-auto mt-8 bg-gray-200 rounded shadow'>
          {/* <h2 className='text-lg poppins-medium mb-4 text-center'>
            Upload a PDF file
          </h2> */}

          <form onSubmit={handleSubmit}>
            <label 
              htmlFor="file-upload"
              className='block w-full p-4 border-2 border-dashed border-gray-300 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 duration-200 transition-all'
              >
                <span className='text-gray-500'>
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

              <div className='mt-4 flex justify-center'>
                <button
                  type='submit'
                  className='px-6 py-2 bg-blue-600'
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Uploading PDF"}
                </button>
              </div>
          </form>
        </div>

        <div className='w-4/5 mx-auto mt-8 flex-grow bg-gray-500 mb-3'>
            {
              response && <p className='text-center text-lg'>{response}</p>
            }
        </div>
      </div>
    )
}

export default App
