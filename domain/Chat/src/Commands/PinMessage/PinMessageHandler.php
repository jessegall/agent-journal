<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\PinMessage;

use App\Exceptions\MessageMissing;
use App\Support\ActorIdentity;
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

        MessagePin::create(
            ActorIdentity::of($command->dispatchedBy()),
            $command->inboxId,
            $command->messageId,
        );
    }
}
