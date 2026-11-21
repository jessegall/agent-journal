<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Scripts\Http\Controllers;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('profiles.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Controllers\ShowProfileDraftController::class)->name('draft.show');
        $calls->register(Controllers\SaveProfileDraftController::class)->name('draft.save');
        $calls->register(Controllers\CheckProfileScriptController::class)->name('draft.check');
        $calls->register(Controllers\ReadProfileLanguageController::class)->name('language');
        $calls->register(Controllers\ShowProfileRunController::class)->name('runs.show');
    });
