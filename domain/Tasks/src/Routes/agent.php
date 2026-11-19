<?php

declare(strict_types=1);

use App\AgentRequests\Contracts\RegistersCalls;
use Domain\Tasks\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(RegistersCalls::class);
        $calls->register(Calls\ListAssignedTasksController::class)->name('tasks.assigned');
        $calls->register(Calls\CreateTaskController::class)->name('tasks.create');
        $calls->register(Calls\EditTaskController::class)->name('tasks.edit');
    });
