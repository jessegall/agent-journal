<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadUnreadMessages;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
use App\Support\ShownMessages;

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
