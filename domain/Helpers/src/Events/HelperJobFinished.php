<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use Domain\Helpers\Contracts\HelperJobEvent;

/**
 * A helper job ended with its report.
 */
final readonly class HelperJobFinished implements HelperEvent, HelperJobEvent
{
    public function __construct(
        public string $jobId,
        public string $reference,
    ) {}
}
