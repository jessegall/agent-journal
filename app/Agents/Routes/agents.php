<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Agents\Http\Controllers\Calls;
use App\Http\Controllers\Agents\LaunchAgentController;
use App\Http\Controllers\Agents\RetireAgentController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::post('/agents/retire', RetireAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.retire');

Route::post('/agents/{agent}/launch', LaunchAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.launch');

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('agents.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Calls\RetireAgentController::class)->name('retire');
        $calls->register(Calls\RecordHeartbeatController::class)->name('heartbeat');
    });
