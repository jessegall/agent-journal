<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Enums\PlanState;

/**
 * A fresh snapshot of the plan an agent works on, read for one hook and never kept across hooks.
 */
final readonly class PlanWork
{
    public function __construct(
        public string $planId,
        public int $number,
        public PlanState $state,
    ) {}
}
