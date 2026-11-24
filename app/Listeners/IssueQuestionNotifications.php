<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Events\Listener;
use App\Data\Notifications\NotificationTarget;
use App\Enums\NotificationSourceType;
use App\Events\Messages\ChatMessageAccepted;
use App\Events\Messages\MessageAnswerRequired;
use App\Events\Messages\MessageSent;
use App\Models\Messages\Message;
use App\Resolvers\QuestionNotificationTarget;
use App\Support\ActorIdentity;
use App\Support\NotificationDelivery;

/**
 * Gives each actor seated at a question's destination one receipt of it, in the transaction of the command that
 * made it wait, so a rolled-back command leaves none. The sender gets none, and a message that does not wait gets
 * none: the saved message decides, never the fact alone or who wrote it.
 */
#[InCommandTransaction]
final readonly class IssueQuestionNotifications implements Listener
{
    public function __construct(
        private InboxResolver $inboxes,
        private NotificationDelivery $delivery,
    ) {}

    public function handle(MessageSent|ChatMessageAccepted|MessageAnswerRequired $fact): void
    {
        $message = Message::query()->acrossInboxes()->findOrFail($fact->messageId);

        if (! $message->awaitsReply()) {
            return;
        }

        $this->delivery->deliver(
            QuestionNotificationTarget::occurrenceKey($message->id),
            NotificationSourceType::Question,
            new NotificationTarget(QuestionNotificationTarget::KEY, $message->id),
            $this->recipientsOf($message),
        );
    }

    /**
     * The actors seated at the message's destination now, without its sender; the delivery keeps each actor once.
     *
     * @return list<ActorIdentity>
     */
    private function recipientsOf(Message $message): array
    {
        $recipients = [];

        foreach ($this->inboxes->membersOf($this->inboxes->resolve($message->destination_inbox_id)) as $membership) {
            if ($message->isWrittenBy($membership->actor)) {
                continue;
            }

            $recipients[] = $membership->actor;
        }

        return $recipients;
    }
}
