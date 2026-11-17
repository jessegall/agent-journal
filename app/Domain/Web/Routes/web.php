<?php

declare(strict_types=1);

use App\Domain\Web\Http\Controllers\LoginController;
use App\Domain\Web\Http\Controllers\PlansController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'guest'])->group(function (): void {
    Route::get('/login', LoginController::class)->name('login');
});

Route::middleware(['web', 'auth', 'journal.person'])->group(function (): void {
    Route::get('/plans', [PlansController::class, 'index'])->name('plans.index');
});
