<?php

declare(strict_types=1);

namespace App\Commands\Notifications\MarkAllNotificationsRead;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * The acting actor marks read the next batch of its unread receipts up to the watermark of the list it saw, and
 * learns whether every one is done; later receipts stay unread.
 *
 * @extends Command<bool>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkAllNotificationsReadCommand extends Command
{
    public function __construct(public int $through) {}
}
