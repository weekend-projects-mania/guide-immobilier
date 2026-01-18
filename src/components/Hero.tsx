const Hero = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
          Ton site immo fav<span className="text-black" style={{ WebkitTextStroke: '1px red' }}>♥</span>ri !
        </h1>
        <p className="bg-black text-white px-3 py-2 inline-block max-w-xl">
          S'informer pour acheter malin - les sites utiles pour vos projets immobiliers
        </p>
      </div>
    </section>
  );
};

export default Hero;
