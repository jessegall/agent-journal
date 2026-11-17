<?php

declare(strict_types=1);

use App\Domain\Plans\Http\Controllers\AssignedPlansController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/plans/assigned', AssignedPlansController::class)
    ->middleware('journal.agent')
    ->name('plans.assigned');
