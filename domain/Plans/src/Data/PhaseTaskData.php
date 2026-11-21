<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Enums\TaskState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One task of a phase, as the phase page and the plan's outline list it: its number, title and state, with the state
 * in Tasks' own words.
 */
#[TypeScript]
final class PhaseTaskData extends Data
{
    public function __construct(
        public readonly string $number,
        public readonly string $title,
        public readonly TaskState $state,
        public readonly string $stateLabel,
    ) {}

    public static function fromSummary(TaskSummary $summary): self
    {
        return new self(
            (string) $summary->number,
            $summary->title,
            $summary->state,
            $summary->state->stateLabel()->text,
        );
    }
}
