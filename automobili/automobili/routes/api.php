<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/register', [RegistrationController::class, 'register']);

Route::post('/login', [LoginController::class, 'login']);

Route::get('/users', [AdminController::class, 'getUsers']);