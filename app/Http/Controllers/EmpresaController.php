<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mensaje = session('msj');
        if ($mensaje) {
            Session::forget('msj');
        }

        $empresa =  Empresa::find(1);

        return Inertia::render('Mantenimiento/Index', [
            'empresa' => $empresa,
            'msj' => $mensaje
        ]);
    }


    public function update(Request $request, $id)
    {

        try {
            $empresa =  Empresa::find($id);
            $empresa->update($request->all());
            session()->put('msj', ["success" => 'Informacion guardada con exito']);
        } catch (\Exception $e) {
            session()->put('msj', ['error' => 'Error en la acción realizada']);
        }

        return redirect(route('empresa.index'));

    }
}
