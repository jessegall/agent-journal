<?php

declare(strict_types=1);

namespace App\Commands\StartAgent;

use App\Attributes\Authorize;
use App\Contracts\AgentStartCommand;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Support\StartReceipt;
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
