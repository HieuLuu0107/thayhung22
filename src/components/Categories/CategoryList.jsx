const fetchCategories = async () => {
  try {
    const response = await api.get('/v1/open/categories'); // Thêm /v1/open
    if (response.data) {
      setCategories(response.data);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}; 