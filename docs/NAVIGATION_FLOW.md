# Diagrama de Arquitectura de Información y Flujo de Navegación
## CRIS Quality Solution LLC (Chris Quality Service) — Miami, FL

Este documento define la arquitectura de navegación, los flujos de interacción del usuario (UX) y el ciclo de operaciones del CRM administrativo para la validación con la Gerencia antes del inicio de la construcción del frontend.

---

## 1. Mapa de Navegación Global (Sitemap)

```mermaid
graph TD
    classDef main fill:#0B2032,stroke:#1E857B,stroke-width:2px,color:#FFFFFF;
    classDef client fill:#1E857B,stroke:#249C90,stroke-width:2px,color:#FFFFFF;
    classDef crm fill:#071624,stroke:#C0392B,stroke-width:2px,color:#FFFFFF;
    classDef calc fill:#16344E,stroke:#38BDF8,stroke-width:2px,color:#FFFFFF;

    Home[Landing Page Principal / Index]:::main
    
    %% Ramas Públicas
    Home --> Services[Servicios Comerciales & Residenciales]:::main
    Home --> About[Sobre Nosotros & Certificaciones EPA/OSHA]:::main
    Home --> Calculator[Calculadora Interactiva de Presupuestos]:::calc
    Home --> Contact[Contacto Directo & Línea Miami 305]:::main
    Home --> ClientLogin[Acceso a Clientes / Client Portal]:::client
    Home --> AdminLogin[Acceso Corporativo / CRM Admin]:::crm

    %% Flujo de Conversión
    Calculator --> Checkout[Proceso de Reserva & Checkout Seguro]:::calc
    Checkout --> Confirmation[Confirmación de Orden & Onboarding]:::calc

    %% Portal de Clientes
    ClientLogin --> ClientDashboard[Dashboard de Cliente]:::client
    ClientDashboard --> InspectionLog[Inspección Fotográfica Antes/Después]:::client
    ClientDashboard --> ScheduledVisits[Calendario de Visitas & Cuadrilla]:::client
    ClientDashboard --> BillingHistory[Historial de Facturación & Pagos ACH]:::client
    ClientDashboard --> AddonService[Solicitud de Servicios Especiales]:::client

    %% CRM Administrativo
    AdminLogin --> CRMDashboard[Panel de Control Operativo]:::crm
    CRMDashboard --> DispatchBoard[Despacho & Rutas Miami-Dade/Broward]:::crm
    CRMDashboard --> WorkOrders[Gestión de Órdenes de Trabajo / Kanban]:::crm
    CRMDashboard --> QAAudit[Auditoría de Calidad & Checklists EPA]:::crm
    CRMDashboard --> InvoicingCRM[Facturación Automatizada & Cobros]:::crm
    CRMDashboard --> CrewManagement[Gestión de Personal & Certificaciones]:::crm
```

---

## 2. Flujo de Conversión del Cliente (Embudo de Ventas: Cotización $\to$ Reserva)

El embudo garantiza que un cliente residencial o corporativo obtenga un presupuesto transparente en menos de 90 segundos y pueda agendar sin fricciones.

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Cliente (Comercial / Residencial)
    participant Web as Landing Page / Calculadora
    participant API as Backend Engine (Pricing & Geozoning)
    participant Stripe as Pasarela de Pagos (Stripe / Plaid ACH)
    participant CRM as CRM Operativo CRIS

    Cliente->>Web: Ingresa a la Calculadora interactiva
    Web->>Cliente: Selecciona Tipo (Oficina, Clínica, Residencia) y Superficie (sq ft)
    Cliente->>Web: Elige Frecuencia (Diario -25%, Semanal -15%, Bi-semanal -5%, Única)
    Web->>API: Calcula tarifa en tiempo real basada en $/sqft + addons
    API-->>Web: Retorna presupuesto desglosado con estimación de horas
    Cliente->>Web: Clic en "Agendar y Reservar Servicio"
    Web->>Cliente: Solicita Código Postal (Miami-Dade / Broward), Fecha y Franja Horaria
    Cliente->>Web: Ingresa datos de acceso (códigos de seguridad, notas operativas)
    Cliente->>Stripe: Selecciona método de pago (Tarjeta / ACH Transfer / NET-30 Comercial)
    Stripe-->>Web: Confirmación de tokenización segura
    Web->>CRM: Emite Orden de Trabajo (WO-Pending) + Asignación automática de cuadrilla
    CRM-->>Cliente: Email y SMS con confirmación, código de servicio y enlace al portal
