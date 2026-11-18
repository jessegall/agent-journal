<?php

declare(strict_types=1);

use App\Http\Controllers\Profiles\LaunchProfileMainController;
use Illuminate\Support\Facades\Route;

Route::post('/profiles/{profile}/launch-main', LaunchProfileMainController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('profiles.launch-main');
