<?php

declare(strict_types=1);

use App\Http\Controllers\Communication\MarkAllNotificationsReadController;
use App\Http\Controllers\Communication\MarkNotificationReadController;
use App\Http\Controllers\Communication\MarkQuestionNotificationReadController;
use App\Http\Controllers\Communication\MarkTargetNotificationReadController;
use App\Http\Controllers\Communication\SendMessageController;
use App\Support\CallRoutes;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('communication.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(App\Http\Controllers\Calls\SendMessageController::class)->name('send');
        $calls->register(App\Http\Controllers\Calls\ReadMessageController::class)->name('read');
        $calls->register(App\Http\Controllers\Calls\ReadUnreadMessagesController::class)->name('read-unread');
    });

Route::middleware(['web', 'auth', 'journal.user'])
    ->prefix('communication')
    ->name('communication.')
    ->group(function (): void {
        Route::post('send', SendMessageController::class)->name('send');
        Route::post('notifications/read', MarkNotificationReadController::class)->name('notifications.read');

        Route::post('notifications/read-all', MarkAllNotificationsReadController::class)
            ->name('notifications.read-all');

        Route::post('notifications/read-question', MarkQuestionNotificationReadController::class)
            ->name('notifications.read-question');

        Route::post('notifications/read-target', MarkTargetNotificationReadController::class)
            ->name('notifications.read-target');
    });
