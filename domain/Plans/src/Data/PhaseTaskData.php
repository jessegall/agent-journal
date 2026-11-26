<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Values\TaskSummary;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One task of a phase, as the phase page and the plan's outline list it: its number, title and state, with the state
 * in Tasks' own words, and whether it waits on other tasks, so the row can offer its prerequisites.
 */
#[TypeScript]
final class PhaseTaskData extends Data
{
    public function __construct(
        public readonly string $number,
        public readonly string $title,
        public readonly TaskStatus $status,
        public readonly string $stateLabel,
        public readonly bool $hasWaits,
    ) {}

    public static function ofSummary(TaskSummary $summary, bool $waits): self
    {
        return new self(
            (string) $summary->number,
            $summary->title,
            $summary->status,
            $summary->status->stateLabel()->text,
            $waits,
        );
    }
}
