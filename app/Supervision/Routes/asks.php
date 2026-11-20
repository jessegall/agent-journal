<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Supervision\Http\Controllers;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('asks.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Controllers\MakeAskController::class)->name('make');
        $calls->register(Controllers\ListAsksController::class)->name('list');
        $calls->register(Controllers\ShowAskController::class)->name('show');
        $calls->register(Controllers\ReplyToAskController::class)->name('reply');
        $calls->register(Controllers\WithdrawAskController::class)->name('withdraw');
    });
