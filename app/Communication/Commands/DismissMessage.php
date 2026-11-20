<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\DismissMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Closes a message without an answer, with a reason: a member of its destination declines it, its author withdraws
 * it, or the owner cancels it on inspection.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(DismissMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
final readonly class DismissMessage extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $messageId,
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
