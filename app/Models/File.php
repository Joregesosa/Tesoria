<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    use HasFactory;

   
    protected $table = "files";
    protected $fillable = [
        'referencia',
        'nombre',
        'extencion', 
        'confidencial', 
        'user_id', 
        'solicitud_id', 
    ];


  
    public function user(): BelongsTo
    {
        return $this->BelongsTo(User::class,'user_id');
    }
   



}
