<?php

declare(strict_types=1);

use App\Drivers\Enums\HookDriver;
use App\Http\Controllers\Hooks\BypassReportController;
use App\Http\Controllers\Hooks\HookController;
use App\Http\Controllers\Hooks\StackInspectionController;
use App\Http\Middleware\Agents\AuthenticateAgent;
use Illuminate\Support\Facades\Route;

Route::post('/hooks/bypasses', BypassReportController::class)
    ->middleware(AuthenticateAgent::class)
    ->name('hooks.bypasses');

Route::post('/hooks/{driver}', HookController::class)
    ->whereIn('driver', array_column(HookDriver::cases(), 'value'))
    ->middleware(AuthenticateAgent::class)
    ->name('hooks.answer');

Route::middleware(['web', 'auth'])
    ->get('/hooks/stacks/{agentId}/{sessionId}', StackInspectionController::class)
    ->whereUlid(['agentId', 'sessionId'])
    ->name('hooks.stacks.show');
