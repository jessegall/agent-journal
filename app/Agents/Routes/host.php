<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\Host\ActivityReportController;
use App\Http\Controllers\Agents\Host\ClaimRequestsController;
use App\Http\Controllers\Agents\Host\ClaimStartController;
use App\Http\Controllers\Agents\Host\CleanupReportController;
use App\Http\Controllers\Agents\Host\CombinationsReportController;
use App\Http\Controllers\Agents\Host\ExitReportController;
use App\Http\Controllers\Agents\Host\HeartbeatReportController;
use App\Http\Controllers\Agents\Host\InterruptNavigationController;
use App\Http\Controllers\Agents\Host\OpenMainRuntimeController;
use App\Http\Controllers\Agents\Host\OutputGrantController;
use App\Http\Controllers\Agents\Host\ProtectionReportController;
use App\Http\Controllers\Agents\Host\RaiseNavigationController;
use App\Http\Controllers\Agents\Host\ReconcileStartsController;
use App\Http\Controllers\Agents\Host\ReplayedEntryController;
use App\Http\Controllers\Agents\Host\ReportFailureController;
use App\Http\Controllers\Agents\Host\ReportRunningController;
use App\Http\Controllers\Agents\Host\ReportStoppedController;
use App\Http\Controllers\Agents\Host\RequestReportController;
use App\Http\Controllers\Agents\Host\ScreenReportController;
use App\Http\Controllers\Agents\Host\StaleEntryController;
use App\Http\Controllers\Agents\Host\StartGrantController;
use App\Http\Controllers\Agents\Host\ToolDiscoveryController;
use App\Http\Controllers\Agents\Host\TurnReportController;
use App\Http\Controllers\Agents\Host\UsageReportController;
use App\Http\Controllers\Agents\Host\WorkspaceReadController;
use App\Http\Controllers\Hooks\Host\PendingStopAttemptsController;
use App\Http\Controllers\Hooks\Host\StopResultsController;
use App\Http\Middleware\Agents\LimitUsageReport;
use Illuminate\Support\Facades\Route;

Route::prefix('host')->middleware('journal.host')->name('agents.host.')->group(function (): void {
    Route::post('/claim', ClaimRequestsController::class)->name('claim');
    Route::post('/runtimes', OpenMainRuntimeController::class)->name('runtimes.open');
    Route::post('/runtimes/{runtime}/start', StartGrantController::class)->name('start');
    Route::get('/runtimes/{runtime}/tool-discovery', ToolDiscoveryController::class)->name('runtimes.tool-discovery');
    Route::post('/runtimes/{runtime}/navigation', RaiseNavigationController::class)->name('navigation.raise');

    Route::post('/navigation/{navigation}/interrupt', InterruptNavigationController::class)
        ->name('navigation.interrupt');

    Route::post('/menu-entries/{entry}/replayed', ReplayedEntryController::class)->name('menu-entries.replayed');
    Route::post('/menu-entries/{entry}/stale', StaleEntryController::class)->name('menu-entries.stale');
    Route::post('/reports/activity', ActivityReportController::class)->name('reports.activity');
    Route::post('/reports/request', RequestReportController::class)->name('reports.request');
    Route::post('/reports/turn', TurnReportController::class)->name('reports.turn');

    Route::post('/reports/usage', UsageReportController::class)
        ->middleware(LimitUsageReport::class)
        ->name('reports.usage');

    Route::post('/reports/heartbeat', HeartbeatReportController::class)->name('reports.heartbeat');
    Route::post('/reports/exit', ExitReportController::class)->name('reports.exit');
    Route::post('/reports/screen', ScreenReportController::class)->name('reports.screen');
    Route::post('/reports/protection', ProtectionReportController::class)->name('reports.protection');
    Route::post('/reports/combinations', CombinationsReportController::class)->name('reports.combinations');
    Route::get('/stop-attempts', PendingStopAttemptsController::class)->name('stop-attempts.pending');
    Route::post('/stop-attempts/{attempt}/results', StopResultsController::class)->name('stop-attempts.results');
    Route::post('/starts/claim', ClaimStartController::class)->name('starts.claim');
    Route::get('/starts', [ReconcileStartsController::class, 'index'])->name('starts.unresolved');
    Route::post('/starts/reconcile', ReconcileStartsController::class)->name('starts.reconcile');
    Route::post('/starts/{start}/running', ReportRunningController::class)->name('starts.running');
    Route::post('/starts/{start}/stopped', ReportStoppedController::class)->name('starts.stopped');
    Route::post('/starts/{start}/failure', ReportFailureController::class)->name('starts.failure');
    Route::get('/workspace-reads', [WorkspaceReadController::class, 'index'])->name('workspace-reads.pending');
    Route::post('/workspace-reads/{reference}', WorkspaceReadController::class)->name('workspace-reads.report');
    Route::get('/cleanups', [CleanupReportController::class, 'index'])->name('cleanups.pending');
    Route::post('/cleanups/{session}', CleanupReportController::class)->name('cleanups.report');
    Route::get('/starts/{start}/outputs', OutputGrantController::class)->name('starts.outputs');
});
