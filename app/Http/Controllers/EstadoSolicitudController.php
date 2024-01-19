<?php

namespace App\Http\Controllers;

use App\Models\EstadoSolicitud;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class EstadoSolicitudController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        return EstadoSolicitud::all();

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
            $EstadoSolicitud = EstadoSolicitud::findOrFail($id);
       

            return $EstadoSolicitud;
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El EstadoSolicitud ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }

    }

    public function create(Request $request)
    {               
        try {

            $validator = validator($request->all(), [
                'nombre'=> 'required',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            EstadoSolicitud::create($request->all());
           
          
            return response()->json(['msj' =>  $request->description], 200);
        
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'No se pudo registrar el EstadoSolicitud'.$e->getMessage()], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error en la accion realizada' . $e->getMessage()], 500);
        }
    }

    public function update($id,Request $request)
    {
        
        try {
            $validator = validator($request->all(), [
                'nombre'=> 'required',
            ]);
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $EstadoSolicitud = EstadoSolicitud::findOrFail($id);
            $EstadoSolicitud->update($request->all());
            $EstadoSolicitud->save();
            
            return response()->json(['msj' => 'EstadoSolicitud actualizado correctamente'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El EstadoSolicitud ' . $id . ' no existe no fue encontrado'], 404);
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
            $EstadoSolicitud = EstadoSolicitud::findOrFail($id);
            if ($EstadoSolicitud->status) {
                $EstadoSolicitud->status = 0;
                $EstadoSolicitud->save();
                return response()->json(['msj' => 'EstadoSolicitud eliminado correctamente'], 200);
            }
            return response()->json(['msj' => 'Este EstadoSolicitud ya ha sido eliminado'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'El EstadoSolicitud ' . $id . ' no existe no fue encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la acción realizada'], 500);
        }
    }
}
