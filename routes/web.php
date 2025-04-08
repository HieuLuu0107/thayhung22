<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome'); // hoặc file blade nào đó
});
