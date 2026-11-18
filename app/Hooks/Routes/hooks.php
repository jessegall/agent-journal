<?php

declare(strict_types=1);

use App\Agents\Http\Middleware\AuthenticateAgent;
use App\Hooks\Enums\HookProgram;
use App\Hooks\Http\BypassReportController;
use App\Hooks\Http\HookController;
use App\Hooks\Http\StackInspectionController;
use Illuminate\Support\Facades\Route;

Route::post('/hooks/bypasses', BypassReportController::class)
    ->middleware(AuthenticateAgent::class)
    ->name('hooks.bypasses');

Route::post('/hooks/{program}', HookController::class)
    ->whereIn('program', array_column(HookProgram::cases(), 'value'))
    ->middleware(AuthenticateAgent::class)
    ->name('hooks.answer');

Route::middleware(['web', 'auth'])
    ->get('/hooks/stacks/{agentId}/{sessionId}', StackInspectionController::class)
    ->whereNumber(['agentId', 'sessionId'])
    ->name('hooks.stacks.show');
