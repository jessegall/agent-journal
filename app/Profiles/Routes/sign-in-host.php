<?php

declare(strict_types=1);

use App\Http\Controllers\Profiles\ClaimAccountCheckController;
use App\Http\Controllers\Profiles\ClaimCleanupController;
use App\Http\Controllers\Profiles\ClaimSignInController;
use App\Http\Controllers\Profiles\PublishSignInChallengeController;
use App\Http\Controllers\Profiles\ReconcileSignInsController;
use App\Http\Controllers\Profiles\ReportAccountCheckController;
use App\Http\Controllers\Profiles\ReportAccountCleanupController;
use App\Http\Controllers\Profiles\ReportSignInCleanupController;
use App\Http\Controllers\Profiles\ReportSignInController;
use App\Http\Controllers\Profiles\TakeSignInCodeController;
use Illuminate\Support\Facades\Route;

Route::prefix('host/sign-ins')->middleware('journal.host')->name('profiles.sign-in-host.')->group(function (): void {
    Route::post('/claim', ClaimSignInController::class)->name('claim');
    Route::post('/reconcile', ReconcileSignInsController::class)->name('reconcile');
    Route::post('/{attempt}/report', ReportSignInController::class)->name('report');
    Route::post('/{attempt}/challenge', PublishSignInChallengeController::class)->name('challenge');
    Route::post('/{attempt}/code', TakeSignInCodeController::class)->name('code');
    Route::post('/{attempt}/cleanup', ReportSignInCleanupController::class)->name('cleanup');
});

Route::prefix('host/accounts')->middleware('journal.host')->name('profiles.account-host.')->group(function (): void {
    Route::post('/checks/claim', ClaimAccountCheckController::class)->name('checks.claim');
    Route::post('/{account}/check', ReportAccountCheckController::class)->name('check');
    Route::post('/cleanups/claim', ClaimCleanupController::class)->name('cleanups.claim');
    Route::post('/{account}/cleanup', ReportAccountCleanupController::class)->name('cleanup');
});
