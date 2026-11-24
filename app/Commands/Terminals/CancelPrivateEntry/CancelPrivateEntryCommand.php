<?php

declare(strict_types=1);

namespace App\Commands\Terminals\CancelPrivateEntry;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

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
