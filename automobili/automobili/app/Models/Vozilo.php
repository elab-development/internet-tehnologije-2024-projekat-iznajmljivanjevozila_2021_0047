<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vozilo extends Model
{
    use HasFactory;

    protected $table='vozilo';
    public $timestamps = false;
    protected $primatyKey='id_vozila';
    protected $fillable=[
        'naziv',
        'proizvodjac',
        'god_proizvodnje',
        'cena_po_danu',
        'tip_vozila',
        'status'
    ];
}
