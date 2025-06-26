export function buildPrompt({ clientData, message, source }: { clientData: any, message: string, source: string }) {
  // Aquí se puede personalizar el prompt según el contexto y el cliente
  return [
    {
      role: 'system',
      content: `Eres NNIA, una asistente IA profesional. Contexto del cliente: ${JSON.stringify(clientData)}. Source: ${source}`,
    },
    {
      role: 'user',
      content: message,
    },
  ];
} 