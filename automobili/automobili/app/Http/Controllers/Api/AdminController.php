<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getUsers(Request $request)
    {
        // Preuzimanje svih korisnika sa osnovnim informacijama
        $users = User::select('ime','prezime', 'email', 'tip_korisnika')->get();

        if ($users->isEmpty()) {
            return response()->json([
                'status' => 'info',
                'message' => 'Nema registrovanih korisnika.',
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Lista korisnika.',
            'data' => $users,
        ], 200);
    }
}
