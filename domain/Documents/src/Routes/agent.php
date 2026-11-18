<?php

declare(strict_types=1);

use Domain\Documents\Http\Controllers\CreateDocumentController;
use Domain\Documents\Http\Controllers\CreateReportController;
use Domain\Documents\Http\Controllers\ListDocumentsController;
use Domain\Documents\Http\Controllers\ListReportsController;
use Domain\Documents\Http\Controllers\ShowDocumentController;
use Domain\Documents\Http\Controllers\ShowReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent')->name('documents.agent.')->group(function (): void {
    Route::post('docs/make', CreateDocumentController::class)->name('docs.make');
    Route::post('docs/list', ListDocumentsController::class)->name('docs.list');
    Route::post('docs/show', ShowDocumentController::class)->name('docs.show');
    Route::post('reports/make', CreateReportController::class)->name('reports.make');
    Route::post('reports/list', ListReportsController::class)->name('reports.list');
    Route::post('reports/show', ShowReportController::class)->name('reports.show');
});
