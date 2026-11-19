<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Communication\Handlers\RequireMessageAnswerHandler;

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
        public ActorIdentity $recipient,
        public int $currentRound,
    ) {}
}
