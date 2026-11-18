<?php

declare(strict_types=1);

use Domain\Tasks\Http\Controllers\AssignedTasksController;
use Domain\Tasks\Http\Controllers\CreateTaskController;
use Domain\Tasks\Http\Controllers\EditTaskController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/tasks/assigned', AssignedTasksController::class)
    ->middleware('journal.agent')
    ->name('tasks.assigned');

Route::post('/agent/tasks/create', CreateTaskController::class)
    ->middleware('journal.agent')
    ->name('tasks.create');

Route::post('/agent/tasks/edit', EditTaskController::class)
    ->middleware('journal.agent')
    ->name('tasks.edit');
