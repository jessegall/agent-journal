<?php

declare(strict_types=1);

use Domain\Memory\Http\Controllers\EditMemoryController;
use Domain\Memory\Http\Controllers\ListMemoriesController;
use Domain\Memory\Http\Controllers\RemoveMemoryController;
use Domain\Memory\Http\Controllers\SaveMemoryController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/memory/save', SaveMemoryController::class)
    ->middleware('journal.agent')
    ->name('memory.save');

Route::post('/agent/memory/edit', EditMemoryController::class)
    ->middleware('journal.agent')
    ->name('memory.edit');

Route::post('/agent/memory/remove', RemoveMemoryController::class)
    ->middleware('journal.agent')
    ->name('memory.remove');

Route::post('/agent/memory/list', ListMemoriesController::class)
    ->middleware('journal.agent')
    ->name('memory.list');
