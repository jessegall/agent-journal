<?php

declare(strict_types=1);

use App\Http\Controllers\Profiles\ClaimSignInController;
use App\Http\Controllers\Profiles\ReportSignInController;
use Illuminate\Support\Facades\Route;

Route::prefix('host/sign-ins')->middleware('journal.host')->name('profiles.sign-in-host.')->group(function (): void {
    Route::post('/claim', ClaimSignInController::class)->name('claim');
    Route::post('/{attempt}/report', ReportSignInController::class)->name('report');
});
