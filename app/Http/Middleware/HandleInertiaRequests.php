<?php

namespace App\Http\Middleware;

use App\Http\Controllers\NotificacionController;
use App\Models\Notificacion;
use App\Models\Solicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $user = null;

        $authUser = auth()->user();

        if ($authUser) {
            if ($authUser->rol_id == 2) {
                $user = $authUser->load(
                    'solicitudes.tipo',
                    'solicitudes.status',
                    'solicitudes.user',
                    'solicitudes.files.user',
                    'solicitudes.comentarios',
                    'solicitudes.userAsignado'
                );
            } else {
                $user = auth()->user();
                $user['solicitudes'] = Solicitud::all()->load('tipo', 'status', 'user', 'files.user', 'comentarios', 'userAsignado');
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'countNotificaciones' => NotificacionController::countNotification()
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
