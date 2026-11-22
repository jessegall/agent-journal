<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * The acting actor marks one of its own notification receipts read; marking it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkNotificationRead extends Command
{
    public function __construct(public string $receiptId) {}
}
