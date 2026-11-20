<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
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
final readonly class UnpinMessage extends Command implements HasAuthorizationSubject
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
