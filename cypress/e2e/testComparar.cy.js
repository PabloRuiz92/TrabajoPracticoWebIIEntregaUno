describe("Pruebas de funcionamiento del comparador", () => {
  it("Pueba con 2 años donde el año A tiene mas que el año B", () => {
    cy.visit("http://localhost:7050/peliculas/comparar");

    cy.get('select[name="anioA"]').select("2000");
    cy.get('select[name="anioB"]').select("2003");
    cy.get('button[type="submit"]').click();

    cy.contains("En el año 2000 hubo más estrenos (4) que en 2003 (3).");
  });

  it("Pueba con 2 años donde el año B tiene mas que el año A", () => {
    cy.visit("http://localhost:7050/peliculas/comparar");

    cy.get('select[name="anioA"]').select("2003");
    cy.get('select[name="anioB"]').select("2000");
    cy.get('button[type="submit"]').click();

    cy.contains("En el año 2000 hubo más estrenos (4) que en 2003 (3).");
  });

  it("Pueba con 2 años donde ambos tiene misma cantidad", () => {
    cy.visit("http://localhost:7050/peliculas/comparar");

    cy.get('select[name="anioA"]').select("2003");
    cy.get('select[name="anioB"]').select("2004");
    cy.get('button[type="submit"]').click();

    cy.contains("Ambos años tuvieron la misma cantidad de estrenos (3).");
  });
});