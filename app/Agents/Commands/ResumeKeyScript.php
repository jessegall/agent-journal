<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ResumeKeyScriptHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * A person lets a key script stopped part way go on from its recorded step; the request's new row version is
 * the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(ResumeKeyScriptHandler::class)]
#[Operation('resume_key_script', ResourceAreaType::Workspace, AccessType::Execute)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
final readonly class ResumeKeyScript extends Command implements HasAuthorizationSubject
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
