<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Chat\Policies\MessagePinPolicy;

/**
 * Pins one readable message of a conversation for the user or agent asking.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(MessagePinPolicy::class, AccessType::Edit)]
final readonly class PinMessage extends Command
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
    ) {}
}
