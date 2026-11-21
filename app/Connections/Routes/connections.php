<?php

declare(strict_types=1);

use App\Connections\Http\Controllers\InstallScriptController;
use App\Connections\Http\Controllers\IssueProjectInvitationController;
use App\Connections\Http\Controllers\RecoverBindingController;
use App\Connections\Http\Controllers\RedeemProjectInvitationController;
use App\Connections\Http\Controllers\RevokeProjectBindingController;
use App\Connections\Http\Controllers\RevokeProjectInvitationController;
use Illuminate\Support\Facades\Route;

Route::get('/install/{ticket}', InstallScriptController::class)->name('connections.install');

Route::post('/api/project-connections/redeem', RedeemProjectInvitationController::class)
    ->middleware('throttle:10,1')
    ->name('connections.redeem');

Route::post('/api/project-connections/recover', RecoverBindingController::class)
    ->middleware('throttle:30,1')
    ->name('connections.recover');

Route::middleware(['web', 'auth', 'journal.user', 'throttle:20,1'])
    ->prefix('/settings/project-connections')
    ->name('connections.')
    ->group(function (): void {
        Route::post('/invitations', IssueProjectInvitationController::class)->name('invitations.issue');
        Route::delete('/invitations/{invitation}', RevokeProjectInvitationController::class)
            ->whereUlid('invitation')
            ->name('invitations.revoke');
        Route::delete('/bindings/{binding}', RevokeProjectBindingController::class)
            ->whereUlid('binding')
            ->name('bindings.revoke');
    });
