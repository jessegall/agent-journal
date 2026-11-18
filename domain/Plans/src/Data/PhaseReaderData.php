<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One phase's page: its plan, its own number and title, and its tasks in their order.
 */
#[TypeScript]
final class PhaseReaderData extends Data
{
    /**
     * @param  list<PhaseTaskData>  $tasks
     */
    public function __construct(
        public readonly string $planNumber,
        public readonly string $planTitle,
        public readonly string $number,
        public readonly string $title,
        #[DataCollectionOf(PhaseTaskData::class)]
        public readonly array $tasks,
    ) {}
}
