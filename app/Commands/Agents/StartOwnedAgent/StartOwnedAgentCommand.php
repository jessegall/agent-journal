<?php

declare(strict_types=1);

namespace App\Commands\Agents\StartOwnedAgent;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\AgentStartCommand;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Support\OwnerStartReceipt;
use App\Support\OwnerStartRequest;

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
