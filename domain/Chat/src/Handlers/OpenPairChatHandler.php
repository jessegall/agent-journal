<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\AgentDirectory;
use Domain\Chat\Commands\OpenPairChat;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Support\PairChats;

final readonly class OpenPairChatHandler extends ChatCommandHandler
{
    public function __construct(
        private AgentDirectory $agents,
        private PairChats $pairs,
    ) {}

    public function handle(OpenPairChat $command): string
    {
        $agent = $this->agents->visibleAgent($command->agentId);

        return $this->pairs->open(ActorIdentity::of($command->dispatchedBy()), $agent)->inbox_id;
    }
}
