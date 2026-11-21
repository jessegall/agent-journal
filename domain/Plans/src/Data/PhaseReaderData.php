<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One phase's page: its plan, its own number and title, its task counts from the phase's tallies, whether it is the
 * plan's current phase, whether the caller may run checks now, its latest check receipt if any, and its tasks in their
 * order.
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
        public readonly int $finishedTasks,
        public readonly int $cancelledTasks,
        public readonly int $totalTasks,
        public readonly bool $isCurrent,
        public readonly bool $canRunChecks,
        #[DataCollectionOf(PhaseTaskData::class)]
        public readonly array $tasks,
        public readonly PhaseCheckData|Optional $checkReceipt = new Optional(),
    ) {}
}
