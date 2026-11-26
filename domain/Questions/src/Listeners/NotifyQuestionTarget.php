<?php

declare(strict_types=1);

namespace Domain\Questions\Listeners;

use App\Contracts\Events\Listener;
use App\Notifications\Data\NotificationTarget;
use App\Notifications\Enums\NotificationSourceType;
use App\Notifications\NotificationDelivery;
use Domain\Questions\Events\QuestionAsked;
use Domain\Questions\Values\QuestionNotificationKeys;

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
