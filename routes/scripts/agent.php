<?php

declare(strict_types=1);

use App\Http\Controllers\CheckProfileScriptController;
use App\Http\Controllers\ReadProfileLanguageController;
use App\Http\Controllers\SaveProfileDraftController;
use App\Http\Controllers\ShowProfileDraftController;
use App\Http\Controllers\ShowProfileRunController;
use App\Support\ApiRegistrar;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('profiles.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(ShowProfileDraftController::class)->name('draft.show');
        $calls->register(SaveProfileDraftController::class)->name('draft.save');
        $calls->register(CheckProfileScriptController::class)->name('draft.check');
        $calls->register(ReadProfileLanguageController::class)->name('language');
        $calls->register(ShowProfileRunController::class)->name('runs.show');
    });
