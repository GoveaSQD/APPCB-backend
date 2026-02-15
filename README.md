# 🎓 Sistema de Gestión de Becas - Backend API

> Sistema backend para gestión de becas universitarias con autenticación JWT y API REST

## 📊 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Base de Datos](#-base-de-datos)
- [Estructura](#-estructura)
- [Despliegue](#-despliegue)

## ✨ Características

| Característica        | Estado | Descripción               |
| --------------------- | ------ | ------------------------- |
| 🔐 Autenticación JWT  | ✅     | Login/Register con tokens |
| 🏛️ CRUD Universidades | ✅     | Gestión completa          |
| 📋 CRUD Modalidades   | ✅     | Tipos de becas            |
| 🎓 CRUD Becados       | ✅     | Estudiantes becados       |
| 👥 Gestión Usuarios   | ✅     | Administración            |
| 📊 Relaciones BD      | ✅     | MySQL con FK              |
| 🛡️ Validación         | ✅     | Input validation          |
| 🐳 Docker             | 🔄     | En desarrollo             |
| 📄 Reportes PDF       | 📋     | Planeado                  |

## 🛠️ Tecnologías

### **Backend Stack**

| Tecnología | Versión  | Propósito          |
| ---------- | -------- | ------------------ |
| Node.js    | v22.17.0 | Runtime JavaScript |
| Express    | 4.18.x   | Framework web      |
| MySQL2     | 3.6.x    | Cliente MySQL      |

### **Base de Datos**

| Componente | Versión | Uso           |
| ---------- | ------- | ------------- |
| MySQL      | 8.0.x   | Base de datos |

### **Desarrollo**

| Herramienta | Versión | Uso                  |
| ----------- | ------- | -------------------- |
| Git         | 2.x     | Control versiones    |
| Postman     | 10.x+   | Testing API          |
| Nodemon     | 2.0.x   | Hot reload           |
| npm         | 11.6.0  | Package manager      |
| nvm         | 1.1.12  | Version node manager |

## 🚀 Instalación

npm install
npm run dev
Para modo producción: 
npm start

### **Requisitos Previos**

```bash
# Verificar instalaciones
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
mysql --version   # >= 8.0.0
```

Comando para iniciar Server MySQL Windows (Cada que se encienda el sistem)

- mysql start
