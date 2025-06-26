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
  // Obtener solo información pública del negocio
  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      business_name,
      business_description,
      business_type,
      business_address,
      business_phone,
      business_email,
      business_website,
      business_hours,
      business_services,
      business_products,
      business_slogan,
      business_mission,
      business_values,
      business_social_media,
      business_logo_url,
      business_banner_url,
      business_about,
      business_faq,
      business_testimonials,
      business_team,
      business_awards,
      business_certifications,
      business_policies,
      business_contact_info
    `)
    .eq('id', clientId)
    .single();
  
  if (error) throw error;
  
  // Filtrar campos vacíos o nulos para limpiar la respuesta
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  );
  
  return cleanData;
} 