<?php

declare(strict_types=1);

use App\Connections\Http\Controllers\ApproveDeviceGrantController;
use App\Connections\Http\Controllers\CancelProjectCommandController;
use App\Connections\Http\Controllers\DeviceCommandController;
use App\Connections\Http\Controllers\DeviceGrantController;
use App\Connections\Http\Controllers\InstallScriptController;
use App\Connections\Http\Controllers\ProjectCommandController;
use App\Connections\Http\Controllers\IssueProjectInvitationController;
use App\Connections\Http\Controllers\RecoverBindingController;
use App\Connections\Http\Controllers\RedeemProjectInvitationController;
use App\Connections\Http\Controllers\RevokeDeviceGrantController;
use App\Connections\Http\Controllers\RevokeProjectBindingController;
use App\Connections\Http\Controllers\RevokeProjectInvitationController;
use App\Agents\Enums\HostProtocolVersion;
use App\Connections\Http\Controllers\BindingPresenceController;
use App\Connections\Http\Controllers\BindingRuntimeController;
use App\Connections\Http\Controllers\RuntimeLeaseController;
use App\Connections\Http\Controllers\WorktreeDeliveryController;
use Illuminate\Support\Facades\Route;

// A connected project's relay speaks the remote-project protocol and needs no runtime to report it is present.
Route::post('/host/bindings/{binding}/presence', BindingPresenceController::class)
    ->middleware('journal.host:'.HostProtocolVersion::RemoteProject->value)
    ->whereUlid('binding')
    ->name('agents.host.bindings.presence');
Route::post('/host/bindings/{binding}/runtimes', BindingRuntimeController::class)
    ->middleware('journal.host:'.HostProtocolVersion::RemoteProject->value)
    ->whereUlid('binding')
    ->name('agents.host.bindings.runtimes');

Route::post('/host/bindings/{binding}/runtimes/{runtime}/lease', RuntimeLeaseController::class)
    ->middleware('journal.host:'.HostProtocolVersion::RemoteProject->value)
    ->whereUlid(['binding', 'runtime'])
    ->name('connections.runtimes.lease');

Route::post('/host/deliveries', WorktreeDeliveryController::class)
    ->middleware('journal.host:'.HostProtocolVersion::RemoteProject->value)
    ->name('connections.deliveries.submit');

Route::get('/install/{ticket}', InstallScriptController::class)->name('connections.install');

Route::post('/api/project-connections/redeem', RedeemProjectInvitationController::class)
    ->middleware('throttle:10,1')
    ->name('connections.redeem');

// A connected machine's journal verbs, signed with the calling start's own token (the agent call envelope).
Route::middleware('journal.agent')->group(function (): void {
    Route::post('/api/project-commands', ProjectCommandController::class)->name('connections.commands.run');
    Route::delete('/api/project-commands/{requestId}', CancelProjectCommandController::class)
        ->where('requestId', '[A-Za-z0-9_-]+')
        ->name('connections.commands.cancel');
});

Route::post('/api/project-commands/device', DeviceCommandController::class)
    ->middleware('throttle:60,1')
    ->name('connections.commands.device');

Route::middleware('throttle:30,1')->prefix('/api/device-grants')->name('connections.device-grants.')
    ->group(function (): void {
        Route::post('/', [DeviceGrantController::class, 'start'])->name('start');
        Route::post('/poll', [DeviceGrantController::class, 'poll'])->name('poll');
    });

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
        Route::post('/devices/{userCode}/approve', ApproveDeviceGrantController::class)
            ->where('userCode', '[A-Za-z0-9-]+')
            ->name('devices.approve');
        Route::delete('/devices/{grant}', RevokeDeviceGrantController::class)->whereUlid('grant')->name('devices.revoke');
        Route::delete('/bindings/{binding}', RevokeProjectBindingController::class)
            ->whereUlid('binding')
            ->name('bindings.revoke');
    });
