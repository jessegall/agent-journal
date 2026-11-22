<?php

declare(strict_types=1);

namespace App\Communication\Commands\DismissMessage;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\DeclineChatQuestion\DeclineChatQuestionCommand;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Enums\DismissalType;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Message;
use App\Communication\Policies\MessageAdministrationPolicy;
use App\Communication\Support\ChatPosting;
use App\Communication\Support\InboxMembership;
use App\Communication\Support\MessageClaims;
use App\Contracts\CommandHandler;
use App\Operations\Enums\AccessType;
use Carbon\CarbonImmutable;

final readonly class DismissMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private InboxResolver $inboxes,
        private MessageClaims $claims,
        private ChatPosting $chats,
    ) {}

    /**
     * @throws MessageMissing
     * @throws MessageStateConflict
     */
    public function handle(DismissMessageCommand $command): void
    {
        $actor = $command->dispatchedBy();
        $dismissedBy = ActorIdentity::of($actor);

        $message = Message::query()->acrossInboxes()->whereKey($command->messageId)->lockForUpdate()->firstOr(
            fn () => throw MessageMissing::forId($command->messageId),
        );

        if ($message->isChat() && ! $message->isWrittenBy($dismissedBy)) {
            $decline = new DeclineChatQuestionCommand($message->id, $command->reason);
            $this->chats->decline($decline->withDispatcher($actor));

            return;
        }

        $type = $this->dismissalBy($message, $actor);
        $message->dismissBy($dismissedBy, $type, $command->reason, CarbonImmutable::now());
        $this->claims->releaseAny($message);
    }

    /**
     * How the caller may close the message: its author withdraws it, a member of its destination declines it, and
     * the owner's inspection cancels it. Anyone else is told it is missing.
     *
     * @throws MessageMissing
     */
    private function dismissalBy(Message $message, Actor $actor): DismissalType
    {
        if ($message->isWrittenBy(ActorIdentity::of($actor))) {
            return DismissalType::Withdrawn;
        }

        $destination = $this->inboxes->resolve($message->destination_inbox_id);
        $members = $this->inboxes->membersOf($destination);

        if (array_any($members, fn (InboxMembership $member) => $member->actor->isSameAs(ActorIdentity::of($actor)))) {
            return DismissalType::Declined;
        }

        if ($actor->actorType()->isAgent()) {
            throw MessageMissing::forId($message->id);
        }

        $this->authorizer->authorize(MessageAdministrationPolicy::class, Message::class, AccessType::Read);

        return DismissalType::Cancelled;
    }
}
