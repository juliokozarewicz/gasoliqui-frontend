import '../1_style/ConfirmPage.css'
import { useNavigate } from 'react-router-dom'
import load from '../../assets/load.png'
import { useEffect, useState } from 'react'
import { confirmItems, listItems } from '../3_shared/fetchApi'
import config from '../3_shared/config'
import { messagesFeedback } from '../3_shared/messages_feedback'

interface Measure {
    measure_uuid: string
    url_image: string,
    measure_value: number;
    has_confirmed: boolean
}

interface ListItemResponse {
    measures: Measure[]
}

export function ConfirmPage() {


    // local storage vars
    const storedCustomerCode = localStorage.getItem('customerCodeVar');
    const storedMeasureID = localStorage.getItem('measureIDVar');

    // navigate
    const navigate = useNavigate()

    // delay
    function delay(milliseconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    // states
    //--------------------------------------------------------------------------------
    const [blackCurtain, setBlackCurtain] = useState(false)
    const [customerCode, setCustomerCode] = useState<string>('')
    const [measureID, setMeasureID] = useState('Selecione uma opção')
    const [imgToConfirm, setImgToConfirm] = useState<string>('')
    const [measureValue, setMeasureValue] = useState<number>()
    const [isOpen, setIsOpen] = useState(false)
    const [itemsNotConfirmed, setItemsNotConfirmed] = useState<Measure[]>([])
    //--------------------------------------------------------------------------------

    // menu id's not confirmed
    //--------------------------------------------------------------------------------
    const toggleDropdown = () => setIsOpen(!isOpen)

    const handleSelect = (value:string) => {
        setMeasureID(value)
        setIsOpen(false)
    }
    //--------------------------------------------------------------------------------

    // get ids not confirmed
    //--------------------------------------------------------------------------------
    useEffect(() => {

        const fetchItems = async () => {
            try {
                if (customerCode) {
                    const response: ListItemResponse = await listItems(customerCode)
                    const falseConfirmed = response.measures.filter(
                        (measure) => !measure.has_confirmed
                    )
                    setItemsNotConfirmed(falseConfirmed)
                }
            } catch (error) {
                setItemsNotConfirmed([])
            }
        }

        fetchItems()
    }, [customerCode])
    //--------------------------------------------------------------------------------

    // set variables if exist
    //--------------------------------------------------------------------------------
    useEffect(() => {
        if (storedCustomerCode) {
            setCustomerCode(storedCustomerCode)
        }
        
        if (storedMeasureID) {
            setMeasureID(storedMeasureID)
        }
    }, [])
    //--------------------------------------------------------------------------------

    // img to confirm
    //--------------------------------------------------------------------------------
    useEffect(() => {
        if (measureID && measureID !== 'Selecione uma opção') {
            const selectedItem = itemsNotConfirmed.find(item => item.measure_uuid === measureID)

            const currentUrl = config.baseUrl
            const urlImageFinal = currentUrl + selectedItem?.url_image

            setImgToConfirm(urlImageFinal)
            setMeasureValue(selectedItem?.measure_value)
        }
    }, [measureID, itemsNotConfirmed])
    //--------------------------------------------------------------------------------

    // send data
    //--------------------------------------------------------------------------------
    function handleSendConfirm() {

        // block page
        setBlackCurtain(true)

        if (measureID.trim() === '' ||
            measureID.trim() === 'Selecione uma opção'
        ) {
                
            // error message
            setBlackCurtain(false)
            messagesFeedback('errormessage', 'o ID da medida não pode ficar vazio')

            // error red border input
            document.getElementById('idmenuselected')?.style.setProperty('border-color', 'var(--red)')

            return
        }

        if (measureValue === null ||
            measureValue === 0
        ){

            // error message
            setBlackCurtain(false)
            messagesFeedback('errormessage', 'o valor da medida não pode ficar vazio')

            // error red border input
            document.getElementById('inputvalueconfirm')?.style.setProperty('border-color', 'var(--red)')

            return
        }

        // api request
        async function confirmItem() {

            try {

                // request
                const fetchData = await confirmItems(
                    measureID,
                    Number(measureValue)
                )

                // response
                if (!fetchData.ok && fetchData.error_description) {
                    setBlackCurtain(false)
                    messagesFeedback('errormessage', fetchData.error_description)
                } else {
                    localStorage.setItem('customerCodeVar', '');
                    localStorage.setItem('measureIDVar', '');
                    navigate('/list')
                    setBlackCurtain(false)
                    messagesFeedback('message', 'confirmação realizada com sucesso')
                }

            } catch {
                setBlackCurtain(false)
                messagesFeedback('errormessage', "Algo não está certo. Por favor, tente novamente mais tarde")
            }

        }

        confirmItem()
    }
    //--------------------------------------------------------------------------------

  return (
    <section className='ConfirmAll'>

        {
            blackCurtain ? (
                <div className='blackcurtain'>
                    <img src={load} className='loadimage' alt="loading"/>
                </div>
            ) :
            null
        }

        <div className='spacetopConfirm'></div>

        <div className='titleboxConfirm'>
            <h1>Confirme os dados da medição:</h1>
            <p>Primeiro, insira o código do cliente. Depois disso, revise ou atualize os dados da medição para garantir que todos os detalhes estejam corretos e precisos. Este processo irá confirmar se as informações estão confiáveis.</p>
        </div>

        <div className='inputsframeConfirm'>
            <p className='textinput'>código do cliente:</p>
            <input 
                id='inputcustomercodeConfirm'
                type='text'
                placeholder='código do cliente'
                value={customerCode}
                onChange={(e) => {
                    setCustomerCode(e.target.value);
                    setMeasureID('Selecione uma opção');
                    setImgToConfirm('')}}
            />
        </div>

        {
            customerCode && itemsNotConfirmed.length > 0 ? (
                <div className="menuidsall">
                    <p className='textinput'>ID da medição:</p>
                    <button
                        type="button"
                        id='idmenuselected'
                        className="menuselected"
                        onClick={toggleDropdown}
                    >
                        <div className='arrow'>^</div>
                        <div className='idinfo'>{measureID}</div>
                    </button>

                    {isOpen && (
                        <div className="listitens">
                            <div>
                                {itemsNotConfirmed.map((item) => (
                                    <a
                                        key={item.measure_uuid}
                                        onClick={() => handleSelect(item.measure_uuid)}
                                    >
                                        {item.measure_uuid}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) :
            null
        }

        {
            customerCode && itemsNotConfirmed.length > 0 && imgToConfirm ?(
                <div className='inputsframeConfirm'>
                    <p className='textinputConfirm'>número correto:</p>
                    <img src={imgToConfirm} className='imguploadConfirm' alt="measure image"/>
                </div>
            ) :
            null
        }

        {
            customerCode && itemsNotConfirmed.length > 0 ? (
                <div className='inputsframeConfirm'>
                    <p className='textinputConfirm'>confirme o número da imagem:</p>
                    <input 
                        id='inputvalueconfirm'
                        type='number'
                        inputMode='numeric'
                        min='0'
                        placeholder='confirme o número da imagem'
                        value={measureValue}
                        onChange={(e) => setMeasureValue(Number(e.target.value))}
                    />
                </div>
            ) :
            null
        }

        {
            customerCode && itemsNotConfirmed.length > 0 ? (
                <button
                    className='sendbtnuploadConfirm'
                    onClick={() => {(handleSendConfirm())}}
                >
                    confirmar número
                </button>
            ) :
            null
        }

    </section>
  )
}
