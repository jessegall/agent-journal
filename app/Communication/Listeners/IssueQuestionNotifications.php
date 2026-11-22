<?php

declare(strict_types=1);

namespace App\Communication\Listeners;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Data\NotificationTarget;
use App\Communication\Enums\NotificationSourceType;
use App\Communication\Events\ChatMessageAccepted;
use App\Communication\Events\MessageAnswerRequired;
use App\Communication\Events\MessageSent;
use App\Communication\Models\Message;
use App\Communication\Resolvers\QuestionNotificationTarget;
use App\Communication\Support\NotificationDelivery;
use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;

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

        if (! $message->needsReply()) {
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
