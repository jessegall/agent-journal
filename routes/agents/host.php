<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\Host\ProjectReadReportController;
use App\Http\Controllers\Agents\Host\WorkspaceReadController;
use App\Http\Controllers\Hosts\AnswerOrderController;
use App\Http\Controllers\Hosts\ClaimOrdersController;
use App\Http\Controllers\Hosts\HeartbeatController;
use App\Http\Controllers\Hosts\InventoryController;
use App\Http\Controllers\Hosts\PrivateValueController;
use App\Http\Controllers\Hosts\ProcessOutputController;
use App\Http\Controllers\Hosts\ProcessReportController;
use App\Projects\Enums\HostRouteRole;
use Illuminate\Support\Facades\Route;

// The work routes enrolled hosts speak with protocol 1 and a connected project's relay with protocol 2, scoped to its
// live binding.
Route::prefix('host')->middleware('journal.host:'.HostRouteRole::Shared->value)->name('agents.host.')->group(function (): void {
    Route::post('/reports/project-reads/{read}', ProjectReadReportController::class)->name('reports.project-reads');
    Route::get('/workspace-reads', [WorkspaceReadController::class, 'index'])->name('workspace-reads.pending');
    Route::post('/workspace-reads/{reference}', WorkspaceReadController::class)->name('workspace-reads.report');
    Route::post('/orders/claim', ClaimOrdersController::class)->name('orders.claim');
    Route::post('/orders/{order}', AnswerOrderController::class)->name('orders.answer');
    Route::post('/private-values/{submission}', PrivateValueController::class)->name('private-values.pull');
    Route::post('/processes/{process}/output', ProcessOutputController::class)->name('processes.output');
    Route::post('/processes/{process}', ProcessReportController::class)->name('processes.report');
    Route::post('/inventory', InventoryController::class)->name('inventory');
    Route::post('/heartbeat', HeartbeatController::class)->name('heartbeat');
});
