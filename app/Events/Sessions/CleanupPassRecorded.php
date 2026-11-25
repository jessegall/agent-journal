<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Enums\Sessions\CleanupStatus;

/**
 * A host recorded one pass of a cleanup, with the state the cleanup is in after it.
 */
final readonly class CleanupPassRecorded extends SessionEvent
{
    public function __construct(
        public string $operationId,
        public CleanupStatus $state,
    ) {}
}
