<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Solicitud extends Model
{
    use HasFactory;
    protected $table = "solicitudes";

    protected $fillable = [
       
        'numero',
        'tipo_id',
        'empresa', 
        'rnc' ,
        'user_id',      
        'status_id',      
        'comentario',
        'status',
      
    ];


  
    public function user(): BelongsTo
    {
        return $this->BelongsTo(User::class,'user_id');
    }

    public function tipo(): BelongsTo
    {
        return $this->BelongsTo(TipoSolicitud::class,'tipo_id');
    }

    public function status(): BelongsTo
    {
        return $this->BelongsTo(EstadoSolicitud::class,'status_id');
    }


}

