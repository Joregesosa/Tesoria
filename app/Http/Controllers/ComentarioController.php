<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

       
                try {
           
            $mensajes = [
                'solicitud_id' => 'El tipo de solicitud no existe.',
                'comentario' => 'El comentario no puede estar en blanco.',
            ];

            $validator = validator($request->all(), [
                'solicitud_id' => 'required|exists:solicitudes,id',
                'comentario' => 'required'
            ],$mensajes);
           
            if ($validator->fails()) {
                return redirect()->route('admsolicitudes')->with('msj', ['error'=> array_values( $validator->errors()->messages())], 404);
            }

           Comentario::create([
                "solicitud_id" => $request->solicitud_id,
                "comentario" => $request->comentario
           ]);

        
            session()->put('msj', ["success" => "El comentario ha sido añadido a la solicitud"]);
        
        } catch (Exception $e) {
            session()->put('msj', ["error" => 'Error en la accion realizada' ]);
           
        }
        
        return redirect('admsolicitudes');
    }


    public function store(Request $request)
    {
        //
    }

    public function show(Comentario $comentario)
    {
        //
    }

  
    public function edit(Comentario $comentario)
    {
        //
    }


    public function update(Request $request, Comentario $comentario)
    {
        //
    }

  
    public function destroy(Request $request)
    {
       
        $validator = validator($request->all(), [
            'comentario_id' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return redirect()->route('admsolicitudes')->with('msj', ['error'=> array_values( $validator->errors()->messages())], 404);
        }

        try {
            $Comentario = Comentario::findOrFail($request->comentario_id);
            if ($Comentario->status) {
                $Comentario->status = 0;
                $Comentario->save();
                session()->put('msj', ["success" => 'Comentario eliminado correctamente']);
                return redirect('admsolicitudes');
            }
            session()->put('msj', ["success" => 'Este Comentario ya ha sido eliminado']);
        } catch (ModelNotFoundException $e) {
            session()->put('msj', ["error" => 'El Comentario no existe no fue encontrado' ]);
           
        } catch (\Exception $e) {
            session()->put('msj', ["error" => 'Error en la accion realizada' ]);
            
        }

    return redirect('admsolicitudes');

    }
}
