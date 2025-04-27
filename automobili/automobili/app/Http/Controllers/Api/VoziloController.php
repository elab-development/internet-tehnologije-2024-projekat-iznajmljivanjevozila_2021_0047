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
            // Prikazivanje greške ako nešto pođe po zlu (nisu sva polja popunjena)
            return response()->json(['message' => 'Dodavanje vozila nije uspelo. Proverite unos.'], 500);
        }
    }
    public function search(Request $request)
    {
        $query = Vozilo::query();

        if ($request->filled('naziv')) {
            $query->where('naziv', 'like', '%' . $request->naziv . '%');
        }

        if ($request->filled('god_proizvodnje')) {
            $query->where('god_proizvodnje', $request->god_proizvodnje);
        }

        if ($request->filled('cena_po_danu')) {
            $query->where('cena_po_danu', '<=', $request->cena_po_danu);
        }

        $vozila = $query->get();

        if ($vozila->isEmpty()) {
            return response()->json(['message' => 'Nijedno vozilo nije pronađeno.'], 404);
        }

        return response()->json($vozila);
    }
    public function update(Request $request, $id)
    {
        // Pronađi vozilo prema ID-u
    $vozilo = Vozilo::find($id);

    // Proveri da li vozilo postoji
    if (!$vozilo) {
        return response()->json(['poruka' => 'Vozilo nije pronađeno.'], 404);
    }

         // Ažuriraj polja samo ako su uneta
    if ($request->filled('naziv')) {
        $vozilo->naziv = $request->naziv;
    }

    if ($request->filled('proizvodjac')) {
        $vozilo->proizvodjac = $request->proizvodjac;
    }

    if ($request->filled('god_proizvodnje')) {
        $vozilo->god_proizvodnje = $request->god_proizvodnje;
    }

    if ($request->filled('cena_po_danu')) {
        $vozilo->cena_po_danu = $request->cena_po_danu;
    }

    if ($request->filled('tip_vozila')) {
        $vozilo->tip_vozila = $request->tip_vozila;
    }

    if ($request->filled('status')) {
        $vozilo->status = $request->status;
    }

    // Sačuvaj izmene
    $vozilo->save();

    return response()->json(['poruka' => 'Vozilo je uspešno ažurirano.', 'vozilo' => $vozilo]);
    }
    public function destroy($id)
    {
        // Pronađi vozilo po ID-u
        $vozilo = Vozilo::find($id);

        // Ako vozilo nije pronađeno, vrati grešku
        if (!$vozilo) {
            return response()->json(['message' => 'Vozilo nije pronađeno.'], 404);
        }
        // obriši vozilo
        $vozilo->delete();

        // Vrati poruku o uspešnom brisanju
        return response()->json(['message' => 'Vozilo je uspešno obrisano.'], 200);
    }
   
}
