<?php

declare(strict_types=1);

use Domain\Plans\Http\Controllers\AssignedPlansController;
use Domain\Plans\Http\Controllers\AssignPlanWorkController;
use Domain\Plans\Http\Controllers\ReassignPlanWorkController;
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
