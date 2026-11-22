<?php

declare(strict_types=1);

namespace App\Agents\Commands\CancelPrivateEntry;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A writer leaves private entry without a value; the session stays shielded until a verified public redraw.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class CancelPrivateEntryCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
    ) {}
}
