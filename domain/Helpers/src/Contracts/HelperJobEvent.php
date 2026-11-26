<?php

declare(strict_types=1);

namespace Domain\Helpers\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a helper job: every event of it implements this, so a listener typed on it receives them all.
 */
interface HelperJobEvent extends Event
{
    public string $jobId { get; }
}
