<?php

declare(strict_types=1);

namespace App\Commands\AnswerMessage;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Effect(CommandEffectType::Recovery)]
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class AnswerMessageCommand extends Command
{
    public function __construct(public string $messageId, public string $replyId) {}
}
