<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One frozen phase of a review snapshot with its first members.
 */
#[TypeScript]
final class PlanReviewPhaseData extends Data
{
    /**
     * @param  list<PlanReviewMemberData>  $members
     */
    public function __construct(
        public readonly int $position,
        public readonly string $number,
        public readonly string $title,
        #[DataCollectionOf(PlanReviewMemberData::class)]
        public readonly array $members,
        public readonly bool $hasMoreMembers,
    ) {}
}
