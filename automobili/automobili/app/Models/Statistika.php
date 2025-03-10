<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistika extends Model
{
    use HasFactory;
    public $timestamps = false;
    // Definišite ime tabele
    protected $table = 'statistika';
    
    // Definišite primarni ključ
    protected $primaryKey = 'id_statistika';


    // Polja koja mogu biti masovno dodeljena
    protected $fillable = [
        'id_vozila',
        'broj_iznajmljivanja',
        'ukupna_zarada',
        'prosecan_broj_dana',
        'datum_pocetka', 
        'datum_kraja'
    ];
    public function vozilo()
    {
        return $this->belongsTo(Vozilo::class, 'id_vozila', 'id_vozila');
    }
}
