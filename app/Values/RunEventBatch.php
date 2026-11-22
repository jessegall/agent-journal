<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A batch of a run's spooled events in their order, as a run-events command carries it.
 */
final class RunEventBatch extends Data
{
    /**
     * @param  list<RunEvent>  $events
     */
    public function __construct(
        #[DataCollectionOf(RunEvent::class)]
        public readonly array $events,
    ) {}
}
