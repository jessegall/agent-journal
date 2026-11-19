<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Http\Controllers\Links\LinkRecordsController;
use App\Http\Controllers\Links\UnlinkRecordsController;
use App\Records\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('links.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Calls\AddLinkController::class)->name('add');
        $calls->register(Calls\RemoveLinkController::class)->name('remove');
    });

Route::middleware(['web', 'auth', 'journal.user'])->prefix('links')->name('links.')->group(function (): void {
    Route::post('add', LinkRecordsController::class)->name('add');
    Route::post('remove', UnlinkRecordsController::class)->name('remove');
});
