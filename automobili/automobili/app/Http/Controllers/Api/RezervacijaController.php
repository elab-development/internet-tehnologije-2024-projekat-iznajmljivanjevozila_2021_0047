<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rezervacija;
use App\Models\User;
use App\Models\Vozilo;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;  // Za autentifikaciju


class RezervacijaController extends Controller
{
    public function store(Request $request)
{
   
    $validated = $request->validate([
        'datum_pocetka' => 'required|date|after_or_equal:today',
        'datum_zavrsetka' => 'required|date|after:datum_pocetka',
        'id_vozila' => 'required|exists:vozilo,id_vozila',
        'id_korisnika' => 'required|exists:korisnik,id', // dodati kad odredis rute i tokene
    ]);
   
     

    // Proveri da li je vozilo dostupno
    $vozilo = Vozilo::find($request->id_vozila);
    // Provera da li je vozilo u servisu
    if ($vozilo->status == 'u servisu') {
        return response()->json(['message' => 'Vozilo je trenutno u servisu i nije dostupno za rezervaciju.'], 400);
    }
    $isAvailable = Rezervacija::where('id_vozila', $vozilo->id_vozila)
        ->where(function($query) use ($request) {
            $query->whereBetween('datum_pocetka', [$request->datum_pocetka, $request->datum_zavrsetka])
                  ->orWhereBetween('datum_zavrsetka', [$request->datum_pocetka, $request->datum_zavrsetka]);
        })
        ->doesntExist(); 

    if (!$isAvailable) {
        return response()->json(['message' => 'Odabrano vozilo nije dostupno u traženom periodu.'], 400);
    }

    // Izračunaj broj dana
    $datum_pocetka = Carbon::parse($request->datum_pocetka);
    $datum_zavrsetka = Carbon::parse($request->datum_zavrsetka);
    $broj_dana = $datum_pocetka->diffInDays($datum_zavrsetka);

    // Izračunaj cenu ukupno
    $cena_ukupno = $vozilo->cena_po_danu * $broj_dana;

    // Sačuvaj rezervaciju sa korisnikom
    $rezervacija = Rezervacija::create([
        'id_vozila' => $vozilo->id_vozila,
        'id_korisnika' => $request->id_korisnika,// Povezivanje sa trenutno ulogovanim korisnikom
        'datum_pocetka' => $request->datum_pocetka,
        'datum_zavrsetka' => $request->datum_zavrsetka,
        'status_rezervacije' => 'aktivno',
        'cena_ukupno' => $cena_ukupno,
    ]);

    return response()->json([
        'message' => 'Rezervacija je uspešno sačuvana!',
        'rezervacija' => $rezervacija
    ], 201);
}
// public function index(Request $request) doradi ovo kad dodas autetifikaciju
// {
//     // Dobija rezervacije trenutnog korisnika
//     $rezervacije = Rezervacija::where('id_korisnika', $request->user()->id)
//                                ->orderBy('datum_pocetka', 'desc')
//                                ->get();

//     // Proveri da li postoje rezervacije
//     if ($rezervacije->isEmpty()) {
//         return response()->json(['message' => 'Nemate prethodne rezervacije.'], 404);
//     }

//     // Vrati listu rezervacija
//     return response()->json(['rezervacije' => $rezervacije], 200);
// }
public function index(Request $request)
{
    // Uzimamo id_korisnika iz request-a
    $id_korisnika = $request->input('id_korisnika');

    // Proveravamo da li korisnik postoji
    $korisnik = User::find($id_korisnika);
    
    if (!$korisnik) {
        return response()->json(['message' => 'Korisnik nije pronađen'], 404);
    }

    // Tražimo sve rezervacije korisnika sa povezanim vozilom
    $rezervacije = Rezervacija::with('vozilo') // Učitavamo povezano vozilo
        ->where('id_korisnika', $id_korisnika)
        ->get();

    // Ako korisnik nema rezervacije
    if ($rezervacije->isEmpty()) {
        return response()->json(['message' => 'Nemate prethodne rezervacije.'], 200);
    }

    // Vraćamo rezervacije zajedno sa vozilima
    return response()->json(['rezervacije' => $rezervacije], 200);
}
}
