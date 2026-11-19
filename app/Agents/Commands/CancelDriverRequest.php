<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CancelDriverRequestHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * A person cancels a driver request that has not started; cancelling a setting change puts the runtime's
 * requested settings back to what the requests still open ask for. The request's new row version is the answer.
 *
 * @implements Command<int>
 */
#[HandledBy(CancelDriverRequestHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
final readonly class CancelDriverRequest implements Command, HasAuthorizationSubject
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
