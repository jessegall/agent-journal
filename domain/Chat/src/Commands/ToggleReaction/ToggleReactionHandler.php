<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\ToggleReaction;

use App\Exceptions\MessageMissing;
use App\Support\ActorIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Models\MessageReaction;
use Domain\Chat\Support\PinnableMessages;

final readonly class ToggleReactionHandler extends ChatCommandHandler
{
    public function __construct(
        private PinnableMessages $readable,
    ) {}

    /**
     * @throws MessageMissing
     */
    public function handle(ToggleReactionCommand $command): bool
    {
        $this->readable->requireIn($command->inboxId, $command->messageId);

        $owner = ActorIdentity::of($command->dispatchedBy());
        $existing = MessageReaction::findFor($owner, $command->inboxId, $command->messageId, $command->emoji);

        if ($existing !== null) {
            $existing->withdraw();

            return false;
        }

        MessageReaction::create($owner, $command->inboxId, $command->messageId, $command->emoji);

        return true;
    }
}
