<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Statistika;
use App\Models\Rezervacija;

class StatistikaVozilaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function statistika(Request $request)
    {

        $request->validate([
            'id_vozila' => 'required|exists:vozilo,id_vozila',
            'datum_pocetka' => 'required|date|before_or_equal:datum_kraja',
            'datum_kraja' => 'required|date|before_or_equal:' . now()->toDateString(),  // Ne može biti u budućnosti
        ]);


        $idVozila = $request->id_vozila;
        $pocetak = $request->datum_pocetka;
        $kraj = $request->datum_kraja;

        // Provera da li statistika već postoji
        $statistika = Statistika::where('id_vozila', $idVozila)
            ->where('datum_pocetka', $pocetak)
            ->where('datum_kraja', $kraj)
            ->first();

        if (!$statistika) {
            // Ako ne postoji, računamo statistiku
            $statistikaPodaci = Rezervacija::where('id_vozila', $idVozila)
                ->where('status_rezervacije', '!=', 'otkazana') // Isključujemo otkazane rezervacije
                ->where(function ($query) use ($pocetak, $kraj) {
                    $query->whereBetween('datum_pocetka', [$pocetak, $kraj])
                        ->orWhereBetween('datum_zavrsetka', [$pocetak, $kraj])
                        ->orWhere(function ($query) use ($pocetak, $kraj) {
                            $query->where('datum_pocetka', '<=', $kraj)
                                ->where('datum_zavrsetka', '>=', $pocetak);
                        });
                })
                ->selectRaw('COUNT(*) as broj_iznajmljivanja, SUM(cena_ukupno) as ukupna_zarada, AVG(DATEDIFF(datum_zavrsetka, datum_pocetka)) as prosecan_broj_dana')
                ->first();


            // Kreiranje nove statistike
            $statistika = Statistika::create([
                'id_vozila' => $idVozila,
                'datum_pocetka' => $pocetak,
                'datum_kraja' => $kraj,
                'broj_iznajmljivanja' => $statistikaPodaci->broj_iznajmljivanja ?? 0,
                'ukupna_zarada' => $statistikaPodaci->ukupna_zarada ?? 0,
                'prosecan_broj_dana' => $statistikaPodaci->prosecan_broj_dana ?? 0,
            ]);
        }

        return response()->json($statistika);
    }
    public function ukupnaStatistika()
    {
        // Broj izvršenih (neotkazanih i završених) rezervacija do danas
        $ukupnoIzvrsenihSad = Rezervacija::where('status_rezervacije', '!=', 'otkazana')
            ->whereDate('datum_zavrsetka', '<=', now())
            ->count();
        $ukupnoOtkazanihSad = Rezervacija::where('status_rezervacije', '!=', 'otkazana')
            ->whereDate('datum_zavrsetka', '<=', now())
            ->count();

        // Ukupni prihod od svih izvršenih rezervacija do danas
        $ukupniPrihod = Rezervacija::where('status_rezervacije', '!=', 'otkazana')
            ->whereDate('datum_zavrsetka', '<=', now())
            ->sum('cena_ukupno');

        // Broj otkazanih rezervacija u narednom periodu (npr. od danas nadalje)
        $brojOtkazanih = Rezervacija::where('status_rezervacije', 'otkazana')
            ->whereDate('datum_pocetka', '>=', now())
            ->count();

        // Broj rezervacija u narednom periodu (od danas nadalje, sve sa statusom aktivno ili na čekanju)
        $brojBuducih = Rezervacija::whereIn('status_rezervacije', ['aktivno', 'na cekanju'])
            ->whereDate('datum_pocetka', '>=', now())
            ->count();
        $ocekivaniUkupniPrihod = Rezervacija::where('status_rezervacije', '!=', 'otkazana')
            ->whereDate('datum_zavrsetka', '>', now())
            ->sum('cena_ukupno');

        return response()->json([
            'ukupno_izvrsenih' => $ukupnoIzvrsenihSad,
            'ukupno_otkazanih' => $ukupnoOtkazanihSad,
            'ukupni_prihod' => $ukupniPrihod,
            'broj_otkazanih' => $brojOtkazanih,
            'broj_buducih' => $brojBuducih,
            'ocekivan_prihod' => $ocekivaniUkupniPrihod,
        ]);
    }
}
