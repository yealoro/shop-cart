export type AuthResponse = {
  success: boolean;
  message: string;
  redirectTo?: string; // Opcional, para redireccionar después de una acción exitosa
};