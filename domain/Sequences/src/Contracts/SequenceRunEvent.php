<?php

declare(strict_types=1);

namespace Domain\Sequences\Contracts;

use App\Contracts\Events\Event;

/**
 * A fact about one run of a sequence: it started, reached or ended a step, or ended.
 */
interface SequenceRunEvent extends Event
{
    public string $runId { get; }
}
