<?php

declare(strict_types=1);

use App\Enums\Projects\HostRouteRole;
use App\Http\Controllers\ApproveDeviceGrantController;
use App\Http\Controllers\AssignBindingEnvironmentController;
use App\Http\Controllers\BindingPresenceController;
use App\Http\Controllers\BindingRuntimeController;
use App\Http\Controllers\BindingRuntimeStopController;
use App\Http\Controllers\BindingStatusController;
use App\Http\Controllers\Calls\CancelProjectCommandController;
use App\Http\Controllers\Calls\ReadProjectCommandStatusController;
use App\Http\Controllers\Calls\RunProjectCommandController;
use App\Http\Controllers\DeviceCommandController;
use App\Http\Controllers\DeviceGrantController;
use App\Http\Controllers\InstallScriptController;
use App\Http\Controllers\IssueProjectInvitationController;
use App\Http\Controllers\RecoverBindingController;
use App\Http\Controllers\RedeemProjectInvitationController;
use App\Http\Controllers\RevokeDeviceGrantController;
use App\Http\Controllers\RevokeProjectBindingController;
use App\Http\Controllers\RevokeProjectBindingsController;
use App\Http\Controllers\RevokeProjectInvitationController;
use App\Http\Controllers\RuntimeLeaseController;
use App\Http\Middleware\AuthenticateDeviceGrant;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

// A connected project's relay speaks the remote-project protocol and needs no runtime to report it is present.
Route::post('/host/bindings/{binding}/presence', BindingPresenceController::class)
    ->middleware('journal.host:'.HostRouteRole::Relay->value)
    ->whereUlid('binding')
    ->name('agents.host.bindings.presence');

// journal status reads what the journal holds of the binding, signed like a report, and records nothing.
Route::post('/host/bindings/{binding}/status', BindingStatusController::class)
    ->middleware('journal.host:'.HostRouteRole::Relay->value)
    ->whereUlid('binding')
    ->name('agents.host.bindings.status');

Route::post('/host/bindings/{binding}/runtimes', BindingRuntimeController::class)
    ->middleware('journal.host:'.HostRouteRole::Relay->value)
    ->whereUlid('binding')
    ->name('agents.host.bindings.runtimes');

Route::post('/host/bindings/{binding}/runtimes/{runtime}/lease', RuntimeLeaseController::class)
    ->middleware('journal.host:'.HostRouteRole::Relay->value)
    ->whereUlid(['binding', 'runtime'])
    ->name('connections.runtimes.lease');

Route::post('/host/bindings/{binding}/runtimes/{runtime}/stopped', BindingRuntimeStopController::class)
    ->middleware('journal.host:'.HostRouteRole::Relay->value)
    ->whereUlid(['binding', 'runtime'])
    ->name('connections.runtimes.stopped');

Route::get('/install/{ticket}', InstallScriptController::class)->name('connections.install');

Route::post('/api/project-connections/redeem', RedeemProjectInvitationController::class)
    ->middleware('throttle:10,1')
    ->name('connections.redeem');

// A connected machine's journal verbs, signed with the calling start's own token (the agent call envelope).
Route::middleware('journal.agent')->name('connections.commands.')->group(function (): void {
    $calls = Container::getInstance()->make(CallRoutes::class);
    $calls->register(RunProjectCommandController::class)->name('run');
    $calls->register(CancelProjectCommandController::class)->name('cancel');
    $calls->register(ReadProjectCommandStatusController::class)->name('status');
});

Route::post('/api/project-commands/device', DeviceCommandController::class)
    ->middleware(['throttle:60,1', AuthenticateDeviceGrant::class])
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
    ->prefix('/project-connections')
    ->name('connections.')
    ->group(function (): void {
        Route::post('/invitations', IssueProjectInvitationController::class)->name('invitations.issue');

        Route::delete('/invitations/{invitation}', RevokeProjectInvitationController::class)
            ->whereUlid('invitation')
            ->name('invitations.revoke');

        Route::post('/devices/{code}/approve', ApproveDeviceGrantController::class)
            ->where('userCode', '[A-Za-z0-9-]+')
            ->name('devices.approve');

        Route::delete('/devices/{grant}', RevokeDeviceGrantController::class)
            ->whereUlid('grant')
            ->name('devices.revoke');

        Route::post('/bindings/revoke', RevokeProjectBindingsController::class)->name('bindings.revoke-chosen');

        Route::put('/bindings/{binding}/environment/{environment}', AssignBindingEnvironmentController::class)
            ->whereUlid(['binding', 'environment'])
            ->name('bindings.environment');

        Route::delete('/bindings/{binding}', RevokeProjectBindingController::class)
            ->whereUlid('binding')
            ->name('bindings.revoke');
    });
