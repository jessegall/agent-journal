<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;
use App\Enums\Drivers\RecoveryAction;
use App\Support\ActorIdentity;

/**
 * A user retried, cancelled or resolved a driver request: the audit record of who did what, and why.
 */
final readonly class DriverRequestRecovered extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
        public RecoveryAction $action,
        public ActorIdentity $actor,
        public string $reason,
    ) {}
}
