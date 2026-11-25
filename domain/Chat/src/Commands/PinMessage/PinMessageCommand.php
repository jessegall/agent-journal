<?php

declare(strict_types=1);

namespace Domain\Chat\Commands\PinMessage;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Chat\Policies\MessagePinPolicy;

/**
 * Pins one readable message of a conversation for the user or agent asking.
 *
 * @extends Command<null>
 */
#[RetainedActorRequestKey]
#[Authorize(MessagePinPolicy::class, AccessType::Edit)]
final readonly class PinMessageCommand extends Command
{
    public function __construct(
        public string $inboxId,
        public string $messageId,
    ) {}
}
