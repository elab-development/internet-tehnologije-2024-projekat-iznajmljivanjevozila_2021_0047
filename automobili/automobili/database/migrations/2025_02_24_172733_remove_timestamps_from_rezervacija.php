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
        Schema::table('rezervacija', function (Blueprint $table) {
            $table->dropTimestamps(); // Briše created_at i updated_at kolone
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rezervacija', function (Blueprint $table) {
            $table->timestamps(); //vraca ra rollback
        });
    }
};
