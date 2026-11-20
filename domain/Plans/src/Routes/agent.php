<?php

declare(strict_types=1);

use App\AgentRequests\Contracts\CallRegistrar;
use Domain\Plans\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRegistrar::class);
        $calls->register(Calls\ListAssignedPlansController::class)->name('plans.assigned');
        $calls->register(Calls\AssignPlanWorkController::class)->name('plans.work.assign');
        $calls->register(Calls\ReassignPlanWorkController::class)->name('plans.work.reassign');
        $calls->register(Calls\UnassignPlanWorkController::class)->name('plans.work.unassign');
        $calls->register(Calls\CreatePlanController::class)->name('plans.create');
        $calls->register(Calls\EditPlanController::class)->name('plans.edit');
        $calls->register(Calls\FinishPlanController::class)->name('plans.finish');
        $calls->register(Calls\CancelPlanController::class)->name('plans.cancel');
        $calls->register(Calls\AddPhaseController::class)->name('plans.phases.create');
        $calls->register(Calls\AddPhaseTasksController::class)->name('plans.phases.add-tasks');
        $calls->register(Calls\RecordPhaseCheckController::class)->name('plans.phases.check');
        $calls->register(Calls\ListPhaseChecksController::class)->name('plans.phases.checks');
    });
