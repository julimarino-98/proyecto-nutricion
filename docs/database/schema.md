# Esquema y relaciones de base de datos

El backend utiliza **MongoDB** con los siguientes documentos principales:

```mermaid
erDiagram
    Usuario {
      string nombre
      string email
      string password (hash)
      string rol (medico|secretaria|admin)
      date createdAt
      date updatedAt
    }

    ObraSocial {
      string nombre
      date createdAt
      date updatedAt
    }

    Turno {
      string paciente.nombre
      string paciente.apellido
      string paciente.email
      string paciente.telefono
      ObjectId obraSocial
      date fechaHora
      string motivo
      string estado (solicitado|confirmado|cancelado|completado)
      string notasInternas
      date createdAt
      date updatedAt
    }

    Usuario ||--o{ Turno : "gestiona (vía API)"
    ObraSocial ||--o{ Turno : "referencia opcional"
```

## Detalles de campos
- **Usuario**: guarda credenciales con contraseña hasheada (`bcrypt`) y rol. El modelo elimina el hash al serializarse.
- **ObraSocial**: colección simple con índice único sobre `nombre`.
- **Turno**:
  - Subdocumento `paciente` con datos obligatorios.
  - Referencia opcional `obraSocial` hacia `ObraSocial`.
  - Índice único parcial sobre `fechaHora` para estados `solicitado` y `confirmado`, evitando turnos solapados.
  - Estados válidos: `solicitado`, `confirmado`, `cancelado`, `completado`.

## Índices relevantes
- `usuarios.email`: único (garantiza correos sin duplicados).
- `obrassociales.nombre`: único (evita registros duplicados).
- `turnos.fechaHora`: índice único parcial cuando el estado es `solicitado` o `confirmado`.
