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
        Schema::create('log_solicitudes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('solicitud_id');
            $table->unsignedBigInteger('user_id');
            $table->string('descripcion');
            $table->string('status')->default(1);
            $table->timestamp('created_at')->useCurrent(); 
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('solicitud_id')->references('id')->on('solicitudes');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_solicitudes');
    }
};
