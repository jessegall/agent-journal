<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Http\Controllers\Text\ReadTextController;
use App\Http\Controllers\Text\TextSectionsController;
use App\Http\Controllers\Text\TextVersionController;
use App\Text\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('text.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Calls\ReadTextVersionController::class)->name('version');
        $calls->register(Calls\ListTextSectionsController::class)->name('sections');
        $calls->register(Calls\ReadTextController::class)->name('read');
    });

Route::middleware(['web', 'auth', 'journal.user'])->prefix('text')->name('text.')->group(function (): void {
    Route::get('version', TextVersionController::class)->name('version');
    Route::get('sections', TextSectionsController::class)->name('sections');
    Route::get('read', ReadTextController::class)->name('read');
});
