<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CloseChat;

use App\Actors\Support\ActorIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Support\ChatMembership;

final readonly class CloseChatHandler extends ChatCommandHandler
{
    public function __construct(private ChatMembership $membership) {}

    /**
     * @throws ChatMembershipRefused
     */
    public function handle(CloseChatCommand $command): void
    {
        $this->membership->close(ActorIdentity::of($command->dispatchedBy()), $command->inboxId);
    }
}
