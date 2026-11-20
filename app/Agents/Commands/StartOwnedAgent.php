<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStartCommand;
use App\Agents\Handlers\StartOwnedAgentHandler;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\OwnerStartReceipt;
use App\Agents\Support\OwnerStartRequest;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Starts an agent for work its owner holds, as Core's StartAgent with the calling session as the parent; the owner
 * names the agent by its actor and never a session.
 *
 * @extends Command<OwnerStartReceipt>
 */
#[HandledBy(StartOwnedAgentHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class StartOwnedAgent extends Command implements AgentStartCommand
{
    public function __construct(public OwnerStartRequest $request) {}

    public function startedAgentId(): string
    {
        return $this->request->agent->id;
    }
}
