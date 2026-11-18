<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Communication\Handlers\SendMessageHandler;

/**
 * Sends a message for the recipient to read, without asking for an answer. The same submission key sent again
 * answers with the same message.
 *
 * @implements Command<string>
 */
#[HandledBy(SendMessageHandler::class)]
final readonly class SendMessage implements Command
{
    public function __construct(
        public ActorIdentity $recipient,
        public string $body,
        public string $submissionKey,
    ) {}
}
