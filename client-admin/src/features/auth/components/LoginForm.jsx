import { useForm } from "react-hook-form"
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";

export const LoginForm = ({ onForgot }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const login = useAuthStore(state => state.login);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        //Mandar data al backend para validar credenciales.
        const res = await login(data)
        console.log(data);

        if (res.success) {
            navigate("/dashboard");
            toast.success("Credenciales válidas", {duration: 4000});
        } else {
            toast.error("Error de autenticación", {duration: 4000});
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label
                    htmlFor="emailOrUsername"
                    className="block text-sm font-medium text-gray-800 mb-1.5"
                >
                    Email o Usuario
                </label>

                <input
                    id="emailOrUsername"
                    type="text"
                    placeholder="correo@ejemplo.com o usuario"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("emailOrUsername", {
                        required: "Este campo es requerido"
                    })}
                />

                {errors.emailOrUsername && (
                    <p className="text-red-600 text-xs mt-1">
                        {errors.emailOrUsername.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-800 mb-1.5"
                >
                    Contraseña
                </label>

                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("password", {
                        required: "La contraseña es obligatoria"
                    })}
                />

                {errors.password && (
                    <p className="text-red-600 text-xs mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-main-blue hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg
                            transition-colors duration-200 text-sm disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            <p className="text-center text-sm">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-main-blue hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </p>
        </form>
    )
}
