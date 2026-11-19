<?php

declare(strict_types=1);

use App\AgentRequests\Contracts\RegistersCalls;
use Domain\Documents\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('documents.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(RegistersCalls::class);
        $calls->register(Calls\MakeDocumentController::class)->name('docs.make');
        $calls->register(Calls\ListDocumentsController::class)->name('docs.list');
        $calls->register(Calls\ShowDocumentController::class)->name('docs.show');
        $calls->register(Calls\OpenDocumentController::class)->name('docs.open');
        $calls->register(Calls\EditDocumentController::class)->name('docs.edit');
        $calls->register(Calls\CloseDocumentController::class)->name('docs.close');
        $calls->register(Calls\ShowDraftController::class)->name('docs.draft');
        $calls->register(Calls\ListDocumentRevisionsController::class)->name('docs.revisions');
        $calls->register(Calls\ShowDocumentRevisionController::class)->name('docs.revision');
        $calls->register(Calls\SettleDocumentController::class)->name('docs.settle');
        $calls->register(Calls\InspectDocumentController::class)->name('docs.inspect');
        $calls->register(Calls\SettleReportController::class)->name('reports.settle');
        $calls->register(Calls\InspectReportController::class)->name('reports.inspect');
        $calls->register(Calls\EditReportController::class)->name('reports.edit');
        $calls->register(Calls\MakeReportController::class)->name('reports.make');
        $calls->register(Calls\ListReportsController::class)->name('reports.list');
        $calls->register(Calls\ShowReportController::class)->name('reports.show');
    });
