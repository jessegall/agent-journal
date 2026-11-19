<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\LaunchAgentHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\LaunchRequest;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * Launches an agent for one request: its session, selection and credential in the command's transaction; a repeat of
 * the same request finds the same launch, and nothing starts a program before the commit.
 *
 * @implements Command<LaunchReceipt>
 */
#[HandledBy(LaunchAgentHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
final readonly class LaunchAgent implements Command, HasAuthorizationSubject
{
    public function __construct(public LaunchRequest $request) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
