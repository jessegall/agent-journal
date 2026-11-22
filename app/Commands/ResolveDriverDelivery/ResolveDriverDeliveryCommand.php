<?php

declare(strict_types=1);

namespace App\Commands\ResolveDriverDelivery;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A user says, from evidence, whether an uncertain delivery arrived; one that did not may then be
 * retried. The request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class ResolveDriverDeliveryCommand extends Command
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public bool $applied,
        public string $reason,
    ) {}
}
