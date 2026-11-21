<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\MessageMissing;
use Domain\Chat\Commands\UnpinMessage;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Support\ConversationPair;
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

        $this->unpinFor(
            ActorIdentity::of($command->dispatchedBy()),
            $command->conversation(),
            $command->messageId,
        );
    }

    /**
     * Removes the owner's pin of the message in the conversation, when there is one.
     */
    private function unpinFor(
        ActorIdentity $owner,
        ConversationPair $conversation,
        string $messageId,
    ): void {
        MessagePin::query()
            ->ownedBy($owner)
            ->inConversation($conversation)
            ->where('message_id', $messageId)
            ->delete();
    }
}
