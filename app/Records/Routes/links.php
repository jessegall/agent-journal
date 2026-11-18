<?php

declare(strict_types=1);

use App\Http\Controllers\Links\LinkRecordsController;
use App\Http\Controllers\Links\UnlinkRecordsController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent/links')->name('links.agent.')->group(function (): void {
    Route::post('add', LinkRecordsController::class)->name('add');
    Route::post('remove', UnlinkRecordsController::class)->name('remove');
});

Route::middleware(['web', 'auth', 'journal.user'])->prefix('links')->name('links.')->group(function (): void {
    Route::post('add', LinkRecordsController::class)->name('add');
    Route::post('remove', UnlinkRecordsController::class)->name('remove');
});
