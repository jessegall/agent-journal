<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use Domain\Helpers\Contracts\HelperJobEvent;

/**
 * A helper job was given steering.
 */
final readonly class HelperJobSteered implements HelperEvent, HelperJobEvent
{
    public function __construct(
        public string $jobId,
        public string $steering,
    ) {}
}
