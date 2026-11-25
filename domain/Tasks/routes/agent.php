<?php

declare(strict_types=1);

use App\Contracts\Domains\ApiRegistrar;
use Domain\Tasks\Http\Controllers\Api\CreateTaskController;
use Domain\Tasks\Http\Controllers\Api\EditTaskController;
use Domain\Tasks\Http\Controllers\Api\ListAssignedTasksController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(ListAssignedTasksController::class)->name('tasks.assigned');
        $calls->register(CreateTaskController::class)->name('tasks.create');
        $calls->register(EditTaskController::class)->name('tasks.edit');
    });
