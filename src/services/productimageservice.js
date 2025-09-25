const api = 'http://127.0.0.1:8000/api/productimages'

export async function fetchProductImages(productid) {
  const res = await fetch(`http://localhost:8000/api/productbyimages/${productid}`);
  if (!res.ok) throw new Error('Failed to fetch product images');
  return await res.json(); // returns array of images for that product
}


// export async function fetchProductImages(){
//     const res = await fetch(api);
//     return await res.json();
// }

export async function createProductImages(product) {
  const res = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  return await res.json();
}


export async function updateProductImages(id, formData) {
    const res = await fetch(api+`/${id}`, {
        method: "POST",
        body: formData,
        headers: {
          'X-HTTP-Method-Override': 'PUT',
        },
    });
    return await res.json();
}

export async function deleteProductImages(id) {
    await fetch(api+`/${id}`, {
        method: 'DELETE'
    });
}