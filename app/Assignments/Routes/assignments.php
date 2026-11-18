<?php

declare(strict_types=1);

use App\Http\Controllers\Assignments\AssignRecordController;
use App\Http\Controllers\Assignments\AutoAssignmentPoolsController;
use App\Http\Controllers\Assignments\ConfigureAutoAssignmentController;
use App\Http\Controllers\Assignments\DisableAutoAssignmentController;
use App\Http\Controllers\Assignments\EnableAutoAssignmentController;
use App\Http\Controllers\Assignments\ListAutoAssignmentsController;
use App\Http\Controllers\Assignments\ReassignRecordController;
use App\Http\Controllers\Assignments\ShowAssignmentController;
use App\Http\Controllers\Assignments\ShowAutoAssignmentController;
use App\Http\Controllers\Assignments\UnassignRecordController;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')->prefix('agent/assignments')->name('assignments.agent.')->group(function (): void {
    Route::post('show', ShowAssignmentController::class)->name('show');
    Route::post('assign', AssignRecordController::class)->name('assign');
    Route::post('reassign', ReassignRecordController::class)->name('reassign');
    Route::post('unassign', UnassignRecordController::class)->name('unassign');
    Route::post('auto/enable', EnableAutoAssignmentController::class)->name('auto.enable');
    Route::post('auto/configure', ConfigureAutoAssignmentController::class)->name('auto.configure');
    Route::post('auto/disable', DisableAutoAssignmentController::class)->name('auto.disable');
    Route::post('auto/show', ShowAutoAssignmentController::class)->name('auto.show');
    Route::post('auto/list', ListAutoAssignmentsController::class)->name('auto.list');
    Route::post('auto/pools', AutoAssignmentPoolsController::class)->name('auto.pools');
});

Route::middleware(['web', 'auth', 'journal.user'])
    ->prefix('assignments')
    ->name('assignments.')
    ->group(function (): void {
        Route::get('show', ShowAssignmentController::class)->name('show');
        Route::post('assign', AssignRecordController::class)->name('assign');
        Route::post('reassign', ReassignRecordController::class)->name('reassign');
        Route::post('unassign', UnassignRecordController::class)->name('unassign');
        Route::post('auto/enable', EnableAutoAssignmentController::class)->name('auto.enable');
        Route::post('auto/configure', ConfigureAutoAssignmentController::class)->name('auto.configure');
        Route::post('auto/disable', DisableAutoAssignmentController::class)->name('auto.disable');
        Route::get('auto/show', ShowAutoAssignmentController::class)->name('auto.show');
        Route::get('auto/list', ListAutoAssignmentsController::class)->name('auto.list');
        Route::get('auto/pools', AutoAssignmentPoolsController::class)->name('auto.pools');
    });
