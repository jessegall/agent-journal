<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadMessage;

use App\Support\ShownMessage;
use App\Support\Command;

/**
 * Reads one message of an inbox the actor is attached to and records the read.
 *
 * @extends Command<ShownMessage>
 */
final readonly class ReadMessageCommand extends Command
{
    public function __construct(public string $messageId) {}
}
