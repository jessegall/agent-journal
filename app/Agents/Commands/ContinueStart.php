<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStartCommand;
use App\Agents\Handlers\ContinueStartHandler;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\StartReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Continues an agent's ended or refused start in one new session that runs with the account chosen now, under the
 * policy the old one ran under; every Continue of the same session answers that one successor, and the old session
 * keeps its own account link.
 *
 * @extends Command<StartReceipt>
 */
#[HandledBy(ContinueStartHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Create)]
final readonly class ContinueStart extends Command implements AgentStartCommand
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
