<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\CreateGroupChat;

use App\Actors\Support\ActorIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Support\ChatMembership;

final readonly class CreateGroupChatHandler extends ChatCommandHandler
{
    public function __construct(private ChatMembership $membership) {}

    /**
     * @throws ChatMembershipRefused
     */
    public function handle(CreateGroupChatCommand $command): string
    {
        return $this->membership->createGroup(
            ActorIdentity::of($command->dispatchedBy()),
            $command->title,
            $command->members(),
        );
    }
}
