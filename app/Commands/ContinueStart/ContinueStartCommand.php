<?php

declare(strict_types=1);

namespace App\Commands\ContinueStart;

use App\Attributes\Authorize;
use App\Contracts\Bus\AgentStartCommand;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Support\StartReceipt;

/**
 * Continues an agent's ended or refused start in one new session that runs with the account chosen now, under the
 * policy the old one ran under; every Continue of the same session answers that one successor, and the old session
 * keeps its own account link.
 *
 * @extends Command<StartReceipt>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Create)]
final readonly class ContinueStartCommand extends Command implements AgentStartCommand
{
    public function __construct(
        public string $sessionId,
        public string $agentId,
    ) {}

    public function startedAgentId(): string
    {
        return $this->agentId;
    }
}
