<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificacionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $user_id = Auth::user()->id;
        if (Auth::user()->rol_id === 2) {
            $data = Notificacion::with('emisor')
                ->where('receptor_id', $user_id)
                ->where('status', 0)
                ->get();
            $notificaciones = [];
        } else {
            $data = Notificacion::with('emisor')
                ->where('receptor_id', null) //verificar esta funcion creando solicitudes en el clientes deben cargarse en el admin
                ->where('status', 0)
                ->get();
            $notificaciones = [];
        }


        foreach ($data as $value) {
            $notificaciones[] = [
                'id' => $value->id,
                'mensaje' => $value->message,
                'emisor' => $value->emisor->name,
                'solicitud_id' => $value->solicitud_id,
                'date' => $value->created_at
            ];
        }

        return Inertia::render('Notificaciones/Index', [
            'notificaciones' => $notificaciones
        ]);
    }


    public function show($id)
    {

        $validator = validator(['id' => $id], [
            'id' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $Notificacion = Notificacion::findOrFail($id);
            $Notificacion->load('emisor');
            $Notificacion->load('receptor');

            return $Notificacion;
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El Notificacion ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }
    }

    public function create(Request $request)
    {
        try {

            $validator = validator($request->all(), [
                'user_id' => 'required|exists:users,id',
                'message ' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            Notificacion::create($request->all());


            return response()->json(['msj' =>  $request->description], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'No se pudo registrar el Notificacion' . $e->getMessage()], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error en la accion realizada' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $notificacion =  Notificacion::findOrFail($request->n_id);
            $notificacion->status = 1;
            $notificacion->save();

            return redirect()->route('admsolicitudes')->with('solicitud_id', $request->id);
        } catch (ModelNotFoundException $e) {

            return redirect()->route('admsolicitudes');
        }
    }

    public function destroy($id)
    {
        $validator = validator(['id' => $id], [
            'id' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $Notificacion = Notificacion::findOrFail($id);
            if ($Notificacion->status) {
                $Notificacion->status = 0;
                $Notificacion->save();
                return response()->json(['msj' => 'Notificacion eliminado correctamente'], 200);
            }
            return response()->json(['msj' => 'Este Notificacion ya ha sido eliminado'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El Notificacion ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }
    }

    public function read(Request $request)
    {

        $validator = validator($request->all(), [
            'id' => 'required|numeric',
            'read ' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }



        try {
            $Notificacion = Notificacion::findOrFail($request->id);

            $Notificacion->read = $request->read;
            $Notificacion->save();
            return response()->json(['msj' => 'Notificacion eliminado correctamente'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El Notificacion ' . $request->id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }
    }

    public static function countNotification()
    {
        if (auth()->check()) :

        $countnotification =    Auth::user()->rol_id === 2 ?
                Notificacion::where('receptor_id', Auth::user()->id)
                ->where('status', 0)->count() : Notificacion::where('receptor_id', null)
                ->where('status', 0)->count();

            return $countnotification;
        endif;
    }
}
