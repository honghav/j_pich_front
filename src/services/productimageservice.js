
export async function fetchProductImages(productid) {
  const res = await fetch(`https://j-pich-back-main-ncxtwh.laravel.cloud/api/productbyimages/${productid}`);
  if (!res.ok) throw new Error('Failed to fetch product images');
  return await res.json(); // returns array of images for that product
}


// export async function fetchProductImages(){
  //     const res = await fetch(api);
  //     return await res.json();
  // }
  
const api = 'https://j-pich-back-main-ncxtwh.laravel.cloud/api/productimages'
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