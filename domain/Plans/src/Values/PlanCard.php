<?php

declare(strict_types=1);

namespace Domain\Plans\Values;

use App\Support\AssignmentHolder;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use PhpOption\Option;

/**
 * What a plan card shows: the plan, whether it may start now, how far its tasks have got, the phase it is in and the
 * actor that holds it, if any.
 */
final readonly class PlanCard
{
    /**
     * @param  Option<AssignmentHolder>  $holder
     */
    public function __construct(
        public string $id,
        public int $number,
        public string $title,
        public PlanType $type,
        public PlanStatus $state,
        public bool $canStart,
        public bool $isFocused,
        public PlanProgress $progress,
        public int|null $currentPhase,
        public Option $holder,
    ) {}
}
