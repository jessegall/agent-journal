<?php

declare(strict_types=1);

use App\Support\CallRegistrar;
use Domain\Sharing\Http\Controllers\Calls\RequestShareController;
use Domain\Sharing\Http\Controllers\Calls\ShareStatusController;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware([
    'journal.agent',
    SubstituteBindings::class,
])
    ->prefix('agent')
    ->name('shares.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRegistrar::class);
        $calls->register(RequestShareController::class)->name('request');
        $calls->register(ShareStatusController::class)->name('status');
    });
