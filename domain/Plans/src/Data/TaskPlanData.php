<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Models\Phase;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The plan and phase a task sits in, as Plans adds them to the task's reader; a task in no phase has neither.
 */
#[TypeScript]
final class TaskPlanData extends Data
{
    public function __construct(
        public readonly string|Optional $planNumber = new Optional(),
        public readonly string|Optional $planTitle = new Optional(),
        public readonly string|Optional $phaseNumber = new Optional(),
        public readonly string|Optional $phaseTitle = new Optional(),
    ) {}

    public static function ofPhase(Phase $phase): self
    {
        return new self(
            (string) $phase->plan->number,
            $phase->plan->title,
            (string) $phase->number,
            $phase->title,
        );
    }
}
