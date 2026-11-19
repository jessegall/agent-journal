<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\MessageMissing;
use App\Contracts\CommandHandler;
use Domain\Chat\Commands\PinMessage;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\PinnableMessages;

final readonly class PinMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private PinnableMessages $pinnable,
    ) {}

    /**
     * @throws MessageMissing
     */
    public function handle(PinMessage $command): void
    {
        $this->pinnable->requireIn($command->conversation(), $command->messageId);
        MessagePin::pinFor(
            ActorIdentity::of($this->actors->actor()),
            $command->conversation(),
            $command->messageId,
        );
    }
}
