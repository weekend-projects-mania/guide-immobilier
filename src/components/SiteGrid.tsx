interface Site {
  name: string;
  url: string;
}

interface SiteGridProps {
  id: string;
  title: string;
  sites: Site[];
}

const SiteGrid = ({ id, title, sites }: SiteGridProps) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "";
    }
  };

  return (
    <section id={id} className="py-8">
      <div className="container px-4">
        <h2 className="text-lg font-medium text-foreground mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sites.map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 border border-border rounded-lg bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
            >
              <img
                src={getFaviconUrl(site.url)}
                alt={`${site.name} logo`}
                className="w-12 h-12 mb-3 object-contain"
              />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center">
                {site.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SiteGrid;
