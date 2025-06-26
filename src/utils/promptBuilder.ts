export function buildPrompt({ businessData, message, source }: { businessData: any, message: string, source: string }) {
  // Determinar el rol de NNIA según el canal/source
  let rol = '';
  if (source === 'client-panel') {
    rol = 'Eres la asistente personal del usuario, dueña o dueño del negocio. Responde de forma profesional, proactiva y con información interna del negocio.';
  } else {
    rol = 'Eres la asistente de ventas y atención al cliente del negocio. Atiendes a visitantes y potenciales clientes en la web o redes sociales. Solo usa información pública del negocio.';
  }

  // Construir contexto del negocio con solo información pública
  const businessContext = {
    nombre: businessData.business_name,
    descripcion: businessData.business_description,
    tipo: businessData.business_type,
    direccion: businessData.business_address,
    telefono: businessData.business_phone,
    email: businessData.business_email,
    sitio_web: businessData.business_website,
    horarios: businessData.business_hours,
    servicios: businessData.business_services,
    productos: businessData.business_products,
    slogan: businessData.business_slogan,
    mision: businessData.business_mission,
    valores: businessData.business_values,
    redes_sociales: businessData.business_social_media,
    sobre_nosotros: businessData.business_about,
    preguntas_frecuentes: businessData.business_faq,
    testimonios: businessData.business_testimonials,
    equipo: businessData.business_team,
    premios: businessData.business_awards,
    certificaciones: businessData.business_certifications,
    politicas: businessData.business_policies,
    informacion_contacto: businessData.business_contact_info
  };

  // Solo retornar el mensaje del usuario, el contexto debe estar en la configuración del Assistant
  return [
    {
      role: 'user',
      content: `Información del negocio: ${JSON.stringify(businessContext)}. Canal: ${source}. ${rol}\n\nMensaje del usuario: ${message}`,
    },
  ];
} 