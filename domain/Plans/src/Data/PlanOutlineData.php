<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A page of a plan's phase headings in the plan's order, the cursor of the next page while more follow, and the page
 * of one phase's tasks when the reader asked for one.
 */
#[TypeScript]
final class PlanOutlineData extends Data
{
    /**
     * @param  list<PhaseHeadingData>  $phases
     */
    public function __construct(
        #[DataCollectionOf(PhaseHeadingData::class)]
        public readonly array $phases,
        public readonly string $phasesAfter,
        public readonly string|Optional $nextPhasesAfter = new Optional(),
        public readonly PhaseTaskPageData|Optional $phaseTasks = new Optional(),
    ) {}
}
