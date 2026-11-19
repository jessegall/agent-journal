<?php

declare(strict_types=1);

use App\Http\Controllers\Profiles\ClaimAccountCheckController;
use App\Http\Controllers\Profiles\ClaimSignInController;
use App\Http\Controllers\Profiles\PublishSignInChallengeController;
use App\Http\Controllers\Profiles\ReportAccountCheckController;
use App\Http\Controllers\Profiles\ReportSignInController;
use App\Http\Controllers\Profiles\TakeSignInCodeController;
use Illuminate\Support\Facades\Route;

Route::prefix('host/sign-ins')->middleware('journal.host')->name('profiles.sign-in-host.')->group(function (): void {
    Route::post('/claim', ClaimSignInController::class)->name('claim');
    Route::post('/{attempt}/report', ReportSignInController::class)->name('report');
    Route::post('/{attempt}/challenge', PublishSignInChallengeController::class)->name('challenge');
    Route::post('/{attempt}/code', TakeSignInCodeController::class)->name('code');
});

Route::prefix('host/accounts')->middleware('journal.host')->name('profiles.account-host.')->group(function (): void {
    Route::post('/checks/claim', ClaimAccountCheckController::class)->name('checks.claim');
    Route::post('/{account}/check', ReportAccountCheckController::class)->name('check');
});
