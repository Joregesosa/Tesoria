import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    console.log(errors)

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <div className="w-full bg-softgray p-5 md:p-10">

                <div className="flex flex-col justify-center md:flex-row md:space-x-10">
                    <div className="flex flex-col justify-center p-5 md:p-20">
                        <h1 className="text-darkblue font-bold text-3xl px-5">Bienvenidos a Tesoria Online</h1>
                        <p className="text-textgray p-5">
                            Tu destino en linea para hacer negocios con tesoria
                        </p>
                        <a className='ms-5 hover:underline hidden md:block' href="https://tesoria.online/">← Ir a Tesoria</a>
                    </div>

                    <div className="flex items-center justify-center">
                        <form onSubmit={submit} className="bg-offwhite flex flex-col w-full md:w-fit h-fit p-8">
                            <h2 className="text-darkblue font-bold text-3xl px-5 text-center py-8">Login</h2>
                            <div>
                                <label htmlFor="email" className="text-sm text-darkblue font-medium">Correo</label>
                                <input type="email" id="email" name="email" value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="border-2 w-full md:w-80 h-9 outline-none mb-6 block" />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <label htmlFor="pass" className="text-sm text-darkblue font-medium">Contraseña</label>
                                <input type="password" id="password" name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="border-2 w-full md:w-80 h-9 outline-none mb-6 block" />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                </label>
                            </div>
                            <button type="submit" className="h-9 w-full bg-softblue mt-5 text-white font-bold text-xl">INGRESAR</button>

                            <div className="flex justify-between text-xs text-darkblue font-medium">
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>

                    <a className='ms-5 hover:underline block  md:hidden' href="https://tesoria.online/">← Ir a Tesoria</a>

                </div>
            </div>
        </GuestLayout>
    );
}

