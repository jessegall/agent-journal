<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The edition asked for as one review snapshot: its number and fingerprint, the plan's frozen title, brief and type,
 * and its first phases with their first members, each brief cut to a slice; the snapshot never changes.
 */
#[TypeScript]
final class PlanReviewEditionData extends Data
{
    /**
     * @param  list<PlanReviewPhaseData>  $phases
     */
    public function __construct(
        public readonly int $number,
        public readonly string $fingerprint,
        public readonly string $title,
        public readonly string $brief,
        public readonly string $type,
        #[DataCollectionOf(PlanReviewPhaseData::class)]
        public readonly array $phases,
        public readonly bool $hasMorePhases,
    ) {}
}
