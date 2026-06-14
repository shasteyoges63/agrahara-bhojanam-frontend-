import { Product } from '../types';
import { imagesForCategory } from './productImages';

export const DEFAULT_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Pavakkai Vathal - 100 g', description: 'Sun-dried bitter gourd vathal, perfect crispy side for curd rice.', price: 60, costPrice: 25, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 0), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-2', name: 'Milaguthakkali Vathal - 100 g', description: 'Traditional black nightshade berries, sun-dried with care.', price: 80, costPrice: 35, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 1), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-3', name: 'Kothavarangai / Cluster Beans Vathal', description: 'Crispy cluster beans vathal for traditional South Indian meals.', price: 50, costPrice: 22, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 2), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-4', name: 'Sundakkai Vathal - 100 g', description: 'Turkey berry vathal — hygienically sun-dried.', price: 80, costPrice: 35, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 0), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-5', name: 'Mithuka Vathal - 100 g', description: 'Traditional dried vathal variety from Madurai kitchens.', price: 40, costPrice: 18, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 1), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-6', name: 'Vendaikai Vathal - 100 g', description: 'Okra vathal — crisp and flavorful when fried in oil.', price: 40, costPrice: 18, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 2), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-7', name: 'Kathirikai Vathal - 100 g', description: 'Brinjal vathal prepared using traditional Brahmin methods.', price: 60, costPrice: 25, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 0), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-8', name: 'Mor Milagai Vathal - 100 g', description: 'Sun-dried chillies in buttermilk — essential for mor kuzhambu.', price: 60, costPrice: 25, category: 'Vathal Varieties', images: imagesForCategory('Vathal Varieties', 1), enabled: true, stock: 100, weight: '100g' },
  { id: 'prod-9', name: 'Tamil Traditional Paruppu Podi', description: 'Hand-roasted lentil powder with authentic spices.', price: 95, costPrice: 40, category: 'Podi Varieties', images: imagesForCategory('Podi Varieties', 0), enabled: true, stock: 80, weight: '150g' },
  { id: 'prod-10', name: 'Madurai Special Maavadu Pickle', description: 'Baby mango pickle cured in traditional clay jars.', price: 195, costPrice: 85, category: 'Pickle Varieties', images: imagesForCategory('Pickle Varieties', 0), enabled: true, stock: 60, weight: '300g' },
];
