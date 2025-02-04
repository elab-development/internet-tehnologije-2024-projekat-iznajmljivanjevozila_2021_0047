<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\VoziloController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [RegistrationController::class, 'register']);

Route::post('/login', [LoginController::class, 'login']);

Route::get('/users', [AdminController::class, 'getUsers']);

Route::post('/vozilo/dodaj', [VoziloController::class, 'store']);

// Ruta za pretragu vozila 
Route::get('/vozilo', [VoziloController::class, 'search']);
 

Route::put('vozilo/{id}', [VoziloController::class, 'update']);
Route::delete('voziloBrisanje/{id}', [VoziloController::class, 'destroy']);