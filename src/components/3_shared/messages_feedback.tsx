// messages feedback
//--------------------------------------------------------------------------------
export function messagesFeedback(errormessageOrmessage:string, message:string) {
    
    const divMessage = document.createElement('div');
    divMessage.className = errormessageOrmessage;
    divMessage.textContent = message;
    document.getElementById('idmessageframe')?.appendChild(divMessage)

    setTimeout(() => {
        divMessage.remove();
    }, 3000);
}
//--------------------------------------------------------------------------------