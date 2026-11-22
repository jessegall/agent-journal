<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\UnpinMessage;

use App\Exceptions\MessageMissing;
use App\Support\ActorIdentity;
use Domain\Chat\Commands\Support\ChatCommandHandler;
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
    public function handle(UnpinMessageCommand $command): void
    {
        $this->pinnable->requireIn($command->inboxId, $command->messageId);

        $this->unpinFor(
            ActorIdentity::of($command->dispatchedBy()),
            $command->inboxId,
            $command->messageId,
        );
    }

    /**
     * Removes the owner's pin of the message in the conversation, when there is one.
     */
    private function unpinFor(
        ActorIdentity $owner,
        string $inboxId,
        string $messageId,
    ): void {
        MessagePin::query()
            ->ownedBy($owner)
            ->inConversation($inboxId)
            ->where('message_id', $messageId)
            ->delete();
    }
}
