<?php

declare(strict_types=1);

use App\Http\Controllers\Hooks\HookController;
use App\Http\Controllers\Hooks\StackInspectionController;
use App\Http\Middleware\Agents\AuthenticateAgent;
use Illuminate\Support\Facades\Route;

Route::post('/hooks/{driver}', HookController::class)
    ->where('driver', '[a-z][a-z0-9-]*')
    ->middleware([AuthenticateAgent::class, 'record.calls:hooks'])
    ->name('hooks.answer');

Route::middleware(['web', 'auth'])
    ->get('/hooks/stacks/{agentId}/{sessionId}', StackInspectionController::class)
    ->whereUlid(['agentId', 'sessionId'])
    ->name('hooks.stacks.show');
