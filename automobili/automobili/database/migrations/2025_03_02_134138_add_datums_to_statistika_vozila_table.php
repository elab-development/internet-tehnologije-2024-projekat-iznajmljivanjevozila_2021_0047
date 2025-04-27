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
        Schema::table('statistika', function (Blueprint $table) {
            $table->date('datum_pocetka')->after('id_vozila')->nullable();
            $table->date('datum_kraja')->after('datum_pocetka')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('statistika', function (Blueprint $table) {
            $table->dropColumn(['datum_pocetka', 'datum_kraja']);
        });
    }
};
