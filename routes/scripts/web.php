<?php

declare(strict_types=1);

use App\Http\Controllers\CheckProfileScriptController;
use App\Http\Controllers\ReadProfileLanguageController;
use App\Http\Controllers\SaveProfileDraftController;
use App\Http\Controllers\ShowProfileDraftController;
use App\Http\Controllers\ShowProfileRunController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'journal.user'])->prefix('profiles')->name('scripts.')->group(function (): void {
    Route::post('/draft/show', ShowProfileDraftController::class)->name('draft.show');
    Route::post('/draft/save', SaveProfileDraftController::class)->name('draft.save');
    Route::post('/draft/check', CheckProfileScriptController::class)->name('draft.check');
    Route::post('/language', ReadProfileLanguageController::class)->name('language');
    Route::post('/runs/show', ShowProfileRunController::class)->name('runs.show');
});
