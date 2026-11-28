<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\Host\WorkspaceReadController;
use App\Projects\Enums\HostRouteRole;
use Illuminate\Support\Facades\Route;

// The work routes enrolled hosts speak with protocol 1 and a connected project's relay with protocol 2, scoped to its
// live binding.
Route::prefix('host')->middleware(['journal.host:'.HostRouteRole::Shared->value, 'record.calls:host'])
    ->name('agents.host.')->group(function (): void {
        Route::get('/workspace-reads', [WorkspaceReadController::class, 'index'])->name('workspace-reads.pending');
        Route::post('/workspace-reads/{reference}', WorkspaceReadController::class)->name('workspace-reads.report');
    });
