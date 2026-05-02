export const PROPERTY_CATEGORIES = {
  residential: {
    label: '🏡 Residential',
    subcategories: [
      { value: 'flat', label: 'Flat' },
      { value: 'penthouse', label: 'Penthouse' },
      { value: 'house_villa', label: 'House / Villa' },
      { value: 'plot', label: 'Plot' },
    ],
  },
  commercial: {
    label: '🏢 Commercial',
    subcategories: [
      { value: 'office_space', label: 'Office Space/Building' },
      { value: 'commercial_property', label: 'Commercial Property' },
      { value: 'industrial', label: 'Industrial Plot/Building/Warehouse' },
      { value: 'institutional', label: 'Institutional Property' },
      { value: 'hospital', label: 'Hospital Property' },
    ],
  },
  others: {
    label: '🌾 Other',
    subcategories: [
      { value: 'agricultural_land', label: 'Agricultural Land' },
      { value: 'farm_house', label: 'Farm House' },
    ],
  },
};

export type PropertyTypeKey = keyof typeof PROPERTY_CATEGORIES;
