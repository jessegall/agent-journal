<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\DismissMessageHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;

/**
 * Dismisses a message, so it waits for no answer.
 *
 * @implements Command<null>
 */
#[HandledBy(DismissMessageHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
final readonly class DismissMessage implements Command, HasAuthorizationSubject
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
