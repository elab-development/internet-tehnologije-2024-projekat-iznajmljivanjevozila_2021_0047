<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;


use function Illuminate\Log\log;

class RegistrationController extends Controller
{
    public function register(Request $request)
    {
        // Validacija podataka
        
        $validator = Validator::make($request->all(), [
            'ime' => 'required|string|max:255',
            'prezime' => 'required|string|max:255',
            'email' => 'required|email|unique:korisnik,email',
            'lozinka' => 'required|string|min:8',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Uneti podaci nisu validni.',
                'errors' => $validator->errors(),
            ], 400);
        }
        
        $user = User::create([
            'ime' => $request->ime,
            'prezime' => $request->prezime,
            'email' => $request->email,
            'lozinka' => Hash::make($request->lozinka),
            'tip_korisnika'=>$request->tip_korisnika,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Uspešno ste registrovani!',
            'data' => $user,
        ], 201);
    }
}
