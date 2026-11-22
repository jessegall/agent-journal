<?php

declare(strict_types=1);

namespace App\Agents\Commands\StartAgent;

use App\Agents\Contracts\AgentStartCommand;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\StartRequest;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
