<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Communication\Handlers\AskMessageHandler;

/**
 * Sends a message that asks its recipient for an answer. The same submission key sent again answers with the same
 * message.
 *
 * @implements Command<string>
 */
#[HandledBy(AskMessageHandler::class)]
final readonly class AskMessage implements Command
{
    public function __construct(
        public ActorIdentity $recipient,
        public string $body,
        public string $submissionKey,
    ) {}
}
