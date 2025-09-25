const api = 'https://j-pich-back-main-ncxtwh.laravel.cloud/api/anotherpay';


export async function fetchAnotherPays(){
    const res = await fetch(api);
    return await res.json();
}

export async function createAnotherPays(formData) {
    const res = await fetch(api, {
        method: 'POST',
        body: formData,
    });
    return await res.json();
}

export async function updateAnotherPays(id, formData) {
  const res = await fetch(api+`/${id}`, {
    method: "POST",
    body: formData,
    headers: {
          'X-HTTP-Method-Override': 'PUT',
    },
  });
  return await res.json();
}



export async function deleteAnotherPays(id) {
    await fetch(api+`/${id}`, {
        method: 'DELETE'
    });
}