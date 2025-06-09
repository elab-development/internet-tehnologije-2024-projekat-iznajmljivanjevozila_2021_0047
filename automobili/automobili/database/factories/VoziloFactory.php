<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vozilo>
 */
class VoziloFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'naziv' => $this->faker->word(),
            'proizvodjac' => $this->faker->company(),
            'god_proizvodnje' => $this->faker->numberBetween(2000, 2023),
            'cena_po_danu' => $this->faker->numberBetween(30, 100),
            'tip_vozila' => $this->faker->randomElement(['SUV', 'sedan', 'kombi', 'hatchback']),
            'status' => $this->faker->randomElement(['dostupno', 'u servisu']),
            'slika' => 'vozila/default.jpg',
        ];
    }
}
