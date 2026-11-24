<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

/**
 * A phase's progress counts were recorded.
 */
final readonly class PhaseProgressRecorded extends PlanEvent
{
    public function __construct(
        public string $phaseId,
    ) {}
}
