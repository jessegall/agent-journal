<?php

declare(strict_types=1);

namespace App\Domain\Plans;

use App\Domain\Tasks\TaskProgress;

/**
 * What a plan card shows: the plan, how far its tasks have got, the phase it is in and the agent it is assigned to.
 */
final readonly class PlanCard
{
    public function __construct(
        public int $id,
        public string $title,
        public PlanKind $kind,
        public PlanState $state,
        public bool $focused,
        public TaskProgress $progress,
        public ?int $currentPhase,
        public ?string $agentName,
    ) {}
}
