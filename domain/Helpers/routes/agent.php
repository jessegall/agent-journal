<?php

declare(strict_types=1);

use App\Contracts\Domains\ApiRegistrar;
use Domain\Helpers\Http\Controllers\Api\CancelHelperJobController;
use Domain\Helpers\Http\Controllers\Api\ContinueHelperController;
use Domain\Helpers\Http\Controllers\Api\ListHelperNoticesController;
use Domain\Helpers\Http\Controllers\Api\SendHelperController;
use Domain\Helpers\Http\Controllers\Api\StartHelperController;
use Domain\Helpers\Http\Controllers\Api\SteerHelperController;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(StartHelperController::class)->name('helpers.start');
        $calls->register(SendHelperController::class)->name('helpers.send');
        $calls->register(ContinueHelperController::class)->name('helpers.continue');
        $calls->register(SteerHelperController::class)->name('helpers.steer');
        $calls->register(CancelHelperJobController::class)->name('helpers.cancel');
        $calls->register(ListHelperNoticesController::class)->name('helpers.notices');
    });
