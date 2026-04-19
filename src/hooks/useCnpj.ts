import { useState, useEffect } from 'react';
import { fetchCnpj, CnpjResult } from '../lib/publicApis';

export function useCnpj() {
  const [cnpj, setCnpj] = useState('');
  const [resultado, setResultado] = useState<CnpjResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const rawCnpj = cnpj.replace(/\D/g, '');
    
    if (rawCnpj.length === 0) {
      setResultado(null);
      setErro(null);
      return;
    }

    if (rawCnpj.length === 14) {
      buscarCnpjAutomatico(rawCnpj);
    }
  }, [cnpj]);

  const buscarCnpjAutomatico = async (cnpjLimpo: string) => {
    setLoading(true);
    setErro(null);
    setResultado(null);

    const res = await fetchCnpj(cnpjLimpo);
    
    if (res) {
      setResultado(res);
    } else {
      setErro('CNPJ não encontrado');
    }
    
    setLoading(false);
  };

  const setCnpjMasked = (texto: string) => {
    let valor = texto.replace(/\D/g, '').slice(0, 14);
    
    if (valor.length > 12) {
      valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else if (valor.length > 8) {
      valor = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
    }
    
    setCnpj(valor);
  };

  return { cnpj, setCnpj: setCnpjMasked, resultado, loading, erro };
}
