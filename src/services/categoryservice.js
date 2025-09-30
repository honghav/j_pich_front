export async function fetchCategories() {
  const res = await fetch('https://seavlia.shop/api/categories');
  return await res.json();
}

export async function createCategory(formData) {
  const res = await fetch('https://seavlia.shop/api/categories', {
    method: 'POST',
    body: formData,
  });
  return await res.json();
}

export async function updateCategory(id, formData) {
  const res = await fetch(`https://seavlia.shop/api/categories/${id}`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-HTTP-Method-Override': 'PUT',
    },
  });
  return await res.json();
}

export async function deleteCategory(id) {
  await fetch(`https://seavlia.shop/api/categories/${id}`, {
    method: 'DELETE',
  });
}
