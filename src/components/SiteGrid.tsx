interface Site {
  name: string;
  url: string;
  subtitle?: string;
  description?: string;
  logoUrl?: string;
  addedAt?: string; // ISO date string for when the site was added
}

interface SiteGridProps {
  id: string;
  title: string;
  sites: Site[];
}

const isRecent = (addedAt?: string): boolean => {
  if (!addedAt) return false;
  const addedDate = new Date(addedAt);
  const now = new Date();
  const diffInHours = (now.getTime() - addedDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 48;
};

const SiteGrid = ({ id, title, sites }: SiteGridProps) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "";
    }
  };

  const getLogoUrl = (site: Site) => {
    if (site.logoUrl) {
      return site.logoUrl;
    }
    return getFaviconUrl(site.url);
  };

  return (
    <section id={id} className="py-8">
      <div className="container px-4">
        <h2 className="text-lg font-bold uppercase text-black dark:text-white mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sites.map((site) => {
            const showNewBadge = isRecent(site.addedAt);
            return (
              <a
                key={site.name + site.url}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 border border-border rounded-lg bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
              >
                <img
                  src={getLogoUrl(site)}
                  alt={`${site.name} logo`}
                  className="w-12 h-12 mb-3 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFaviconUrl(site.url);
                  }}
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center flex items-center gap-1">
                  {site.name}
                  {showNewBadge && (
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="Nouveau" />
                  )}
                </span>
                {site.subtitle && (
                  <span className="text-xs text-muted-foreground text-center">
                    {site.subtitle}
                  </span>
                )}
                {site.description && (
                  <span className="text-xs text-muted-foreground text-center italic mt-1">
                    {site.description}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SiteGrid;
