<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\LaunchesAgent;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ContinueLaunchHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\LaunchReceipt;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * Continues an agent's ended or refused launch in one new session that runs with the account chosen now, under the
 * policy the old one ran under; every Continue of the same session answers that one successor, and the old session
 * keeps its own account link.
 *
 * @extends Command<LaunchReceipt>
 */
#[HandledBy(ContinueLaunchHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
final readonly class ContinueLaunch extends Command implements HasAuthorizationSubject, LaunchesAgent
{
    public function __construct(
        public string $sessionId,
        public string $agentId,
    ) {}

    public function launchedAgentId(): string
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
