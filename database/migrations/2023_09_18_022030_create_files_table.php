<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('referencia')->unique();
            $table->string('nombre');
            $table->string('extencion');
            $table->boolean('confidencial')->default(false);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('solicitud_id');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('solicitud_id')->references('id')->on('solicitudes');
            $table->unique(['nombre','user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
