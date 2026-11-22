<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Api\PlanEditionChanges;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What changed between the edition before and the one asked for: added, removed and changed tasks by number, whether
 * the plan's own text changed, and whether the comparison covered both editions whole.
 */
#[TypeScript]
final class PlanEditionChangesData extends Data
{
    /**
     * @param  list<int>  $added
     * @param  list<int>  $removed
     * @param  list<int>  $changed
     */
    public function __construct(
        public readonly int $olderEdition,
        public readonly array $added,
        public readonly array $removed,
        public readonly array $changed,
        public readonly bool $isPlanTextChanged,
        public readonly bool $isWhole,
    ) {}

    public static function ofChanges(int $olderEdition, PlanEditionChanges $changes): self
    {
        return new self(
            $olderEdition,
            $changes->added,
            $changes->removed,
            $changes->changed,
            $changes->isPlanTextChanged,
            $changes->isWhole,
        );
    }
}
