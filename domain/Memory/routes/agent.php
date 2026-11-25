<?php

declare(strict_types=1);

use App\Contracts\Domains\ApiRegistrar;
use Domain\Memory\Http\Controllers\Api\EditMemoryController;
use Domain\Memory\Http\Controllers\Api\ListMemoriesController;
use Domain\Memory\Http\Controllers\Api\RemoveMemoryController;
use Domain\Memory\Http\Controllers\Api\SaveMemoryController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(SaveMemoryController::class)->name('memory.save');
        $calls->register(EditMemoryController::class)->name('memory.edit');
        $calls->register(RemoveMemoryController::class)->name('memory.remove');
        $calls->register(ListMemoriesController::class)->name('memory.list');
    });
