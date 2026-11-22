<?php

declare(strict_types=1);

use App\Http\Controllers\Calls\AddLinkController;
use App\Http\Controllers\Calls\RemoveLinkController;
use App\Http\Controllers\Links\LinkRecordsController;
use App\Http\Controllers\Links\UnlinkRecordsController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('links.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(AddLinkController::class)->name('add');
        $calls->register(RemoveLinkController::class)->name('remove');
    });

Route::middleware(['web', 'auth', 'journal.user'])->prefix('links')->name('links.')->group(function (): void {
    Route::post('add', LinkRecordsController::class)->name('add');
    Route::post('remove', UnlinkRecordsController::class)->name('remove');
});
