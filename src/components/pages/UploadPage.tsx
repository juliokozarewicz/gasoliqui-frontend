import { useState, ChangeEvent } from 'react'
import '../1_style/UploadPage.css'
import { messagesFeedback } from '../3_shared/messages_feedback'
import { uploadImage } from '../3_shared/fetchApi'
import { useNavigate } from 'react-router-dom'
import load from '../../assets/load.png'

export function UploadPage() {

    // navigate
    const navigate = useNavigate()

    // states
    //--------------------------------------------------------------------------------
    const [imageURL, setImageURL] = useState('')
    const [customerCode, setCustomerCode] = useState<string>('')
    const [customerType, setCustomerType] = useState<string>('')
    const [blackCurtain, setBlackCurtain] = useState(false)
    //--------------------------------------------------------------------------------

    // update file name
    //--------------------------------------------------------------------------------
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null
        if (file) {
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file)
                setImageURL(url)
            } else {
                messagesFeedback('errormessage', 'o arquivo deve ser uma imagem')
            }
        } else {
            messagesFeedback('errormessage', 'o arquivo deve ser uma imagem')
        }
    }
    //--------------------------------------------------------------------------------

    // convert img to base 64 and upload
    //--------------------------------------------------------------------------------
    const imageUrlToBase64 = async (imageUrl: string): Promise<string> => {

        const response = await fetch(imageUrl)
        if (!response.ok) throw new Error(`falha ao buscar imagem`)
        const blob = await response.blob()
        const reader = new FileReader()
        return new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    const base64DataUrl = reader.result as string
                    const base64PrefixIndex = base64DataUrl.indexOf(',') + 1
                    const base64String = base64DataUrl.substring(base64PrefixIndex)
                    resolve(base64String)
                } else {
                    reject(new Error('falha ao converter blob em base64'))
                }
            }
            reader.onerror = () => reject(new Error('falha ao ler o blob'))
            reader.readAsDataURL(blob)
        })
    }

    function handleSend(imageBlobUrl: string) {

        // block page
        setBlackCurtain(true)

        imageUrlToBase64(imageBlobUrl)
        .then(base64String => {
            if (customerCode.trim() === '') {
                
                // error message
                setBlackCurtain(false)
                messagesFeedback('errormessage', 'o código do cliente não pode ficar vazio')

                // error red border input
                document.getElementById('inputcustomercode')?.style.setProperty('border-color', 'var(--red)')

                return
            }

            if (customerType.trim() === '') {
                
                // error message
                setBlackCurtain(false)
                messagesFeedback('errormessage', 'o tipo de cliente não pode ficar vazio')

                // error red border input
                document.getElementById('inputcustomertype')?.style.setProperty('border-color', 'var(--red)')

                return
            }

            // api request
            async function UploadItem() {

                try {

                    // request
                    const fetchData = await uploadImage(
                        base64String,
                        customerCode,
                        new Date(Date.now()),
                        customerType
                    )

                    // response
                    if (!fetchData.ok && fetchData.error_description) {
                        setBlackCurtain(false)
                        messagesFeedback('errormessage', fetchData.error_description)
                    } else {
                        localStorage.setItem('customerCodeVar', customerCode);
                        localStorage.setItem('measureIDVar', fetchData.measure_uuid);
                        navigate('/confirm')
                        setBlackCurtain(false)
                        messagesFeedback('message', 'medição realizada com sucesso')
                    }

                } catch {
                    setBlackCurtain(false)
                    messagesFeedback('errormessage', "Algo não está certo. Por favor, tente novamente mais tarde")
                }

            }

            UploadItem()

        })

        .catch(() => console.error('Error'))
    }    
    //--------------------------------------------------------------------------------

  return (
    <section className='uploadAll'>

        {
            blackCurtain ? (
                <div className='blackcurtain'>
                    <img src={load} className='loadimage' alt="loading"/>
                </div>
            ) :
            null
        }

        <div className='spacetopupload'></div>
        <div className='titlebox'>
            <h1>carregue uma imagem para ser realizada a medição:</h1>
            <p>Carregue sua imagem aqui para iniciar a leitura e processamento. O sistema analisará a foto e converterá os dados em informações utilizáveis.</p>
        </div>

        <button className='dragarea'>
            <input type="file" id='inputfile' accept="image/*" onChange={handleFileChange}/>
            <label htmlFor="inputfile" id="customupload">
                + selecione uma imagem
            </label>
        </button>

        {
            imageURL ? (
                <div className='inputsframe'>
                    <p className='textinput'>imagem selecionada:</p>
                    <img src={imageURL} className='imgupload' alt="measure image"/>
                </div>
            ) :
            null
        }

        {
            imageURL ? (
                <div className='inputsframe'>
                    <p className='textinput'>código do cliente:</p>
                    <input 
                        id='inputcustomercode'
                        type='text'
                        placeholder='código do cliente'
                        value={customerCode}
                        onChange={(e) => setCustomerCode(e.target.value)}
                    />
                </div>
            ) :
            null
        }

        {
            imageURL ? (
                <div className='inputsframe'>
                    <p className='textinput'>tipo de leitura:</p>
                    <input 
                        id='inputcustomertype'
                        type='text'
                        placeholder='tipo de leitura'
                        value={customerType}
                        onChange={(e) => setCustomerType(e.target.value)}
                    />
                </div>
            ) :
            null
        }

        {
            imageURL ? (
                <button
                    className='sendbtnupload'
                    onClick={() => {(handleSend(imageURL))}}
                >
                    enviar
                </button>
            ) :
            null
        }

    </section>
  )
}
