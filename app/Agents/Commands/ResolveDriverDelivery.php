<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ResolveDriverDeliveryHandler;
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
 * A user says, from evidence, whether an uncertain delivery arrived; one that did not may then be
 * retried. The request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(ResolveDriverDeliveryHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('resolve_driver_delivery', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ResolveDriverDelivery extends Command implements AuthorizedCommand
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
