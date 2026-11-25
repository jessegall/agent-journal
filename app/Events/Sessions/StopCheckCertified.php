<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StopCheckEvent;

/**
 * A stop attempt was certified.
 */
final readonly class StopCheckCertified extends SessionEvent implements StopCheckEvent
{
    public function __construct(
        public string $attemptId,
    ) {}
}
