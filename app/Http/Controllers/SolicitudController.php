<?php

namespace App\Http\Controllers;

use App\Models\EstadoSolicitud;
use App\Models\Notificacion;
use App\Models\Solicitud;
use App\Models\TipoSolicitud;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class SolicitudController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $mensaje = session('msj');
        if ($mensaje) {
            Session::forget('msj');
        }
        return Inertia::render('Solicitudes/Index', [
            'datos' => TipoSolicitud::where('status', '1')->get(),
            'msj' => $mensaje,
        ]);
    }

    public function administracion(Request $request)
    {
        $mensaje = session('msj');
        $solicitud_id = session('solicitud_id');

        $solicitud_id && session()->forget('solicitud_id');

        if (!$solicitud_id) {
            $solicitud_id =  $request->id;
        }

        if ($mensaje) {
            session()->forget('msj');
        }

        return Inertia::render('Admsolicitudes/Index', [
            'tipoSolicitudes' => TipoSolicitud::where('status', '1')->get(),
            'statusList' => EstadoSolicitud::select('id', 'nombre')->where('status', 1)->get(),
            'msj' => $mensaje,
            'solicitud_id' => $solicitud_id,
        ]);
    }

    public function panel(Request $request)
    {
        $mensaje = session('msj');
        Session::forget('msj');

        return Inertia::render('Panel/Index', [
            'msj' => $mensaje,
            'clientes' => User::where("rol_id", 2)->get(),

        ]);
    }

    public function create(Request $request)
    {   

        try {
            $request->merge([
                'user_id' => Auth::user()->id,
                'status_id' => 1,
            ]);

            $validator = validator($request->all(), [
                'tipo_id' => 'exists:tipo_solicitudes,id',
                'created_at' => 'date',
                'user_id' => 'exists:users,id',
                'status_id' => 'exists:estado_solicitudes,id',
                'descripcion' => 'required',
            ], [
                'tipo_id.exists' => 'El tipo de solicitud seleccionado no es válido.',
                'user_id.exists' => 'El usuario seleccionado no es válido.',
                'descripcion.required' => 'La descripción es obligatoria.',
            ]);



            if ($validator->fails()) {
                session()->put('msj', ['error' => array_values($validator->errors()->messages())]);

                return back();
            }

            $Solicitud = Solicitud::create($request->all());

            $request->merge([
                'solicitud_id' =>  $Solicitud->id,
            ]);

            if ($request->tipo_id > 2) {
                Notificacion::create(
                    [
                        'solicitud_id' =>  $Solicitud->id,
                        'emisor_id' => Auth::user()->id,
                        'message' => "Has recibido una nueva solicitud"
                    ]
                );
            }


            if($request->created_at){
               
                $request->merge([
                    'descripcion' => "Se ha creado el bloque de " . ($request->tipo_id == 1 ? "Compras" : "Ventas") . " " . $request->descripcion,
                ]);
                
            }else{
                $soli = Solicitud::find($request->solicitud_id);
                $request->merge([
                    'descripcion' => "Se ha creado la solicitud Numero: ".$soli->numero,
                ]);
            }


            // $log = new LogSolicitudController();

            // $respuesta = $log->create($request);

            session()->put('msj', ["success" => $request->descripcion, "id" => $Solicitud->id]);

            //  return response()->json(['msj' => 'Solicitud creada correctamente','log' => $respuesta->original['msj']], 200);
        } catch (ModelNotFoundException $e) {
            session()->put('msj', ["error" => 'No se pudo registrar la Solicitud']);
        } catch (QueryException $e) {

            $errormsj = $e->getMessage();

            if (strpos($errormsj, 'Duplicate entry') !== false) {
                preg_match("/Duplicate entry '(.*?)' for key '(.*?)'/", $errormsj, $matches);
                $duplicateValue = $matches[1] ?? '';
                $duplicateKey = $matches[2] ?? '';
                if ($duplicateKey == 'solicitudes_tipo_id_user_id_created_at_unique') {
                    $fecha = Carbon::parse(substr($duplicateValue, 4))->locale('es');
                    session()->put('msj', ["errord" => "Ya existe un bloque para " . $duplicateValue]);
                } else {

                    session()->put('msj', ["error" => "No se puede realizar la acción, el valor '$duplicateValue' está duplicado"], 422);
                }
            } else {
                session()->put('msj', ["error" => 'No se pudo registrar el Solicitud']);
            }
        } catch (Exception $e) {
            session()->put('msj', ["error" => 'Error en la accion realizada']);
        }

        if (isset($request->created_at)) {
            return redirect('panel');
        }
        return redirect('solicitudes');
    }

    public function update(Request $request)
    {
        try {
            
            $mensajes = [
                'tipo_id' => 'El tipo de solicitud no existe.',
                'created_at' => 'La fecha de creacion no es valida.',
                'user_id' => 'El usuario no existe.',
                'status_id' => 'El estado seleccionado no existe.',
                'descripcion' => 'La descripcion no puede estar en blanco.',
            ];

            $validator = validator($request->all(), [

                'id' => 'required|exists:solicitudes,id',
                'tipo_id' => 'exists:tipo_solicitudes,id',
                'created_at' => 'date',
                'user_id' => 'exists:users,id',
                'status_id' => 'exists:estado_solicitudes,id',
                'descripcion' => 'required',

            ], $mensajes);

           

            if ($validator->fails()) {

                session()->put('msj', ['error' => array_values($validator->errors()->messages())]);

                return back();


            }

           
            $Solicitud = Solicitud::findOrFail($request->id);
            $status_ant = EstadoSolicitud::find($Solicitud->status_id);
            $status_act = EstadoSolicitud::find($request->status_id) ?? $status_ant;

            $request->merge([
                'solicitud_id' => $request->id,
                'status_ant' => $Solicitud->status_id,
                'message' => "El estado de la solicitud No. $request->numero Ha cambiado de $status_ant->nombre a $status_act->nombre"
            ]);

            
            $Solicitud->update($request->all());

            if (Auth::user()->rol_id == 3) {
                $Solicitud->usuarioAsignado_id = Auth::user()->id;
            }
            
            $Solicitud->save();

            if ($request->status_ant != $request->status_id) {
                // $log = new LogSolicitudController();
                // $respuesta = $log->create($request);

                $request->merge([
                    'descripcion' => "Se ha actualizado la solicitud ".$request->status_ant ."->". $request->status_id,
                ]);

                Notificacion::create(
                    [
                        'solicitud_id' => $request->id,
                        'emisor_id' => Auth::user()->id,
                        'receptor_id' => $request->user_id,
                        'message' => $request->message
                    ]
                );
            }

            if ($Solicitud->tipo_id == 1 || $Solicitud->tipo_id == 2) {
                return redirect('panel')->with('msj', ['success' => 'Bloque actualizado correctamente']);
            }
           
            return redirect()->route('admsolicitudes')
                ->with('msj', ['success' => 'Solicitud actualizada correctamente'])
                ->with('solicitud_id', $request->id);
        } catch (ModelNotFoundException $e) {

            return redirect()->route('admsolicitudes')->with('msj', ['error' => 'El Solicitud ' . $request->id . ' no existe no fue encontrado'], 404);
        } catch (QueryException $e) {

            $errormsj = $e->getMessage();

            if (strpos($errormsj, 'Duplicate entry') !== false) {
                preg_match("/Duplicate entry '(.*?)' for key '(.*?)'/", $errormsj, $matches);
                $duplicateValue = $matches[1] ?? '';
                $duplicateKey = $matches[2] ?? '';
                if ($duplicateKey == 'solicitudes_tipo_id_user_id_created_at_unique') {
                    $fecha = Carbon::parse(substr($duplicateValue, 4))->locale('es');
                    session()->put('msj', ["errord" => "Ya existe un bloque para " . $duplicateValue]);
                } else {

                    session()->put('msj', ["error" => "No se puede realizar la acción, el valor '$duplicateValue' está duplicado"], 422);
                }
            } else {
                session()->put('msj', ["error" => 'No se pudo registrar el Solicitud']);
            }
        }  catch (Exception $e) {

            return redirect()->route('admsolicitudes')->with('msj', ['error' => 'Error en la acción realizada'], 500);
        }

        return back();
    }

    public function destroy($id)
    {
        $validator = validator(['id' => $id], [
            'id' => 'required|numeric|exists:solicitudes,id'
        ]);

       if ($validator->fails()) {
                return redirect()->route('admsolicitudes')->with('msj', ['error' => array_values($validator->errors()->messages())], 404);
            }

        try {
            $Solicitud = Solicitud::findOrFail($id)->load('files','notificaciones');

            
            if(auth()->user()->rol_id == 2){
               
                if(count($Solicitud->files) == 0){
                    
                    $Solicitud->notificaciones->each->delete();
                    $Solicitud->delete();   

                    session()->put('msj', ["success" => 'Bloque eliminado correctamente']);
                   
                }else{
                    session()->put('msj', ["error" => 'No se puede eliminar la solicitud porque tiene archivos adjuntos']);
                   
                }
            } elseif(auth()->user()->rol_id == 1){

                $Solicitud->files->each->delete();
                $Solicitud->notificaciones->each->delete();
                $Solicitud->delete();
                //eliminar todos los archivos relacionados a la solicitud   
        
            }

            return back();    
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El Solicitud ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'.$e], 500);
        }
    }
}
