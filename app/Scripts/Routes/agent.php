<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Http\Controllers\Scripts;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('profiles.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Scripts\ShowProfileDraftController::class)->name('draft.show');
        $calls->register(Scripts\SaveProfileDraftController::class)->name('draft.save');
        $calls->register(Scripts\CheckProfileScriptController::class)->name('draft.check');
        $calls->register(Scripts\ReadProfileLanguageController::class)->name('language');
        $calls->register(Scripts\ShowProfileRunController::class)->name('runs.show');
    });
