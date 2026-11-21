<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user cancels a driver request that has not started; cancelling a setting change puts the runtime's
 * requested settings back to what the requests still open ask for. The request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class CancelDriverRequest extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
