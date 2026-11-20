<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\MessageMissing;
use Domain\Chat\Commands\UnpinMessage;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\PinnableMessages;

final readonly class UnpinMessageHandler extends ChatCommandHandler
{
    public function __construct(
        private PinnableMessages $pinnable,
    ) {}

    /**
     * @throws MessageMissing
     */
    public function handle(UnpinMessage $command): void
    {
        $this->pinnable->requireIn($command->conversation(), $command->messageId);
        MessagePin::unpinFor(
            ActorIdentity::of($command->dispatchedBy()),
            $command->conversation(),
            $command->messageId,
        );
    }
}
