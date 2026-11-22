<?php

declare(strict_types=1);

use App\Http\Controllers\Calls\RequestShareController;
use App\Http\Controllers\Calls\ShareStatusController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('shares.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(RequestShareController::class)->name('request');
        $calls->register(ShareStatusController::class)->name('status');
    });
