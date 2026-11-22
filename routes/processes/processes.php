<?php

declare(strict_types=1);

use App\Http\Controllers\Calls\AdmitLineController;
use App\Http\Controllers\Calls\ApproveProposalController;
use App\Http\Controllers\Calls\ApproveSampleController;
use App\Http\Controllers\Calls\CheckRestoredOutputController;
use App\Http\Controllers\Calls\CheckRunCurrencyController;
use App\Http\Controllers\Calls\CleanOutputController;
use App\Http\Controllers\Calls\ExplainCommandController;
use App\Http\Controllers\Calls\FetchAdmissionController;
use App\Http\Controllers\Calls\ImportProposalsController;
use App\Http\Controllers\Calls\ListProposalsController;
use App\Http\Controllers\Calls\ProposeReaderController;
use App\Http\Controllers\Calls\ProposeRuleController;
use App\Http\Controllers\Calls\ProveReaderController;
use App\Http\Controllers\Calls\ReadOutputBytesController;
use App\Http\Controllers\Calls\ReadOutputSummaryController;
use App\Http\Controllers\Calls\ReadOutputTailController;
use App\Http\Controllers\Calls\RecordRunChunkController;
use App\Http\Controllers\Calls\RecordRunEventsController;
use App\Http\Controllers\Calls\RejectProposalController;
use App\Http\Controllers\Calls\RestoreRuleController;
use App\Http\Controllers\Calls\RetireRuleController;
use App\Http\Controllers\Calls\ReviseProposalController;
use App\Http\Controllers\Calls\SearchOutputController;
use App\Http\Controllers\Calls\SettleSampleController;
use App\Http\Controllers\Calls\ShowCommandRequestController;
use App\Http\Controllers\Calls\StartEvidenceRunController;
use App\Http\Controllers\Calls\StartSampleController;
use App\Http\Controllers\Calls\WithdrawProposalController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('processes.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(AdmitLineController::class)->name('admit');
        $calls->register(FetchAdmissionController::class)->name('admission');
        $calls->register(StartEvidenceRunController::class)->name('evidence');
        $calls->register(CheckRunCurrencyController::class)->name('currency');
        $calls->register(ReadOutputSummaryController::class)->name('output.summary');
        $calls->register(ReadOutputTailController::class)->name('output.tail');
        $calls->register(SearchOutputController::class)->name('output.search');
        $calls->register(ReadOutputBytesController::class)->name('output.bytes');
        $calls->register(RecordRunEventsController::class)->name('events');
        $calls->register(RecordRunChunkController::class)->name('chunks');
        $calls->register(CheckRestoredOutputController::class)->name('restore-check');
        $calls->register(CleanOutputController::class)->name('clean');
        $calls->register(ProposeReaderController::class)->name('readers');
        $calls->register(ApproveSampleController::class)->name('sample-approval');
        $calls->register(StartSampleController::class)->name('samples');
        $calls->register(SettleSampleController::class)->name('samples.settle');
        $calls->register(ProveReaderController::class)->name('proofs');
        $calls->register(ProposeRuleController::class)->name('proposals.propose');
        $calls->register(ShowCommandRequestController::class)->name('requests.show');
        $calls->register(ListProposalsController::class)->name('proposals.list');
        $calls->register(ImportProposalsController::class)->name('proposals.import');
        $calls->register(ReviseProposalController::class)->name('proposals.revise');
        $calls->register(WithdrawProposalController::class)->name('proposals.withdraw');
        $calls->register(ApproveProposalController::class)->name('proposals.approve');
        $calls->register(RejectProposalController::class)->name('proposals.reject');
        $calls->register(RetireRuleController::class)->name('rules.retire');
        $calls->register(RestoreRuleController::class)->name('rules.restore');
    });

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        Container::getInstance()->make(CallRoutes::class)
            ->register(ExplainCommandController::class)
            ->name('processes.explain');
    });
