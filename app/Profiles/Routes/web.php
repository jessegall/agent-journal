<?php

declare(strict_types=1);

use App\Drivers\Enums\HookDriver;
use App\Http\Controllers\Profiles\DriverSwitchStageController;
use App\Http\Controllers\Profiles\EligibleAccountsController;
use App\Http\Controllers\Profiles\StartProfileMainController;
use App\Http\Controllers\Profiles\SwitchAgentDriverController;
use Illuminate\Support\Facades\Route;

Route::post('/profiles/{profile}/start-main', StartProfileMainController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('profiles.start-main');

Route::get('/profiles/eligible-accounts/{driver}', EligibleAccountsController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->whereIn('driver', array_map(fn (HookDriver $driver) => $driver->value, HookDriver::cases()))
    ->name('profiles.eligible-accounts');

Route::post('/profiles/{profile}/switch', SwitchAgentDriverController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->name('profiles.switch');

Route::get('/profiles/switches/{requestId}', DriverSwitchStageController::class)
    ->middleware(['web', 'auth', 'journal.user'])
    ->whereUlid('requestId')
    ->name('profiles.switch-stage');
