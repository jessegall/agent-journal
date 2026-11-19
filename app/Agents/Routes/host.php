<?php

declare(strict_types=1);

use App\Http\Controllers\Agents\Host\ActivityReportController;
use App\Http\Controllers\Agents\Host\ClaimRequestsController;
use App\Http\Controllers\Agents\Host\ExitReportController;
use App\Http\Controllers\Agents\Host\HeartbeatReportController;
use App\Http\Controllers\Agents\Host\LaunchGrantController;
use App\Http\Controllers\Agents\Host\OpenMainRuntimeController;
use App\Http\Controllers\Agents\Host\RaiseNavigationController;
use App\Http\Controllers\Agents\Host\RequestReportController;
use App\Http\Controllers\Agents\Host\TurnReportController;
use Illuminate\Support\Facades\Route;

Route::prefix('host')->middleware('journal.host')->name('agents.host.')->group(function (): void {
    Route::post('/claim', ClaimRequestsController::class)->name('claim');
    Route::post('/runtimes', OpenMainRuntimeController::class)->name('runtimes.open');
    Route::post('/runtimes/{runtime}/launch', LaunchGrantController::class)->name('launch');
    Route::post('/runtimes/{runtime}/navigation', RaiseNavigationController::class)->name('navigation.raise');
    Route::post('/reports/activity', ActivityReportController::class)->name('reports.activity');
    Route::post('/reports/request', RequestReportController::class)->name('reports.request');
    Route::post('/reports/turn', TurnReportController::class)->name('reports.turn');
    Route::post('/reports/heartbeat', HeartbeatReportController::class)->name('reports.heartbeat');
    Route::post('/reports/exit', ExitReportController::class)->name('reports.exit');
});
