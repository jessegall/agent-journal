<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RepairDriverSettingsHandler;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user gives a failed setting change a new value in its own place in the queue; the request's new row
 * version is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(RepairDriverSettingsHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RepairDriverSettings extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $replacementText,
        public string $reason,
    ) {}
}
