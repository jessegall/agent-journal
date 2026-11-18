<?php

declare(strict_types=1);

use App\Processes\Http\Controllers\AdmitLineController;
use App\Processes\Http\Controllers\ApproveProposalController;
use App\Processes\Http\Controllers\ApproveSampleController;
use App\Processes\Http\Controllers\CleanOutputController;
use App\Processes\Http\Controllers\ExplainCommandController;
use App\Processes\Http\Controllers\FetchAdmissionController;
use App\Processes\Http\Controllers\ImportProposalsController;
use App\Processes\Http\Controllers\ListProposalsController;
use App\Processes\Http\Controllers\ProposeReaderController;
use App\Processes\Http\Controllers\ProposeRuleController;
use App\Processes\Http\Controllers\ProveReaderController;
use App\Processes\Http\Controllers\ReadOutputController;
use App\Processes\Http\Controllers\RecordRunChunkController;
use App\Processes\Http\Controllers\RecordRunEventsController;
use App\Processes\Http\Controllers\RejectProposalController;
use App\Processes\Http\Controllers\RestoreCheckController;
use App\Processes\Http\Controllers\RestoreRuleController;
use App\Processes\Http\Controllers\RetireRuleController;
use App\Processes\Http\Controllers\ReviseProposalController;
use App\Processes\Http\Controllers\RunCurrencyController;
use App\Processes\Http\Controllers\SettleSampleController;
use App\Processes\Http\Controllers\ShowCommandRequestController;
use App\Processes\Http\Controllers\StartEvidenceRunController;
use App\Processes\Http\Controllers\StartSampleController;
use App\Processes\Http\Controllers\WithdrawProposalController;
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
        Route::post('runs/{processRun}/currency', RunCurrencyController::class)->name('currency');
        Route::post('admit', AdmitLineController::class)->name('admit');
        Route::post('runs/clean', CleanOutputController::class)->name('clean');
        Route::post('runs/{processRun}/restore-check', RestoreCheckController::class)->name('restore-check');
        Route::post('requests/{commandRequest}/readers', ProposeReaderController::class)->name('readers');
        Route::post('requests/{commandRequest}/sample-approval', ApproveSampleController::class)
            ->name('sample-approval');
        Route::post('requests/{commandRequest}/samples', StartSampleController::class)->name('samples');
        Route::post('requests/{commandRequest}/samples/settle', SettleSampleController::class)
            ->name('samples.settle');
        Route::post('requests/{commandRequest}/proofs', ProveReaderController::class)->name('proofs');
        Route::post('requests/{commandRequest}/proposals', ProposeRuleController::class)->name('proposals.propose');
        Route::post('requests/{commandRequest}/show', ShowCommandRequestController::class)->name('requests.show');
        Route::post('proposals/list', ListProposalsController::class)->name('proposals.list');
        Route::post('proposals/import', ImportProposalsController::class)->name('proposals.import');
        Route::post('proposals/{proposal}/revisions', ReviseProposalController::class)->name('proposals.revise');
        Route::post('proposals/{proposal}/withdraw', WithdrawProposalController::class)->name('proposals.withdraw');
        Route::post('proposals/{proposal}/approve', ApproveProposalController::class)->name('proposals.approve');
        Route::post('proposals/{proposal}/reject', RejectProposalController::class)->name('proposals.reject');
        Route::post('rules/{rule}/retire', RetireRuleController::class)->name('rules.retire');
        Route::post('rules/{rule}/restore', RestoreRuleController::class)->name('rules.restore');
    });
