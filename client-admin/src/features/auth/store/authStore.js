import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  login as loginRequest,
  register as registerRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
} from "../../../shared/api";
import { showError } from "../../../shared/utils/toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      loading: false,
      error: null,
      isLoadingAuth: true,
      isAuthenticated: false,

      checkAuth: () => {
        const token = get().token;
        const role = get().user?.role;
        const isAdmin = role === "ADMIN_ROLE";

        if (token && !isAdmin) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isLoadingAuth: true,
            isAuthenticated: false,
            error: "No tienes permisos para acceder como administrador."
          })
          return;

        }

        set({

          isLoadingAuth: false,
          isAuthenticated: Boolean(token) && isAdmin
        })

      },


      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await loginRequest({ emailOrUsername, password });
          console.log(data);

          const role = data?.userDetails?.role;

          if (role !== "ADMIN_ROLE") {
            const message = "No tiene permisos para acceder como administrador"
            set({
              user: null,
              token: null,
              refreshToken: null,
              expiresAt: null,
              error: message,
              isLoadingAuth: true,
              isAuthenticated: false,


            })

            showError(message)
            return { success: false, error: message }

          }

          set({
            user: data.userDetails,
            token: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresAt,
            loading: false,
            isAuthenticated: true,
          });

          return { success: true, error: null };
        } catch (err) {
          console.error("Login error:", err);
          const message =
            err.response?.data?.message || "Error de autenticación";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        try {
          set({ loading: true, error: null });
          const { data } = await registerRequest(formData);
          set({ loading: false });
          return {
            success: true,
            emailVerificationRequired: data?.emailVerificationRequired,
            data,
          };
        } catch (err) {
          const message = err.response?.data?.message || "Error al registrarse";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ loading: true, error: null });
          const { data } = await forgotPasswordRequest(email);
          set({ loading: false });
          return { success: true, message: data?.message, data };
        } catch (err) {
          const message =
            err.response?.data?.message ||
            "No se pudo enviar el correo de recuperacion";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      resetPassword: async ({ token, newPassword }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await resetPasswordRequest({ token, newPassword });

          if (data?.success === false) {
            const message =
              data?.message || "No se pudo actualizar la contrasena";
            set({ error: message, loading: false });
            return { success: false, error: message };
          }

          set({ loading: false });
          return { success: true, message: data?.message, data };
        } catch (err) {
          const message =
            err.response?.data?.message ||
            "No se pudo actualizar la contrasena";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          expiresAt: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
      },
    }),
    { name: "auth-Storage" },
  ),
);
