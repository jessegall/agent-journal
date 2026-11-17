<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api;

use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Enums\PlanState;

/**
 * What a plan card shows: the plan, whether it may start now, how far its tasks have got, the phase it is in and the
 * agent it is assigned to.
 */
final readonly class PlanCard
{
    public function __construct(
        public int $id,
        public string $title,
        public PlanKind $kind,
        public PlanState $state,
        public bool $canStart,
        public bool $focused,
        public PlanProgress $progress,
        public int|null $currentPhase,
        public string|null $agentName,
    ) {}
}
