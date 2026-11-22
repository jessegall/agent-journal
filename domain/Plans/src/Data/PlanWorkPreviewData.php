<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What assigning a plan's work would move, read from its tallies before anything is hydrated: its phases and tasks,
 * how many unfinished tasks move and how many finished or cancelled ones stay, whether it is over the one limit, and
 * the eligible workers to choose from.
 */
#[TypeScript]
final class PlanWorkPreviewData extends Data
{
    /**
     * @param  list<PlanWorkRecipientData>  $recipients
     */
    public function __construct(
        public readonly bool $mayAssign,
        public readonly int $phaseCount,
        public readonly int $taskCount,
        public readonly int $movingTasks,
        public readonly int $stayingTasks,
        public readonly bool $isOverLimit,
        #[DataCollectionOf(PlanWorkRecipientData::class)]
        public readonly array $recipients,
    ) {}
}
