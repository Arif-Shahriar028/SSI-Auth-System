interface WebhookBody {
  type: string,
  payload: any
}

export const apiFetch = async (url: string, method: string, body?: object, token?: string) => {
  try {

    const options: RequestInit = {
      method,
      // credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    }
    

    if(body && method !== 'GET' && method !== 'HEAD'){
      options.body = JSON.stringify(body);
    }

    // console.log(JSON.stringify(body));
    const response = await fetch(url, options);
    // console.log(response)
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

export const webhookCall = async (body: WebhookBody) => {
  try{
    const webhook_url = `${process.env.WEBHOOK_URL}/${body.type}` as string;
    console.log('body: ', JSON.stringify(body));
    // TODO: add secret key when webhook call
    await apiFetch(webhook_url, 'POST', body);
  }catch(error){
    console.log('error in webhook call: ', JSON.stringify(error));
  }
}