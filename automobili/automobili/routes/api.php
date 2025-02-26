<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\RezervacijaController;
use App\Http\Controllers\Api\VoziloController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [RegistrationController::class, 'register']);

Route::post('/login', [LoginController::class, 'login']);
//Route::get('/users', [AdminController::class, 'getUsers']);
//Route::get('/users', [AdminController::class, 'getUsers'])
//   ->middleware('auth:sanctum');

Route::get('/users', function () {
    
    
        if (request()->user()->tip_korisnika === 'admin') {
            // Vraćanje svih korisnika u bazi
           return app(AdminController::class)->getUsers();
           //return action([App\Http\Controllers\Api\AdminController::class, 'getUsers']);
           //return response()->json(App\Models\User::all());
        //    $controller = new \App\Http\Controllers\Api\AdminController();
        //    return $controller->getUsers();
        }
       
    
   // Ako korisnik nije admin, vrati 403
    return response()->json(['message' => 'Forbidden'], 403);
})->middleware('auth:sanctum');


//Route::post('/vozilo/dodaj', [VoziloController::class, 'store']);
Route::post('/vozilo/dodaj', function () {
    
        if (request()->user()->tip_korisnika === 'admin') {
            // Poziv metode store iz VoziloController-a
            return app(VoziloController::class)->store(request()); // prosleđivanje Request objekta
        }
    
    // Ako korisnik nije admin, vrati 403
    return response()->json(['message' => 'Forbidden'], 403);
})->middleware('auth:sanctum');
   
// Ruta za pretragu vozila 
Route::get('/vozilo', [VoziloController::class, 'search']);
 

//Route::put('vozilo/{id}', [VoziloController::class, 'update']);
Route::put('vozilo/{id}', function ($id, \Illuminate\Http\Request $request) {
    if (request()->user()->tip_korisnika === 'admin') {
        return app(VoziloController::class)->update($request, $id);
    }
    return response()->json(['message' => 'Forbidden'], 403);
})->middleware('auth:sanctum');

//Route::delete('voziloBrisanje/{id}', [VoziloController::class, 'destroy']);
Route::delete('voziloBrisanje/{id}', function ($id) {
    if (request()->user()->tip_korisnika === 'admin') {
        return app(VoziloController::class)->destroy($id);
    }
    return response()->json(['message' => 'Forbidden'], 403);
})->middleware('auth:sanctum');
Route::post('/rezervacija', [RezervacijaController::class, 'store'])->middleware('auth:sanctum');
//Route::get('/rezervacijaSve', [RezervacijaController::class, 'index']);
Route::get('/rezervacijaSve', [RezervacijaController::class, 'index'])
    ->middleware('auth:sanctum');

Route::put('/rezervacija/{id}', [RezervacijaController::class, 'update'])
    ->middleware('auth:sanctum');

Route::put('/rezervacijaOtkazivanje/{id}', [RezervacijaController::class, 'cancel'])
    ->middleware('auth:sanctum');