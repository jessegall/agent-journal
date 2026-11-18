<?php

declare(strict_types=1);

use App\Http\Controllers\Web\LayoutsController;
use App\Http\Controllers\Web\LoginController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'guest'])->group(function (): void {
    Route::get('/login', LoginController::class)->name('login');
});

Route::middleware(['web', 'auth', 'journal.user'])->group(function (): void {
    Route::post('/layouts', [LayoutsController::class, 'store'])->name('layouts.store');
    Route::put('/layouts/{layout}', [LayoutsController::class, 'update'])->name('layouts.update');
    Route::delete('/layouts/{layout}', [LayoutsController::class, 'destroy'])->name('layouts.destroy');
});
