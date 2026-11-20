<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStartCommand;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ContinueStartHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StartReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Continues an agent's ended or refused start in one new session that runs with the account chosen now, under the
 * policy the old one ran under; every Continue of the same session answers that one successor, and the old session
 * keeps its own account link.
 *
 * @extends Command<StartReceipt>
 */
#[HandledBy(ContinueStartHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('continue_start', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class ContinueStart extends Command implements AgentStartCommand, AuthorizedCommand
{
    public function __construct(
        public string $sessionId,
        public string $agentId,
    ) {}

    public function startedAgentId(): string
    {
        return $this->agentId;
    }

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
