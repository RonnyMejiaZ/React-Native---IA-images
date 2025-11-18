# Servidor Proxy para Lexica.art API

Este servidor proxy resuelve los problemas de CORS al acceder a la API de Lexica.art desde el frontend.

## Instalación

1. Asegúrate de tener Python 3.7+ instalado
2. Instala las dependencias:

```bash
pip install -r requirements.txt
```

## Ejecución

Para iniciar el servidor proxy:

```bash
python server.py
```

El servidor se ejecutará en `http://localhost:5000` por defecto.

## Endpoints

### POST `/api/lexica-proxy`

Proxy para la API de Lexica.art

**Body (JSON):**
```json
{
  "q": "a trending wallpaper",
  "page": 1,
  "per_page": 10
}
```

**Respuesta:**
```json
{
  "images": [
    {
      "id": "...",
      "src": "...",
      "srcSmall": "...",
      "prompt": "..."
    }
  ]
}
```

### GET `/health`

Verifica que el servidor esté funcionando.

**Respuesta:**
```json
{
  "status": "ok",
  "message": "Proxy server is running"
}
```

## Configuración

- El servidor permite CORS desde cualquier origen
- La cookie de sesión está configurada en `server.py`
- El puerto puede cambiarse con la variable de entorno `PORT`

## Notas

- Asegúrate de actualizar la cookie en `server.py` si expira
- El servidor debe estar ejecutándose antes de usar la aplicación React Native
- Para desarrollo en dispositivos móviles, cambia `localhost` por la IP de tu máquina en `lib/lexica.ts`

