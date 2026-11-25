<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\CancelSessionStartController;
use App\Http\Controllers\Agents\CheckStartStatusController;
use App\Http\Controllers\Agents\ContinueStartController;
use App\Http\Controllers\Agents\DismissSessionStartOutcomeController;
use App\Http\Controllers\Agents\InterruptAgentController;
use App\Http\Controllers\Agents\RecheckDriverSwitchController;
use App\Http\Controllers\Agents\RetireAgentController;
use App\Http\Controllers\Agents\RetryDriverSwitchController;
use App\Http\Controllers\Agents\StartAgentController;
use App\Http\Controllers\Agents\StopAgentController;
use App\Http\Controllers\Calls\RecordHeartbeatController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::post('/agents/retire', RetireAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.retire');

Route::post('/agents/{agent}/start', StartAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.start');

Route::post('/agents/{agent}/stop', StopAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->whereUlid('agent')
    ->name('agents.stop');

Route::post('/agents/{agent}/interrupt', InterruptAgentController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->whereUlid('agent')
    ->name('agents.interrupt');

Route::post('/agents/{agent}/launch-outcome/dismiss', DismissSessionStartOutcomeController::class)
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

Route::post('/agents/{agent}/sessions/{session}/cancel-launch', CancelSessionStartController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->whereUlid(['agent', 'session'])
    ->name('agents.cancel-launch');

Route::post('/agents/{agent}/sessions/{session}/check-start', CheckStartStatusController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->whereUlid(['agent', 'session'])
    ->name('agents.check-start');

Route::post('/agents/sessions/{session}/continue', ContinueStartController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('agents.continue');

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('agents.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(App\Http\Controllers\Calls\RetireAgentController::class)->name('retire');
        $calls->register(RecordHeartbeatController::class)->name('heartbeat');
    });
