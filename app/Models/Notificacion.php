<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    use HasFactory;
    protected $table = "notificaciones";
   
    protected $fillable = [
        'solicitud_id',
        'emisor_id',
        'receptor_id',
        'message',
        'read',
        'status',
    ];



    public function emisor(): BelongsTo
    {
        return $this->BelongsTo(User::class, 'emisor_id');
    }

    public function receptor(): BelongsTo
    {
        return $this->BelongsTo(User::class, 'receptor_id');
    }
}
