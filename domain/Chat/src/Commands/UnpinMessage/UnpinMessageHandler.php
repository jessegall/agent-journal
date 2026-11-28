<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\UnpinMessage;

use App\Exceptions\MessageMissing;
use App\Support\ActorReference;
use Domain\Chat\Commands\Support\ChatCommandHandler;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Resolvers\Support\MessagePinReader;

final readonly class UnpinMessageHandler extends ChatCommandHandler
{
    public function __construct(
        private MessagePinReader $pinnable,
    ) {}

    /**
     * @throws MessageMissing
     */
    public function handle(UnpinMessageCommand $command): void
    {
        $this->pinnable->requireIn($command->inboxId, $command->messageId);

        $this->unpinFor(
            $command->dispatchedBy(),
            $command->inboxId,
            $command->messageId,
        );
    }

    /**
     * Removes the owner's pin of the message in the conversation, when there is one.
     */
    private function unpinFor(
        ActorReference $owner,
        string $inboxId,
        string $messageId,
    ): void {
        MessagePin::query()
            ->ownedBy($owner)
            ->ofMessage($inboxId, $messageId)
            ->delete();
    }
}
