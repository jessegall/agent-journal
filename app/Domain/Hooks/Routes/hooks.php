<?php

declare(strict_types=1);

use App\Domain\Agents\Http\Middleware\AuthenticateAgent;
use App\Domain\Hooks\Http\HookController;
use App\Domain\Hooks\Http\StackInspectionController;
use App\Domain\Hooks\Programs\HookProgram;
use Illuminate\Support\Facades\Route;

Route::post('/hooks/{program}', HookController::class)
    ->whereIn('program', array_column(HookProgram::cases(), 'value'))
    ->middleware(AuthenticateAgent::class)
    ->name('hooks.answer');

Route::middleware(['web', 'auth'])
    ->get('/hooks/stacks/{agentId}/{sessionId}', StackInspectionController::class)
    ->whereNumber(['agentId', 'sessionId'])
    ->name('hooks.stacks.show');
