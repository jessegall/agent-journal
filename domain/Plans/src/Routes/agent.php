<?php

declare(strict_types=1);

use Domain\Plans\Http\Controllers\AddPhaseController;
use Domain\Plans\Http\Controllers\AddPhaseTasksController;
use Domain\Plans\Http\Controllers\AssignedPlansController;
use Domain\Plans\Http\Controllers\AssignPlanWorkController;
use Domain\Plans\Http\Controllers\CreatePlanController;
use Domain\Plans\Http\Controllers\EditPlanController;
use Domain\Plans\Http\Controllers\EndPlanController;
use Domain\Plans\Http\Controllers\PhaseChecksController;
use Domain\Plans\Http\Controllers\ReassignPlanWorkController;
use Domain\Plans\Http\Controllers\RecordPhaseCheckController;
use Domain\Plans\Http\Controllers\UnassignPlanWorkController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/plans/assigned', AssignedPlansController::class)
    ->middleware('journal.agent')
    ->name('plans.assigned');

Route::middleware('journal.agent')->prefix('agent/plans/work')->name('plans.work.')->group(function (): void {
    Route::post('assign', AssignPlanWorkController::class)->name('assign');
    Route::post('reassign', ReassignPlanWorkController::class)->name('reassign');
    Route::post('unassign', UnassignPlanWorkController::class)->name('unassign');
});

Route::middleware('journal.agent')->prefix('agent/plans')->name('plans.')->group(function (): void {
    Route::post('create', CreatePlanController::class)->name('create');
    Route::post('edit', EditPlanController::class)->name('edit');
    Route::post('finish', EndPlanController::class)->defaults('ending', 'finish')->name('finish');
    Route::post('cancel', EndPlanController::class)->defaults('ending', 'cancel')->name('cancel');
    Route::post('phases/create', AddPhaseController::class)->name('phases.create');
    Route::post('phases/add-tasks', AddPhaseTasksController::class)->name('phases.add-tasks');
    Route::post('phases/check', RecordPhaseCheckController::class)->name('phases.check');
    Route::post('phases/checks', PhaseChecksController::class)->name('phases.checks');
});
