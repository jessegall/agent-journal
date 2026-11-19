<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\MessageMissing;
use App\Contracts\CommandHandler;
use Domain\Chat\Commands\UnpinMessage;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\PinnableMessages;

final readonly class UnpinMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private PinnableMessages $pinnable,
    ) {}

    /**
     * @throws MessageMissing
     */
    public function handle(UnpinMessage $command): void
    {
        $this->pinnable->requireIn($command->conversation(), $command->messageId);
        MessagePin::unpinFor(
            ActorIdentity::of($this->actors->actor()),
            $command->conversation(),
            $command->messageId,
        );
    }
}
