<?php

declare(strict_types=1);

use App\Contracts\Domains\ApiRegistrar;
use Domain\Plans\Http\Controllers\Api\AddPhaseController;
use Domain\Plans\Http\Controllers\Api\AddPhaseTasksController;
use Domain\Plans\Http\Controllers\Api\AssignPlanWorkController;
use Domain\Plans\Http\Controllers\Api\CancelPlanController;
use Domain\Plans\Http\Controllers\Api\CreatePlanController;
use Domain\Plans\Http\Controllers\Api\EditPlanController;
use Domain\Plans\Http\Controllers\Api\FinishPlanController;
use Domain\Plans\Http\Controllers\Api\ListAssignedPlansController;
use Domain\Plans\Http\Controllers\Api\ListPhaseChecksController;
use Domain\Plans\Http\Controllers\Api\ReassignPlanWorkController;
use Domain\Plans\Http\Controllers\Api\RecordPhaseCheckController;
use Domain\Plans\Http\Controllers\Api\UnassignPlanWorkController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(ListAssignedPlansController::class)->name('plans.assigned');
        $calls->register(AssignPlanWorkController::class)->name('plans.work.assign');
        $calls->register(ReassignPlanWorkController::class)->name('plans.work.reassign');
        $calls->register(UnassignPlanWorkController::class)->name('plans.work.unassign');
        $calls->register(CreatePlanController::class)->name('plans.create');
        $calls->register(EditPlanController::class)->name('plans.edit');
        $calls->register(FinishPlanController::class)->name('plans.finish');
        $calls->register(CancelPlanController::class)->name('plans.cancel');
        $calls->register(AddPhaseController::class)->name('plans.phases.create');
        $calls->register(AddPhaseTasksController::class)->name('plans.phases.add-tasks');
        $calls->register(RecordPhaseCheckController::class)->name('plans.phases.check');
        $calls->register(ListPhaseChecksController::class)->name('plans.phases.checks');
    });
