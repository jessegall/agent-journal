<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\DismissMessage;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\MessageAbility;
use App\Communication\Events\MessageDismissed;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Communication\Support\InboxMembership;
use App\Communication\Support\MessageClaims;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class DismissMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $authorizer,
        private InboxResolver $inboxes,
        private MessageClaims $claims,
        private Dispatcher $events,
    ) {}

    /**
     * @throws MessageMissing
     * @throws MessageStateConflict
     */
    public function handle(DismissMessage $command): void
    {
        $actor = $command->dispatchedBy();
        $message = Message::query()->acrossInboxes()->whereKey($command->messageId)->lockForUpdate()->firstOr(
            fn () => throw MessageMissing::forId($command->messageId),
        );
        $type = $this->dismissalBy($message, $actor);
        $dismissedBy = ActorIdentity::of($actor);
        $message->dismissBy($dismissedBy, $type, $command->reason, CarbonImmutable::now());
        $this->claims->releaseAny($message);
        $this->events->dispatch(new MessageDismissed($message->id, $dismissedBy, $type));
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

        $this->authorizer->authorize(MessagePolicy::class, Message::class, MessageAbility::Inspect);

        return DismissalType::Cancelled;
    }
}
