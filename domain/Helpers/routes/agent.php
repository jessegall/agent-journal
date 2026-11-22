<?php

declare(strict_types=1);

use App\Contracts\CallRegistrar;
use Domain\Helpers\Http\Controllers\Calls;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRegistrar::class);
        $calls->register(Calls\StartHelperController::class)->name('helpers.start');
        $calls->register(Calls\SendHelperController::class)->name('helpers.send');
        $calls->register(Calls\ContinueHelperController::class)->name('helpers.continue');
        $calls->register(Calls\SteerHelperController::class)->name('helpers.steer');
        $calls->register(Calls\CancelHelperJobController::class)->name('helpers.cancel');
        $calls->register(Calls\ListHelperNoticesController::class)->name('helpers.notices');
    });
