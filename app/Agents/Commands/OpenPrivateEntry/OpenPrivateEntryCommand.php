<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenPrivateEntry;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
