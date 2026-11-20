<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Chat\Enums\MessagePinAbility;
use Domain\Chat\Handlers\UnpinMessageHandler;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Removes the asker's pin of one message of a conversation.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[HandledBy(UnpinMessageHandler::class)]
#[Authorize(MessagePinPolicy::class, MessagePinAbility::Work)]
#[Operation('unpin_message', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class UnpinMessage extends Command implements AuthorizedCommand
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return MessagePin::class;
    }
}
