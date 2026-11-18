<?php

declare(strict_types=1);

use App\Http\Controllers\Processes\AdmitLineController;
use App\Http\Controllers\Processes\ApproveProposalController;
use App\Http\Controllers\Processes\ApproveSampleController;
use App\Http\Controllers\Processes\ExplainCommandController;
use App\Http\Controllers\Processes\FetchAdmissionController;
use App\Http\Controllers\Processes\ImportProposalsController;
use App\Http\Controllers\Processes\ListProposalsController;
use App\Http\Controllers\Processes\ProposeReaderController;
use App\Http\Controllers\Processes\ProposeRuleController;
use App\Http\Controllers\Processes\ProveReaderController;
use App\Http\Controllers\Processes\ReadOutputController;
use App\Http\Controllers\Processes\RecordRunChunkController;
use App\Http\Controllers\Processes\RecordRunEventsController;
use App\Http\Controllers\Processes\RejectProposalController;
use App\Http\Controllers\Processes\RestoreRuleController;
use App\Http\Controllers\Processes\RetireRuleController;
use App\Http\Controllers\Processes\RunCurrencyController;
use App\Http\Controllers\Processes\ReviseProposalController;
use App\Http\Controllers\Processes\SettleSampleController;
use App\Http\Controllers\Processes\ShowCommandRequestController;
use App\Http\Controllers\Processes\StartEvidenceRunController;
use App\Http\Controllers\Processes\StartSampleController;
use App\Http\Controllers\Processes\WithdrawProposalController;
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
