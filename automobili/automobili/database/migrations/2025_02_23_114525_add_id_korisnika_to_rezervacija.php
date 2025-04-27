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
            $table->foreignId('id_korisnika')->constrained('korisnik')->onDelete('cascade'); // Veza sa users tabelom
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rezervacija', function (Blueprint $table) {
            $table->dropForeign(['id_korisnika']);
            $table->dropColumn('id_korisnika');
        });
    }
};
