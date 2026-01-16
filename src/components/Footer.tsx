const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-8">
      <div className="container px-4">
        <p className="text-sm text-muted-foreground text-center mb-4">
          © {new Date().getFullYear()} Guide Immobilier. Tous les liens externes appartiennent à leurs propriétaires respectifs.
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Un lien ne fonctionne plus ? Une idée d'une ressource à ajouter ? Contactes nous :{" "}
          <a
            href="mailto:guideimmobilierbelgique@gmail.com"
            className="text-primary hover:underline"
          >
            guideimmobilierbelgique@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
