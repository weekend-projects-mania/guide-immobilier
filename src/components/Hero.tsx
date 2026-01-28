import { Heart } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Ton site immo fav
          <Heart
            aria-hidden="true"
            className="hero-heart"
            fill="hsl(var(--brand-heart-fill))"
            stroke="hsl(var(--brand-heart-stroke))"
            strokeWidth={2.25}
          />
          ri !
        </h1>
        <p className="bg-black text-white px-3 py-2 inline-block max-w-xl">
          S'informer pour acheter malin - TOUS les sites utiles pour vos projets immobiliers
        </p>
      </div>
    </section>
  );
};

export default Hero;
