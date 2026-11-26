<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\ProjectBindingEvent;

/**
 * The runtime that held a project binding stopped, so the binding is free.
 */
final readonly class ProjectBindingLeaseEnded implements ConnectionEvent, ProjectBindingEvent
{
    public function __construct(public string $bindingId, public string $runtimeId) {}
}
