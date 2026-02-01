import { MenuItem, RoomType } from '../types';

const FOOD_IMAGE_IDS = [
  '1603133872878-684f208d82ff', // Kullu Siddu / Indian bread
  '1551782450_aaf510c417f', // Chana Madra / chickpeas
  '1603133872878-684f208d82ff', // Sepu Vadi / dumplings
  '1558642452_306c0ae75225', // Babru / fried patties
  '1551782450_aaf510c417f', // Paneer Tikka
  '1603133872878-684f208d82ff', // Samosa
  '1551782450_aaf510c417f', // Pakora
  '1603133872878-684f208d82ff', // Chicken Tikka
  '1558642452_306c0ae75225', // Biryani
  '1551782450_aaf510c417f', // Butter Chicken
  '1603133872878-684f208d82ff', // Dal Makhani
  '1558642452_306c0ae75225', // Paneer Butter Masala
  '1551782450_aaf510c417f', // Mixed Vegetable
  '1603133872878-684f208d82ff', // Rice
  '1558642452_306c0ae75225', // Naan
  '1551782450_aaf510c417f', // Gulab Jamun
  '1603133872878-684f208d82ff', // Ras Malai
  '1558642452_306c0ae75225', // Kulfi
  '1551782450_aaf510c417f', // Lassi
  '1603133872878-684f208d82ff'  // Tea
];

export const INITIAL_MENU: MenuItem[] = [
  // --- HIMACHALI SPECIALS ---
  {
    id: 'h1',
    name: 'Traditional Kullu Siddu',
    category: 'Himachali Specials',
    price: 15,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[0]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Local steamed bread with a savory walnut and poppy seed stuffing, served with fresh ghee.'
  },
  {
    id: 'h2',
    name: 'Chana Madra',
    category: 'Himachali Specials',
    price: 18,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[1]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Kabuli chana cooked in a rich, slow-simmered yogurt-based gravy with local mountain spices.'
  },
  {
    id: 'h3',
    name: 'Sepu Vadi Heritage',
    category: 'Himachali Specials',
    price: 20,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[2]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Split urad dal dumplings cooked in a spinach gravy, a highlight of the Mandi Dham.'
  },
  {
    id: 'h4',
    name: 'Babru with Honey',
    category: 'Himachali Specials',
    price: 12,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[3]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Himachali deep-fried wheat patties, similar to kachoris, served with local forest honey.'
  },

  // --- STARTERS ---
  {
    id: 'm1',
    name: 'Paneer Tikka Angare',
    category: 'Starters',
    price: 18,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[4]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Cubes of cottage cheese marinated in spicy yogurt and grilled in a clay oven.'
  },
  {
    id: 'm2',
    name: 'Crispy Vegetable Samosa',
    category: 'Starters',
    price: 12,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[5]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Flaky pastry filled with spiced potatoes and peas, served with tamarind chutney.'
  },

  // --- BREAKFAST ---
  {
    id: 'm4',
    name: 'Classic Masala Dosa',
    category: 'Breakfast',
    price: 14,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[6]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Crispy rice crepe filled with spiced potato mash, served with sambar and coconut chutney.'
  },
  {
    id: 'm5',
    name: 'Amritsari Chole Bhature',
    category: 'Breakfast',
    price: 16,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[7]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Spicy chickpeas served with fluffy deep-fried leavened bread and pickles.'
  },

  // --- MAIN COURSE ---
  {
    id: 'm9',
    name: 'Butter Chicken (Murgh Makhani)',
    category: 'Main Course',
    price: 28,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[8]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Tender chicken pieces simmered in a rich, creamy tomato and butter gravy.'
  },
  {
    id: 'm11',
    name: 'Paneer Lababdar',
    category: 'Main Course',
    price: 24,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[9]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Cottage cheese cubes in a luscious tomato-onion gravy with a hint of cashew.'
  },

  // --- DESSERTS ---
  {
    id: 'm13',
    name: 'Gulab Jamun with Rabri',
    category: 'Desserts',
    price: 12,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[10]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Deep-fried milk solids soaked in cardamom rose syrup, served with thickened milk.'
  },
  {
    id: 'm14',
    name: 'Royal Rasmalai',
    category: 'Desserts',
    price: 14,
    image: `https://images.unsplash.com/photo-${FOOD_IMAGE_IDS[11]}?auto=format&fit=crop&q=80&w=800`,
    description: 'Soft paneer discs soaked in sweetened, thickened milk flavored with cardamom and saffron.'
  }
];

// Reliable working hotel room image IDs from Unsplash
const ROOM_IMAGE_IDS = [
  '1566665797739-1674de7a421a',
  '1590490360182-c33d57733427',
  '1595576508898-0ad5c879a061',
  '1582719478250-c89cae4dc85b',
  '1540518614846-7eded433c457',
  '1611892440504-42a792e24d32',
  '1591088398332-8a7791972843',
  '1566073771259-6a8506099945',
  '1578683010236-d716f9a3f2c1',
  '1560347876-aeef00ee58a1',
  '1596394516093-501ba68a0ba6',
  '1618773928121-c32242e63f39',
  '1592229505726-ca121723b8ea',
  '1522771739844-6a9f6d5f14af',
  '1512918766755-ee7a3048956b',
  '1631049307264-da0ec9d70304',
  '1611892441539-8af3d02283ac',
  '1598928506311-c55ded91a20c',
  '1505691938895-1758d7eaa511',
  '1554995207-c18c203602cb',
  '1502672260266-1c1ef2d93688'
];

// Reliable gallery IDs for Himalayan Vista
export const GALLERY_IMAGE_IDS = [
  '1464822759023-fed622ff2c3b', // Peaks
  '1491555103945-3c465522272a', // Lush valley
  '1511892440504-42a792e24d32', // Luxury room
  '1599487488170-d11ec9c175f0', // Food
  '1520114878144-61247a19a195', // Snow peaks
  '1506744038136-46273834b3fb', // Landscape
  '1517248135467-4c7edcad34c4', // Restaurant interior
  '1603894584134-f132f178cb38'  // Butter chicken
];

// Generate 21 distinct rooms
export const INITIAL_ROOMS: RoomType[] = Array.from({ length: 21 }, (_, i) => {
  const id = `room-${i + 1}`;
  const floor = Math.floor(i / 5) + 1;
  const types = ['Classic Heritage', 'Deluxe Oasis', 'Executive Royal', 'Imperial Suite', 'Presidential Sky Villa'];
  const type = types[i % types.length];
  const price = 200 + (i * 25);
  
  // Use the reliable IDs array, circling back if necessary
  const imageId = ROOM_IMAGE_IDS[i % ROOM_IMAGE_IDS.length];
  
  return {
    id,
    type: `${type} ${100 + i + 1}`,
    pricePerNight: price,
    image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800`,
    capacity: (i % 3) + 2,
    description: `An exquisite ${type} located on Floor ${floor}. Features hand-picked Indian artifacts and panoramic views of the city skyline.`,
    amenities: ['24/7 Butler', 'Smart Control', 'Luxury Bath', 'High-Speed WiFi', 'Complimentary Breakfast']
  };
});