import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LatestEpisodes from "@/components/LatestEpisodes";

const DerniersPodcasts = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-8">
          <div className="container px-4">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
              Top 10 des dernières sorties des podcasts immobiliers
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Les podcasts immobiliers belges que nous suivons, mis à jour chaque jour.
            </p>
            <LatestEpisodes limit={10} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DerniersPodcasts;
