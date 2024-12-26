<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // Validacija kredencijala
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'lozinka' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pogrešno uneti podaci.',
                'errors' => $validator->errors(),
            ], 400);
        }
        // proevra mail
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pogrešan e-mail ili lozinka.',
            ], 401);
        }

        // Proverite da li lozinka odgovara hash-ovanoj lozinci
        if (Hash::check($request->lozinka, $user->lozinka)) {
            // Uspešna prijava
            Auth::login($user);  // Logujte korisnika
            return response()->json([
                'status' => 'success',
                'message' => 'Uspešna prijava!',
            ], 200);
        }

        // Ako lozinka nije ispravna
        return response()->json([
            'status' => 'error',
            'message' => 'Pogrešan e-mail ili lozinka.',
        ], 401);

        
    }
}
