# Reporte

## Descripción del Proyecto:
Este proyecto consiste en una aplicación desarrollada en Node.js utilizando el framework
Express. Consiste en una API REST que consume los datos extraídos del portal oficial de datos
públicos del gobierno argentino permitiendo gestionar la información de películas
mediante peticiones HTTP. La API permite realizar operaciones CRUD (Obtener, agregar,
modificar y eliminar) y otras operaciones con lógica interna.

## Fuente de datos:
Se utilizó un dataset derivado del portal público del Gobierno argentino:

Titulo: Estrenos de cine por origen del film

URL: https://datos.gob.ar/dataset/cultura-sector-audiovisual/archivo/cultura_26914562-e043-4690-8251-fc94dd5ad3cd

Formato: JSON

Se eligió esta fuente por la facilidad que ofrece para la carga de datos y su disponibilidad en el
portal público del gobierno argentino, siendo esta nuestra primera experiencia en el desarrollo
con Node.js y Express.

## Endpoints desarrollados:
Se desarrollaron los siguientes endpoints básicos de la API REST:
• GET /peliculas – Obtener todas las periodos
• POST /peliculas – Agregar un periodos nuevo
• PUT /peliculas/id/:id – Modificar una periodo existente
• DELETE /peliculas/id/:id – Eliminar una periodo por ID

Además, se implementaron las siguientes operaciones con lógica interna:
•	GET /peliculas/anio/:anio –  Busca periodo por año

•	GET /peliculas/anios/:desde/:hasta – Muestra los periodos entre 2 años

•	GET /peliculas/aniosTotal/:desde/:hasta – Busca por rango de años y muestra el total de peliculas extranjeras/locales

•	GET /peliculas/comparaAnios?anio1=value&anio2=value – Compara la cantidad total de peliculas en 2 años diferentes y responde que año tuvo más estrenos

