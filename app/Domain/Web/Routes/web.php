<?php

declare(strict_types=1);

use App\Domain\Web\Http\Controllers\LoginController;
use App\Domain\Web\Http\Controllers\PlansController;
use App\Domain\Web\Http\Controllers\StartPlanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'guest'])->group(function (): void {
    Route::get('/login', LoginController::class)->name('login');
});

Route::middleware(['web', 'auth', 'journal.person'])->group(function (): void {
    Route::get('/plans', [PlansController::class, 'index'])->name('plans.index');
    Route::post('/plans/{plan}/start', StartPlanController::class)->name('plans.start');
});
