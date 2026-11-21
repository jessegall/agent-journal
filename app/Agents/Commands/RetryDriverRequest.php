<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user sends a failed or unavailable driver request again, as a new attempt under its own key; the
 * request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RetryDriverRequest extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}
}
