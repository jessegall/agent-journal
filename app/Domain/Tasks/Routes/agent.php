<?php

declare(strict_types=1);

use App\Domain\Tasks\Http\Controllers\AssignedTasksController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/tasks/assigned', AssignedTasksController::class)
    ->middleware('journal.agent')
    ->name('tasks.assigned');
