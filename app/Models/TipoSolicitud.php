<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TipoSolicitud extends Model
{
    use HasFactory;
    protected $table = "tipo_solicitudes";

    protected $fillable = [
        'nombre',
        'tipo',
        'status',
    ];


}
