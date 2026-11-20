<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Handlers\PinMessageHandler;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Pins one readable message of a conversation for the user or agent asking.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[HandledBy(PinMessageHandler::class)]
#[Authorize(MessagePinPolicy::class, AccessType::Edit)]
final readonly class PinMessage extends Command
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
