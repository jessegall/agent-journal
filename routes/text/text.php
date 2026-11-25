<?php

declare(strict_types=1);

use App\Http\Controllers\Api\ListTextSectionsController;
use App\Http\Controllers\Api\ReadTextVersionController;
use App\Http\Controllers\Text\ReadTextController;
use App\Http\Controllers\Text\TextSectionsController;
use App\Http\Controllers\Text\TextVersionController;
use App\Support\ApiRegistrar;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('text.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(ReadTextVersionController::class)->name('version');
        $calls->register(ListTextSectionsController::class)->name('sections');
        $calls->register(App\Http\Controllers\Api\ReadTextController::class)->name('read');
    });

Route::middleware(['web', 'auth', 'journal.user'])->prefix('text')->name('text.')->group(function (): void {
    Route::get('version', TextVersionController::class)->name('version');
    Route::get('sections', TextSectionsController::class)->name('sections');
    Route::get('read', ReadTextController::class)->name('read');
});
