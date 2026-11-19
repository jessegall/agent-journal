<?php

declare(strict_types=1);

use App\Http\Controllers\Profiles\StartProfileMainController;
use Illuminate\Support\Facades\Route;

Route::post('/profiles/{profile}/start-main', StartProfileMainController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('profiles.start-main');
