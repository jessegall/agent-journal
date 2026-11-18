<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use App\Actors\Enums\ActorType;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;

/**
 * One plan as its read gives it: number, title, type, state, revision and creator, its progress and current phase as
 * every plan list counts them, and its phases with at most 50 task references from the offset, with the offset to
 * read on from when there are more. The brief and notes come only in the context view.
 */
final readonly class PlanDetails
{
    /**
     * @param  list<PlanPhaseTasks>  $phases
     */
    public function __construct(
        public string $id,
        public int $number,
        public string $title,
        public PlanType $type,
        public PlanState $state,
        public int $revision,
        public ActorType $creatorType,
        public string $creatorId,
        public PlanProgress $progress,
        public int|null $currentPhase,
        public array $phases,
        public int|null $nextTaskOffset,
        public string|null $brief,
        public string|null $finishNote,
        public string|null $cancelReason,
    ) {}
}
