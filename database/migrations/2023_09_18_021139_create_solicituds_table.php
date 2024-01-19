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
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->integer('numero')->unique();
            $table->unsignedBigInteger('tipo_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('status_id');
            $table->unsignedBigInteger('usuarioAsignado_id')->nullable();
            $table->text('descripcion');
            $table->string('status')->default(1);
            $table->timestamps();
            $table->foreign('tipo_id')->references('id')->on('tipo_solicitudes');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('usuarioAsignado_id')->references('id')->on('users');
            $table->foreign('status_id')->references('id')->on('estado_solicitudes');
            $table->unique(['tipo_id', 'user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