```

---

## 3. Flujo Operativo del CRM y Despacho en Campo (Operations & Field Execution)

Refleja la promesa de valor: control riguroso, trazabilidad GPS y auditoría fotográfica antes/después garantizada.

```mermaid
flowchart TD
    classDef startNode fill:#0B2545,stroke:#0066CC,stroke-width:2px,color:#fff;
    classDef processNode fill:#FFFFFF,stroke:#0B2545,stroke-width:1.5px,color:#0F172A;
    classDef greenNode fill:#0FA97E,stroke:#0B2545,stroke-width:2px,color:#fff;
    classDef alertNode fill:#F59E0B,stroke:#0F172A,stroke-width:2px,color:#fff;

    Start([Nueva Orden de Trabajo WO Recibida]):::startNode --> Dispatch{Algoritmo de Despacho}:::processNode
    
    Dispatch -->|Ubicación: Brickell / Downtown| Crew1[Asignación Cuadrilla 1 - Vehículo Ford Transit #101]:::processNode
    Dispatch -->|Ubicación: Doral / Medley| Crew2[Asignación Cuadrilla 2 - Vehículo Ford Transit #102]:::processNode
    Dispatch -->|Ubicación: Coral Gables / South Miami| Crew3[Asignación Cuadrilla 3 - Vehículo Ford Transit #103]:::processNode

    Crew1 --> StatusInRoute[Cambio de Estado: 'En Ruta' / Notificación al Cliente por SMS]:::processNode
    StatusInRoute --> Arrival[Llegada al Inmueble / Check-in Geocercado GPS]:::processNode
    
    Arrival --> InspectionBefore[Paso Obligatorio: Fotografía 'Antes' en App Móvil de Cuadrilla]:::processNode
    InspectionBefore --> ServiceExecution[Ejecución del Servicio bajo Protocolo EPA Hospital-Grade]:::processNode
    
    ServiceExecution --> InspectionAfter[Paso Obligatorio: Fotografía 'Después' + Checklist de 28 Puntos]:::processNode
    InspectionAfter --> SuperReview{¿Supera el 100% de la Inspección QA?}:::alertNode

    SuperReview -->|No: Falta detalle| ReTouch[Subsanación inmediata por el equipo antes de retirarse]:::alertNode
    ReTouch --> InspectionAfter

    SuperReview -->|Sí: Aprobado| SignOff[Firma digital del Facility Manager o Check-out automático]:::greenNode
    SignOff --> CloseOrder[Estado: 'Servicio Completado & Certificado']:::greenNode
    CloseOrder --> AutoBilling[Disparo de Factura Automática + Reporte Fotográfico al Portal del Cliente]:::greenNode
```

---

## 4. Arquitectura de Pantallas del CRM Administrativo

```mermaid
graph LR
    classDef admin fill:#0B2545,stroke:#00B4D8,stroke-width:2px,color:#fff;
    classDef view fill:#F8FAFC,stroke:#0066CC,stroke-width:1.5px,color:#0F172A;

    CRMRoot[Panel Central / Dashboard]:::admin

    CRMRoot --> V1[1. Monitor de Rendimiento / KPIs]:::view
    V1 --- D1[• Ingresos Recurrentes Mensuales MRR<br>• Tasa de Cumplimiento de Horarios 99.4%<br>• Puntuación de Satisfacción CSAT 4.9/5.0<br>• Horas Facturadas vs Estimadas]

    CRMRoot --> V2[2. Dispatch Board Interactivo]:::view
    V2 --- D2[• Mapa de calor Miami-Dade & Broward<br>• Rastreo GPS en tiempo real de vehículos<br>• Estado de cuadrillas: En ruta, Limpiando, Libre<br>• Alertas de tráfico en I-95 y Palmetto]

    CRMRoot --> V3[3. Tablero Kanban de Servicios]:::view
    V3 --- D3[• Programados (Scheduled)<br>• En Camino (In Route)<br>• En Proceso (In Progress)<br>• Inspección QA Aprobada<br>• Facturados & Pagados]

    CRMRoot --> V4[4. Repositorio de Auditoría Fotográfica]:::view
    V4 --- D4[• Búsqueda por Cliente y Fecha<br>• Comparador visual 'Antes / Después'<br>• Certificados de desinfección descargables PDF]
```

---

## 5. Portal de Clientes (Client Self-Service Experience)

Diseñado para administradores de condominios de lujo, oficinas corporativas y propietarios que exigen control absoluto:

1. **Dashboard Principal:**
   - Próxima visita programada con foto y nombre del líder de cuadrilla.
   - Estado en tiempo real del servicio en curso (ej. *"Cuadrilla en sitio limpiando piso 4"*).
2. **Inspecciones Fotográficas:**
   - Galería interactiva con deslizador (*slider*) comparativo de alta definición.
   - Registro de sellos temporales y firmas de auditoría de supervisores.
3. **Gestión de Facturación y Finanzas:**
   - Descarga de facturas fiscales con desglose de servicios.
   - Configuración de pagos automatizados ACH (Plaid) o tarjetas corporativas con recibos automáticos.
4. **Solicitudes en Un Clic:**
   - Adición de servicios extraordinarios (lavado profundo de alfombras, pulido de mármol, desinfección con nebulizador EPA).
