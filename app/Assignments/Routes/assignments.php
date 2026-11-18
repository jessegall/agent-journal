<?php

declare(strict_types=1);

use App\Http\Controllers\Assignments\AssignRecordController;
use App\Http\Controllers\Assignments\ReassignRecordController;
use App\Http\Controllers\Assignments\ShowAssignmentController;
use App\Http\Controllers\Assignments\UnassignRecordController;
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
