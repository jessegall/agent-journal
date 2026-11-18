<?php

declare(strict_types=1);

use App\Http\Controllers\Processes\ExplainCommandController;
use App\Http\Controllers\Processes\FetchAdmissionController;
use App\Http\Controllers\Processes\RecordRunChunkController;
use App\Http\Controllers\Processes\RecordRunEventsController;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::post('/agent/processes/explain', ExplainCommandController::class)->middleware('journal.agent')->name('processes.explain');

Route::middleware(['journal.agent', SubstituteBindings::class])->prefix('agent/processes')->name('processes.agent.')->group(function (): void {
    Route::post('admissions/{processRun}', FetchAdmissionController::class)->name('admission');
    Route::post('runs/{processRun}/events', RecordRunEventsController::class)->name('events');
    Route::post('runs/{processRun}/chunks', RecordRunChunkController::class)->name('chunks');
});
