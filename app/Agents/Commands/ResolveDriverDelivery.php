<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ResolveDriverDeliveryHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * A person says, from evidence, whether an uncertain delivery arrived; one that did not may then be
 * retried. The request's new row version is the answer.
 *
 * @implements Command<int>
 */
#[HandledBy(ResolveDriverDeliveryHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
final readonly class ResolveDriverDelivery implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public bool $applied,
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
