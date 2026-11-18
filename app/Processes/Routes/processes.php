<?php

declare(strict_types=1);

use App\Http\Controllers\Processes\ApproveSampleController;
use App\Http\Controllers\Processes\ExplainCommandController;
use App\Http\Controllers\Processes\FetchAdmissionController;
use App\Http\Controllers\Processes\ProposeReaderController;
use App\Http\Controllers\Processes\ReadOutputController;
use App\Http\Controllers\Processes\RecordRunChunkController;
use App\Http\Controllers\Processes\RecordRunEventsController;
use App\Http\Controllers\Processes\SettleSampleController;
use App\Http\Controllers\Processes\StartSampleController;
use App\Http\Controllers\Processes\StartEvidenceRunController;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::post('/agent/processes/explain', ExplainCommandController::class)
    ->middleware('journal.agent')
    ->name('processes.explain');

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent/processes')
    ->name('processes.agent.')
    ->group(function (): void {
        Route::post('admissions/{processRun}', FetchAdmissionController::class)->name('admission');
        Route::post('runs/{processRun}/events', RecordRunEventsController::class)->name('events');
        Route::post('runs/{processRun}/chunks', RecordRunChunkController::class)->name('chunks');
        Route::post('permits/{evidencePermit}/runs', StartEvidenceRunController::class)->name('evidence');
        Route::post('runs/{processRun}/output', ReadOutputController::class)->name('output');
        Route::post('requests/{commandRequest}/readers', ProposeReaderController::class)->name('readers');
        Route::post('requests/{commandRequest}/sample-approval', ApproveSampleController::class)->name('sample-approval');
        Route::post('requests/{commandRequest}/samples', StartSampleController::class)->name('samples');
        Route::post('requests/{commandRequest}/samples/settle', SettleSampleController::class)
            ->name('samples.settle');
    });
