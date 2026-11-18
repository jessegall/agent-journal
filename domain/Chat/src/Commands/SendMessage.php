<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Chat\Handlers\SendMessageHandler;

/**
 * Sends a message to the agent of a session and asks it for an answer.
 *
 * @implements Command<null>
 */
#[HandledBy(SendMessageHandler::class)]
final readonly class SendMessage implements Command
{
    public function __construct(
        public string $body,
        public string $sessionId,
    ) {}
}
