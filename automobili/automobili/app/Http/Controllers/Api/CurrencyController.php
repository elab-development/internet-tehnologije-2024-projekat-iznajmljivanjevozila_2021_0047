<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class CurrencyController extends Controller
{
    public function getRates()
    {
        $response = Http::get('https://open.er-api.com/v6/latest/EUR');

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json(['error' => 'Neuspešan zahtev'], 500);
    }
}
