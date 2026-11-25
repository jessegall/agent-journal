<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Data\Notifications\NotificationTarget;
use App\Enums\NotificationSourceType;
use App\Events\Questions\QuestionAsked;
use App\Support\NotificationDelivery;
use App\Support\QuestionNotificationKeys;

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
            new NotificationTarget(QuestionNotificationKeys::target(), $event->questionId),
            [$event->target],
        );
    }
}
