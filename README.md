# Reporte

## Descripción del Proyecto:
Este proyecto consiste en una aplicación desarrollada en Node.js utilizando el framework
Express. Consiste en una API REST que consume los datos extraídos del portal oficial de datos
públicos del gobierno argentino permitiendo gestionar la información de películas nacionales
mediante peticiones HTTP. La API permite realizar operaciones CRUD (Obtener, agregar,
modificar y eliminar) y utiliza un archivo JSON como fuente de datos.

## Fuente de datos:
Se utilizó un dataset derivado del portal público del Gobierno argentino:

Titulo: Recaudación de cine a nivel nacional por origen de film

URL: https://datos.gob.ar/dataset/cultura-sector-audiovisual/archivo/cultura_40ce52b7-2240-
4c58-b662-803b97df0bc0

Formato: JSON

Se eligió esta fuente por la facilidad que ofrece para la carga de datos y su disponibilidad en el
portal público del gobierno argentino, siendo esta nuestra primera experiencia en el desarrollo
con Node.js y Express.

## Endpoints:
Se desarrollaron los siguientes endpoints básicos de la API REST:
• GET /peliculas – Obtener todas las películas
• POST /peliculas – Agregar una película nueva
• PUT /peliculas/:id – Modificar una película existente
• DELETE /peliculas/:id – Eliminar una película por ID

Además, se implementaron los siguientes filtros con lógica interna:
• GET /peliculas/filtrar/anio/:anio – Filtrar películas por año
