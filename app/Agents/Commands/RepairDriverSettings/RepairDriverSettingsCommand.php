<?php

declare(strict_types=1);

namespace App\Agents\Commands\RepairDriverSettings;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
