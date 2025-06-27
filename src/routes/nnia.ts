import { Router, Request, Response } from 'express';
import { buildPrompt } from '../utils/promptBuilder';
import { askNNIAWithModel } from '../services/openai';
import { getClientData, getPublicBusinessData, getAppointments, createAppointment, getAvailability, setAvailability } from '../services/supabase';

const router = Router();

// POST /nnia/respond
router.post('/respond', async (req: Request, res: Response) => {
  const { clientId, message, source, visitorId, threadId } = req.body;

  if (!clientId || !message || !source) {
    res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    return;
  }

  try {
    // 1. Obtener información pública del negocio (sin datos confidenciales)
    const businessData = await getPublicBusinessData(clientId);

    // 2. Construir prompt personalizado con solo información pública
    const prompt = buildPrompt({ businessData, message, source });

    // 3. Elegir modelo según el canal
    let model = 'gpt-3.5-turbo';
    // Si en el futuro quieres usar gpt-4 para el panel, puedes hacer:
    // if (source === 'client-panel') model = 'gpt-4';

    // 4. Llamar a la API de OpenAI con el modelo elegido
    const nniaResponse = await askNNIAWithModel(prompt, model);

    // 4. (Opcional) Aquí puedes analizar si OpenAI pidió ejecutar una función y ejecutarla
    // Por ejemplo, si nniaResponse.run.required_action === 'function_call', ejecuta la función y responde

    res.json({
      success: true,
      nnia: nniaResponse.message,
      allMessages: nniaResponse.allMessages
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

// Obtener citas del cliente
router.get('/appointments', async (req: Request, res: Response) => {
  const clientId = req.query.clientId as string;
  if (!clientId) return res.status(400).json({ error: 'Falta clientId' });
  try {
    const data = await getAppointments(clientId);
    res.json({ success: true, appointments: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear cita
router.post('/appointments', async (req: Request, res: Response) => {
  try {
    const data = await createAppointment(req.body);
    res.json({ success: true, appointment: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener disponibilidad
router.get('/availability', async (req: Request, res: Response) => {
  const clientId = req.query.clientId as string;
  if (!clientId) return res.status(400).json({ error: 'Falta clientId' });
  try {
    const data = await getAvailability(clientId);
    res.json({ success: true, availability: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Guardar disponibilidad
router.post('/availability', async (req: Request, res: Response) => {
  const { clientId, days, hours, types } = req.body;
  if (!clientId) return res.status(400).json({ error: 'Falta clientId' });
  try {
    const data = await setAvailability(clientId, { days, hours, types });
    res.json({ success: true, availability: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 