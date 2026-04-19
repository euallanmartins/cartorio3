export type CepResult = {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type IndicadoresBCB = {
  selic: number;
  cdi: number;
  data: string;
};

export type CnpjResult = {
  razaoSocial: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export async function fetchCep(cep: string): Promise<CepResult | null> {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || ''
    };
  } catch {
    return null;
  }
}

export async function fetchCepFallback(cep: string): Promise<CepResult | null> {
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      logradouro: data.street || '',
      bairro: data.neighborhood || '',
      cidade: data.city || '',
      uf: data.state || ''
    };
  } catch {
    return null;
  }
}

export async function fetchCepComFallback(cep: string): Promise<CepResult | null> {
  const viaCepResult = await fetchCep(cep);
  if (viaCepResult) return viaCepResult;
  return fetchCepFallback(cep);
}

export async function geocodeEndereco(endereco: string): Promise<LatLng | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1&countrycodes=br`, {
      headers: {
        'User-Agent': '3RISP-App/1.0'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchIndicadoresBCB(): Promise<IndicadoresBCB> {
  try {
    // fix: usar allSettled para tratar falha individual de cada indicador
    const [selicResult, cdiResult] = await Promise.allSettled([
      fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json').then(r => r.json()),
      fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json').then(r => r.json())
    ]);
    
    const selic = selicResult.status === 'fulfilled' ? parseFloat(selicResult.value[0].valor) : 0;
    const cdi = cdiResult.status === 'fulfilled' ? parseFloat(cdiResult.value[0].valor) : 0;
    const data = selicResult.status === 'fulfilled' ? selicResult.value[0].data : '';
    
    return { selic, cdi, data };
  } catch {
    return { selic: 0, cdi: 0, data: '' };
  }
}

export async function fetchCnpj(cnpj: string): Promise<CnpjResult | null> {
  try {
    const res = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
    if (!res.ok) return null;
    const data = await res.json();
    
    return {
      razaoSocial: data.razao_social || '',
      logradouro: data.estabelecimento?.logradouro || '',
      numero: data.estabelecimento?.numero || '',
      bairro: data.estabelecimento?.bairro || '',
      cidade: data.estabelecimento?.cidade?.nome || '',
      uf: data.estabelecimento?.estado?.sigla || ''
    };
  } catch {
    return null;
  }
}
