<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KorisnikResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_korisnika' => $this->id,
            'ime' => $this->ime,
            'prezime' => $this->prezime,
            'email' => $this->email,
            'tip_korisnika' => $this->tip_korisnika,
        ];
    }
}
