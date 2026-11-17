<?php

declare(strict_types=1);

use App\Core\Agents\Http\Controllers\RetireAgentController;
use Illuminate\Support\Facades\Route;

Route::post('/agent/agents/retire', RetireAgentController::class)->middleware('journal.agent')->name('agents.agent.retire');

Route::post('/agents/retire', RetireAgentController::class)->middleware(['web', 'auth', 'journal.user'])->name('agents.retire');
