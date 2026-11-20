<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ResolveDriverDeliveryHandler;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user says, from evidence, whether an uncertain delivery arrived; one that did not may then be
 * retried. The request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(ResolveDriverDeliveryHandler::class)]
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class ResolveDriverDelivery extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public bool $applied,
        public string $reason,
    ) {}
}
