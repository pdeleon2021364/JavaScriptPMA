import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../../assets/img/kinal_sports.png";
import { useAuthStore } from "../store/authStore";

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);

  const token = useMemo(
    () => new URLSearchParams(location.search).get("token"),
    [location.search],
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ newPassword }) => {
    if (!token) {
      toast.error("El enlace de recuperacion no es valido", {
        duration: 4000,
      });
      return;
    }

    const res = await resetPassword({ token, newPassword });

    if (res.success) {
      toast.success(res.message || "Contrasena actualizada correctamente", {
        duration: 4000,
      });
      navigate("/");
      return;
    }

    toast.error(res.error || "No se pudo actualizar la contrasena", {
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-10">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Kinal Sports" className="h-20 w-auto" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Renovar Contrasena
          </h1>
          <p className="text-gray-600 text-base max-w-md mx-auto">
            Ingresa una nueva contrasena para tu cuenta
          </p>
        </div>

        {!token ? (
          <div className="space-y-5">
            <p className="text-center text-sm text-red-600">
              El enlace de recuperacion no es valido o esta incompleto.
            </p>
            <button
              type="button"
              className="w-full bg-main-blue text-white py-2 rounded-lg hover:opacity-90"
              onClick={() => navigate("/")}
            >
              Volver al Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-800 mb-1.5"
              >
                Nueva Contrasena
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="********"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register("newPassword", {
                  required: "La nueva contrasena es obligatoria",
                  minLength: {
                    value: 8,
                    message: "La contrasena debe tener al menos 8 caracteres",
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-800 mb-1.5"
              >
                Confirmar Contrasena
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="********"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                {...register("confirmPassword", {
                  required: "Confirma tu nueva contrasena",
                  validate: (value) =>
                    value === getValues("newPassword") ||
                    "Las contrasenas no coinciden",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-main-blue hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Contrasena"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
