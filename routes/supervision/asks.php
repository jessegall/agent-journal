<?php

declare(strict_types=1);

use App\Http\Controllers\ListAsksController;
use App\Http\Controllers\MakeAskController;
use App\Http\Controllers\ReplyToAskController;
use App\Http\Controllers\ShowAskController;
use App\Http\Controllers\WithdrawAskController;
use App\Support\ApiRegistrar;
use Illuminate\Container\Container;
use Illuminate\Support\Facades\Route;

Route::middleware('journal.agent')
    ->prefix('agent')
    ->name('asks.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(ApiRegistrar::class);
        $calls->register(MakeAskController::class)->name('make');
        $calls->register(ListAsksController::class)->name('list');
        $calls->register(ShowAskController::class)->name('show');
        $calls->register(ReplyToAskController::class)->name('reply');
        $calls->register(WithdrawAskController::class)->name('withdraw');
    });
