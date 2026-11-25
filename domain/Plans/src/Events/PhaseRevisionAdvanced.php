<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

/**
 * A phase moved on to its next revision.
 */
final readonly class PhaseRevisionAdvanced implements PlanEvent
{
    public function __construct(
        public string $planId,
        public string $phaseId,
    ) {}
}
