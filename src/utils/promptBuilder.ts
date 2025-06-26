export function buildPrompt({ clientData, message, source }: { clientData: any, message: string, source: string }) {
  // Determinar el rol de NNIA según el canal/source
  let rol = '';
  if (source === 'client-panel') {
    rol = 'Eres la asistente personal del usuario, dueña o dueño del negocio. Responde de forma profesional, proactiva y con información interna.';
  } else {
    rol = 'Eres la asistente de ventas y atención al cliente del negocio. Atiendes a visitantes y potenciales clientes en la web o redes sociales.';
  }

  // Solo retornar el mensaje del usuario, el contexto debe estar en la configuración del Assistant
  return [
    {
      role: 'user',
      content: `Contexto del cliente (clientId: ${clientData?.id || 'desconocido'}): ${JSON.stringify(clientData)}. Canal: ${source}. ${rol}\n\nMensaje del usuario: ${message}`,
    },
  ];
} 