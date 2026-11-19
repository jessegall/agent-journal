<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\MessageMissing;
use App\Contracts\CommandHandler;
use Domain\Chat\Commands\UnpinMessage;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\PinnableMessages;

final readonly class UnpinMessageHandler implements CommandHandler
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
