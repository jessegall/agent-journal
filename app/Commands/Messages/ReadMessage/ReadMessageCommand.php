<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadMessage;

use App\Data\Messages\MessageView;
use App\Support\Command;

/**
 * Reads one message of an inbox the actor is attached to and records the read.
 *
 * @extends Command<MessageView>
 */
final readonly class ReadMessageCommand extends Command
{
    public function __construct(public string $messageId) {}
}
