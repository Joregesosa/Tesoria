<?php

namespace App\Http\Controllers;

use App\Models\TipoSolicitud;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class TipoSolicitudController extends Controller
{

    public function index()
    {
        $mensaje = session('msj');
        if ($mensaje) {
            Session::forget('msj');
        }

        $TipoSolicitudes =  TipoSolicitud::where('tipo', '>',  0)->get();

        return Inertia::render('Mantenimiento/Index', [
            'tipoSolicitudes' => $TipoSolicitudes,
            'msj' => $mensaje
        ]);
    }

    public function create(Request $request)
    {
        try {
            $mensajes = [
                'nombre.required' => 'El nombre no puede estar en blanco',
                'tipo.required' => 'El tipo no puede estar en blanco',

            ];

            $validator = validator($request->all(), [
                'nombre' => 'required',
                'tipo' => 'required'
            ], $mensajes);

            if ($validator->fails()) {

                return redirect()->route('usuarios.index')->with('msj', ['error' => array_values($validator->errors()->messages())], 404);
            }

            TipoSolicitud::create($request->all());

            session()->put('msj', ["success" => 'Tipo de solicitud creada con exito']);

        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'No se pudo registrar el TipoSolicitud' . $e->getMessage()], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error en la accion realizada' . $e->getMessage()], 500);
        }

        return redirect(route('tipoSolicitud.index'));
    }

    public function update(Request $request)
    {

        try {
            $mensajes = [
                'id.exists' => 'El id es invalido',
                'id.required' => 'El id no puede estar en blanco',

            ];

            $validator = validator($request->all(), [
                'id' => 'required|exists:tipo_solicitudes,id',
            ], $mensajes);

            if ($validator->fails()) {

                return redirect()->route('usuarios.index')->with('msj', ['error' => array_values($validator->errors()->messages())], 404);
            }


            $TipoSolicitud = TipoSolicitud::findOrFail($request->id);
            $TipoSolicitud->update($request->all());

            session()->put('msj', ["success" => 'Tipo de solicitud actializada con exito']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El TipoSolicitud ' . $request->id . ' no existe no fue encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }
        return redirect(route('tipoSolicitud.index'));
    }

    public function destroy($id)
    {
        try {

            $mensajes = [
                'id.exists' => 'El id es invalido',
                'id.required' => 'El id no puede estar en blanco',
    
            ];
    
            $validator = validator(['id' => $id], [
                'id' => 'required|exists:tipo_solicitudes,id',
            ], $mensajes);
    
            if ($validator->fails()) {
    
                return redirect()->route('usuarios.index')->with('msj', ['error' => array_values($validator->errors()->messages())], 404);
            }

            $TipoSolicitud = TipoSolicitud::findOrFail($id);
            $TipoSolicitud->delete();
             
            session()->put('msj', ["success" => 'Tipo de solicitud eliminada con exito']);
         
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El TipoSolicitud ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }
        return redirect(route('tipoSolicitud.index'));
    }

   
}
