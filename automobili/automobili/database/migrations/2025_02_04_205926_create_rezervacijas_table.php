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
        Schema::create('rezervacija', function (Blueprint $table) {
            $table->bigIncrements('id_rezervacija');  // primarni ključ
            $table->foreignId('id_vozila')->references('id_vozila')->on('vozilo')->onDelete('cascade'); // povezivanje sa tabelom vozilo
            $table->date('Datum_pocetka');
            $table->date('Datum_zavrsetka');
            $table->enum('Status_rezervacije', ['aktivno', 'otkazano', 'zavrseno'])->default('aktivno');
            $table->decimal('Cena_ukupno', 10, 2); // cena sa dve decimale
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations
     */
    public function down(): void
    {
        Schema::dropIfExists('rezervacija');
    }
};
