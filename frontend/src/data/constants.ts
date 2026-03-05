import { Heart, Star, Award, Clock } from 'lucide-react';

export const NAVBAR_HEIGHT = 80;

export const NAV_LINKS = ['Home', 'About', 'Services', 'Gallery', 'Testimonials', 'Contact'];

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600',
  'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=600',
];

export const ALL_PETS_IMAGES = [
  ...GALLERY_IMAGES,
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600',
];

export const STATS = [
  { value: 2500, label: 'Happy Pets',            suffix: '+' },
  { value: 1200, label: 'Grooming Sessions',      suffix: '+' },
  { value: 95,   label: 'Customer Satisfaction',  suffix: '%' },
  { value: 15,   label: 'Years Experience',       suffix: '+' },
];

export const SERVICES = [
  {
    title:    'Basic Care',
    price:    30,
    features: ['Bathing & shampooing', 'Brushing & combing', 'Nail trimming', 'Ear cleaning'],
    icon:     Heart,
    image:    'https://images.unsplash.com/photo-1600369671738-ffed168d0494?w=600',
    popular:  false,
  },
  {
    title:    'Premium Grooming',
    price:    70,
    features: ['All basic services', 'Hair styling & cutting', 'Teeth cleaning', 'Spa treatment'],
    icon:     Star,
    image:    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600',
    popular:  true,
  },
  {
    title:    'Deluxe Package',
    price:    120,
    features: ['All premium services', 'Full grooming session', 'Photo shoot', 'Aromatherapy'],
    icon:     Award,
    image:    'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=600',
    popular:  false,
  },
];

export const TESTIMONIALS = [
  {
    name:     'Sarah Johnson',
    role:     'Dog Owner',
    location: 'Jakarta',
    text:     'PetCare has been amazing! My dog Max loves going there. The staff is so caring and professional.',
    rating:   5,
    avatar:   '/testimonials/customer1.jpg',
  },
  {
    name:     'Michael Chen',
    role:     'Cat Owner',
    location: 'Bandung',
    text:     'Best grooming service in town. My cat Luna always comes back looking beautiful and happy.',
    rating:   5,
    avatar:   '/testimonials/customer2.jpg',
  },
  {
    name:     'Emma Davis',
    role:     'Dog Lover',
    location: 'Surabaya',
    text:     'They handle all my pets with such love and care. Highly recommend their services!',
    rating:   5,
    avatar:   '/testimonials/customer3.jpg',
  },
];

export const ABOUT_FEATURES = [
  {
    icon:  Award,
    title: 'Expert Team',
    desc:  'Our highly trained professionals bring a wealth of experience.',
  },
  {
    icon:  Star,
    title: 'Quality Service',
    desc:  'We guarantee a superior clean that will exceed your expectations.',
  },
  {
    icon:  Clock,
    title: 'Reliable Price',
    desc:  'We offer competitive services at prices that are affordable for everyone.',
  },
];