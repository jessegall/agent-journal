<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadUnreadMessages;

use App\Support\ShownMessages;
use App\Support\Command;

/**
 * Reads the messages of the actor's inboxes it has not read yet, oldest first, up to the limit, and records each read.
 *
 * @extends Command<ShownMessages>
 */
final readonly class ReadUnreadMessagesCommand extends Command
{
    public const int LIMIT = 50;
}
