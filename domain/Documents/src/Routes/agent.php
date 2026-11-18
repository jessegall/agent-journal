<?php

declare(strict_types=1);

use Domain\Documents\Http\Controllers\CloseDocumentController;
use Domain\Documents\Http\Controllers\CreateDocumentController;
use Domain\Documents\Http\Controllers\CreateReportController;
use Domain\Documents\Http\Controllers\DocumentCommentsController;
use Domain\Documents\Http\Controllers\DocumentRevisionController;
use Domain\Documents\Http\Controllers\DocumentRevisionsController;
use Domain\Documents\Http\Controllers\EditDocumentController;
use Domain\Documents\Http\Controllers\ListDocumentsController;
use Domain\Documents\Http\Controllers\ListReportsController;
use Domain\Documents\Http\Controllers\OpenDocumentController;
use Domain\Documents\Http\Controllers\ReportCommentsController;
use Domain\Documents\Http\Controllers\ShowDocumentController;
use Domain\Documents\Http\Controllers\ShowDraftController;
use Domain\Documents\Http\Controllers\ShowReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent')->name('documents.agent.')->group(function (): void {
    Route::post('docs/make', CreateDocumentController::class)->name('docs.make');
    Route::post('docs/list', ListDocumentsController::class)->name('docs.list');
    Route::post('docs/show', ShowDocumentController::class)->name('docs.show');
    Route::post('docs/open', OpenDocumentController::class)->name('docs.open');
    Route::post('docs/edit', EditDocumentController::class)->name('docs.edit');
    Route::post('docs/close', CloseDocumentController::class)->name('docs.close');
    Route::post('docs/draft', ShowDraftController::class)->name('docs.draft');
    Route::post('docs/revisions', DocumentRevisionsController::class)->name('docs.revisions');
    Route::post('docs/revision', DocumentRevisionController::class)->name('docs.revision');
    Route::post('docs/comments', DocumentCommentsController::class)->name('docs.comments');
    Route::post('reports/comments', ReportCommentsController::class)->name('reports.comments');
    Route::post('reports/make', CreateReportController::class)->name('reports.make');
    Route::post('reports/list', ListReportsController::class)->name('reports.list');
    Route::post('reports/show', ShowReportController::class)->name('reports.show');
});
