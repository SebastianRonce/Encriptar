# CryptoSafe 🔐

> Herramienta educativa para explorar el cifrado de mensajes, números complejos y seguridad de contraseñas.

CryptoSafe es una aplicación web moderna y responsive que permite **cifrar y descifrar mensajes**, **explorar los números complejos dentro de una transformación matemática criptográfica** y **analizar la seguridad de contraseñas**.

**Importante:** esta aplicación es **educativa**. El cifrado basado en números complejos sirve para aprender los conceptos matemáticos y criptográficos, y **no debe usarse para proteger información real**. Para eso la aplicación ofrece un modo basado en **AES-GCM** (Web Crypto API) y recomienda algoritmos reconocidos como AES o ChaCha20 en entornos de producción.

---

## 🎯 Objetivo

Enseñar, de forma práctica e intuitiva:

1. Qué es cifrar y descifrar, y cómo funciona un proceso reversible.
2. Cómo se representan y operan los **números complejos** (`z = a + bi`, con `i² = -1`).
3. Qué hace segura una contraseña y cómo se puede evaluar su fortaleza.
4. Cómo generar contraseñas aleatorias con fuentes criptográficamente seguras.

---

## 🧱 Arquitectura

```text
cryptosafe/
│
├── public/                     # Archivos estáticos (favicon)
├── src/
│   ├── components/             # Componentes reutilizables de UI
│   │   ├── Navbar/
│   │   ├── MessageEncryptor/
│   │   ├── MessageDecryptor/
│   │   ├── PasswordAnalyzer/
│   │   ├── PasswordGenerator/
│   │   ├── ComplexNumberVisualizer/
│   │   ├── SecurityMeter/
│   │   ├── Alert/
│   │   ├── Tabs/
│   │   └── StepGuide/
│   │
│   ├── pages/                  # Vistas por ruta
│   │   ├── Home/
│   │   ├── Encrypt/
│   │   ├── Decrypt/
│   │   ├── PasswordSecurity/
│   │   ├── ComplexNumbers/
│   │   ├── About/
│   │   └── NotFound/
│   │
│   ├── services/               # Lógica de negocio (independiente de la UI)
│   │   ├── encryptionService.js      # Cifrado educativo + AES-GCM
│   │   ├── passwordService.js        # Analizador y generador
│   │   └── complexNumberService.js   # Operaciones con números complejos
│   │
│   ├── utils/                  # Utilidades y validaciones
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   ├── styles/                 # CSS global (tema, componentes)
│   ├── App.jsx                 # Definición de rutas
│   └── main.jsx                # Punto de entrada
│
├── server/                     # Backend opcional (Express)
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── tests/                      # Pruebas con Vitest
├── .gitignore
├── vite.config.js
└── package.json
```

Todos los **servicios** (`services/`) están desacoplados de la interfaz. Esto permite, en el futuro, mover la lógica de cifrado o análisis a un backend sin tocar los componentes.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite |
| Lenguaje | JavaScript (ESM) |
| Enrutado | React Router 7 |
| Estilos | CSS moderno con variables |
| Criptografía real | Web Crypto API (`crypto.subtle`) |
| Pruebas | Vitest |
| Backend opcional | Node.js + Express 5 |

---

## 📦 Instalación

Requisitos: **Node.js ≥ 20** y npm.

```bash
npm install
```

## ▶️ Ejecución

### Modo desarrollo:

```bash
npm run dev
```

Abra `http://localhost:5173`.

### Build de producción:

```bash
npm run build
npm run preview
```

### Backend opcional:

```bash
npm run server
```

El servidor sirve el frontend compilado desde `dist/` (ejecuta primero `npm run build`) y expone `GET /api/health`. Sólo devuelve el estado del servicio; **todo el cifrado y análisis ocurre en el cliente**.

### Pruebas:

```bash
npm test
```

---

## ✨ Funcionalidades

| Sección | Ruta | Descripción |
| --- | --- | --- |
| Inicio | `/` | Presentación y tarjetas de acceso |
| Cifrar mensaje | `/encrypt` | Cifrado educativo (números complejos) y seguro (AES-GCM) |
| Descifrar mensaje | `/decrypt` | Proceso inverso con detección automática de formato |
| Contraseñas | `/password` | Analizador y generador de contraseñas |
| Números complejos | `/complex` | Visualizador y operaciones en el plano complejo |
| Acerca de | `/about` | Documentación, seguridad y limitaciones |

### Cifrado y descifrado

- **Modo educativo (números complejos):** cada carácter del mensaje se convierte en su código Unicode (`A → 65`) y se representa como `z = código + 0i`. Con cada carácter de la clave se construye `w = código + k·i`. Se **multiplica** `z · w` para cifrar y se **divide** para descifrar, recuperando exactamente el código original. Un **checksum** permite detectar claves incorrectas o datos alterados.
- **Modo seguro (AES-GCM):** criptografía real con la Web Crypto API. La clave se deriva con **PBKDF2** (150.000 iteraciones, SHA-256) y el mensaje se cifra con **AES-256-GCM**, que además detecta manipulación.
- El descifrador **detecta automáticamente** el formato del texto cifrado.
- Flujo comprobado por pruebas:

  ```
  descifrar(cifrar(mensaje, clave), clave) === mensaje
  ```

### Análisis de contraseñas

Analiza localmente y en tiempo real:

- Longitud.
- Presencia de mayúsculas, minúsculas, números y caracteres especiales.
- Repetición de caracteres.
- Secuencias simples (`123456`, `abcdef`, patrones de teclado `qwerty`).
- Contraseñas extremadamente comunes (lista integrada).

Clasificación: **Muy débil · Débil · Regular · Buena · Fuerte · Excelente**, con medidor visual y **recomendaciones** personalizadas.

### Generador de contraseñas

Permite elegir longitud (6–64) y conjunto de caracteres, y usa **`crypto.getRandomValues()`** con muestreo por rechazo para garantizar uniformidad.

### Números complejos

Visualiza `z = a + bi` en el plano complejo (módulo, conjugado, argumento) y calcula **suma, resta, multiplicación y división** entre dos números.

---

## ⚠️ Consideraciones de seguridad

- Todos los cálculos ocurren **localmente** en el navegador.
- Las contraseñas **nunca se almacenan** ni se envían a servidores externos.
- No se registran mensajes ni contraseñas en consola ni en `localStorage`.
- Las entradas se **validan** y React escapa el contenido (protección contra XSS).
- El generador usa una fuente criptográficamente segura.
- El modo seguro usa `crypto.subtle`, que requiere un **contexto seguro** (HTTPS o `localhost`).
- El algoritmo de números complejos es **educativo**: no es un sustituto de AES, ChaCha20 u otras implementaciones auditadas.

## 🚧 Limitaciones

- El cifrado educativo no protege información real.
- El analizador de contraseñas usa heurísticas; para una estimación rigurosa se recomienda calcular entropía real.
- La lista de contraseñas comunes es representativa, no exhaustiva.
- PBKDF2 con 150.000 iteraciones es adecuado para la demo; en producción se recomienda Argon2id.
- El backend Express es solo un punto de partida (health-check y servido estático); aún no expone API de cifrado.

---

## 📄 Licencia

Proyecto con fines educativos. Úselo y modifíquelo libremente.