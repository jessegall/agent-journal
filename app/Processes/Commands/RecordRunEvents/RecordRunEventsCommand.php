<?php

declare(strict_types=1);

namespace App\Processes\Commands\RecordRunEvents;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * Applies a batch of a run's spooled events in order, each sequence number once, then assesses the parts that ended
 * and settles the run's parts when an event ended it; it answers how many events it took.
 *
 * @extends Command<int>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class RecordRunEventsCommand extends Command
{
    /**
     * @param  string  $events  the batch as the call sent it, already validated, as JSON
     */
    public function __construct(public string $processRunId, public string $events) {}
}
