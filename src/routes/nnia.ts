import { Router, Request, Response } from 'express';
import { buildPrompt } from '../utils/promptBuilder';
import { askNNIAWithAssistantAPI } from '../services/openai';
import { getClientData } from '../services/supabase';

const router = Router();

// POST /nnia/respond
router.post('/respond', async (req: Request, res: Response) => {
  const { clientId, message, source, visitorId, threadId } = req.body;

  if (!clientId || !message || !source) {
    res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    return;
  }

  try {
    // 1. Obtener información real del usuario desde Supabase
    const clientData = await getClientData(clientId);

    // 2. Construir prompt personalizado (ahora sí se usa)
    const prompt = buildPrompt({ clientData, message, source });

    // 3. Llamar a la Assistant API de OpenAI (con prompt personalizado)
    const nniaResponse = await askNNIAWithAssistantAPI(prompt, threadId);

    // 4. (Opcional) Aquí puedes analizar si OpenAI pidió ejecutar una función y ejecutarla
    // Por ejemplo, si nniaResponse.run.required_action === 'function_call', ejecuta la función y responde

    res.json({
      success: true,
      nnia: nniaResponse.message,
      threadId: nniaResponse.threadId,
      allMessages: nniaResponse.allMessages,
      run: nniaResponse.run
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error procesando la solicitud de NNIA', details: error.message });
  }
});

// Análisis de documentos (subida y análisis)
router.post('/analyze-document', async (req: Request, res: Response) => {
  // Aquí se recibiría la URL o el archivo del documento
  // Se analizaría el documento y se guardaría el resumen en Supabase
  // Ejemplo de respuesta:
  res.json({ success: true, summary: 'Resumen del documento (pendiente de integración real)' });
});

// Gestión de citas (crear, actualizar, eliminar)
router.post('/appointments', async (req: Request, res: Response) => {
  // Aquí se recibirían los datos de la cita y se guardarían en Supabase
  // Ejemplo de respuesta:
  res.json({ success: true, message: 'Cita creada (pendiente de integración real)' });
});

router.put('/appointments/:id', async (req: Request, res: Response) => {
  // Aquí se actualizaría la cita con el id dado
  res.json({ success: true, message: 'Cita actualizada (pendiente de integración real)' });
});

router.delete('/appointments/:id', async (req: Request, res: Response) => {
  // Aquí se eliminaría la cita con el id dado
  res.json({ success: true, message: 'Cita eliminada (pendiente de integración real)' });
});

export default router; 