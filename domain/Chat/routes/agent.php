<?php

declare(strict_types=1);

use App\Contracts\Domains\ApiRegistrar;
use Domain\Chat\Http\Controllers\Api\DockAddController;
use Domain\Chat\Http\Controllers\Api\DockListController;
use Domain\Chat\Http\Controllers\Api\DockRemoveController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('chat.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(DockAddController::class)->name('dock.add');
        $calls->register(DockListController::class)->name('dock.list');
        $calls->register(DockRemoveController::class)->name('dock.remove');
    });
