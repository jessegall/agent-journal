<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\RecordHeartbeatController;
use App\Http\Controllers\Agents\RetireAgentController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/agents/retire', RetireAgentController::class)->middleware('journal.agent')->name('agents.agent.retire');

Route::post('/agent/heartbeat', RecordHeartbeatController::class)->middleware('journal.agent')->name('agents.agent.heartbeat');

Route::post('/agents/retire', RetireAgentController::class)->middleware(['web', 'auth', 'journal.user'])->name('agents.retire');
