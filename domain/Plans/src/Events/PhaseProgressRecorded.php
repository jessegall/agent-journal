<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

/**
 * A phase's progress counts were recorded.
 */
final readonly class PhaseProgressRecorded implements PlanEvent
{
    public function __construct(
        public string $planId,
        public string $phaseId,
    ) {}
}
