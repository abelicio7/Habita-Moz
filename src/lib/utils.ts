import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um número de telefone para o formato internacional de Moçambique (+258)
 * Remove todos os caracteres não numéricos e adiciona o prefixo 258 se necessário
 */
export function formatMozambiquePhone(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Se já começa com 258, retorna como está
  if (cleanPhone.startsWith('258')) {
    return cleanPhone;
  }
  
  // Se começa com 8 (operadoras moçambicanas: 82, 84, 85, 86, 87)
  // e tem 9 dígitos, adiciona o prefixo 258
  if (cleanPhone.startsWith('8') && cleanPhone.length === 9) {
    return `258${cleanPhone}`;
  }
  
  // Caso contrário, retorna o número limpo (pode ser de outro país)
  return cleanPhone;
}
