<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Chat\Handlers\RequireMessageAnswerHandler;

/**
 * Asks the agent of a session to answer a message.
 *
 * @implements Command<null>
 */
#[HandledBy(RequireMessageAnswerHandler::class)]
final readonly class RequireMessageAnswer implements Command
{
    public function __construct(
        public string $messageId,
        public string $sessionId,
    ) {}
}
