import { useState, useEffect, useRef } from 'react';
import { fetchIndicadoresBCB, IndicadoresBCB } from '../lib/publicApis';

// fix: cache global por sessão para não refazer request ao remontar
let cachedIndicadores: IndicadoresBCB | null = null;

export function useIndicadores() {
  const [indicadores, setIndicadores] = useState<IndicadoresBCB | null>(cachedIndicadores);
  const [loading, setLoading] = useState(!cachedIndicadores);

  useEffect(() => {
    // fix: se já temos cache, não refaz a requisição
    if (cachedIndicadores) {
      setIndicadores(cachedIndicadores);
      setLoading(false);
      return;
    }

    let mounted = true;

    const carregar = async () => {
      const res = await fetchIndicadoresBCB();
      if (mounted) {
        cachedIndicadores = res; // fix: persiste em cache de sessão
        setIndicadores(res);
        setLoading(false);
      }
    };

    carregar();

    return () => {
      mounted = false;
    };
  }, []);

  return { indicadores, loading };
}
