import { Button } from "@/components/ui/button";

interface Resource {
  name: string;
  url: string;
  description: string;
  addedAt?: string; // ISO date string for when the resource was added
}

interface ResourceListProps {
  id: string;
  title: string;
  resources: Resource[];
}

const isRecent = (addedAt?: string): boolean => {
  if (!addedAt) return false;
  const addedDate = new Date(addedAt);
  const now = new Date();
  const diffInHours = (now.getTime() - addedDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 48;
};

const ResourceList = ({ id, title, resources }: ResourceListProps) => {
  return (
    <section id={id} className="py-8">
      <div className="container px-4">
        <h2 className="text-lg font-bold uppercase text-black dark:text-white mb-4">{title}</h2>
        <div className="border border-border rounded-lg divide-y divide-border bg-card">
          {resources.map((resource, index) => {
            const isBlack = index % 2 === 0;
            const showNewBadge = isRecent(resource.addedAt);
            return (
              <a
                key={`${resource.name}-${index}`}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-black dark:text-white group-hover:text-primary transition-colors flex items-center gap-2">
                    {resource.description}
                    {showNewBadge && (
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 flex-shrink-0" title="Nouveau" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {resource.name}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`ml-4 flex-shrink-0 border transition-transform hover:scale-105 ${
                    isBlack 
                      ? 'bg-black text-white border-black hover:bg-black hover:text-white' 
                      : 'bg-white text-black border-black hover:bg-white hover:text-black'
                  }`}
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