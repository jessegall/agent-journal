<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\AskMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Sends a message from one inbox to another that waits for an answer; the answer is the new message id.
 *
 * @implements Command<string>
 */
#[HandledBy(AskMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class AskMessage implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $sourceInboxId,
        public string $destinationInboxId,
        public string $body,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
