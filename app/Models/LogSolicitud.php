<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogSolicitud extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = "log_solicitudes";
    protected $fillable = [
       
        'solicitud_id',
        'user_id',
        'descripcion', 
        'status',
    ];


  
    public function user(): BelongsTo
    {
        return $this->BelongsTo(User::class,'user_id');
    }

    public function solicitud(): BelongsTo
    {
        return $this->BelongsTo(Solicitud::class,'solicitud_id');
    }

    


  
}


