<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\RequestShareController;
use App\Http\Controllers\Agents\ShareStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent/sharing')->name('shares.agent.')->group(function (): void {
    Route::post('request', RequestShareController::class)->name('request');
    Route::post('status', ShareStatusController::class)->name('status');
});
