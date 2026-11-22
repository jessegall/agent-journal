<?php

declare(strict_types=1);

use App\AgentRequests\Support\CallRoutes;
use App\Communication\Http\Controllers\Calls;
use App\Http\Controllers\Communication\AskMessageController;
use App\Http\Controllers\Communication\DismissMessageController;
use App\Http\Controllers\Communication\InboxCountsController;
use App\Http\Controllers\Communication\InboxHistoryController;
use App\Http\Controllers\Communication\MarkAllNotificationsReadController;
use App\Http\Controllers\Communication\MarkNotificationReadController;
use App\Http\Controllers\Communication\MarkQuestionNotificationReadController;
use App\Http\Controllers\Communication\MarkTargetNotificationReadController;
use App\Http\Controllers\Communication\MessagesBetweenController;
use App\Http\Controllers\Communication\NotificationChangesController;
use App\Http\Controllers\Communication\NotificationPageController;
use App\Http\Controllers\Communication\ReadMessagesController;
use App\Http\Controllers\Communication\ReleaseMessageClaimController;
use App\Http\Controllers\Communication\ReplyToMessageController;
use App\Http\Controllers\Communication\RequireMessageAnswerController;
use App\Http\Controllers\Communication\SendMessageController;
use App\Http\Controllers\Communication\ShowMessageController;
use App\Http\Controllers\Communication\TakeNextMessagesController;
use App\Http\Controllers\Communication\WakeStatusController;
use Illuminate\Container\Container;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;

Route::middleware(['journal.agent', SubstituteBindings::class])
    ->prefix('agent')
    ->name('communication.agent.')
    ->group(function (): void {
        $calls = Container::getInstance()->make(CallRoutes::class);
        $calls->register(Calls\SendMessageController::class)->name('send');
        $calls->register(Calls\AskMessageController::class)->name('ask');
        $calls->register(Calls\AskQuestionController::class)->name('question');
        $calls->register(Calls\SelectMessageController::class)->name('select');
        $calls->register(Calls\AnswerMessageController::class)->name('answer');
        $calls->register(Calls\ReplyToMessageController::class)->name('reply');
        $calls->register(Calls\RequireMessageAnswerController::class)->name('require-answer');
        $calls->register(Calls\ReadMessagesController::class)->name('read');
        $calls->register(Calls\TakeNextMessagesController::class)->name('take-next');
        $calls->register(Calls\DismissMessageController::class)->name('dismiss');
        $calls->register(Calls\ReleaseMessageClaimController::class)->name('release-claim');
        $calls->register(Calls\ShowMessageController::class)->name('show');
        $calls->register(Calls\ListMessagesBetweenController::class)->name('between');
        $calls->register(Calls\ReadInboxHistoryController::class)->name('history');
        $calls->register(Calls\CountInboxMessagesController::class)->name('counts');
        $calls->register(Calls\ReadWakeStatusController::class)->name('wake-status');
        $calls->register(Calls\PostChatMessageController::class)->name('chat.post');
        $calls->register(Calls\AskChatQuestionController::class)->name('chat.ask');
        $calls->register(Calls\ReplyInChatController::class)->name('chat.reply');
    });

Route::middleware(['web', 'auth', 'journal.user'])
    ->prefix('communication')
    ->name('communication.')
    ->group(function (): void {
        Route::post('send', SendMessageController::class)->name('send');
        Route::post('ask', AskMessageController::class)->name('ask');
        Route::post('reply', ReplyToMessageController::class)->name('reply');
        Route::post('require-answer', RequireMessageAnswerController::class)->name('require-answer');
        Route::post('read', ReadMessagesController::class)->name('read');
        Route::post('take-next', TakeNextMessagesController::class)->name('take-next');
        Route::post('dismiss', DismissMessageController::class)->name('dismiss');
        Route::post('release-claim', ReleaseMessageClaimController::class)->name('release-claim');
        Route::get('show', ShowMessageController::class)->name('show');
        Route::get('between', MessagesBetweenController::class)->name('between');
        Route::get('history', InboxHistoryController::class)->name('history');
        Route::get('counts', InboxCountsController::class)->name('counts');
        Route::get('wake-status', WakeStatusController::class)->name('wake-status');
        Route::get('notifications', NotificationPageController::class)->name('notifications');
        Route::get('notifications/changes', NotificationChangesController::class)->name('notifications.changes');
        Route::post('notifications/read', MarkNotificationReadController::class)->name('notifications.read');

        Route::post('notifications/read-all', MarkAllNotificationsReadController::class)
            ->name('notifications.read-all');

        Route::post('notifications/read-question', MarkQuestionNotificationReadController::class)
            ->name('notifications.read-question');

        Route::post('notifications/read-target', MarkTargetNotificationReadController::class)
            ->name('notifications.read-target');
    });
