
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export function saveTokens(tokens: {
  accessToken: string;
  refreshToken?: string;
}): void {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


//ESTO SE CAMBIO 
export async function login(
  correoElectronico: string,
  contrasena: string,
): Promise<void> {
  const { data } = await api.post<{
    accessToken: string;
    refreshToken: string;
  }>('/auth/login', {
    correoElectronico,
    contrasena,
    idRolSolicitado: 2,
  });

  saveTokens(data);
}

export function logout(): void {
  clearTokens();
  window.location.replace('/login');
}

export function errorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    if (!e.response) return 'No se pudo conectar con el servidor';
    const message = (e.response.data as { message?: string | string[] })
      ?.message;
    if (message) return Array.isArray(message) ? message.join(', ') : message;
  }
  return 'Ocurrió un error inesperado';
}

export type ResumenReportesApi = {
  total: number;
  pendientes: number;
  aprobados: number;
  rechazados: number;
};

export async function getResumenReportes(): Promise<ResumenReportesApi> {
  const { data } = await api.get<ResumenReportesApi>(
    '/reportes/resumen',
  );

  return data;
}

export type EstadisticasReportesApi = {
  totalReportes: number;

  porEstado: {
    enRevision: number;
    aprobados: number;
    rechazados: number;
  };

  porSexo: {
    sexo: string;
    cantidad: number;
  }[];

  porRangoEdad: {
    rango: string;
    cantidad: number;
  }[];

  porPlataforma: {
    plataforma: string;
    cantidad: number;
  }[];
};

export async function getEstadisticasReportes(): Promise<EstadisticasReportesApi> {
  const { data } = await api.get<EstadisticasReportesApi>(
    '/reportes/estadisticas',
  );

  return data;
}

export type ReporteApi = {
  idReporte: number;
  idUsuario: number;
  idSubcategoria: number;
  idEstado: number;
  descripcion: string;
  plataforma: string;
  entidadReportada: string;
  publicacionAnonima: boolean;
  fechaRegistro: string;
  categoria: string;
  subcategoria: string;
};

export async function getReportesPendientes(): Promise<ReporteApi[]> {
  const { data } = await api.get<ReporteApi[]>(
    '/reportes/pendientes',
  );

  return data;
}

export async function getHistorialReportes(): Promise<
  ReporteApi[]
> {
  const { data } = await api.get<ReporteApi[]>(
    '/reportes/historial',
  );

  return data;
}

export type EvidenciaApi = {
  idEvidencia: number;
  idReporte: number;
  nombreArchivo: string;
  urlArchivo: string;
  tipoArchivo: string;
  fechaCarga: string;
};

export async function getReporteDetalle(
  idReporte: number,
): Promise<ReporteApi> {
  const { data } = await api.get<ReporteApi>(
    `/reportes/${idReporte}`,
  );

  return data;
}

export async function getEvidenciasReporte(
  idReporte: number,
): Promise<EvidenciaApi[]> {
  const { data } = await api.get<EvidenciaApi[]>(
    `/evidencias/reportes/${idReporte}`,
  );

  return data;
}

export async function actualizarEstadoReporte(
  idReporte: number,
  idEstado: number,
): Promise<ReporteApi> {
  const { data } = await api.patch<ReporteApi>(
    `/reportes/${idReporte}/estado`,
    { idEstado },
  );

  return data;
}

export async function descargarEvidencia(
  nombreArchivo: string,
): Promise<void> {
  const { data } = await api.get<Blob>(
    `/evidencias/archivos/${encodeURIComponent(nombreArchivo)}`,
    {
      responseType: 'blob',
    },
  );

  const url = URL.createObjectURL(data);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  URL.revokeObjectURL(url);
}

let refreshing: Promise<void> | null = null;

function refreshAccessToken(): Promise<void> {
  // axios "pelón": esta petición no pasa por los interceptores de `api`
  refreshing ??= axios
    .post<{ accessToken: string }>(`${API_URL}/auth/refresh`, {
      refreshToken: getRefreshToken(),
    })
    .then(({ data }) => saveTokens(data))
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const is401 = error.response?.status === 401;
    const isAuthRoute = original?.url?.startsWith('/auth/');
    if (!is401 || !original || original._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      await refreshAccessToken();
    } catch (e) {
      // El servidor rechazó el refresh: la sesión terminó. Si ni siquiera
      // respondió (está apagado), los tokens se conservan.
      if (axios.isAxiosError(e) && e.response) logout();
      return Promise.reject(e);
    }
    return api(original);
  },
);
