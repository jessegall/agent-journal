<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\AddChatParticipant;

use App\Support\ActorIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Support\ChatMembership;

final readonly class AddChatParticipantHandler extends ChatCommandHandler
{
    public function __construct(private ChatMembership $membership) {}

    /**
     * @throws ChatMembershipRefused
     */
    public function handle(AddChatParticipantCommand $command): void
    {
        $this->membership->add(ActorIdentity::of($command->dispatchedBy()), $command->inboxId, $command->participantIdentity());
    }
}
