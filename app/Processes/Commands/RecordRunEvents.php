<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\RecordRunEventsHandler;
use App\Processes\Policies\ProcessPolicy;

/**
 * Applies a batch of a run's spooled events in order, each sequence number once, then assesses the parts that ended
 * and settles the run's parts when an event ended it; it answers how many events it took.
 *
 * @extends Command<int>
 */
#[HandledBy(RecordRunEventsHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class RecordRunEvents extends Command
{
    /**
     * @param  string  $events  the batch as the call sent it, already validated, as JSON
     */
    public function __construct(public string $processRunId, public string $events) {}
}
