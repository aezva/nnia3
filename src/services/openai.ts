import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const assistantId = process.env.OPENAI_ASSISTANT_ID || '';

export async function askNNIAWithAssistantAPI(messages: {role: string, content: string}[], threadId?: string) {
  // 1. Si no hay thread, crear uno nuevo y añadir todos los mensajes (system + user)
  let thread = threadId;
  if (!thread) {
    const threadRes = await openai.beta.threads.create();
    thread = threadRes.id;
    // Añadir todos los mensajes iniciales (system y user)
    for (const msg of messages) {
      await openai.beta.threads.messages.create(thread, {
        role: msg.role as any,
        content: msg.content,
      });
    }
  } else {
    // Si el thread ya existe, solo añadir el mensaje del usuario
    const userMsg = messages.find(m => m.role === 'user');
    if (userMsg) {
      await openai.beta.threads.messages.create(thread, {
        role: 'user',
        content: userMsg.content,
      });
    }
  }

  // 3. Ejecutar el assistant (run)
  const run = await openai.beta.threads.runs.create(thread, {
    assistant_id: assistantId,
    // tools: [ ... ] // Aquí puedes definir herramientas si las tienes
  });

  // 4. Esperar a que el run termine (polling)
  let runStatus = run.status;
  let runResult = run;
  while (runStatus === 'queued' || runStatus === 'in_progress') {
    await new Promise((r) => setTimeout(r, 400));
    runResult = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread });
    runStatus = runResult.status;
  }

  // 5. Obtener los mensajes finales del thread
  const messagesFinales = await openai.beta.threads.messages.list(thread);
  const lastMessage = messagesFinales.data.find((msg) => msg.role === 'assistant');
  let assistantText = '';
  if (lastMessage && lastMessage.content && Array.isArray(lastMessage.content)) {
    const textBlock = lastMessage.content.find((block) => block.type === 'text');
    if (textBlock && 'text' in textBlock && textBlock.text && 'value' in textBlock.text) {
      assistantText = textBlock.text.value;
    }
  }

  return {
    threadId: thread,
    run: runResult,
    message: assistantText,
    allMessages: messagesFinales.data,
  };
} 