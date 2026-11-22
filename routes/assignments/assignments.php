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
use App\Http\Controllers\Calls\ListAssignmentPoolsController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('assignments.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(App\Http\Controllers\Calls\ShowAssignmentController::class)->name('show');
        $calls->register(App\Http\Controllers\Calls\AssignRecordController::class)->name('assign');
        $calls->register(App\Http\Controllers\Calls\ReassignRecordController::class)->name('reassign');
        $calls->register(App\Http\Controllers\Calls\UnassignRecordController::class)->name('unassign');
        $calls->register(App\Http\Controllers\Calls\EnableAutoAssignmentController::class)->name('auto.enable');
        $calls->register(App\Http\Controllers\Calls\ConfigureAutoAssignmentController::class)->name('auto.configure');
        $calls->register(App\Http\Controllers\Calls\DisableAutoAssignmentController::class)->name('auto.disable');
        $calls->register(App\Http\Controllers\Calls\ShowAutoAssignmentController::class)->name('auto.show');
        $calls->register(App\Http\Controllers\Calls\ListAutoAssignmentsController::class)->name('auto.list');
        $calls->register(ListAssignmentPoolsController::class)->name('auto.pools');
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
