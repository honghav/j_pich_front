const api = 'http://127.0.0.1:8000/api/orders';


export async function fetchOrders(){
    const res = await fetch(api);
    return await res.json();
}

export async function createOrders(formData) {
    const res = await fetch(api, {
        method: 'POST',
        body: formData,
    });
    return await res.json();
}

export async function updateOrders(id, formData) {
  const res = await fetch(api+`/${id}`, {
    method: "POST",
    body: formData,
    headers: {
          'X-HTTP-Method-Override': 'PUT',
    },
  });
  return await res.json();
}



export async function deleteOrders(id) {
    await fetch(api+`/${id}`, {
        method: 'DELETE'
    });
}