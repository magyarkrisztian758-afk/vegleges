const products = [
  {
    id: 1,
    name: 'Légszűrő',
    brand: 'CarCore',
    category: 'Motor',
    oem: 'A1234',
    compatibility: ['Audi A4', 'VW Passat', 'Skoda Octavia'],
    description: 'Magas hatásfokú, hosszú élettartamú légszűrő a tiszta motorlevegőért.',
    price: 8990,
    inventory: 34,
    image: 'https://via.placeholder.com/360x240?text=L%C3%A9gsz%C5%B1r%C5%91'
  },
  {
    id: 2,
    name: 'Olajszűrő',
    brand: 'CarCore',
    category: 'Motor',
    oem: 'B5678',
    compatibility: ['BMW 3 Series', 'Mercedes C', 'Opel Insignia'],
    description: 'Tartós olajszűrő az optimális motorteljesítmény fenntartásához.',
    price: 4290,
    inventory: 48,
    image: 'https://via.placeholder.com/360x240?text=Olajsz%C5%B1r%C5%91'
  },
  {
    id: 3,
    name: 'Akkumulátor 60Ah',
    brand: 'PowerDrive',
    category: 'Elektromos',
    oem: 'C9012',
    compatibility: ['Toyota Corolla', 'Honda Civic', 'Nissan Qashqai'],
    description: 'Megbízható indítási teljesítmény minden évszakban.',
    price: 27990,
    inventory: 21,
    image: 'https://via.placeholder.com/360x240?text=Akkumul%C3%A1tor+60Ah'
  },
  {
    id: 4,
    name: 'Féktárcsa első',
    brand: 'SafeStop',
    category: 'Fék',
    oem: 'D3456',
    compatibility: ['Ford Focus', 'Seat Leon', 'Hyundai i30'],
    description: 'Az első féktárcsák világos fékhatást és hosszú élettartamot biztosítanak.',
    price: 15990,
    inventory: 13,
    image: 'https://via.placeholder.com/360x240?text=F%C3%A9kt%C3%A1rcsa+els%C5%91'
  },
  {
    id: 5,
    name: 'Lengéscsillapító hátsó',
    brand: 'CarCore',
    category: 'Felfüggesztés',
    oem: 'E7890',
    compatibility: ['VW Golf', 'Audi A3', 'Skoda Fabia'],
    description: 'Pontosan hangolt, kényelmes és stabil hátsó lengéscsillapító.',
    price: 43990,
    inventory: 18,
    image: 'https://via.placeholder.com/360x240?text=Leng%C3%A9scsillap%C3%ADt%C3%B3+h%C3%A1ts%C3%B3'
  },
  {
    id: 6,
    name: 'Kuplung készlet',
    brand: 'DriveLine',
    category: 'Váltó',
    oem: 'F1122',
    compatibility: ['BMW 5 Series', 'Mercedes EClass', 'Volvo S60'],
    description: 'Teljes kuplung szett a precíz váltásért és megbízható hajtásért.',
    price: 88990,
    inventory: 9,
    image: 'https://via.placeholder.com/360x240?text=Kuplung+k%C3%A9szlet'
  },
  {
    id: 7,
    name: 'Vízpumpa',
    brand: 'CoolFlow',
    category: 'Hűtés',
    oem: 'G3344',
    compatibility: ['Opel Astra', 'Peugeot 308', 'Citroen C4'],
    description: 'Erős és megbízható vízszivattyú a motor optimális hűtéséért.',
    price: 14990,
    inventory: 28,
    image: 'https://via.placeholder.com/360x240?text=V%C3%ADzpumpa'
  },
  {
    id: 8,
    name: 'Xenon Izzó D2S',
    brand: 'BrightBeam',
    category: 'Világítás',
    oem: 'H5566',
    compatibility: ['BMW X5', 'Mercedes GLK', 'Audi Q7'],
    description: 'Erős fényű xenon izzó a jobb láthatóságért éjszakai vezetésnél.',
    price: 12490,
    inventory: 41,
    image: 'https://via.placeholder.com/360x240?text=Xenon+Izz%C3%B3+D2S'
  },
  {
    id: 9,
    name: 'Gyújtógyertya',
    brand: 'SparkPro',
    category: 'Motor',
    oem: 'K7788',
    compatibility: ['VW Passat', 'Skoda Superb', 'Audi A6'],
    description: 'Gyors gyújtás és stabil motorfutás a hosszabb élettartamért.',
    price: 5690,
    inventory: 64,
    image: 'https://via.placeholder.com/360x240?text=Gy%C3%BAjt%C3%B3gyertya'
  }
];

export default products;
