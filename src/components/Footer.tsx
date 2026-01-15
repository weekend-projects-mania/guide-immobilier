const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-8">
      <div className="container px-4">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Guide Immobilier. Tous les liens externes appartiennent à leurs propriétaires respectifs.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
