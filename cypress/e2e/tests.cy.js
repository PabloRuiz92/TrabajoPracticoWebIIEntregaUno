describe("Busqueda de texto en el index", () => {
  it("debería contener ese texto", () => {
    cy.visit("http://localhost:7050/");
    cy.contains("BD de estrenos en Argentina");
  });
});