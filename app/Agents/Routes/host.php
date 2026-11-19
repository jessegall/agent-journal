<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\Host\ActivityReportController;
use App\Http\Controllers\Agents\Host\ClaimStartController;
use App\Http\Controllers\Agents\Host\ClaimRequestsController;
use App\Http\Controllers\Agents\Host\ExitReportController;
use App\Http\Controllers\Agents\Host\HeartbeatReportController;
use App\Http\Controllers\Agents\Host\LaunchGrantController;
use App\Http\Controllers\Agents\Host\OpenMainRuntimeController;
use App\Http\Controllers\Agents\Host\ReconcileStartsController;
use App\Http\Controllers\Agents\Host\ReportFailureController;
use App\Http\Controllers\Agents\Host\ReportRunningController;
use App\Http\Controllers\Agents\Host\ReportStoppedController;
use App\Http\Controllers\Agents\Host\RequestReportController;
use App\Http\Controllers\Agents\Host\TurnReportController;
use Illuminate\Support\Facades\Route;

Route::prefix('host')->middleware('journal.host')->name('agents.host.')->group(function (): void {
    Route::post('/claim', ClaimRequestsController::class)->name('claim');
    Route::post('/runtimes', OpenMainRuntimeController::class)->name('runtimes.open');
    Route::post('/runtimes/{runtime}/launch', LaunchGrantController::class)->name('launch');
    Route::post('/reports/activity', ActivityReportController::class)->name('reports.activity');
    Route::post('/reports/request', RequestReportController::class)->name('reports.request');
    Route::post('/reports/turn', TurnReportController::class)->name('reports.turn');
    Route::post('/reports/heartbeat', HeartbeatReportController::class)->name('reports.heartbeat');
    Route::post('/reports/exit', ExitReportController::class)->name('reports.exit');
    Route::post('/starts/claim', ClaimStartController::class)->name('starts.claim');
    Route::get('/starts', [ReconcileStartsController::class, 'index'])->name('starts.unresolved');
    Route::post('/starts/reconcile', ReconcileStartsController::class)->name('starts.reconcile');
    Route::post('/starts/{start}/running', ReportRunningController::class)->name('starts.running');
    Route::post('/starts/{start}/stopped', ReportStoppedController::class)->name('starts.stopped');
    Route::post('/starts/{start}/failure', ReportFailureController::class)->name('starts.failure');
});
