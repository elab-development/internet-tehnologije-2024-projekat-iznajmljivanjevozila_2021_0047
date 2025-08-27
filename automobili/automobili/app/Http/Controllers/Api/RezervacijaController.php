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
    public function show($id)
    {
        $rezervacija = Rezervacija::find($id);

        if (!$rezervacija) {
            return response()->json(['message' => 'Rezervacija nije pronađena.'], 404);
        }

        return response()->json($rezervacija, 200);
    }
    public function store(Request $request)
    {

        $validated = $request->validate([
            'datum_pocetka' => 'required|date|after_or_equal:today',
            'datum_zavrsetka' => 'required|date|after:datum_pocetka',
            'id_vozila' => 'required|exists:vozilo,id_vozila',

        ]);

        // Proveri da li je vozilo dostupno
        $vozilo = Vozilo::find($request->id_vozila);
        // Provera da li je vozilo u servisu
        if ($vozilo->status == 'u servisu') {
            return response()->json(['message' => 'Vozilo je trenutno u servisu i nije dostupno za rezervaciju.'], 400);
        }
        $isAvailable = Rezervacija::where('id_vozila', $vozilo->id_vozila)
            ->where(function ($query) use ($request) {
                $query->whereBetween('datum_pocetka', [$request->datum_pocetka, $request->datum_zavrsetka])
                    ->orWhereBetween('datum_zavrsetka', [$request->datum_pocetka, $request->datum_zavrsetka]);
            })
            ->where('status_rezervacije', '!=', 'otkazano')
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
            'id_korisnika' => $request->user()->id, // Povezivanje sa trenutno ulogovanim korisnikom
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
    public function index(Request $request)
    {

        $rezervacije = Rezervacija::with('vozilo')
            ->where('id_korisnika', $request->user()->id)
            ->orderBy('datum_pocetka', 'desc')
            ->get();
        // Proveri da li postoje rezervacije
        if ($rezervacije->isEmpty()) {
            return response()->json(['message' => 'Nemate prethodne rezervacije.'], 404);
        }

        // Vrati listu rezervacija
        return response()->json(['rezervacije' => $rezervacije], 200);
    }

    public function update(Request $request, $id)
    {

        //  Nađi rezervaciju i proveri da li pripada prijavljenom korisniku
        $rezervacija = Rezervacija::find($id);

        if (!$rezervacija || $rezervacija->id_korisnika !== $request->user()->id) {
            return response()->json(['message' => 'Nemate dozvolu za izmenu ove rezervacije.'], 403);
        }

        //  Validacija podataka
        $validated = $request->validate([
            'datum_pocetka' => 'required|date|after_or_equal:today',
            'datum_zavrsetka' => 'required|date|after:datum_pocetka',
        ]);

        //  Provera dostupnosti vozila za nove datume
        $isAvailable = Rezervacija::where('id_vozila', $rezervacija->id_vozila)
            ->where('id_rezervacija', '!=', $id) // Isključujemo trenutnu rezervaciju iz provere
            ->where(function ($query) use ($request) {
                $query->whereBetween('datum_pocetka', [$request->datum_pocetka, $request->datum_zavrsetka])
                    ->orWhereBetween('datum_zavrsetka', [$request->datum_pocetka, $request->datum_zavrsetka]);
            })
            ->where('status_rezervacije', '!=', 'otkazano')
            ->doesntExist();


        if (!$isAvailable) {
            return response()->json(['message' => 'Vozilo nije dostupno za izabrane datume.'], 400);
        }

        // Izračunaj novu cenu (ako je cena po danu promenjiva)
        $broj_dana = Carbon::parse($request->datum_pocetka)->diffInDays($request->datum_zavrsetka);
        $cena_ukupno = $rezervacija->vozilo->cena_po_danu * $broj_dana;

        //  Ažuriranje rezervacije
        $rezervacija->update([
            'datum_pocetka' => $request->datum_pocetka,
            'datum_zavrsetka' => $request->datum_zavrsetka,
            'cena_ukupno' => $cena_ukupno,
        ]);
        $rezervacija->refresh();
        return response()->json([
            'message' => 'Rezervacija je uspešno izmenjena!',
            'rezervacija' => $rezervacija
        ], 200);
    }
    public function cancel($id, Request $request)
    {
        // Traži rezervaciju prema ID-u
        $rezervacija = Rezervacija::find($id);

        // Provera da li rezervacija postoji
        if (!$rezervacija) {
            return response()->json(['message' => 'Rezervaciju nije moguće pronaći.'], 404);
        }

        // Provera da li rezervacija pripada trenutnom korisniku
        if ($rezervacija->id_korisnika !== $request->user()->id) {
            return response()->json(['message' => 'Nemate pravo da otkažete ovu rezervaciju.'], 403);
        }

        // Provera da li rezervacija može da bude otkazana
        // Ako je rezervacija već započela, ne može biti otkazana
        if (Carbon::now()->greaterThanOrEqualTo(Carbon::parse($rezervacija->datum_pocetka))) {
            return response()->json(['message' => 'Rezervaciju nije moguće otkazati, već je započela.'], 400);
        }

        // Promena statusa na "otkazano"
        $rezervacija->status_rezervacije = 'otkazano';
        $rezervacija->save(); // Spasavanje promene u bazi

        // Vraćanje odgovora sa porukom
        return response()->json(['message' => 'Rezervacija je uspešno otkazana.'], 200);
    }
}
