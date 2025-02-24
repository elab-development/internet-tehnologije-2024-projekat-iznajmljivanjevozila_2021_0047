<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    use HasFactory;

    protected $table = 'rezervacija'; // ime tabele u bazi
    public $timestamps = false;
    protected $primaryKey='id_rezervacija';
    protected $fillable = [
        'datum_pocetka',
        'datum_zavrsetka',
        'status_rezervacije',
        'cena_ukupno',
        'id_vozila', // spoljni kljuc
        'id_korisnika' //spoljni kljuc
    ];

    // Relacija sa Vozilom
    public function vozilo()
    {
        return $this->belongsTo(Vozilo::class, 'id_vozila','id_vozila');
    }
    public function korisnik()
{
    return $this->belongsTo(User::class, 'id_korisnika', 'id'); // 2 je u ovoj bazi (spoljni kljuc), a 3 primanri u tabeli korisnik
}
}
