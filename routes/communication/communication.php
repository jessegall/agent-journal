<?php

declare(strict_types=1);

use App\Http\Controllers\Calls\AcknowledgePresentationController;
use App\Http\Controllers\Calls\AnswerChatQuestionController;
use App\Http\Controllers\Calls\AnswerMessageController;
use App\Http\Controllers\Calls\AskChatQuestionController;
use App\Http\Controllers\Calls\AskQuestionController;
use App\Http\Controllers\Calls\ClaimSpeechController;
use App\Http\Controllers\Calls\CountInboxMessagesController;
use App\Http\Controllers\Calls\DeclineChatQuestionController;
use App\Http\Controllers\Calls\ListMessagesBetweenController;
use App\Http\Controllers\Calls\PostChatMessageController;
use App\Http\Controllers\Calls\ReadInboxHistoryController;
use App\Http\Controllers\Calls\ReadWakeStatusController;
use App\Http\Controllers\Calls\ReleaseSpeechController;
use App\Http\Controllers\Calls\ReplyInChatController;
use App\Http\Controllers\Calls\SelectMessageController;
use App\Http\Controllers\Communication\AskMessageController;
use App\Http\Controllers\Communication\DismissMessageController;
use App\Http\Controllers\Communication\InboxCountsController;
use App\Http\Controllers\Communication\InboxHistoryController;
use App\Http\Controllers\Communication\MarkAllNotificationsReadController;
use App\Http\Controllers\Communication\MarkNotificationReadController;
use App\Http\Controllers\Communication\MarkQuestionNotificationReadController;
use App\Http\Controllers\Communication\MarkTargetNotificationReadController;
use App\Http\Controllers\Communication\MessagesBetweenController;
use App\Http\Controllers\Communication\ReadMessagesController;
use App\Http\Controllers\Communication\ReleaseMessageClaimController;
use App\Http\Controllers\Communication\ReplyToMessageController;
use App\Http\Controllers\Communication\RequireMessageAnswerController;
use App\Http\Controllers\Communication\SendMessageController;
use App\Http\Controllers\Communication\ShowMessageController;
use App\Http\Controllers\Communication\TakeNextMessagesController;
use App\Http\Controllers\Communication\WakeStatusController;
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
        $calls->register(App\Http\Controllers\Calls\AskMessageController::class)->name('ask');
        $calls->register(AskQuestionController::class)->name('question');
        $calls->register(SelectMessageController::class)->name('select');
        $calls->register(AnswerMessageController::class)->name('answer');
        $calls->register(App\Http\Controllers\Calls\ReplyToMessageController::class)->name('reply');
        $calls->register(App\Http\Controllers\Calls\RequireMessageAnswerController::class)->name('require-answer');
        $calls->register(App\Http\Controllers\Calls\ReadMessagesController::class)->name('read');
        $calls->register(App\Http\Controllers\Calls\TakeNextMessagesController::class)->name('take-next');
        $calls->register(App\Http\Controllers\Calls\DismissMessageController::class)->name('dismiss');
        $calls->register(App\Http\Controllers\Calls\ReleaseMessageClaimController::class)->name('release-claim');
        $calls->register(App\Http\Controllers\Calls\ShowMessageController::class)->name('show');
        $calls->register(ListMessagesBetweenController::class)->name('between');
        $calls->register(ReadInboxHistoryController::class)->name('history');
        $calls->register(CountInboxMessagesController::class)->name('counts');
        $calls->register(ReadWakeStatusController::class)->name('wake-status');
        $calls->register(PostChatMessageController::class)->name('chat.post');
        $calls->register(AskChatQuestionController::class)->name('chat.ask');
        $calls->register(ReplyInChatController::class)->name('chat.reply');
        $calls->register(ClaimSpeechController::class)->name('chat.claim');
        $calls->register(ReleaseSpeechController::class)->name('chat.release');
        $calls->register(AnswerChatQuestionController::class)->name('chat.answer');
        $calls->register(DeclineChatQuestionController::class)->name('chat.decline');
        $calls->register(AcknowledgePresentationController::class)->name('chat.acknowledge');
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
        Route::post('notifications/read', MarkNotificationReadController::class)->name('notifications.read');

        Route::post('notifications/read-all', MarkAllNotificationsReadController::class)
            ->name('notifications.read-all');

        Route::post('notifications/read-question', MarkQuestionNotificationReadController::class)
            ->name('notifications.read-question');

        Route::post('notifications/read-target', MarkTargetNotificationReadController::class)
            ->name('notifications.read-target');
    });
