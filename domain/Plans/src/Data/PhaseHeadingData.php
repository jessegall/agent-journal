<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Models\Phase;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One phase heading of a plan's outline: its number, title and revision, its task counts from the tallies, and
 * whether it is the plan's current phase. Its tasks are read page by page when it is opened.
 */
#[TypeScript]
final class PhaseHeadingData extends Data
{
    public function __construct(
        public readonly string $number,
        public readonly string $title,
        public readonly int $revision,
        public readonly int $finishedTasks,
        public readonly int $cancelledTasks,
        public readonly int $totalTasks,
        public readonly bool $isCurrent,
    ) {}

    public static function ofPhase(Phase $phase, int|null $currentPhase): self
    {
        return new self(
            (string) $phase->number,
            $phase->title,
            $phase->revision,
            $phase->finished_tasks,
            $phase->cancelled_tasks,
            $phase->total_tasks,
            $phase->number === $currentPhase,
        );
    }
}
