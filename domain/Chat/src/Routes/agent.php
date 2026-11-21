<?php

declare(strict_types=1);

use App\AgentRequests\Contracts\CallRegistrar;
use Domain\Chat\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('chat.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRegistrar::class);
        $calls->register(Calls\DockAddController::class)->name('dock.add');
        $calls->register(Calls\DockListController::class)->name('dock.list');
        $calls->register(Calls\DockRemoveController::class)->name('dock.remove');
    });
