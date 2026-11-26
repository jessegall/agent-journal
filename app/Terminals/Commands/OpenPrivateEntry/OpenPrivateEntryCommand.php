<?php

declare(strict_types=1);

namespace App\Terminals\Commands\OpenPrivateEntry;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A writer asks the host to close every output sink for a private entry; the field is offered once it confirmed.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class OpenPrivateEntryCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
        public int $sequence,
    ) {}
}
