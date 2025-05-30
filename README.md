# 🧠 Narrify API

Este repositorio contiene el backend de **Narrify**, una aplicación que resume videos de YouTube utilizando transcripciones y la API de OpenAI.

👉 Frontend: [Narrify UI](https://narrify.cloud)

---

## 🚀 ¿Qué hace este API?

1. Recibe un `video_id` de YouTube como parámetro.
2. Intenta obtener la transcripción del video.
3. Si no está disponible, puede hacer fallback a un servidor alterno (como un Raspberry Pi).
4. Envía la transcripción a OpenAI con un prompt especializado.
5. Devuelve un resumen estructurado, claro y fácil de leer.

---

## 🛠️ Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [youtube-transcript](https://www.npmjs.com/package/youtube-transcript)
- [OpenAI SDK](https://github.com/openai/openai-node)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [CORS](https://www.npmjs.com/package/cors)
- [PM2](https://pm2.keymetrics.io/) (recomendado para producción)

---

## 📦 Instalación

```bash
git clone https://github.com/xalfeiran/narrify-api.git
cd narrify-api
npm install
```

---

## 🔐 Variables de entorno `.env`

```env
PORT=5050
OPENAI_API_KEY=tu_clave_openai
MAX_REQUESTS_PER_MINUTE=10
API_SECRET_TOKEN=tu_token_privado
```

---

## 🧪 Ejemplo de uso

```http
GET /summarize?video_id=Wy2P5JKr1sw
Authorization: Bearer tu_token_privado
```

Respuesta:

```json
{
  "video_id": "Wy2P5JKr1sw",
  "title": "Cómo hacer pan en casa",
  "channel": "Cocina Fácil",
  "summary": "🎯 Argumento principal: ..."
}
```

---

## 📁 Estructura

```
/narrify-api
  ├── app.js                # API principal
  ├── transcriptUtils.js    # Funciones para extraer transcripciones y metadatos
  ├── .env                  # Variables sensibles (no se sube a Git)
  └── package.json
```

---

## ⚙️ Funcionalidades destacadas

- Límite de peticiones por IP (rate limiting)
- Verificación de token por header `Authorization`
- Soporte para CORS
- Fallback a servidor externo si YouTube bloquea la transcripción
- Prompt especializado para resúmenes estructurados y fáciles de leer

---

## 🧩 Mejoras futuras

- Logging con métricas de uso
- Base de datos para historial de consultas
- Panel de administración
- Soporte para Whisper en videos sin transcripción
- Cacheo de resultados para ahorrar tokens

---

## ✨ Autor

Creado por [Xavier Alfeirán](https://www.linkedin.com/in/xavieralfeiran/)

---

## 📝 Licencia

MIT License
