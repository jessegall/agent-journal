<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\ProjectBindingEvent;

/**
 * The runtime that held a project binding stopped, so the binding is free.
 */
final readonly class ProjectBindingLeaseEnded extends ConnectionEvent implements ProjectBindingEvent
{
    public function __construct(public string $bindingId, public string $runtimeId) {}
}
