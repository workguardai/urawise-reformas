import type { Metadata } from 'next'
import { CookieSettingsLink } from '@/components/consent'
import { REFORMAS_COMPANY, REFORMAS_EMAIL, SITE_URL } from '@/lib/reformas'

// Privacy policy for the renovation business behind reformas.urawise.eu (Spanish, separate from the platform's policy).

export const metadata: Metadata = {
  title: 'Política de privacidad | Reformas en Barcelona',
  description: 'Cómo tratamos tus datos cuando nos pides un presupuesto de reforma.',
  alternates: { canonical: `${SITE_URL}/privacidad` },
  robots: { index: false },
}

/** A company detail, highlighted while it hasn't been filled in yet. */
const Fill = ({ value, missing }: { value: string; missing: string }) => value ? <>{value}</> : <mark className="legal-todo">[Pendiente: {missing}]</mark>

export default function PrivacidadPage() {
  const email = REFORMAS_EMAIL ? <a href={`mailto:${REFORMAS_EMAIL}`}>{REFORMAS_EMAIL}</a> : <Fill value="" missing="email de contacto" />
  return <main className="reformas-page" lang="es">
    <header className="reformas-header">
      <a className="wordmark" href="/">URAWISE<span>.</span></a>
    </header>
    <article className="legal-body reformas-legal-body">
      <h1>Política de privacidad</h1>
      <p>Esta política explica cómo tratamos tus datos personales cuando nos contactas para pedir un presupuesto o nos encargas una reforma.</p>

      <h2>1. Responsable del tratamiento</h2>
      <p>{REFORMAS_COMPANY.owner ? <>{REFORMAS_COMPANY.name}, nombre comercial de {REFORMAS_COMPANY.owner}</> : REFORMAS_COMPANY.name}, empresario individual con NIF portugués <Fill value={REFORMAS_COMPANY.taxId} missing="NIF" />{REFORMAS_COMPANY.address ? <> y domicilio en {REFORMAS_COMPANY.address}</> : null}. Contacto: {email}.</p>

      <h2>2. Qué datos tratamos</h2>
      <ul>
        <li>Los datos que nos envías al contactarnos: nombre, teléfono, email y el contenido de tus mensajes (por ejemplo, la descripción de la reforma y las fotos que nos mandes).</li>
        <li>Si usas el formulario de presupuesto: nombre, teléfono, email (opcional), zona o código postal, tipo de trabajo y la descripción que escribas.</li>
        <li>Si llegas desde un anuncio de Google y aceptas las cookies de publicidad: el identificador del clic en el anuncio, para saber qué anuncios traen clientes (ver apartado 3).</li>
        <li>La dirección de la vivienda, para la visita y la obra.</li>
        <li>Si aceptas el presupuesto, los datos necesarios para el contrato y la facturación.</li>
        <li>Datos de navegación de esta web solo si aceptas las cookies de analítica y publicidad (ver apartado 7).</li>
      </ul>

      <h2>3. Para qué los usamos y con qué base legal</h2>
      <ul>
        <li><strong>Responder a tu consulta, visitar la vivienda y preparar el presupuesto:</strong> aplicación de medidas precontractuales a petición tuya.</li>
        <li><strong>Realizar la obra y facturarla:</strong> ejecución del contrato y cumplimiento de obligaciones legales (fiscales y contables).</li>
        <li><strong>Medir qué páginas y anuncios funcionan:</strong> tu consentimiento, que puedes retirar en cualquier momento. Con ese consentimiento, al enviar el formulario comunicamos a Google Ads la solicitud, con tu email o teléfono cifrados (en forma de «hash», no legibles), y más adelante si se concertó una visita o se contrató la obra, sin otros datos personales.</li>
      </ul>
      <p>No vendemos tus datos ni los usamos para enviarte publicidad sin tu permiso.</p>

      <h2>4. Con quién se comparten</h2>
      <ul>
        <li><strong>WhatsApp (Meta)</strong>, si nos escribes por WhatsApp, y nuestro proveedor de correo electrónico, si nos escribes por email.</li>
        <li><strong>Vercel</strong>, que aloja esta web, y <strong>Neon</strong>, donde se guardan las solicitudes del formulario.</li>
        <li><strong>Resend</strong>, que nos envía por email cada solicitud del formulario.</li>
        <li><strong>Google</strong> (Google Analytics y Google Ads), solo si aceptas las cookies de analítica y publicidad.</li>
        <li>Administraciones públicas, cuando la ley lo exija.</li>
      </ul>
      <p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en ese caso lo hacen con las garantías previstas en el RGPD, como las cláusulas contractuales tipo de la Comisión Europea.</p>

      <h2>5. Cuánto tiempo los conservamos</h2>
      <p>Si no llegamos a contratar la reforma, borramos tus datos cuando ya no sean necesarios para responder a tu consulta. Si contratas la obra, los conservamos mientras dure la relación y, después, durante los plazos que exige la ley (por ejemplo, la normativa fiscal y mercantil).</p>

      <h2>6. Tus derechos</h2>
      <p>Puedes pedir el acceso, la rectificación, la supresión, la limitación u oposición al tratamiento y la portabilidad de tus datos escribiéndonos a {email}. Si consideras que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).</p>

      <h2 id="cookies">7. Cookies</h2>
      <p>Usamos cookies necesarias para que la web funcione y para recordar tu elección sobre cookies. Solo si las aceptas, usamos también cookies de analítica y publicidad (Google Analytics y Google Ads) para saber qué páginas y anuncios funcionan. Puedes cambiar tu elección cuando quieras: <CookieSettingsLink label="Configuración de cookies" />.</p>
    </article>
    <footer className="reformas-footer">
      <p className="reformas-legal"><a href="/">← Volver a Reformas en Barcelona</a></p>
    </footer>
  </main>
}
