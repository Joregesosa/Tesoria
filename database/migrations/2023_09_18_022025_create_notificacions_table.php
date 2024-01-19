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
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('solicitud_id');
            $table->unsignedBigInteger('emisor_id');
            $table->unsignedBigInteger('receptor_id')->nullable()->default(null);
            $table->string('message');
            $table->boolean('status')->default(false);
            $table->timestamps();
            $table->foreign('emisor_id')->references('id')->on('users');
            $table->foreign('receptor_id')->references('id')->on('users');
            $table->foreign('solicitud_id')->references('id')->on('solicitudes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
