<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStartCommand;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\StartAgentHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StartReceipt;
use App\Agents\Support\StartRequest;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Starts an agent for one request: its session, selection and credential in the command's transaction; a repeat of
 * the same request finds the same start, and nothing starts a program before the commit.
 *
 * @extends Command<StartReceipt>
 */
#[HandledBy(StartAgentHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('start_agent', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class StartAgent extends Command implements AuthorizedCommand, AgentStartCommand
{
    public function __construct(public StartRequest $request) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }

    public function startedAgentId(): string
    {
        return $this->request->agentId;
    }
}
