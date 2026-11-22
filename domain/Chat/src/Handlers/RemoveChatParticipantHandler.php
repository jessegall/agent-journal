<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Chat\Commands\RemoveChatParticipant;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Support\ChatMembership;

final readonly class RemoveChatParticipantHandler extends ChatCommandHandler
{
    public function __construct(private ChatMembership $membership) {}

    /**
     * @throws ChatMembershipRefused
     */
    public function handle(RemoveChatParticipant $command): void
    {
        $this->membership->remove(ActorIdentity::of($command->dispatchedBy()), $command->inboxId, $command->participantIdentity());
    }
}
