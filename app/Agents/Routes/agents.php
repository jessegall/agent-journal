<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Agents\Http\Controllers\Calls;
use App\Http\Controllers\Agents\ContinueStartController;
use App\Http\Controllers\Agents\DismissLaunchOutcomeController;
use App\Http\Controllers\Agents\RecheckDriverSwitchController;
use App\Http\Controllers\Agents\RetireAgentController;
use App\Http\Controllers\Agents\RetryDriverSwitchController;
use App\Http\Controllers\Agents\StartAgentController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::post('/agents/retire', RetireAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.retire');

Route::post('/agents/{agent}/start', StartAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.start');

Route::post('/agents/{agent}/launch-outcome/dismiss', DismissLaunchOutcomeController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->whereUlid('agent')
    ->name('agents.launch-outcome.dismiss');

Route::middleware(['web', 'auth', 'journal.user'])
    ->prefix('/agents/switches/{switch}')
    ->name('agents.switch.')
    ->whereUlid('switch')
    ->group(function (): void {
        Route::post('/retry', RetryDriverSwitchController::class)->name('retry');
        Route::post('/recheck', RecheckDriverSwitchController::class)->name('recheck');
    });

Route::post('/agents/sessions/{session}/continue', ContinueStartController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.continue');

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('agents.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Calls\RetireAgentController::class)->name('retire');
        $calls->register(Calls\RecordHeartbeatController::class)->name('heartbeat');
    });
