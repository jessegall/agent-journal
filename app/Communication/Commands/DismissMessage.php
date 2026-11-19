<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Communication\Handlers\DismissMessageHandler;

/**
 * Dismisses a message, so it waits for no answer.
 *
 * @implements Command<null>
 */
#[HandledBy(DismissMessageHandler::class)]
final readonly class DismissMessage implements Command
{
    public function __construct(
        public string $messageId,
        public int $round,
    ) {}
}
