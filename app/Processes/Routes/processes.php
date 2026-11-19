<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Processes\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('processes.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Calls\AdmitLineController::class)->name('admit');
        $calls->register(Calls\FetchAdmissionController::class)->name('admission');
        $calls->register(Calls\StartEvidenceRunController::class)->name('evidence');
        $calls->register(Calls\CheckRunCurrencyController::class)->name('currency');
        $calls->register(Calls\ReadOutputSummaryController::class)->name('output.summary');
        $calls->register(Calls\ReadOutputTailController::class)->name('output.tail');
        $calls->register(Calls\SearchOutputController::class)->name('output.search');
        $calls->register(Calls\ReadOutputBytesController::class)->name('output.bytes');
        $calls->register(Calls\RecordRunEventsController::class)->name('events');
        $calls->register(Calls\RecordRunChunkController::class)->name('chunks');
        $calls->register(Calls\CheckRestoredOutputController::class)->name('restore-check');
        $calls->register(Calls\CleanOutputController::class)->name('clean');
        $calls->register(Calls\ProposeReaderController::class)->name('readers');
        $calls->register(Calls\ApproveSampleController::class)->name('sample-approval');
        $calls->register(Calls\StartSampleController::class)->name('samples');
        $calls->register(Calls\SettleSampleController::class)->name('samples.settle');
        $calls->register(Calls\ProveReaderController::class)->name('proofs');
        $calls->register(Calls\ProposeRuleController::class)->name('proposals.propose');
        $calls->register(Calls\ShowCommandRequestController::class)->name('requests.show');
        $calls->register(Calls\ListProposalsController::class)->name('proposals.list');
        $calls->register(Calls\ImportProposalsController::class)->name('proposals.import');
        $calls->register(Calls\ReviseProposalController::class)->name('proposals.revise');
        $calls->register(Calls\WithdrawProposalController::class)->name('proposals.withdraw');
        $calls->register(Calls\ApproveProposalController::class)->name('proposals.approve');
        $calls->register(Calls\RejectProposalController::class)->name('proposals.reject');
        $calls->register(Calls\RetireRuleController::class)->name('rules.retire');
        $calls->register(Calls\RestoreRuleController::class)->name('rules.restore');
    });

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        Container::getInstance()->make(CallRoutes::class)
            ->register(Calls\ExplainCommandController::class)
            ->name('processes.explain');
    });
