<?php

namespace App\Http\Controllers;

use App\Models\LogSolicitud;
use App\Models\Solicitud;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class LogSolicitudController extends Controller
{
    /**
     * Display a listing of the resource. 
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        return LogSolicitud::with('user.rol', 'user.person')->get();

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
            $LogSolicitud = LogSolicitud::findOrFail($id);
            $LogSolicitud->load('user');

            return $LogSolicitud;
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El LogSolicitud ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }

    }

    public function create(Request $request)
    {              
       
        try {

            if($request->created_at){
               
                $request->merge([
                    'descripcion' => "Se ha creado el bloque de " . ($request->tipo_id == 1 ? "Compras" : "Ventas") . " " . $request->descripcion,
                ]);
                
            }else if($request->status_ant){
                $request->merge([
                    'descripcion' => "Se ha actualizado la solicitud ".$request->status_ant ."->". $request->status_id,
                ]);
            }else{
                $soli = Solicitud::find($request->solicitud_id);
                $request->merge([
                    'descripcion' => "Se ha creado la solicitud Numero: ".$soli->numero,
                ]);
            }

            $validator = validator($request->all(), [
                'solicitud_id'=> 'required',
                'user_id'=> 'required|exists:users,id',
                'descripcion'=> 'required'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            LogSolicitud::create($request->all());

            return response()->json(['msj' =>  $request->descripcion], 200);
        
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'No se pudo registrar el LogSolicitud'.$e->getMessage()], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error en la accion realizada' . $e->getMessage()], 500);
        }
    }

    public function update($id,Request $request)
    {
        
        try {
            $validator = validator($request->all(), [
                'description'=> 'required',
                'user_id'=> 'required|exists:users,id',
                'ip'=> 'required',
                'so'=> 'required',
                'browser'=> 'required'
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $LogSolicitud = LogSolicitud::findOrFail($id);
            $LogSolicitud->update($request->all());
            $LogSolicitud->save();

           

            return response()->json(['msj' => 'LogSolicitud actualizado correctamente'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El LogSolicitud ' . $id . ' no existe no fue encontrado'], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
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
            $LogSolicitud = LogSolicitud::findOrFail($id);
            if ($LogSolicitud->status) {
                $LogSolicitud->status = 0;
                $LogSolicitud->save();
                return response()->json(['msj' => 'LogSolicitud eliminado correctamente'], 200);
            }
            return response()->json(['msj' => 'Este LogSolicitud ya ha sido eliminado'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El LogSolicitud ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }
    }

}
