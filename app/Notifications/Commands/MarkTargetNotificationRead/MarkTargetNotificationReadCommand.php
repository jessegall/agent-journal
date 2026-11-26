<?php

declare(strict_types=1);

namespace App\Notifications\Commands\MarkTargetNotificationRead;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\MessagePolicy;
use App\Support\Command;

/**
 * The acting actor marks read its own receipt that leads to one target, such as report 12, after the target's page
 * showed it; marking it again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(MessagePolicy::class, AccessType::Edit)]
final readonly class MarkTargetNotificationReadCommand extends Command
{
    public function __construct(
        public string $targetKey,
        public string $targetId,
    ) {}
}
