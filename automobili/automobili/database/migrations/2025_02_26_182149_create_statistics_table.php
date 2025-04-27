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
        Schema::create('statistika', function (Blueprint $table) {
            $table->id('id_statistika'); 
            $table->foreignId('id_vozila')->references('id_vozila')->on('vozilo')->onDelete('cascade'); // spoljni kljuc
            $table->integer('broj_iznajmljivanja')->default(0);
            $table->decimal('ukupna_zarada', 10, 2)->default(0);
            $table->decimal('prosecan_broj_dana', 5, 2)->default(0);
            
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statistika');
    }
};
