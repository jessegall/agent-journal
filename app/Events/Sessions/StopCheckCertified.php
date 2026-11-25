<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StopCheckEvent;

/**
 * A stop attempt was certified.
 */
final readonly class StopCheckCertified implements SessionEvent, StopCheckEvent
{
    public function __construct(
        public string $attemptId,
    ) {}
}
