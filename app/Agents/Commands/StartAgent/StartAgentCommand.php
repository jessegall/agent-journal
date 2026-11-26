<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartAgent;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStartCommand;
use App\Policies\AgentPolicy;
use App\Sessions\StartReceipt;
use App\Support\Command;
use App\Values\StartRequest;

/**
 * Starts an agent for one request: its session, selection and credential in the command's transaction; a repeat of
 * the same request finds the same start, and nothing starts a driver before the commit.
 *
 * @extends Command<StartReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class StartAgentCommand extends Command implements AgentStartCommand
{
    public function __construct(public StartRequest $request) {}

    public function startedAgentId(): string
    {
        return $this->request->agentId;
    }
}
