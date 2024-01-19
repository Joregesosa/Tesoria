<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class UserController extends Controller
{

    public function index()
    {

        if (auth()->user()->rol_id == 1) {
            $mensaje = session('msj');
            if ($mensaje) {
                Session::forget('msj');
            }

            $users = User::select('id', 'name', 'telefono', 'email', 'empresa', 'rnc', 'status', 'rol_id')->with('rol')->get();

            $roles = Rol::select('id', 'nombre')->where('status', 1)->get();

            return Inertia::render('Usuarios/Index', [
                'users' => $users,
                'roles' => $roles,
                'msj' => $mensaje
            ]);
        } else {
            return json_encode('No tienes permiso para esta transaccion');
        }
    }

    public function update(Request $request)
    {

        if (auth()->user()->rol_id == 1) {
            $user = User::find($request->id);
            $request->name != null && $user->name = $request->name;
            $request->email != null && $user->email = $request->email;
            $request->password != null && $user->password = $request->password;
            $request->empresa != null && $user->empresa = $request->empresa;
            $request->rnc != null && $user->rnc = $request->rnc;
            $request->rol_id != null && $user->rol_id = $request->rol_id;
            $request->status != null && $user->status = $request->status;
            $request->telefono != null && $user->telefono = $request->telefono;
            $user->save();

            session()->put('msj', ["success" => 'Usuario actializado con exito']);
        } else {

            session()->put('msj', ["error" => 'No tienes permiso para esta transaccion']);
        }

        return redirect(route('usuarios.index'));
    }

    public function destroy(string $id)
    {

        if (auth()->user()->rol_id == 1) {

            User::destroy($id);
            session()->put('msj', ["success" => 'Usuario eliminado con exito']);
        } else {
            session()->put('msj', ["error" => 'No tienes permiso para esta transaccion']);
        }
        return redirect(route('usuarios.index'));
    }
}
