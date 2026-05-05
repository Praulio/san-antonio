export function validateApuntarmePayload({ nombre, whatsapp }) {
  const errors = [];
  if (!nombre || !nombre.trim()) errors.push('Falta el nombre');
  if (!whatsapp || !whatsapp.trim()) errors.push('Falta el WhatsApp');
  else {
    const digits = whatsapp.replace(/\D/g, '');
    if (digits.length < 10) errors.push('WhatsApp debe tener al menos 10 dígitos');
  }
  return errors;
}

export async function submitApuntarme(endpoint, payload) {
  return postAction(endpoint, 'apuntarme', payload);
}

export async function submitTestimonio(endpoint, payload) {
  return postAction(endpoint, 'testimonio', payload);
}

async function postAction(endpoint, action, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
    redirect: 'follow'
  });
  if (!res.ok) throw new Error(`Error al enviar (${res.status})`);
  return res.json();
}
