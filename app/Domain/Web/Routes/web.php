<?php

declare(strict_types=1);

use App\Domain\Web\Http\Controllers\LoginController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'guest'])->group(function (): void {
    Route::get('/login', LoginController::class)->name('login');
});
