<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use Domain\Helpers\Contracts\HelperJobEvent;

/**
 * A helper job was cancelled.
 */
final readonly class HelperJobCancelled implements HelperEvent, HelperJobEvent
{
    public function __construct(
        public string $jobId,
    ) {}
}
