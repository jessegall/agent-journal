<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * A setting request that failed was repaired with another setting, the model or effort its driver applies now.
 */
final readonly class DriverRequestRepaired implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
        public string $setting,
    ) {}
}
