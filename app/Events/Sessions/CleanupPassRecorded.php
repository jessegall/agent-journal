<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Enums\CleanupStatus;

/**
 * A host recorded one pass of a cleanup, with the state the cleanup is in after it.
 */
final readonly class CleanupPassRecorded implements SessionEvent
{
    public function __construct(
        public string $operationId,
        public CleanupStatus $status,
    ) {}
}
