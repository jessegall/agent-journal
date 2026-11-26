<?php

declare(strict_types=1);

namespace App\Agents\Commands\RepairDriverSettings;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A user gives a failed setting change a new value in its own place in the queue; the request's new row
 * version is the answer.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RepairDriverSettingsCommand extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $replacementText,
        public string $reason,
    ) {}
}
