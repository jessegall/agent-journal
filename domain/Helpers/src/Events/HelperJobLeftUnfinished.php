<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use Domain\Helpers\Contracts\HelperJobEvent;

/**
 * A helper job was left unfinished after its helper stopped.
 */
final readonly class HelperJobLeftUnfinished extends HelperEvent implements HelperJobEvent
{
    public function __construct(
        public string $jobId,
    ) {}
}
