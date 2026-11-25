<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AdmitLineController;
use App\Http\Controllers\Api\ApproveProposalController;
use App\Http\Controllers\Api\ApproveSampleController;
use App\Http\Controllers\Api\CheckRestoredOutputController;
use App\Http\Controllers\Api\CheckRunStalenessController;
use App\Http\Controllers\Api\CleanOutputController;
use App\Http\Controllers\Api\ExplainCommandController;
use App\Http\Controllers\Api\FetchAdmissionController;
use App\Http\Controllers\Api\ImportProposalsController;
use App\Http\Controllers\Api\ListProposalsController;
use App\Http\Controllers\Api\ProposeReaderController;
use App\Http\Controllers\Api\ProposeRuleController;
use App\Http\Controllers\Api\ProveReaderController;
use App\Http\Controllers\Api\ReadOutputBytesController;
use App\Http\Controllers\Api\ReadOutputSummaryController;
use App\Http\Controllers\Api\ReadOutputTailController;
use App\Http\Controllers\Api\RecordRunChunkController;
use App\Http\Controllers\Api\RecordRunEventsController;
use App\Http\Controllers\Api\RejectProposalController;
use App\Http\Controllers\Api\RestoreRuleController;
use App\Http\Controllers\Api\RetireRuleController;
use App\Http\Controllers\Api\ReviseProposalController;
use App\Http\Controllers\Api\SearchOutputController;
use App\Http\Controllers\Api\SettleSampleController;
use App\Http\Controllers\Api\ShowCommandRequestController;
use App\Http\Controllers\Api\StartEvidenceRunController;
use App\Http\Controllers\Api\StartSampleController;
use App\Http\Controllers\Api\WithdrawProposalController;
use App\Support\ApiRegistrar;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('processes.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(AdmitLineController::class)->name('admit');
        $calls->register(FetchAdmissionController::class)->name('admission');
        $calls->register(StartEvidenceRunController::class)->name('evidence');
        $calls->register(CheckRunStalenessController::class)->name('staleness');
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
        Container::getInstance()->make(ApiRegistrar::class)
            ->register(ExplainCommandController::class)
            ->name('processes.explain');
    });
