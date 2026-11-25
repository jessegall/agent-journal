<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use Domain\Helpers\Contracts\HelperJobEvent;

/**
 * A helper job was held after its helper stopped.
 */
final readonly class HelperJobHeld implements HelperEvent, HelperJobEvent
{
    public function __construct(
        public string $jobId,
    ) {}
}
