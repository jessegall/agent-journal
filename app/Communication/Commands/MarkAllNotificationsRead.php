<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * The acting actor marks read the next batch of its unread receipts up to the watermark of the list it saw, and
 * learns whether every one is done; later receipts stay unread.
 *
 * @extends Command<bool>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkAllNotificationsRead extends Command
{
    public function __construct(public int $through) {}
}
