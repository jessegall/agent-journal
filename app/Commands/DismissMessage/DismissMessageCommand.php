<?php

declare(strict_types=1);

namespace App\Commands\DismissMessage;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\MessageCommand;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Closes a message without an answer, with a reason: a member of its destination declines it, its author withdraws
 * it, or the owner cancels it on inspection.
 *
 * @extends Command<null>
 *
 * @implements MessageCommand<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Effect(CommandEffectType::Recovery)]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class DismissMessageCommand extends Command implements MessageCommand
{
    public function __construct(
        public string $messageId,
        public string $reason,
    ) {}
}
