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
        Schema::create('vozilo', function (Blueprint $table) {
            $table->id('id_vozila');
            $table->string('naziv');
            $table->string('proizvodjac');
            $table->year('god_proizvodnje');
            $table->decimal('cena_po_danu',10,2);
            $table->enum('tip_vozila',['SUV','sedan','kombi','hatchback']);
            $table->enum('status',['dostupno','rezervisano','u servisu']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vozilo');
    }
};
