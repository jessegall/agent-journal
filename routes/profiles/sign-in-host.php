<?php

declare(strict_types=1);

use App\Http\Controllers\Profiles\ClaimAccountCheckController;
use App\Http\Controllers\Profiles\ClaimCleanupController;
use App\Http\Controllers\Profiles\ClaimSignInController;
use App\Http\Controllers\Profiles\MakeHostFolderController;
use App\Http\Controllers\Profiles\PublishSignInChallengeController;
use App\Http\Controllers\Profiles\ReadFolderUseController;
use App\Http\Controllers\Profiles\ReadHostFolderAnswerController;
use App\Http\Controllers\Profiles\ReconcileSignInsController;
use App\Http\Controllers\Profiles\RemoveHostFolderController;
use App\Http\Controllers\Profiles\ReportAccountCheckController;
use App\Http\Controllers\Profiles\ReportAccountCleanupController;
use App\Http\Controllers\Profiles\ReportSignInCleanupController;
use App\Http\Controllers\Profiles\ReportSignInController;
use App\Http\Controllers\Profiles\TakeSignInCodeController;
use App\Http\Middleware\Profiles\RefuseRunnerOfOtherArrangement;
use Illuminate\Support\Facades\Route;

Route::prefix('host/sign-ins')->middleware('journal.host')->name('profiles.sign-in-host.')->group(function (): void {
    Route::post('/claim', ClaimSignInController::class)
        ->middleware(RefuseRunnerOfOtherArrangement::class)
        ->name('claim');

    Route::post('/reconcile', ReconcileSignInsController::class)->name('reconcile');
    Route::post('/{attempt}/report', ReportSignInController::class)->name('report');
    Route::post('/{attempt}/challenge', PublishSignInChallengeController::class)->name('challenge');
    Route::post('/{attempt}/code', TakeSignInCodeController::class)->name('code');
    Route::post('/{attempt}/cleanup', ReportSignInCleanupController::class)->name('cleanup');
});

Route::prefix('host/accounts')->middleware('journal.host')->name('profiles.account-host.')->group(function (): void {
    Route::post('/checks/claim', ClaimAccountCheckController::class)
        ->middleware(RefuseRunnerOfOtherArrangement::class)
        ->name('checks.claim');

    Route::post('/{account}/check', ReportAccountCheckController::class)->name('check');

    Route::post('/cleanups/claim', ClaimCleanupController::class)
        ->middleware(RefuseRunnerOfOtherArrangement::class)
        ->name('cleanups.claim');

    Route::post('/{account}/cleanup', ReportAccountCleanupController::class)->name('cleanup');

    Route::post('/folders/make', MakeHostFolderController::class)->name('folders.make');
    Route::post('/folders/remove', RemoveHostFolderController::class)->name('folders.remove');
    Route::post('/folders/use', ReadFolderUseController::class)->name('folders.use');
    Route::post('/folders/{order}/answer', ReadHostFolderAnswerController::class)->name('folders.answer');
});
