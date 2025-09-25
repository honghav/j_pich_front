export async function fetchCategories() {
  const res = await fetch('http://127.0.0.1:8000/api/categories');
  return await res.json();
}

export async function createCategory(formData) {
  const res = await fetch('http://127.0.0.1:8000/api/categories', {
    method: 'POST',
    body: formData,
  });
  return await res.json();
}

export async function updateCategory(id, formData) {
  const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
    method: 'POST',
    body: formData,
    headers: {
      'X-HTTP-Method-Override': 'PUT',
    },
  });
  return await res.json();
}

export async function deleteCategory(id) {
  await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
    method: 'DELETE',
  });
}
