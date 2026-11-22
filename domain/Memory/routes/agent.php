<?php

declare(strict_types=1);

use App\Contracts\Domains\CallRegistrar;
use Domain\Memory\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRegistrar::class);
        $calls->register(Calls\SaveMemoryController::class)->name('memory.save');
        $calls->register(Calls\EditMemoryController::class)->name('memory.edit');
        $calls->register(Calls\RemoveMemoryController::class)->name('memory.remove');
        $calls->register(Calls\ListMemoriesController::class)->name('memory.list');
    });
