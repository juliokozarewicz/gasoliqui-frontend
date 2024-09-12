import config from '../3_shared/config'


export async function uploadImage (
    image_data:string,
    customer_code:string,
    measure_datetime:Date,
    measure_type:string) {
    const request = await fetch(`${config.baseUrl}/api/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image_data,
            customer_code,
            measure_datetime,
            measure_type
        }),
    });
    const result = await request.json();
    return result;
};

export async function confirmItems (measure_uuid:string, confirmed_value:number) {
    const request = await fetch(`${config.baseUrl}/api/confirm`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            measure_uuid,
            confirmed_value,
        }),
    });
    const result = await request.json();
    return result;
};

export async function listItems (cutomerCode:string) {
    const request = await fetch(`${config.baseUrl}/api/${cutomerCode}/list`);
    const result = await request.json();
    return result;
};