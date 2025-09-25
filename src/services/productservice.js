const api = 'https://j-pich-back-main-ncxtwh.laravel.cloud/api/products';


export async function fetchProductById(id) {
  const res = await fetch(`${api}/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product by id");
  }
  return await res.json();
}
export async function fetchProducts(){
    const res = await fetch(api);
    return await res.json();
}
export async function fetchProductsStatus(){
    const res = await fetch('https://j-pich-back-main-ncxtwh.laravel.cloud/api/productstatus');
    return await res.json();
}

// export async function createProduct(product) {
//   const res = await fetch(api, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(product),
//   });

//   return await res.json();
// }
export async function createProduct(formData) {
    const res = await fetch(api, {
        method: 'POST',
        body: formData,
    });
    return await res.json();
}



export async function updateProduct(id, formData) {
    const res = await fetch(api+`/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          'X-HTTP-Method-Override': 'PUT',
        },
    });
    return await res.json();
}

export async function deleteProduct(id) {
    await fetch(api+`/${id}`, {
        method: 'DELETE'
    });
}