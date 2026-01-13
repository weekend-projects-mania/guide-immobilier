import { ExternalLink } from "lucide-react";

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

const ResourceList = ({ id, title, resources }: ResourceListProps) => {
  return (
    <section id={id} className="py-8">
      <div className="container px-4">
        <h2 className="text-lg font-medium text-foreground mb-4">{title}</h2>
        <div className="border border-border rounded-lg divide-y divide-border bg-card">
          {resources.map((resource) => (
            <a
              key={resource.name}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {resource.name}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {resource.description}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceList;
