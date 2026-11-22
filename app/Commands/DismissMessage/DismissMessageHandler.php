<?php

declare(strict_types=1);

namespace App\Commands\DismissMessage;

use App\Commands\DeclineChatQuestion\DeclineChatQuestionCommand;
use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Chat\InboxResolver;
use App\Enums\AccessType;
use App\Enums\DismissalType;
use App\Exceptions\MessageMissing;
use App\Exceptions\MessageStateConflict;
use App\Models\Message;
use App\Policies\MessageAdministrationPolicy;
use App\Support\ActorIdentity;
use App\Support\ChatPosting;
use App\Support\InboxMembership;
use App\Support\MessageClaims;
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
