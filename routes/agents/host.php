<?php

declare(strict_types=1);

use App\Enums\Projects\HostRouteRole;
use App\Http\Controllers\Agents\Host\OutputGrantController;
use App\Http\Controllers\Agents\Host\ProjectReadReportController;
use App\Http\Controllers\Agents\Host\ProtectionReportController;
use App\Http\Controllers\Agents\Host\WorkspaceReadController;
use App\Http\Controllers\Hooks\Host\PendingStopChecksController;
use App\Http\Controllers\Hooks\Host\StopConditionResultsController;
use App\Http\Controllers\Hosts\AnswerOrderController;
use App\Http\Controllers\Hosts\ClaimOrdersController;
use App\Http\Controllers\Hosts\HeartbeatController;
use App\Http\Controllers\Hosts\InventoryController;
use App\Http\Controllers\Hosts\PrivateValueController;
use App\Http\Controllers\Hosts\ProcessOutputController;
use App\Http\Controllers\Hosts\ProcessReportController;
use Illuminate\Support\Facades\Route;

// The work routes enrolled hosts speak with protocol 1 and a connected project's relay with protocol 2, scoped to its
// live binding.
Route::prefix('host')->middleware('journal.host:'.HostRouteRole::Shared->value)->name('agents.host.')->group(function (): void {
    Route::post('/reports/project-reads/{read}', ProjectReadReportController::class)->name('reports.project-reads');
    Route::post('/reports/protection', ProtectionReportController::class)->name('reports.protection');
    Route::get('/stop-attempts', PendingStopChecksController::class)->name('stop-attempts.pending');
    Route::post('/stop-attempts/{attempt}/results', StopConditionResultsController::class)->name('stop-attempts.results');
    Route::get('/workspace-reads', [WorkspaceReadController::class, 'index'])->name('workspace-reads.pending');
    Route::post('/workspace-reads/{reference}', WorkspaceReadController::class)->name('workspace-reads.report');
    Route::get('/starts/{start}/outputs', OutputGrantController::class)->name('starts.outputs');
    Route::post('/orders/claim', ClaimOrdersController::class)->name('orders.claim');
    Route::post('/orders/{order}', AnswerOrderController::class)->name('orders.answer');
    Route::post('/private-values/{submission}', PrivateValueController::class)->name('private-values.pull');
    Route::post('/processes/{process}/output', ProcessOutputController::class)->name('processes.output');
    Route::post('/processes/{process}', ProcessReportController::class)->name('processes.report');
    Route::post('/inventory', InventoryController::class)->name('inventory');
    Route::post('/heartbeat', HeartbeatController::class)->name('heartbeat');
});
