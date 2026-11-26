<?php

declare(strict_types=1);

namespace App\Messages\Commands\ReadUnreadMessages;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Messages\ShownMessages;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * Reads the messages of the actor's inboxes it has not read yet, oldest first, up to the limit, and records each read.
 *
 * @extends Command<ShownMessages>
 */
#[Authorize(MessagePolicy::class, AccessType::Read)]
final readonly class ReadUnreadMessagesCommand extends Command
{
    public const int LIMIT = 50;
}
