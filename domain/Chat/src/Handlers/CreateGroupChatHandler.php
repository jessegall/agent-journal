<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use Domain\Chat\Commands\CreateGroupChat;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Support\ChatMembership;

final readonly class CreateGroupChatHandler extends ChatCommandHandler
{
    public function __construct(private ChatMembership $membership) {}

    /**
     * @throws ChatMembershipRefused
     */
    public function handle(CreateGroupChat $command): string
    {
        return $this->membership->createGroup(
            ActorIdentity::of($command->dispatchedBy()),
            $command->title,
            $command->members(),
        );
    }
}
