import {
  AllIcon, FitnessIcon, SelfDevelopmentIcon, BookIcon, LanguageIcon, MusicIcon,
  SportsIcon, OutdoorIcon, WorkIcon, CultureIcon, CraftIcon, DanceIcon,
  VolunteerIcon, NetworkingIcon, VehicleIcon, PhotoIcon, GameIcon, CookingIcon, PetIcon
} from '@/components/icons/CategoryIcons';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const iconMap = {
  all: AllIcon,
  fitness: FitnessIcon,
  selfDevelopment: SelfDevelopmentIcon,
  book: BookIcon,
  language: LanguageIcon,
  music: MusicIcon,
  sports: SportsIcon,
  outdoor: OutdoorIcon,
  work: WorkIcon,
  culture: CultureIcon,
  craft: CraftIcon,
  dance: DanceIcon,
  volunteer: VolunteerIcon,
  networking: NetworkingIcon,
  vehicle: VehicleIcon,
  photo: PhotoIcon,
  game: GameIcon,
  cooking: CookingIcon,
  pet: PetIcon,
};

const CategorySelector = ({ categories, selectedCategory, onCategorySelect }: CategorySelectorProps) => {
  const itemsPerRow = Math.ceil(categories.length / 2);
  const firstRow = categories.slice(0, itemsPerRow);
  const secondRow = categories.slice(itemsPerRow);

  const renderCategoryButton = (category: Category) => {
    const IconComponent = iconMap[category.icon as keyof typeof iconMap];
    const isSelected = selectedCategory === category.id;
    
    return (
      <button
        key={category.id}
        onClick={() => onCategorySelect(category.id)}
        className={`flex-1 flex flex-col items-center gap-2 p-1 transition-all duration-200 ${
          isSelected ? 'scale-105' : 'hover:scale-102'
        }`}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
          isSelected 
            ? 'bg-primary shadow-lg shadow-primary/30' 
            : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <IconComponent className={`w-6 h-6 ${
            isSelected ? 'text-white' : 'text-gray-600'
          }`} />
        </div>
        <span className={`text-xs font-medium text-center leading-tight ${
          isSelected ? 'text-primary font-semibold' : 'text-gray-600'
        }`}>
          {category.name}
        </span>
      </button>
    );
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        {firstRow.map(renderCategoryButton)}
      </div>
      <div className="flex gap-2">
        {secondRow.map(renderCategoryButton)}
      </div>
    </div>
  );
};

export default CategorySelector;