<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Rezervacija;
use App\Models\Vozilo;
use Carbon\Carbon;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rezervacija>
 */
class RezervacijaFactory extends Factory
{
    protected $model = Rezervacija::class;
    /**
     * Define the model's default state.
     
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Uzmi random vozilo iz baze
        $vozilo = Vozilo::inRandomOrder()->first() ?? Vozilo::factory()->create();

        // Generiši random datume (početak i kraj)
        $datum_pocetka = Carbon::parse($this->faker->dateTimeBetween('-1 month', '+1 month'))->format('Y-m-d');
        $datum_zavrsetka = Carbon::parse($datum_pocetka)->addDays(rand(1, 14))->format('Y-m-d'); // Dodaj random broj dana

        // Izračunaj broj dana
        $broj_dana = Carbon::parse($datum_pocetka)->diffInDays($datum_zavrsetka);

        // Izračunaj cenu ukupno (cena po danu * broj dana)
        $cena_ukupno = $vozilo->cena_po_danu * max($broj_dana, 1); // Osiguraj da nije 0
        return [
            'id_vozila' => $vozilo->id_vozila,
            'datum_pocetka' => $datum_pocetka,
            'datum_zavrsetka' => $datum_zavrsetka,
            'status_rezervacije' => 'aktivno',
            'cena_ukupno' => $cena_ukupno,
        ];
    }
}
