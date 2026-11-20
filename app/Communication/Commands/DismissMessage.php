<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Communication\Contracts\MessageCommand;
use App\Communication\Handlers\DismissMessageHandler;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

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
#[HandledBy(DismissMessageHandler::class)]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class DismissMessage extends Command implements MessageCommand
{
    public function __construct(
        public string $messageId,
        public string $reason,
    ) {}
}
