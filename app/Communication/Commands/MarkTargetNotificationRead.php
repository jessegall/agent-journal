<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;

/**
 * The acting actor marks read its own receipt that leads to one target, such as report 12, after the target's page
 * showed it; marking it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkTargetNotificationRead extends Command
{
    public function __construct(
        public string $targetKey,
        public string $targetId,
    ) {}
}
