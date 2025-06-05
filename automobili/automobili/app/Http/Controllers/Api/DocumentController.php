<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function upload(Request $request)
{
    
    $request->validate([
        'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        'naziv' => 'required|string|max:255', 
    ]);

     $file = $request->file('document');

    $path = $file->store('documents'); // snima u storage/app/documents

    $document = Document::create([
        'id_korisnika' =>  $request->user()->id,
        'naziv' => $request->naziv, 
        'original_name' => $file->getClientOriginalName(),
        'path' => $path,
    ]);

    return response()->json([
        'message' => 'Dokument uspešno sačuvan.',
        'document' => $document
    ]);
}
}
