import '../1_style/ListPage.css';
import load from '../../assets/load.png';
import { useState } from 'react';
import { listItems } from '../3_shared/fetchApi';
import { messagesFeedback } from '../3_shared/messages_feedback';

// interface
interface Measures {
    has_confirmed: boolean
    measure_datetime: string
    measure_type: string
    measure_uuid: string
    measure_value: number;
    url_image: string,
}

export function ListPage() {

    // states
    //--------------------------------------------------------------------------------
    const [blackCurtain, setBlackCurtain] = useState(false);
    const [customerCode, setCustomerCode] = useState<string>('')
    const [itemsGet, setItemsGet] = useState<Measures[]>([])
    //--------------------------------------------------------------------------------

    // functions
    //-------------------------------------------------------------------------------- 

    // send customer
    function handleSendList() {

        // block page
        setBlackCurtain(true)

        if (customerCode.trim() === '') {
                
            // error message
            setBlackCurtain(false)
            messagesFeedback('errormessage', 'o código do cliente não pode ficar vazio')

            // error red border input
            document.getElementById('inputcustomercodeList')?.style.setProperty('border-color', 'var(--red)')

            return
        }

        // api request
        async function listItem() {
            try {

                // request
                const fetchData = await listItems(
                    customerCode
                )

                // response
                if (!fetchData.ok && fetchData.error_description) {
                    setBlackCurtain(false)
                    messagesFeedback('errormessage', fetchData.error_description)
                    setItemsGet([])
                } else {
                    setBlackCurtain(false)
                    document.getElementById('inputcustomercodeList')?.style.setProperty('border-color', 'var(--gray2)')
                    setItemsGet(fetchData.measures)
                }

            } catch (error) {
                alert(error)
                setBlackCurtain(false)
                messagesFeedback('errormessage', "Algo não está certo. Por favor, tente novamente mais tarde")
            }
        }

        listItem()
    }

    // extarct date
    function extractDate(isoString: string): string {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${day}/${month}/${year}`;
      }      
    //--------------------------------------------------------------------------------

  return (
    <section className='ListAll'>

        {
            blackCurtain ? (
                <div className='blackcurtain'>
                    <img src={load} className='loadimage' alt="loading"/>
                </div>
            ) :
            null
        }

        <div className='spacetopList'></div>

        <div className='titleboxList'>
            <h1>Listar leituras realizadas:</h1>
            <p>Por favor, insira o código do cliente e uma lista abrangente de todas as medições realizadas até o momento será fornecida. Além disso, verifique e confirme quaisquer medidas que ainda não tenham sido verificadas.</p>
        </div>

        <div className='searchinput'>
            <div className='inputsframeList'>
                <p className='textinputList'>código do cliente:</p>
                <input
                    id='inputcustomercodeList'
                    type='text'
                    placeholder='código do cliente'
                    value={customerCode}
                    onChange={(e) => {setCustomerCode(e.target.value)}}
                />
            </div>

            <button
                className='sendbtnuploadList'
                onClick={() => {(handleSendList())}}
            >
                pesquisar
            </button>
        </div>

        {customerCode && itemsGet.length > 0 ? (
                <table className='resultsList'>
                    <thead>
                        <tr>
                            <th>data</th>
                            <th>tipo</th>
                            <th>valor</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemsGet.map(item => (
                            <tr key={item.measure_uuid}>
                                <td>{extractDate(item.measure_datetime)}</td>
                                <td>{item.measure_type === 'gas' ? 'gás' : 'água'}</td>
                                <td><p>{BigInt(Math.round(item.measure_value)).toString()}</p></td>
                                <td>
                                    <p className={item.has_confirmed ? 'confirmed' : 'notconfirmed'}>
                                        {item.has_confirmed ? 'verificado' : 'confirmar'}
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : null
        }

    </section>
  );
}
