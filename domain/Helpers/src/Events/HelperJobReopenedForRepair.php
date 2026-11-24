<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use Domain\Helpers\Contracts\HelperJobEvent;

/**
 * A helper job was opened again to repair the findings given.
 */
final readonly class HelperJobReopenedForRepair extends HelperEvent implements HelperJobEvent
{
    public function __construct(
        public string $jobId,
    ) {}
}
