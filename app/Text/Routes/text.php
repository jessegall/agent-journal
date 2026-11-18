<?php

declare(strict_types=1);

use App\Http\Controllers\Text\ReadTextController;
use App\Http\Controllers\Text\TextSectionsController;
use App\Http\Controllers\Text\TextVersionController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent/text')->name('text.agent.')->group(function (): void {
    Route::post('version', TextVersionController::class)->name('version');
    Route::post('sections', TextSectionsController::class)->name('sections');
    Route::post('read', ReadTextController::class)->name('read');
});

Route::middleware(['web', 'auth', 'journal.user'])->prefix('text')->name('text.')->group(function (): void {
    Route::get('version', TextVersionController::class)->name('version');
    Route::get('sections', TextSectionsController::class)->name('sections');
    Route::get('read', ReadTextController::class)->name('read');
});
