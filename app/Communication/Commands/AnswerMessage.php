<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\AnswerMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/** @extends Command<string> */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Effect(CommandEffectType::Recovery)]
#[HandledBy(AnswerMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[Operation('messages_answer', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class AnswerMessage extends Command implements AuthorizedCommand
{
    public function __construct(public string $messageId, public string $replyId) {}

    /** @return class-string */
    public function subject(): string
    {
        return Message::class;
    }
}
