import { Category } from "../types";
import {
  Code,
  Paintbrush,
  Camera,
  PenTool,
  Globe,
  MessageSquare,
} from "lucide-react";

const categories: Category[] = [
  { id: "1", name: "Development", icon: "Code" },
  { id: "2", name: "Design", icon: "Paintbrush" },
  { id: "3", name: "Photography", icon: "Camera" },
  { id: "4", name: "Writing", icon: "PenTool" },
  { id: "5", name: "Translation", icon: "Globe" },
  { id: "6", name: "Marketing", icon: "MessageSquare" },
];

const iconMap = {
  Code,
  Paintbrush,
  Camera,
  PenTool,
  Globe,
  MessageSquare,
};

export default function CategoryList() {
  return (
    <main className="gap_section mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            return (
              <button
                key={category.id}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
