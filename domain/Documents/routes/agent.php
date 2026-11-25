<?php

declare(strict_types=1);

use App\Contracts\Domains\ApiRegistrar;
use Domain\Documents\Http\Controllers\Api\CloseDocumentController;
use Domain\Documents\Http\Controllers\Api\CommentDocumentController;
use Domain\Documents\Http\Controllers\Api\CommentReportController;
use Domain\Documents\Http\Controllers\Api\EditDocumentController;
use Domain\Documents\Http\Controllers\Api\EditReportController;
use Domain\Documents\Http\Controllers\Api\InspectDocumentController;
use Domain\Documents\Http\Controllers\Api\InspectReportController;
use Domain\Documents\Http\Controllers\Api\ListDocumentRevisionsController;
use Domain\Documents\Http\Controllers\Api\ListDocumentsController;
use Domain\Documents\Http\Controllers\Api\ListReportsController;
use Domain\Documents\Http\Controllers\Api\MakeDocumentController;
use Domain\Documents\Http\Controllers\Api\MakeReportController;
use Domain\Documents\Http\Controllers\Api\OpenDocumentController;
use Domain\Documents\Http\Controllers\Api\SettleDocumentController;
use Domain\Documents\Http\Controllers\Api\SettleReportController;
use Domain\Documents\Http\Controllers\Api\ShowDocumentController;
use Domain\Documents\Http\Controllers\Api\ShowDocumentRevisionController;
use Domain\Documents\Http\Controllers\Api\ShowDraftController;
use Domain\Documents\Http\Controllers\Api\ShowReportController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('documents.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(MakeDocumentController::class)->name('docs.make');
        $calls->register(ListDocumentsController::class)->name('docs.list');
        $calls->register(ShowDocumentController::class)->name('docs.show');
        $calls->register(OpenDocumentController::class)->name('docs.open');
        $calls->register(EditDocumentController::class)->name('docs.edit');
        $calls->register(CloseDocumentController::class)->name('docs.close');
        $calls->register(CommentDocumentController::class)->name('docs.comment');
        $calls->register(ShowDraftController::class)->name('docs.draft');
        $calls->register(ListDocumentRevisionsController::class)->name('docs.revisions');
        $calls->register(ShowDocumentRevisionController::class)->name('docs.revision');
        $calls->register(SettleDocumentController::class)->name('docs.settle');
        $calls->register(InspectDocumentController::class)->name('docs.inspect');
        $calls->register(SettleReportController::class)->name('reports.close');
        $calls->register(InspectReportController::class)->name('reports.inspect');
        $calls->register(EditReportController::class)->name('reports.edit');
        $calls->register(MakeReportController::class)->name('reports.make');
        $calls->register(CommentReportController::class)->name('reports.comment');
        $calls->register(ListReportsController::class)->name('reports.list');
        $calls->register(ShowReportController::class)->name('reports.show');
    });
