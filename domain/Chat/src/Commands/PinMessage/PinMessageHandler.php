<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\PinMessage;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\MessageMissing;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\PinnableMessages;

final readonly class PinMessageHandler extends ChatCommandHandler
{
    public function __construct(
        private PinnableMessages $pinnable,
    ) {}

    /**
     * @throws MessageMissing
     */
    public function handle(PinMessageCommand $command): void
    {
        $this->pinnable->requireIn($command->inboxId, $command->messageId);

        MessagePin::pinFor(
            ActorIdentity::of($command->dispatchedBy()),
            $command->inboxId,
            $command->messageId,
        );
    }
}
