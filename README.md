# Instrucciones para configurar y ejecutar el backend

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (última versión recomendada)
- [PostgreSQL](https://www.postgresql.org/) (si usas una base de datos local)
- [Prisma CLI](https://www.prisma.io/) (se instalará con el proyecto)

## Instalación del proyecto

1. **Clona el repositorio**
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd api
   ```

2. **Instala las dependencias**
   ```sh
   npm install
   ```

3. **Configura las variables de entorno**
   - Crea un archivo `.env` en la raíz del proyecto y copia el contenido de `.env.example`, reemplazando los valores correspondientes.

4. **Genera el cliente de Prisma y ejecuta las migraciones**
   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Inicia el servidor en modo desarrollo**
   ```sh
   npm run dev
   ```

6. **Accede a Prisma Studio (opcional, para visualizar la base de datos)**
   ```sh
   npm run prisma:studio
   ```

## Archivo .env.example

Crea un archivo `.env` basado en este `.env.example`:

```
# Configuración de Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Configuración de la base de datos PostgreSQL
DATABASE_URL=postgresql://your_user:your_password@your_host/your_database?sslmode=require
PGHOST=your_host
PGDATABASE=your_database
PGUSER=your_user
PGPASSWORD=your_password
```

## Endpoints disponibles

### Usuarios

#### Crear usuario - `POST /users`

Se debe enviar la solicitud en formato **multipart/form-data**.

**Campos requeridos:**

- `name`: Nombre del usuario (string).
- `email`: Correo electrónico único (string).
- `avatar`: Archivo de imagen.

**Ejemplo en Postman:**

1. Selecciona el método **POST** y la URL `http://localhost:4000/users`.
2. Ve a la pestaña **Body** y selecciona **form-data**.
3. Agrega los siguientes campos:
   
   | Key    | Type  | Value                   |
   |--------|-------|-------------------------|
   | name   | Text  | John Doe                |
   | email  | Text  | john@example.com        |
   | avatar | File  | (Selecciona una imagen) |

4. Presiona **Send**.

#### Listar usuarios - `GET /users`

#### Obtener usuario por ID - `GET /users/:id`

#### Eliminar usuario - `DELETE /users/:id`

Si el usuario tiene un avatar, este se eliminará de **Cloudinary** antes de eliminar el usuario de la base de datos.

---

### Transacciones

#### Registrar transacción - `POST /transactions`

**Body (JSON format):**
```json
{
  "user_id": 3,
  "amount": 50.00,
  "type": "deposit"
}
```

#### Obtener transacciones de un usuario - `GET /transactions/:user_id`

## Notas
- El servidor se ejecutará en `http://localhost:4000/` por defecto.
- Prisma manejará la base de datos y sus migraciones automáticamente.
- Asegúrate de que la base de datos **PostgreSQL** esté funcionando antes de ejecutar el backend.

