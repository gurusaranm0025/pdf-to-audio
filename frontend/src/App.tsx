import React, { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState({ isError: false, error: '' })

  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(false);
    const selectedFile = e.dataTransfer.files[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    } else {
      setError({ isError: true, error: "Please upload a valid file." })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError({ isError: true, error: 'Select a file first' })
      return
    }

    setError({ isError: false, error: '' })
    setLoading(true)

    const formData = new FormData();
    if (file != null) {
      formData.append("file", file)
    } else {
      setLoading(false)
      return
    }

    try {
      const res: any = await axios.post("http://localhost:8000/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: 'blob',
      })

      if (res.status == 200) {

        const audioBlob = new Blob([res.data])
        const url = URL.createObjectURL(audioBlob)

        const link = document.createElement('a')
        link.href = url
        link.download = `${file.name.substring(0, file.name.lastIndexOf('.'))}.mp3`
        document.body.appendChild(link)
        link.click()

        link.remove()
        URL.revokeObjectURL(url)
      } else if (res.status == 400 && res.message) {
        setError({ isError: true, error: res.message })
      }
    } catch (err: any) {
      setError({ isError: true, error: err.message })
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
        <div
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`w-4/5 mx-auto p-3 mt-8 rounded-xl duration-300 ${isDragging ? "shadow-lg bg-mauve" : "shadow-sm bg-dusty-indigo"}`}
        >

          <label
            htmlFor="file-upload"
            className={`group w-full min-h-[16vh] p-4 rounded-xl border-2 border-dashed border-lilac-gray cursor-pointer bg-transparent transition-all flex items-center justify-center duration-300 hover:border-white hover:text-white ${isDragging && "border-white"} ${file != undefined && "border-white"}`}
          >
            <span className={`text-lilac-gray poppins-semibold text-xl group-hover:text-white duration-300 ${isDragging && "text-white"} ${file != undefined && "text-white"}`}>
              {
                (file !== undefined && file.name) ?
                  `Selected File: ${file.name} (${((file.size / 1024) / 1024).toFixed(2)}) MB`
                  : `Click to select a PDF file`
              }
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
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      {
        error.isError &&
        <div className='w-4/5 mx-auto flex justify-center'>
          <span className='text-xl text-red-500 poppins-medium'>{error.error}</span>
        </div>
      }

    </div>
  )
}

export default App
