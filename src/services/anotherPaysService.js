const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://j-pich-back-main-ncxtwh.laravel.cloud/api';

export class AnotherPaysService {
  static async getCountByMonth(month = null) {
    try {
      const url = month 
        ? `${API_BASE_URL}/another-pays/count-by-month?month=${month}`
        : `${API_BASE_URL}/another-pays/count-by-month`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // cache: 'no-store', // Uncomment if you don't want caching
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching count by month:', error);
      throw new Error('Failed to fetch statistics data');
    }
  }

  // Get available months for dropdown
  static async getAvailableMonths() {
    try {
      // This would need to be implemented in your Laravel API
      // For now, I'll generate last 12 months
      const months = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months.push({
          value: date.toISOString().slice(0, 7), // YYYY-MM
          label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
        });
      }
      
      return months;
    } catch (error) {
      console.error('Error generating months:', error);
      return [];
    }
  }
}