import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchCepComFallback, CepResult } from '../lib/publicApis';

export function useCep() {
  const [cep, setCep] = useState('');
  const [resultado, setResultado] = useState<CepResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // fix: ref para cancelar requisição anterior se o cep mudar rapidamente
  const requestIdRef = useRef(0);

  useEffect(() => {
    const rawCep = cep.replace(/\D/g, '');
    
    if (rawCep.length === 0) {
      setResultado(null);
      setErro(null);
      return;
    }
    
    if (rawCep.length === 8) {
      const currentId = ++requestIdRef.current;
      buscarCepAutomatico(rawCep, currentId);
    }
  }, [cep]);

  const buscarCepAutomatico = async (cepLimpo: string, requestId: number) => {
    setLoading(true);
    setErro(null);
    setResultado(null);

    const res = await fetchCepComFallback(cepLimpo);
    
    // fix: só atualiza se for a requisição mais recente
    if (requestId !== requestIdRef.current) return;
    
    if (res) {
      setResultado(res);
    } else {
      setErro('CEP não encontrado');
    }
    
    setLoading(false);
  };

  const setCepMasked = (texto: string) => {
    const numeros = texto.replace(/\D/g, '').slice(0, 8);
    if (numeros.length <= 5) {
      setCep(numeros);
    } else {
      setCep(`${numeros.slice(0, 5)}-${numeros.slice(5)}`);
    }
  };

  // fix: verificação de circunscrição baseada nos bairros do 3º RI
  const isCircunscricao3RISP = useCallback((): boolean => {
    if (!resultado) return false;
    const lowerBairro = resultado.bairro.toLowerCase();
    return lowerBairro.includes('brás') || lowerBairro.includes('santana') || lowerBairro.includes('cachoeirinha');
  }, [resultado]);

  return { cep, setCep: setCepMasked, resultado, loading, erro, isCircunscricao3RISP };
}
