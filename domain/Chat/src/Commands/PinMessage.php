<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Chat\Enums\MessagePinAbility;
use Domain\Chat\Handlers\PinMessageHandler;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Policies\MessagePinPolicy;
use Domain\Chat\Support\ConversationPair;

/**
 * Pins one readable message of a conversation for the person or agent asking.
 *
 * @extends Command<null>
 */
#[HandledBy(PinMessageHandler::class)]
#[Authorize(MessagePinPolicy::class, MessagePinAbility::Work)]
#[RetainedActorRequestKey]
final readonly class PinMessage extends Command implements HasAuthorizationSubject
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
