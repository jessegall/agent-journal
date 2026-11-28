<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\PinMessage;

use App\Exceptions\MessageMissing;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Resolvers\Support\MessagePinReader;

final readonly class PinMessageHandler extends ChatCommandHandler
{
    public function __construct(
        private MessagePinReader $pinnable,
    ) {}

    /**
     * @throws MessageMissing
     */
    public function handle(PinMessageCommand $command): void
    {
        $this->pinnable->requireIn($command->inboxId, $command->messageId);

        MessagePin::create(
            $command->dispatchedBy(),
            $command->inboxId,
            $command->messageId,
        );
    }
}
