<?php

declare(strict_types=1);

namespace Domain\Chat\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Chat\Handlers\DismissMessageHandler;

/**
 * Dismisses a message, so it waits for no answer.
 *
 * @implements Command<null>
 */
#[HandledBy(DismissMessageHandler::class)]
final readonly class DismissMessage implements Command
{
    public function __construct(
        public int $messageId,
    ) {}
}
