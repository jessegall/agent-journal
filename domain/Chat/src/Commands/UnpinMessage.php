<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Handlers\UnpinMessageHandler;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Removes the asker's pin of one message of a conversation.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[HandledBy(UnpinMessageHandler::class)]
#[Authorize(MessagePinPolicy::class, AccessType::Edit)]
final readonly class UnpinMessage extends Command
{
    public function __construct(
        public string $sourceInboxId,
        public string $destinationInboxId,
        public string $messageId,
    ) {}

    public function conversation(): ConversationPair
    {
        return new ConversationPair($this->sourceInboxId, $this->destinationInboxId);
    }
}
