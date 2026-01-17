import { Button } from "@/components/ui/button";

interface Resource {
  name: string;
  url: string;
  description: string;
}

interface ResourceListProps {
  id: string;
  title: string;
  resources: Resource[];
}

// Colors from the palette, arranged for harmony (similar colors spaced apart)
const buttonColors = [
  "#F5A25D", // orange
  "#4F8FE3", // blue
  "#4CAF88", // green
  "#F08C7C", // salmon
  "#5AC8C8", // cyan
  "#B28AD8", // purple
  "#F2C86A", // yellow
  "#3FB6B2", // teal
  "#E88B4A", // dark orange
  "#63B7E6", // light blue
  "#9ACB7C", // lime green
  "#D8A1C4", // pink
  "#57B6B2", // teal variant
  "#7BCFA6", // light green
];

const ResourceList = ({ id, title, resources }: ResourceListProps) => {
  return (
    <section id={id} className="py-8">
      <div className="container px-4">
        <h2 className="text-lg font-bold uppercase text-black dark:text-white mb-4">{title}</h2>
        <div className="border border-border rounded-lg divide-y divide-border bg-card">
          {resources.map((resource, index) => {
            const bgColor = buttonColors[index % buttonColors.length];
            return (
              <a
                key={`${resource.name}-${index}`}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-black dark:text-white group-hover:text-primary transition-colors">
                    {resource.description}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {resource.name}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4 flex-shrink-0 text-white border-transparent transition-colors"
                  style={{ backgroundColor: bgColor }}
                >
                  Visiter
                </Button>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResourceList;
