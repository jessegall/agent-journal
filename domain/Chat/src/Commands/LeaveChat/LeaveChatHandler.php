<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\LeaveChat;

use App\Support\ActorIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Support\ChatMembership;

final readonly class LeaveChatHandler extends ChatCommandHandler
{
    public function __construct(private ChatMembership $membership) {}

    /**
     * @throws ChatMembershipRefused
     */
    public function handle(LeaveChatCommand $command): void
    {
        $this->membership->leave(ActorIdentity::of($command->dispatchedBy()), $command->inboxId);
    }
}
