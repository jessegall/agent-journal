<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\RecoveryAction;
use App\Contracts\Event;

/**
 * A person retried, cancelled or resolved a driver request: the audit record of who did what, and why.
 */
final readonly class DriverRequestRecovered implements Event
{
    public function __construct(
        public string $requestId,
        public RecoveryAction $action,
        public ActorIdentity $actor,
        public string $reason,
    ) {}
}
