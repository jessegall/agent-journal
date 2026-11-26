<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartOwnedAgent;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStartCommand;
use App\Policies\AgentPolicy;
use App\Sessions\OwnerStartReceipt;
use App\Sessions\OwnerStartRequest;
use App\Support\Command;

/**
 * Starts an agent for work its owner holds, as Core's StartAgentCommand with the calling session as the parent; the owner
 * names the agent by its actor and never a session.
 *
 * @extends Command<OwnerStartReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class StartOwnedAgentCommand extends Command implements AgentStartCommand
{
    public function __construct(public OwnerStartRequest $request) {}

    public function startedAgentId(): string
    {
        return $this->request->agent->id;
    }
}
