<?php

declare(strict_types=1);

namespace App\Communication\Commands\AnswerMessage;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

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
