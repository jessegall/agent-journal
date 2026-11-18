<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Communication\Handlers\AnswerMessageHandler;

/**
 * Marks a message answered.
 *
 * @implements Command<null>
 */
#[HandledBy(AnswerMessageHandler::class)]
final readonly class AnswerMessage implements Command
{
    public function __construct(
        public string $messageId,
    ) {}
}
