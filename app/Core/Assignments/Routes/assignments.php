<?php

declare(strict_types=1);

use App\Core\Assignments\Http\Controllers\AssignRecordController;
use App\Core\Assignments\Http\Controllers\ReassignRecordController;
use App\Core\Assignments\Http\Controllers\ShowAssignmentController;
use App\Core\Assignments\Http\Controllers\UnassignRecordController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent/assignments')->name('assignments.agent.')->group(function (): void {
    Route::post('show', ShowAssignmentController::class)->name('show');
    Route::post('assign', AssignRecordController::class)->name('assign');
    Route::post('reassign', ReassignRecordController::class)->name('reassign');
    Route::post('unassign', UnassignRecordController::class)->name('unassign');
});

Route::middleware(['web', 'auth', 'journal.user'])->prefix('assignments')->name('assignments.')->group(function (): void {
    Route::get('show', ShowAssignmentController::class)->name('show');
    Route::post('assign', AssignRecordController::class)->name('assign');
    Route::post('reassign', ReassignRecordController::class)->name('reassign');
    Route::post('unassign', UnassignRecordController::class)->name('unassign');
});
