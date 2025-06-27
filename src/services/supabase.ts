import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

console.log('DEBUG SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('DEBUG SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '[PRESENTE]' : '[VACÍA]');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getClientData(clientId: string) {
  // Ejemplo: obtener datos del cliente desde la tabla 'clients'
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();
  if (error) throw error;
  return data;
}

export async function getPublicBusinessData(clientId: string) {
  // Obtener business_name desde clients
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, business_name')
    .eq('id', clientId)
    .single();
  if (clientError) throw clientError;

  // Obtener información pública del negocio desde business_info
  const { data: businessInfo, error: businessError } = await supabase
    .from('business_info')
    .select('*')
    .eq('client_id', clientId)
    .single();
  if (businessError) throw businessError;

  // Combinar los datos
  const combined = {
    business_name: client.business_name,
    ...businessInfo
  };

  // Filtrar campos vacíos o nulos para limpiar la respuesta
  const cleanData = Object.fromEntries(
    Object.entries(combined).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  );

  return cleanData;
}

// Obtener citas de un cliente
export async function getAppointments(clientId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  if (error) throw error;
  return data;
}

// Crear una cita
export async function createAppointment(appointment: any) {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select();
  if (error) throw error;
  return data[0];
}

// Obtener disponibilidad de un cliente
export async function getAvailability(clientId: string) {
  const { data, error } = await supabase
    .from('business_info')
    .select('appointment_days, appointment_hours, appointment_types')
    .eq('client_id', clientId)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
  // Adaptar a formato esperado por el frontend
  return data ? {
    days: data.appointment_days ? data.appointment_days.split(',') : [],
    hours: data.appointment_hours || '',
    types: data.appointment_types ? data.appointment_types.split(',') : []
  } : { days: [], hours: '', types: [] };
}

// Guardar o actualizar disponibilidad
export async function setAvailability(clientId: string, availability: { days: string, hours: string, types: string }) {
  const { data, error } = await supabase
    .from('business_info')
    .update({
      appointment_days: availability.days,
      appointment_hours: availability.hours,
      appointment_types: availability.types
    })
    .eq('client_id', clientId)
    .select();
  if (error) throw error;
  return data && data[0] ? {
    days: data[0].appointment_days ? data[0].appointment_days.split(',') : [],
    hours: data[0].appointment_hours || '',
    types: data[0].appointment_types ? data[0].appointment_types.split(',') : []
  } : { days: [], hours: '', types: [] };
}

// Obtener disponibilidad y tipos de cita de un cliente (helper para NNIA)
export async function getAvailabilityAndTypes(clientId: string) {
  const { data, error } = await supabase
    .from('business_info')
    .select('appointment_days, appointment_hours, appointment_types')
    .eq('client_id', clientId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? {
    days: data.appointment_days ? data.appointment_days.split(',') : [],
    hours: data.appointment_hours || '',
    types: data.appointment_types ? data.appointment_types.split(',') : []
  } : { days: [], hours: '', types: [] };
} 