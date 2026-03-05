export type ServiceCategory = 'Boarding' | 'Care' | 'Health';

export interface Service {
    id: string;
    title: string;
    category: ServiceCategory;
    description: string;
    price: number;       
    priceUnit: string;   
    duration: string;       
    features: string[];
    image: string;          
    popular?: boolean;
    availableFor: ('Cats' | 'Dogs')[];
}

export const SERVICES: Service[] = [
    {
        id: 'pet-boarding',
        title: 'Pet Boarding',
        category: 'Boarding',
        description: 'Pet boarding service with comfortable facilities while you are away.',
        price: 150000,
        priceUnit: 'night',
        duration: 'Minimum 1 night',
        features: [
            'Clean & comfortable cage',
            'Meals twice a day',
            '24-hour monitoring',
            'Daily report via WhatsApp',
        ],
        image: '/services/pet-boarding.jpg',
        popular: false,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'pet-daycare',
        title: 'Pet Daycare',
        category: 'Boarding',
        description: 'Leave your pet with us for the day and pick them up in the afternoon.',
        price: 80000,
        priceUnit: 'day',
        duration: '8 hours (08:00 - 17:00)',
        features: [
            'Spacious play area',
            'Lunch included',
            'Group play sessions',
            'Full supervision',
        ],
        image: '/services/pet-daycare.jpg',
        popular: false,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'pet-grooming',
        title: 'Pet Grooming',
        category: 'Care',
        description: 'Bathing, nail trimming, and complete fur care for your pet.',
        price: 100000,
        priceUnit: 'session',
        duration: '90 - 120 minutes',
        features: [
            'Bath with special pet shampoo',
            'Fur trimming & styling',
            'Nail trimming',
            'Ear cleaning',
        ],
        image: '/services/pet-grooming.jpg',
        popular: true,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'pet-spa',
        title: 'Pet Spa',
        category: 'Care',
        description: 'Complete premium treatment for your beloved pet.',
        price: 200000,
        priceUnit: 'session',
        duration: '2 - 3 hours',
        features: [
            'All grooming services included',
            'Fur mask & conditioner',
            'Relaxing massage',
            'Free perfume & bandana',
        ],
        image: '/services/pet-spa.jpg',
        popular: false,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'nail-trimming',
        title: 'Nail Trimming',
        category: 'Care',
        description: 'Quick and safe nail trimming for your pet.',
        price: 30000,
        priceUnit: 'session',
        duration: '15 - 30 minutes',
        features: [
            'Front & back nail trimming',
            'Nail smoothing',
            'Quick & painless',
        ],
        image: '/services/nail-trimming.jpg',
        popular: false,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'veterinary-check',
        title: 'Veterinary Check',
        category: 'Health',
        description: 'Comprehensive health examination by an experienced veterinarian.',
        price: 120000,
        priceUnit: 'session',
        duration: '30 - 45 minutes',
        features: [
            'Complete physical examination',
            'Weight & body condition check',
            'Doctor consultation',
            'Pet health certificate',
        ],
        image: '/services/veterinary-check.jpg',
        popular: true,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'vaksinasi',
        title: 'Vaccination',
        category: 'Health',
        description: 'Routine vaccination to maintain your pet’s health and immunity.',
        price: 180000,
        priceUnit: 'session',
        duration: '15 - 30 minutes',
        features: [
            'Core & booster vaccines',
            'Performed by experienced veterinarians',
            'Official vaccination card',
            'Post-vaccination consultation',
        ],
        image: '/services/vaksinasi.jpg',
        popular: false,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'konsultasi-dokter',
        title: 'Doctor Consultation',
        category: 'Health',
        description: 'Direct consultation with a veterinarian for specific concerns.',
        price: 80000,
        priceUnit: 'session',
        duration: '20 - 30 minutes',
        features: [
            'Face-to-face consultation',
            'Initial diagnosis',
            'Prescription if needed',
            'WhatsApp follow-up',
        ],
        image: '/services/konsultasi-dokter.jpg',
        popular: false,
        availableFor: ['Cats', 'Dogs'],
    },
    {
        id: 'sterilisasi',
        title: 'Sterilization',
        category: 'Health',
        description: 'Safe sterilization surgery performed by certified veterinarians.',
        price: 500000,
        priceUnit: 'session',
        duration: '2 - 4 hours',
        features: [
            'Surgery performed by certified veterinarians',
            'Safe anesthesia',
            'Post-surgery monitoring',
            '1 free follow-up check',
        ],
        image: '/services/sterilisasi.jpg',
        popular: false,
        availableFor: ['Cats', 'Dogs'],
    },
];

export const getServiceById = (id: string): Service | undefined =>
    SERVICES.find(s => s.id === id);

export const getServicesByCategory = (category: ServiceCategory): Service[] =>
    SERVICES.filter(s => s.category === category);

export const formatPrice = (price: number): string =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);