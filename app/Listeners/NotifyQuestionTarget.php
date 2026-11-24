<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Enums\NotificationSourceType;
use App\Events\Questions\QuestionAsked;
use App\Support\QuestionNotificationKeys;
use App\Data\Notifications\NotificationTarget;
use App\Support\NotificationDelivery;

/**
 * A question asked of an actor becomes one notification for that actor alone.
 */
final readonly class NotifyQuestionTarget implements Listener
{
    public function __construct(private NotificationDelivery $delivery) {}

    public function handle(QuestionAsked $event): void
    {
        $this->delivery->deliver(
            QuestionNotificationKeys::occurrenceKey($event->questionId),
            NotificationSourceType::Question,
            new NotificationTarget(QuestionNotificationKeys::TARGET, $event->questionId),
            [$event->target],
        );
    }
}
