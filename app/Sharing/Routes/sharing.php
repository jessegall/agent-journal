<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Sharing\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('shares.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Calls\RequestShareController::class)->name('request');
        $calls->register(Calls\ShareStatusController::class)->name('status');
    });
