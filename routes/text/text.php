<?php

declare(strict_types=1);

use App\Http\Controllers\Calls\ListTextSectionsController;
use App\Http\Controllers\Calls\ReadTextVersionController;
use App\Http\Controllers\Text\ReadTextController;
use App\Http\Controllers\Text\TextSectionsController;
use App\Http\Controllers\Text\TextVersionController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('text.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(ReadTextVersionController::class)->name('version');
        $calls->register(ListTextSectionsController::class)->name('sections');
        $calls->register(App\Http\Controllers\Calls\ReadTextController::class)->name('read');
    });

Route::middleware(['web', 'auth', 'journal.user'])->prefix('text')->name('text.')->group(function (): void {
    Route::get('version', TextVersionController::class)->name('version');
    Route::get('sections', TextSectionsController::class)->name('sections');
    Route::get('read', ReadTextController::class)->name('read');
});
