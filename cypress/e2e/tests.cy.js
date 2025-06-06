describe("Pruebas del CRUD", () => {
  it("Puede agregar una película nueva", () => {
    cy.visit("http://localhost:7050/peliculas/agregar");

    cy.get('input[name="titulo"]').type("Película para testing");
    cy.get('input[name="anio"]').type("2024");
    cy.get('select[name="origen"]').select("nacional");

    cy.get('button[type="submit"]').click();

    cy.contains("Película insertada correctamente.");
    cy.visit("http://localhost:7050/peliculas/nacionales");
    cy.contains("Película para testing");
  });

  it("Al buscar por titulo la película agregada en el test anterior esta aparece correctamente", () => {
    cy.visit("http://localhost:7050/peliculas/buscar");

    cy.get('input[name="titulo"]').type("Película para testing");
    cy.get('select[name="origenTitulo"]').select("nacional");

    cy.contains("button", "Buscar por Título").click();

    cy.contains("Película encontrada.");
    cy.contains("Película para testing");
  });

  it("Puede editar correctamente la pelicula agregada en el primer test", () => {
    cy.visit("http://localhost:7050/peliculas/nacionales");
    cy.contains("Película para testing");
    
    cy.visit("http://localhost:7050/peliculas/editar");

    cy.get('input[name="tituloViejo"]').type("Película para testing");
    cy.get('input[name="anioViejo"]').type("2024");
    cy.get('select[name="origenViejo"]').select("nacional");

    cy.get('input[name="tituloNuevo"]').type("Película para testing");
    cy.get('input[name="anioNuevo"]').type("2021");

    cy.get('button[type="submit"]').click();

    cy.contains("Película actualizada correctamente.");
    cy.visit("http://localhost:7050/peliculas/nacionales");
    cy.contains("Película para testing");
  });

  it("Puede borrar la película recientemente agregada por el primer test", () => {
    cy.visit("http://localhost:7050/peliculas/eliminar");

    cy.get('input[name="titulo"]').type("Película para testing");
    cy.get('select[name="origen"]').select("nacional");

    cy.get('button[type="submit"]').click();

    cy.contains("Película borrada correctamente.");
    cy.visit("http://localhost:7050/peliculas/nacionales");
    cy.get("body").should("not.contain", "Película para testing");
  });
});