<?php

declare(strict_types=1);

namespace App\Notifications\Commands\MarkNotificationRead;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * The acting actor marks one of its own notification receipts read; marking it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkNotificationReadCommand extends Command
{
    public function __construct(public string $receiptId) {}
}
