<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One frozen task of a review snapshot: its number, title and the start of its brief, and whether the brief goes on.
 */
#[TypeScript]
final class PlanReviewMemberData extends Data
{
    public function __construct(
        public readonly string $taskNumber,
        public readonly string $title,
        public readonly string $brief,
        public readonly bool $isBriefCut,
    ) {}
}
