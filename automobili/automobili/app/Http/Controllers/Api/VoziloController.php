<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vozilo;
use Illuminate\Http\Request;

class VoziloController extends Controller
{
     // Metoda za skladištenje vozila
     public function store(Request $request)
     {
        try{
         // Validacija podataka
         $validated = $request->validate([
             'naziv' => 'required|string|max:255',
             'proizvodjac' => 'required|string|max:255',
             'god_proizvodnje' => 'required|integer|between:1900,' . date('Y'),
             'cena_po_danu' => 'required|numeric|min:0',
             'tip_vozila' => 'required|in:SUV,sedan,kombi,hatchback',  // Validacija za tip vozila
             'status' => 'required|in:dostupno,rezervisano,u servisu'
         ]);
 
         // Ako validacija prođe, sačuvaj vozilo u bazu
         Vozilo::create([
             'naziv' => $validated['naziv'],
             'proizvodjac' => $validated['proizvodjac'],
             'god_proizvodnje' => $validated['god_proizvodnje'],
             'cena_po_danu' => $validated['cena_po_danu'],
             'tip_vozila' => $validated['tip_vozila'],
             'status'=> $validated['status']
         ]);
 
         // Vraćanje sa porukom o uspehu
         return response()->json(['message' => 'Vozilo je uspešno dodato.'], 201);
        }catch (\Exception $e) {
            // Prikazivanje greške ako nešto pođe po zlu
            return response()->json(['message' => 'Dodavanje vozila nije uspelo. Proverite unos.'], 500);
        }
    }
}
