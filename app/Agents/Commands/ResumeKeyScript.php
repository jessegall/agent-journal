<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ResumeKeyScriptHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * A user lets a key script stopped part way go on from its recorded step; the request's new row version is
 * the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(ResumeKeyScriptHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('resume_key_script', ResourceAreaType::Workspace, AccessType::Execute)]
final readonly class ResumeKeyScript extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
