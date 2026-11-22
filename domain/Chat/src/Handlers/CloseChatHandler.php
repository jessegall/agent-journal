<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Chat\Commands\CloseChat;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Support\ChatMembership;

final readonly class CloseChatHandler extends ChatCommandHandler
{
    public function __construct(private ChatMembership $membership) {}

    /**
     * @throws ChatMembershipRefused
     */
    public function handle(CloseChat $command): void
    {
        $this->membership->close(ActorIdentity::of($command->dispatchedBy()), $command->inboxId);
    }
}
