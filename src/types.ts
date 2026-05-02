export interface Location {
  address?: string;
  locality?: string;
  city: string;
  state?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
}

export interface Media {
  coverImage?: string;
  gallery?: string[];
  brochure?: string;
  video?: string;
}

export interface Property {
  id: string; // Mapped from MongoDB _id
  title: string;
  description?: string;
  location: Location;
  price: number;
  purpose: 'sale' | 'rent';
  proprtyType: 'residential' | 'commercial' | 'others';
  area?: {
    value?: number;
    unit?: 'sqft' | 'sqm' | 'sqyd';
  };
  configuration?: string;
  propertyAvailability?: boolean;
  category: 'Flat' | 'Penthouse' | 'house/villa' | 'plot';
  amenities?: string[];
  status?: 'active' | 'inactive';
  media?: Media;
  isFeatured?: boolean;
  tags?: string[];
  projectId?: string;
  createdBy?: string;
  ytVideo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string; // Mapped from MongoDB _id
  title: string;
  description?: string;
  about?: string;
  location: Location;
  priceRange: {
    min: number;
    max: number;
  };
  projectStatus?: 'pre_launch' | 'under_construction' | 'ready_to_move';
  availabilityStatus?: 'active' | 'inactive';
  configurations?: string[];
  totalUnits?: number;
  launchDate?: string;
  amenities?: string[];
  media?: Media;
  ytVideo?: string;
  isFeatured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  type: 'listing' | 'kyc' | 'payment' | 'update';
  title: string;
  description: string;
  time: string;
  user?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AppSettings {
  app: {
    name: string;
    logo?: string;
    favicon?: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  whatsapp: {
    number?: string;
    message?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  features: {
    enableLeads: boolean;
    enableFavorites: boolean;
    enableProjects: boolean;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
  maintenance: {
    isEnabled: boolean;
    message?: string;
  };
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    verified: number;
  };
  requirements: {
    total: number;
  };
  properties: {
    total: number;
    active: number;
  };
  projects: {
    total: number;
    featured: number;
  };
}

