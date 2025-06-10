describe("Pruebas del CRUD", () => {
  it("PRueba de agregar una película nueva", () => {
    cy.visit("http://localhost:7050/peliculas/agregar");

    cy.get('input[name="titulo"]').type("Película para testing");
    cy.get('input[name="anio"]').type("2024");
    cy.get('select[name="origen"]').select("Nacional");

    cy.get('button[type="submit"]').click();

    cy.contains("Película insertada correctamente.");
    cy.visit("http://localhost:7050/peliculas/nacionales");
    cy.contains("Película para testing");
  });

  it("Al buscar por titulo la película agregada en el test anterior esta aparece correctamente", () => {
    cy.visit("http://localhost:7050/peliculas/buscar");

    cy.get('input[name="titulo"]').type("Película para testing");

    cy.contains("button", "Buscar por Título").click();

    cy.contains("Película encontrada.");
    cy.contains("Película para testing");
  });

  it("Puede editar correctamente la pelicula agregada en el primer test", () => {
    cy.visit("http://localhost:7050/peliculas/nacionales");
    cy.contains("Película para testing");
    
    cy.visit("http://localhost:7050/peliculas/editar");

    cy.get('select[name="tituloViejo"]').select("Película para testing");

    cy.get('input[name="tituloNuevo"]').type("Película para testing editada");
    cy.get('input[name="anioNuevo"]').type("2021");
    cy.get('select[name="origenNuevo"]').select("Internacional");

    cy.get('button[type="submit"]').click();

    cy.contains("Película actualizada correctamente.");
    cy.visit("http://localhost:7050/peliculas/internacionales");
    cy.contains("Película para testing editada");
    cy.visit("http://localhost:7050/peliculas/nacionales");
    cy.get("body").should("not.contain", "Película para testing editada");
  });

  it("Puede borrar la película recientemente agregada por el primer test", () => {
    cy.visit("http://localhost:7050/peliculas/internacionales");
    cy.contains("Película para testing editada");

    cy.visit("http://localhost:7050/peliculas/eliminar");

    cy.get('select[name="titulo"]').select("Película para testing editada");

    cy.contains("button", "Eliminar por título").click();

    cy.contains('Película "Película para testing editada" borrada correctamente.');
    cy.visit("http://localhost:7050/peliculas/internacionales");
    cy.get("body").should("not.contain", "Película para testing editada");
  });
});