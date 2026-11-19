<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\AnswerMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Marks a message answered.
 *
 * @implements Command<null>
 */
#[HandledBy(AnswerMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
final readonly class AnswerMessage implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $messageId,
        public int $round,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Message::class;
    }
}
