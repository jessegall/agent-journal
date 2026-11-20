<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CancelKeyScriptHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * A person cancels a key script stopped part way; the request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(CancelKeyScriptHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('cancel_key_script', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class CancelKeyScript extends Command implements HasAuthorizationSubject
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
